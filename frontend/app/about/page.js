'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Lightbulb,
  Sprout,
  Handshake,
  Rocket,
  Target,
  Star,
  Users,
  GraduationCap,
  Building2,
  TrendingUp,
  Zap,
  Coins,
  Library,
  UserCheck,
} from 'lucide-react';
import '@/lib/i18n';
import { useTranslation } from 'react-i18next';
import '../../styles/about-modern.css';
import TeamSection from '@/components/marketing/TeamSection';
import AboutHero from '@/components/marketing/AboutHero';
import EcosystemImpactRoadmapVertical from '@/components/ecosystem/EcosystemImpactRoadmapVertical';
import '../../styles/ecosystem-roadmap-vertical.css';

export default function AboutUs() {
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const handleMouseMove = e => {
      const cards = document.querySelectorAll(
        '.icon-box, .card, .feature-card, .about-card, .mission-card, .approach-card, .what-card, .impact-roadmap-card, .hero-stat-item, .stat-item'
      );
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--x', `${x}px`);
        card.style.setProperty('--y', `${y}px`);
        // Keep old vars for other card types if needed
        card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
        card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <AboutHero />

      {/* Floating Premium Language Switcher Sticky Widget */}
      <div className="lang-switcher-sticky">
        <button
          className={`lang-switcher-btn ${i18n.language === 'en' ? 'active' : ''}`}
          onClick={() => i18n.changeLanguage('en')}
        >
          EN
        </button>
        <button
          className={`lang-switcher-btn ${i18n.language === 'hi' ? 'active' : ''}`}
          onClick={() => i18n.changeLanguage('hi')}
        >
          HI
        </button>
      </div>

      <div className="about-page">
        {/* Who We Are - Dark */}
        <section className="who-section" id="about-company">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="section-header">
                <div className="section-label">{t('about.ourStory')}</div>
                <h2 className="section-title">{t('about.whyWeBuilt')}</h2>
              </div>

              <div className="who-content">
                <p className="who-description">
                  {t('about.description')}
                </p>
                <div className="who-highlight">
                  <p>
                    {t('about.highlight')}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* What We Stand For - Light */}
        <section className="stand-section">
          <div className="container">
            <div>
              <div className="section-header">
                <div className="section-label">{t('about.ourValues')}</div>
                <h2 className="section-title">{t('about.whatWeStandFor')}</h2>
                <p className="section-description">
                  {t('about.valuesDescription')}
                </p>
              </div>

              <div className="stand-grid">
                <div className="icon-box">
                  <div className="stand-icon">
                    <Lightbulb size={24} />
                  </div>
                  <h3>{t('about.encouraged')}</h3>
                </div>
                <div className="icon-box">
                  <div className="stand-icon">
                    <Sprout size={24} />
                  </div>
                  <h3>{t('about.nurtured')}</h3>
                </div>
                <div className="icon-box">
                  <div className="stand-icon">
                    <Handshake size={24} />
                  </div>
                  <h3>{t('about.supported')}</h3>
                </div>
                <div className="icon-box">
                  <div className="stand-icon">
                    <Rocket size={24} />
                  </div>
                  <h3>{t('about.builtWithClarity')}</h3>
                </div>
              </div>

              <div className="stand-statement">
                <p>
                  {t('about.ecosystemStatement')}<strong>{t('about.ecosystemEnabler')}</strong>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What We Do - Dark */}
        <section className="what-section">
          <div className="container">
            <div>
              <div className="section-header">
                <div className="section-label">{t('about.ourServices')}</div>
                <h2 className="section-title">{t('about.whatWeDo')}</h2>
                <p className="section-description">
                  {t('about.servicesDescription')}
                </p>
              </div>

              <div className="what-grid">
                <div className="what-card">
                  <div className="what-number">01</div>
                  <h3>{t('about.ideasInnovation')}</h3>
                  <ul>
                    <li>{t('about.ideasBullet1')}</li>
                    <li>{t('about.ideasBullet2')}</li>
                    <li>{t('about.ideasBullet3')}</li>
                  </ul>
                </div>

                <div className="what-card">
                  <div className="what-number">02</div>
                  <h3>{t('about.foundersEntrepreneurs')}</h3>
                  <ul>
                    <li>{t('about.foundersBullet1')}</li>
                    <li>{t('about.foundersBullet2')}</li>
                    <li>{t('about.foundersBullet3')}</li>
                  </ul>
                </div>

                <div className="what-card">
                  <div className="what-number">03</div>
                  <h3>{t('about.earlyStageStartups')}</h3>
                  <ul>
                    <li>{t('about.earlyBullet1')}</li>
                    <li>{t('about.earlyBullet2')}</li>
                    <li>{t('about.earlyBullet3')}</li>
                  </ul>
                </div>

                <div className="what-card">
                  <div className="what-number">04</div>
                  <h3>{t('about.studentsInstitutions')}</h3>
                  <ul>
                    <li>{t('about.studentsBullet1')}</li>
                    <li>{t('about.studentsBullet2')}</li>
                    <li>{t('about.studentsBullet3')}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision - Light */}
        <section className="mission-section" id="vision-mission">
          <div className="container">
            <div>
              <div className="mission-grid">
                <div className="mission-card">
                  <div className="mission-icon">
                    <Target size={24} />
                  </div>
                  <h3>{t('about.ourMission')}</h3>
                  <p>
                    {t('about.missionDescription')}
                  </p>
                </div>

                <div className="mission-card">
                  <div className="mission-icon">
                    <Star size={24} />
                  </div>
                  <h3>{t('about.ourVision')}</h3>
                  <p>
                    {t('about.visionDescription')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <EcosystemImpactRoadmapVertical />

        {/* Our Approach - Light */}
        <section className="approach-section">
          <div className="container">
            <div>
              <div className="section-header">
                <div className="section-label">{t('about.ourMethodology')}</div>
                <h2 className="section-title">{t('about.ourApproach')}</h2>
                <p className="section-description">{t('about.approachDescription')}</p>
              </div>

              <div className="approach-grid">
                <div className="approach-card">
                  <div className="approach-icon">
                    <Target size={24} />
                  </div>
                  <h3>{t('about.learnByDoing')}</h3>
                  <p>{t('about.notJustTheory')}</p>
                </div>
                <div className="approach-card">
                  <div className="approach-icon">
                    <Users size={24} />
                  </div>
                  <h3>{t('about.founderFirstMindset')}</h3>
                  <p>{t('about.successPriority')}</p>
                </div>
                <div className="approach-card">
                  <div className="approach-icon">
                    <Zap size={24} />
                  </div>
                  <h3>{t('about.executionOverIdeas')}</h3>
                  <p>{t('about.actionDrivesResults')}</p>
                </div>
                <div className="approach-card">
                  <div className="approach-icon">
                    <Handshake size={24} />
                  </div>
                  <h3>{t('about.communityGrowth')}</h3>
                  <p>{t('about.growTogether')}</p>
                </div>
              </div>

              <div className="approach-statement">
                <p>
                  {t('about.realOutcomes')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us - Dark */}
        <section className="why-section">
          <div className="container">
            <div>
              <div className="section-header">
                <div className="section-label">{t('about.whyUs')}</div>
                <h2 className="section-title">{t('about.whyStartupsIndia')}</h2>
              </div>

              <div className="why-grid">
                <div className="why-item">
                  <div className="why-check">✓</div>
                  <p>{t('about.whyBullet1')}</p>
                </div>
                <div className="why-item">
                  <div className="why-check">✓</div>
                  <p>{t('about.whyBullet2')}</p>
                </div>
                <div className="why-item">
                  <div className="why-check">✓</div>
                  <p>{t('about.whyBullet3')}</p>
                </div>
                <div className="why-item">
                  <div className="why-check">✓</div>
                  <p>{t('about.whyBullet4')}</p>
                </div>
                <div className="why-item">
                  <div className="why-check">✓</div>
                  <p>{t('about.whyBullet5')}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Commitment - Light */}
        <section className="commitment-section">
          <div className="container">
            <motion.div
              className="commitment-box"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2>{t('about.ourCommitment')}</h2>
              <p>
                {t('about.commitmentP1')}
              </p>
              <p>
                {t('about.commitmentP2')}
              </p>
            </motion.div>
          </div>
        </section>

        {/* TEAM SECTION */}
        <TeamSection />

        {/* CTA Section - Dark */}
        <section className="cta-section">
          <div className="container">
            <motion.div
              className="cta-content"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2>{t('about.ctaTitle')}</h2>
              <p>
                {t('about.ctaSub')}
              </p>
              <a href="/login" style={{ textDecoration: 'none' }}>
                <button className="cta-button">{t('about.ctaBtn')}</button>
              </a>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
