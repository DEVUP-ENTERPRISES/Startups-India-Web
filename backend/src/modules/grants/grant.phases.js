const { STATUS } = require('./grant.status');

/**
 * The 5-phase Startups India journey, derived from an application's status +
 * evaluation. This is the single source of truth the journey tracker, the
 * sidebar and the pre-apply showcase all render from - the frontend never
 * hardcodes phase logic.
 *
 * Phases 3–5 are real and admin-driven: an admin advances an applicant into
 * Pre-Incubation, then Incubation, then Funding, and each move unlocks that
 * phase here. `comingSoon` is kept only so the generic pre-apply showcase can
 * label the later phases for someone who hasn't started the journey yet.
 */
const PHASES = [
  { key: 'registration', title: 'Registration', subtitle: 'Free - submit your startup idea' },
  { key: 'idea_evaluation', title: 'Idea Evaluation', subtitle: 'Reviewed & scored by top VCs and mentors' },
  { key: 'pre_incubation', title: 'Pre-Incubation', subtitle: 'Structured mentorship to get investor-ready', comingSoon: true },
  { key: 'incubation', title: 'Incubation', subtitle: 'Hands-on support to build and scale', comingSoon: true },
  { key: 'funding', title: 'Funding', subtitle: 'Backed by top VCs and angel investors', comingSoon: true },
];

/**
 * Each status → [phase index the applicant occupies, whether that phase is done].
 * `done: true` means they've finished that phase and are awaiting the admin to
 * start the next one - so the next phase renders locked, not current. That is
 * what makes "passing the evaluation doesn't auto-open Pre-Incubation; an admin
 * action does" true.
 */
const STATUS_POSITION = {
  [STATUS.DRAFT]: [0, false],
  [STATUS.SUBMITTED]: [0, false],
  [STATUS.UNDER_REVIEW]: [0, false],
  [STATUS.SHORTLISTED]: [0, false],
  [STATUS.CHANGES_REQUESTED]: [0, false],
  [STATUS.SELECTED]: [1, false],
  [STATUS.EVALUATION_PENDING]: [1, false],
  [STATUS.EVALUATION_PAID]: [1, false],
  [STATUS.EVALUATION_SCHEDULED]: [1, false],
  [STATUS.EVALUATION_COMPLETED]: [1, true], // cleared Phase 2; awaiting Pre-Incubation
  [STATUS.PRE_INCUBATION]: [2, false],
  [STATUS.INCUBATION]: [3, false],
  [STATUS.FUNDING_STARTED]: [4, false],
  [STATUS.GRANT_APPROVED]: [4, true],
  [STATUS.COMPLETED]: [4, true],
};

/**
 * @returns {{ currentPhase: number, passedEvaluation: boolean|null, phases: object[] }}
 * Each phase: { key, title, subtitle, comingSoon, state }
 * state ∈ 'done' | 'current' | 'locked' | 'rejected'
 */
function computePhases(application, evaluation = null) {
  const status = application.status;
  const passed = evaluation?.submittedAt ? evaluation.passed === true : null;
  const rejected = status === STATUS.REJECTED;

  // Where the applicant sits in the journey.
  const [pos, complete] = STATUS_POSITION[status] || [0, false];

  // A rejection doesn't record which phase it happened in; infer from the
  // evaluation (scored → they'd at least reached Phase 2) as a fair fallback.
  const rejectedPhase = rejected ? (evaluation?.submittedAt ? 1 : 0) : -1;

  const phases = PHASES.map((p, i) => {
    let state;
    if (rejected) {
      if (i < rejectedPhase) state = 'done';
      else if (i === rejectedPhase) state = 'rejected';
      else state = 'locked';
    } else if (i < pos) {
      state = 'done';
    } else if (i === pos) {
      // Finished this phase and awaiting the next → 'done' (next stays locked).
      state = complete ? 'done' : 'current';
    } else {
      state = 'locked';
    }
    return { ...p, state };
  });

  return { currentPhase: pos, passedEvaluation: passed, phases };
}

module.exports = { PHASES, STATUS_POSITION, computePhases };
