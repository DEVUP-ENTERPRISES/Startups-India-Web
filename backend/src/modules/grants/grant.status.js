const { ApiError } = require('../../utils/apiError');

/**
 * The application lifecycle, as an explicit state machine.
 *
 * Statuses are not free-text and transitions are not "whatever the admin clicked".
 * Without this, an application could go Rejected → Grant Approved, or a student
 * could reach Evaluation Scheduled without ever paying. Every transition in the
 * product is enumerated here, and anything not listed is rejected at the service
 * boundary — so a bug in a controller cannot corrupt an application's history.
 */
const STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under_review',
  CHANGES_REQUESTED: 'changes_requested',
  SHORTLISTED: 'shortlisted',
  REJECTED: 'rejected',
  SELECTED: 'selected',
  EVALUATION_PENDING: 'idea_evaluation_pending',
  EVALUATION_PAID: 'idea_evaluation_paid',
  EVALUATION_SCHEDULED: 'evaluation_scheduled',
  EVALUATION_COMPLETED: 'evaluation_completed',
  FUNDING_STARTED: 'funding_process_started',
  GRANT_APPROVED: 'grant_approved',
  COMPLETED: 'completed',
};

const ALL_STATUSES = Object.values(STATUS);

// Human labels — the student UI never invents its own copy for a status.
const STATUS_LABELS = {
  [STATUS.DRAFT]: 'Draft',
  [STATUS.SUBMITTED]: 'Submitted',
  [STATUS.UNDER_REVIEW]: 'Under Review',
  [STATUS.CHANGES_REQUESTED]: 'Changes Requested',
  [STATUS.SHORTLISTED]: 'Shortlisted',
  [STATUS.REJECTED]: 'Rejected',
  [STATUS.SELECTED]: 'Selected',
  [STATUS.EVALUATION_PENDING]: 'Idea Evaluation Pending',
  [STATUS.EVALUATION_PAID]: 'Idea Evaluation Paid',
  [STATUS.EVALUATION_SCHEDULED]: 'Evaluation Scheduled',
  [STATUS.EVALUATION_COMPLETED]: 'Evaluation Completed',
  [STATUS.FUNDING_STARTED]: 'Funding Process Started',
  [STATUS.GRANT_APPROVED]: 'Grant Approved',
  [STATUS.COMPLETED]: 'Completed',
};

// Terminal: nothing may transition out of these.
const TERMINAL = [STATUS.REJECTED, STATUS.COMPLETED];

/**
 * Allowed transitions. Read as: from → [permitted next states].
 * `actor` records who is allowed to drive each transition; anything a student
 * can trigger is deliberately tiny.
 */
const TRANSITIONS = {
  [STATUS.DRAFT]: [STATUS.SUBMITTED],
  [STATUS.SUBMITTED]: [STATUS.UNDER_REVIEW, STATUS.SHORTLISTED, STATUS.REJECTED, STATUS.CHANGES_REQUESTED],
  [STATUS.UNDER_REVIEW]: [STATUS.SHORTLISTED, STATUS.REJECTED, STATUS.CHANGES_REQUESTED, STATUS.SELECTED],
  // A student edits and resubmits.
  [STATUS.CHANGES_REQUESTED]: [STATUS.SUBMITTED, STATUS.REJECTED],
  [STATUS.SHORTLISTED]: [STATUS.SELECTED, STATUS.REJECTED, STATUS.UNDER_REVIEW],
  // Selection is what opens the paid evaluation.
  [STATUS.SELECTED]: [STATUS.EVALUATION_PENDING, STATUS.GRANT_APPROVED, STATUS.REJECTED],
  // Only a verified payment moves this on — see grant.service.
  [STATUS.EVALUATION_PENDING]: [STATUS.EVALUATION_PAID, STATUS.REJECTED],
  [STATUS.EVALUATION_PAID]: [STATUS.EVALUATION_SCHEDULED, STATUS.REJECTED],
  [STATUS.EVALUATION_SCHEDULED]: [STATUS.EVALUATION_COMPLETED, STATUS.REJECTED],
  [STATUS.EVALUATION_COMPLETED]: [STATUS.FUNDING_STARTED, STATUS.GRANT_APPROVED, STATUS.REJECTED],
  [STATUS.FUNDING_STARTED]: [STATUS.GRANT_APPROVED, STATUS.REJECTED],
  [STATUS.GRANT_APPROVED]: [STATUS.COMPLETED],
  [STATUS.REJECTED]: [],
  [STATUS.COMPLETED]: [],
};

// Statuses at/after which the student's own form is frozen. Editing after review
// has begun would let someone swap their pitch out from under a reviewer.
const LOCKED_STATUSES = ALL_STATUSES.filter(
  s => s !== STATUS.DRAFT && s !== STATUS.CHANGES_REQUESTED
);

function isTerminal(status) {
  return TERMINAL.includes(status);
}

function canTransition(from, to) {
  return Boolean(TRANSITIONS[from]?.includes(to));
}

/**
 * Throws unless `from → to` is a legal move. This is the single choke point that
 * every status change must pass through.
 */
function assertTransition(from, to) {
  if (!ALL_STATUSES.includes(to)) {
    throw new ApiError(400, `Unknown status: ${to}`);
  }
  if (from === to) {
    throw new ApiError(409, `Application is already ${STATUS_LABELS[to]}`);
  }
  if (isTerminal(from)) {
    throw new ApiError(409, `Application is ${STATUS_LABELS[from]} and can no longer change`);
  }
  if (!canTransition(from, to)) {
    throw new ApiError(
      409,
      `Cannot move an application from ${STATUS_LABELS[from]} to ${STATUS_LABELS[to]}`
    );
  }
}

// Is the student allowed to edit the form in this state?
function isEditable(status, revisionAllowed = false) {
  if (status === STATUS.DRAFT || status === STATUS.CHANGES_REQUESTED) return true;
  // Admin can unlock a specific application for revision.
  return revisionAllowed && !isTerminal(status);
}

module.exports = {
  STATUS,
  ALL_STATUSES,
  STATUS_LABELS,
  TRANSITIONS,
  LOCKED_STATUSES,
  isTerminal,
  canTransition,
  assertTransition,
  isEditable,
};
