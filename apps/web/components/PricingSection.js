'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function PricingSection() {
  const router = useRouter();
  const pricingTiers = [
    {
      id: 1,
      name: 'Sponsored',
      price: 'Free',
      subtitle: 'Limited seats available',
      description: 'For exceptional student founders who demonstrate strong potential and commitment.',
      features: [
        'Full program access',
        'All workshops included',
        'Mentor sessions',
        'Community access',
        'Certificate of completion'
      ],
      cta: 'Apply for Sponsorship',
      popular: false,
      availability: 'Subject to availability'
    },
    {
      id: 2,
      name: 'Premium',
      price: 'Contact Us',
      subtitle: 'Best value for serious founders',
      description: 'Complete pre-incubation program designed to accelerate your startup journey.',
      features: [
        'Full curriculum access',
        'Weekly mentor sessions',
        'Live workshops & events',
        'Pitch deck review',
        'Investor introductions',
        'Community & networking',
        'Certificate of completion',
        'Lifetime alumni access'
      ],
      cta: 'Get Pricing Details',
      popular: true,
      badge: 'Most Popular'
    },
    {
      id: 3,
      name: 'Scholarship',
      price: 'Up to 100% Off',
      subtitle: 'Merit & need-based',
      description: 'Financial assistance for deserving student founders who need support.',
      features: [
        'Income-based eligibility',
        'Merit evaluation',
        'Project assessment',
        'Quick application process',
        'Partial to full coverage'
      ],
      cta: 'Apply for Scholarship',
      popular: false,
      criteria: true
    }
  ];

  return (
    <section className="pricing-section">
      {/* Background Elements */}
      <div className="pricing-bg">
        <div className="pricing-gradient pricing-gradient-1"></div>
        <div className="pricing-gradient pricing-gradient-2"></div>
      </div>

      <div className="pricing-container">
        {/* Header */}
        <motion.div
          className="pricing-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="pricing-badge">PRICING & SCHOLARSHIPS</div>
          <h2 className="pricing-title">
            Invest in Your<br />
            <span className="pricing-highlight">Startup Future</span>
          </h2>
          <p className="pricing-subtitle">
            We believe in making quality education accessible. Choose the plan that works for you, or apply for financial assistance.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="pricing-grid">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.id}
              className={`pricing-card ${tier.popular ? 'pricing-card-popular' : ''}`}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              {tier.popular && (
                <div className="pricing-card-badge">{tier.badge}</div>
              )}

              <div className="pricing-card-header">
                <h3 className="pricing-card-name">{tier.name}</h3>
                <div className="pricing-card-price">{tier.price}</div>
                <p className="pricing-card-subtitle">{tier.subtitle}</p>
              </div>

              <p className="pricing-card-description">{tier.description}</p>

              {tier.availability && (
                <div className="pricing-availability">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
                  <span>{tier.availability}</span>
                </div>
              )}

              <div className="pricing-features">
                {tier.features.map((feature, idx) => (
                  <div key={idx} className="pricing-feature">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              {tier.criteria && (
                <div className="pricing-criteria">
                  <div className="criteria-label">Scholarship Criteria:</div>
                  <div className="criteria-text">Based on merit, need, and project potential</div>
                </div>
              )}

              <button 
                className={`pricing-cta ${tier.popular ? 'pricing-cta-primary' : 'pricing-cta-secondary'}`}
                onClick={() => router.push('/signup')}
              >
                <span>{tier.cta}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Trust Banner */}
        <motion.div
          className="pricing-trust"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="trust-item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span>Secure Payment</span>
          </div>
          <div className="trust-item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="7"/>
              <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
            </svg>
            <span>Certificate Included</span>
          </div>
          <div className="trust-item">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span>Lifetime Alumni Access</span>
          </div>
        </motion.div>

        {/* Help Section */}
        <motion.div
          className="pricing-help"
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="pricing-help-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div className="pricing-help-content">
            <h3>Have questions about pricing?</h3>
            <p>Our team is here to help you find the right plan and answer any questions about scholarships or payment options.</p>
          </div>
          <button className="pricing-help-cta" onClick={() => window.location.href = 'mailto:info@startupsindia.in'}>
            <span>Contact Us</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
