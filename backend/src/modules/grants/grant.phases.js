const { STATUS } = require('./grant.status');

/**
 * The 5-phase Startups India journey, derived from an application's status +
 * evaluation. This is the single source of truth the premium phase-tracker UI
 * renders from — the frontend never hardcodes phase logic.
 *
 * Phases 3–5 are live in the journey but "locked" (coming soon): an applicant
 * who clears Phase 2 is marked eligible for them, but there's no interaction yet.
 */
const PHASES = [
  { key: 'registration', title: 'Registration', subtitle: 'Free — submit your startup idea' },
  { key: 'idea_evaluation', title: 'Idea Evaluation', subtitle: 'Reviewed & scored by top VCs and mentors' },
  { key: 'pre_incubation', title: 'Pre-Incubation', subtitle: 'Structured mentorship to get investor-ready', comingSoon: true },
  { key: 'incubation', title: 'Incubation', subtitle: 'Hands-on support to build and scale', comingSoon: true },
  { key: 'funding', title: 'Funding', subtitle: 'Backed by top VCs and angel investors', comingSoon: true },
];

// Which phase each status belongs to (0-based).
const PHASE1 = [STATUS.DRAFT, STATUS.SUBMITTED, STATUS.UNDER_REVIEW, STATUS.SHORTLISTED, STATUS.CHANGES_REQUESTED];
const PHASE2 = [STATUS.SELECTED, STATUS.EVALUATION_PENDING, STATUS.EVALUATION_PAID, STATUS.EVALUATION_SCHEDULED];
// A completed (passed) evaluation has cleared Phase 2 and reached Phase 3.
const ADVANCED = [STATUS.EVALUATION_COMPLETED, STATUS.FUNDING_STARTED, STATUS.GRANT_APPROVED, STATUS.COMPLETED];

/**
 * @returns {{ currentPhase: number, passedEvaluation: boolean|null, phases: object[] }}
 * Each phase: { key, title, subtitle, comingSoon, state }
 * state ∈ 'done' | 'current' | 'locked' | 'rejected'
 */
function computePhases(application, evaluation = null) {
  const status = application.status;
  const passed = evaluation?.submittedAt ? evaluation.passed === true : null;

  // Which phase is the application "in".
  let currentPhase;
  if (PHASE1.includes(status)) currentPhase = 0;
  else if (PHASE2.includes(status)) currentPhase = 1;
  else if (ADVANCED.includes(status)) currentPhase = 2; // cleared evaluation
  else currentPhase = 0; // rejected — resolved below

  const rejected = status === STATUS.REJECTED;
  // A rejection after the evaluation was scored belongs to Phase 2; otherwise Phase 1.
  const rejectedPhase = rejected ? (evaluation?.submittedAt ? 1 : 0) : -1;

  const phases = PHASES.map((p, i) => {
    let state;
    if (rejected) {
      if (i < rejectedPhase) state = 'done';
      else if (i === rejectedPhase) state = 'rejected';
      else state = 'locked';
    } else if (i < currentPhase) {
      state = 'done';
    } else if (i === currentPhase) {
      // Phases 3–5 are coming soon: even when "reached", show them locked.
      state = p.comingSoon ? 'locked' : 'current';
    } else {
      state = 'locked';
    }
    return { ...p, state };
  });

  return { currentPhase, passedEvaluation: passed, phases };
}

module.exports = { PHASES, computePhases };
