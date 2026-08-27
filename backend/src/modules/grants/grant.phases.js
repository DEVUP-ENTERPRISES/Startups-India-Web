const { STATUS } = require('./grant.status');

/**
 * The 6-phase Startups India journey, derived from an application's status +
 * evaluation. This is the single source of truth the journey tracker, the
 * sidebar and the pre-apply showcase all render from - the frontend never
 * hardcodes phase logic.
 *
 * Stage unlock rules (applied 2 hrs before the booked evaluation slot):
 *   score < 50  → unlock Stage 3 (Pre-Incubation) only
 *   50 ≤ score < 75 → unlock Stages 3 + 4 (Pre-Incubation + Incubation)
 *   score ≥ 75  → unlock Stages 3 + 4 + 5 (Accelerator Program added)
 *   (Stage 6 - Grants is unlocked by admin after Accelerator)
 */
const PHASES = [
  {
    key: 'registration',
    title: 'Registration',
    subtitle: 'Complete your profile and register your startup',
    icon: 'rocket',
  },
  {
    key: 'idea_validation',
    title: 'Idea Validation',
    subtitle: 'Submit your pitch deck & revenue model for expert evaluation',
    icon: 'lightbulb',
  },
  {
    key: 'pre_incubation',
    title: 'Pre-Incubation',
    subtitle: 'Structured mentorship to refine your business & deck',
    icon: 'graduation',
    comingSoon: true,
  },
  {
    key: 'incubation',
    title: 'Incubation',
    subtitle: 'Physical space, labs, and pilot support for your startup',
    icon: 'building',
    comingSoon: true,
  },
  {
    key: 'accelerator',
    title: 'Accelerator Program',
    subtitle: 'Scale fast with mentors, investors & market access',
    icon: 'accelerator',
    comingSoon: true,
  },
  {
    key: 'grants',
    title: 'Grants',
    subtitle: 'Unlock government grants and seed funding up to ₹20L',
    icon: 'landmark',
    comingSoon: true,
  },
];

/**
 * Each status → [phase index the applicant occupies, whether that phase is done].
 * `done: true` means they've finished that phase and are awaiting the admin to
 * start the next one.
 */
const STATUS_POSITION = {
  // Stage 1 done once onboarding complete. All pre-payment statuses = S1 done, S2 active.
  [STATUS.DRAFT]: [0, true],
  [STATUS.SUBMITTED]: [0, true],
  [STATUS.UNDER_REVIEW]: [0, true],
  [STATUS.SHORTLISTED]: [0, true],
  [STATUS.CHANGES_REQUESTED]: [0, true],
  [STATUS.SELECTED]: [0, true],
  [STATUS.EVALUATION_PENDING]: [0, true],
  // Payment done → Stage 2 is now "active/in progress" (pos=1, complete=false)
  [STATUS.EVALUATION_PAID]: [1, false],
  [STATUS.EVALUATION_SCHEDULED]: [1, false],
  // Admin scored → Stage 2 complete, score-based stages unlock
  [STATUS.EVALUATION_COMPLETED]: [1, true],
  [STATUS.PRE_INCUBATION]: [2, false],
  [STATUS.INCUBATION]: [3, false],
  [STATUS.FUNDING_STARTED]: [4, false],    // Accelerator Program
  [STATUS.GRANT_APPROVED]: [5, false],
  [STATUS.COMPLETED]: [5, true],
};

/**
 * Compute which phases are unlocked based on evaluation score and slot time.
 * Score is revealed + stages unlocked 2 hours before the booked slot.
 *
 * @param {object} application
 * @param {object|null} evaluation
 * @returns {{ currentPhase, passedEvaluation, score, scoreRevealed, phases[] }}
 */
function computePhases(application, evaluation = null) {
  const status = application.status;
  const rejected = status === STATUS.REJECTED;

  const [pos, complete] = STATUS_POSITION[status] || [0, false];

  // Score reveal logic:
  // - If admin has already submitted a score (evaluation.submittedAt is set),
  //   reveal immediately (admin scored = approved = stages unlocked now)
  // - Otherwise, only reveal 2hrs before the booked slot
  const adminScored = Boolean(evaluation?.submittedAt);
  const slotTime = evaluation?.meeting?.scheduledAt
    ? new Date(evaluation.meeting.scheduledAt).getTime()
    : null;
  const now = Date.now();
  const twoHoursMs = 2 * 60 * 60 * 1000;
  const scoreRevealed = adminScored || (slotTime ? (now >= slotTime - twoHoursMs) : false);

  const score = scoreRevealed ? (evaluation?.score ?? null) : null;
  const passed = evaluation?.submittedAt ? evaluation.passed === true : null;

  // Determine how many stages are unlocked based on score thresholds:
  // < 50  → Pre-Incubation only (stage index 2)
  // 50-74 → Pre-Incubation + Incubation (stage index 3)
  // ≥ 75  → Pre-Incubation + Incubation + Accelerator (stage index 4)
  let unlockedUpTo = pos;
  if (scoreRevealed && score !== null) {
    if (score >= 75) {
      unlockedUpTo = Math.max(pos, 4); // Accelerator Program
    } else if (score >= 50) {
      unlockedUpTo = Math.max(pos, 3); // Incubation
    } else if (score >= 1) {
      unlockedUpTo = Math.max(pos, 2); // Pre-Incubation only
    }
    // score === 0 → rejected, no unlock
  }

  const rejectedPhase = rejected
    ? evaluation?.submittedAt ? 1 : 0
    : -1;

  const phases = PHASES.map((p, i) => {
    let state;
    if (rejected) {
      if (i < rejectedPhase) state = 'done';
      else if (i === rejectedPhase) state = 'rejected';
      else state = 'locked';
    } else if (i < pos) {
      state = 'done';
    } else if (i === pos) {
      if (complete) {
        // This phase is done - the NEXT phase becomes current
        state = 'done';
      } else {
        state = 'current';
      }
    } else if (complete && i === pos + 1) {
      // The phase immediately after a completed one is always current
      // (Stage 2 is always current once Stage 1 is done, regardless of score)
      state = 'current';
    } else if (scoreRevealed && i <= unlockedUpTo) {
      state = 'unlocked';
    } else {
      state = 'locked';
    }
    return { ...p, state };
  });

  return {
    currentPhase: pos,
    passedEvaluation: passed,
    score,
    scoreRevealed,
    unlockedUpTo,
    phases,
  };
}

module.exports = { PHASES, STATUS_POSITION, computePhases };
