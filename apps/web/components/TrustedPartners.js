'use client';

import '../styles/trusted-partners.css';
const partners = [
  '/assets/images/partners-logo/TSIC-NewLogo-Website.png',
  '/assets/images/partners-logo/t-hub-logo.png',
  '/assets/images/partners-logo/We-hub.png',
  '/assets/images/partners-logo/MSME_Logo.png',
  '/assets/images/partners-logo/nitiaayog-logo.png',
];

export default function TrustedPartners() {
  return (
<section className="trusted-partners">
    
    <div className="trusted-grid"></div>
<div className="trusted-rgb-orb"></div>

  <div className="trusted-rgb-glow"></div>
  <div className="trusted-orb"></div>

  <div className="container trusted-container">

        <div className="trusted-badge-wrapper">
         <div className="trusted-badge">
          ⚡ ECOSYSTEM PARTNERS
         </div>
        </div>

<div className="trusted-title">
  Trusted By
</div>

<div className="trusted-highlight-title">
  Ecosystem Leaders
</div>

        <p className="trusted-description">
          Collaborating with incubators, universities,
          investors and corporates across India.
        </p>

        <div className="partners-slider-wrapper">
          <div className="partners-slider-track">

            {[...partners, ...partners].map((logo, index) => (
              <div className="partner-logo" key={index}>
                <img src={logo} alt="Partner Logo" />
              </div>
            ))}

          </div>
        </div>

        <p className="trusted-footer">
          100+ Ecosystem Partners Across India
        </p>

      </div>
    </section>
  );
}