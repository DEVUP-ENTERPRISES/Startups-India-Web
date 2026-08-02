'use client';

import '../../../styles/programs.css';

export default function GrowthProgramsPage() {
  return (
    <div className="programs-page">
      <div className="programs-container">
        <div className="coming-soon-box">
          <div className="icon">📈</div>
          <h1>Coming Soon</h1>
          <p className="subtitle">Growth Programs Are On The Way</p>
          <div className="divider"></div>
          <p className="description">
            We're developing advanced growth programs designed to scale your startup to new heights. 
            Expect strategic guidance, expansion support, and access to global networks that will accelerate your growth journey.
          </p>
          <div className="features">
            <span className="feature-tag">Scale Strategy</span>
            <span className="feature-tag">Global Networks</span>
            <span className="feature-tag">Advanced Resources</span>
          </div>
        </div>
      </div>
    </div>
  );
}
