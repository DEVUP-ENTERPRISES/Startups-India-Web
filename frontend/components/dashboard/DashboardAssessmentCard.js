'use client';

import '../../styles/dashboard-assessment-card.css';

export default function DashboardAssessmentCard() {
  return (
    <div className="dashboard-assessment-card pending launch-notice">
      <div className="assessment-status-badge launch">
        <span className="status-dot launching"></span>
        <span className="status-text">Coming Soon</span>
      </div>

      <div className="assessment-icon-premium">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
          <path d="M6 12v5c3 3 9 3 12 0v-5"/>
        </svg>
      </div>

      <h3 className="assessment-title-premium">Final Assessment</h3>
      <p className="assessment-description-premium">
        Complete the assessment to earn your certificate
      </p>

      <div className="launch-date-compact">
        <div>
          <div className="launch-title-compact">Launches</div>
          <div className="launch-date-compact-text">26 Jan 2026</div>
        </div>
      </div>
    </div>
  );
}
