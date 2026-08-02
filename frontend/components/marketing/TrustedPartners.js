'use client';

import '../../styles/trusted-partners.css';

const partners = [
  { src: '/assets/images/partners-logo/TSIC-NewLogo-Website.png', alt: 'TSIC' },
  { src: '/assets/images/partners-logo/t-hub-logo.png',           alt: 'T-Hub' },
  { src: '/assets/images/partners-logo/We-hub.png',               alt: 'WE Hub' },
  { src: '/assets/images/partners-logo/MSME_Logo.png',            alt: 'MSME' },
  { src: '/assets/images/partners-logo/nitiaayog-logo.png',       alt: 'NITI Aayog' },
  { src: '/assets/images/partners-logo/Google-logo.png',          alt: 'Google' },
];

// Duplicate for seamless infinite scroll
const track = [...partners, ...partners, ...partners];

export default function TrustedPartners() {
  return (
    <section className="tp-section">
      {/* Background layers */}
      <div className="tp-grid"       aria-hidden="true" />
      <div className="tp-rgb-glow"   aria-hidden="true" />
      <div className="tp-orb"        aria-hidden="true" />
      <div className="tp-rgb-orb"    aria-hidden="true" />

      <div className="tp-container">
        {/* Badge */}
        <div className="tp-badge-wrap">
          <div className="tp-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
            ECOSYSTEM PARTNERS
          </div>
        </div>

        {/* Heading */}
        <h2 className="tp-title">Trusted By</h2>
        <h2 className="tp-highlight">Ecosystem Leaders</h2>

        <p className="tp-desc">
          Collaborating with incubators, universities, investors and corporates across India.
        </p>

        {/* Logo slider */}
        <div className="tp-slider-wrap">
          <div className="tp-slider-track">
            {track.map((p, i) => (
              <div className="tp-logo" key={i}>
                <img src={p.src} alt={p.alt} loading="lazy" />
              </div>
            ))}
          </div>
        </div>

        <p className="tp-footer">100+ Ecosystem Partners Across India</p>
      </div>
    </section>
  );
}
