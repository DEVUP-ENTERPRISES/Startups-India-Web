'use client';

import { motion } from 'framer-motion';
import MarketAccessHero from '../../components/MarketAccessHero';
import '../../styles/market-access.css';

export default function MarketAccessPage() {
  return (
    <>
      <div className="market-access-page">
        
        <MarketAccessHero />

        {/* What is Market Access - Dark */}
        <section className="what-section">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="section-header what-is-header">
                <div className="section-label foundation-label">THE FOUNDATION</div>
                <h2 className="section-title">What is <span className="text-coral-light">Market</span> <span className="text-coral-dark">Access?</span></h2>
                <p className="section-description">
                  Market Access is the bridge between startup ideas/products and real<br/>
                  customers, industries, and markets.
                </p>
              </div>

              <div className="problems-grid">
                <motion.div 
                  className="premium-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true, margin: "-50px" }}
                >
                  <div className="card-header">
                    <div className="card-icon-box">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    </div>
                    <div className="card-number">01</div>
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">Early Customers</h3>
                    <p className="card-desc">Eliminate the adoption void. We secure your first high-value customers through a curated network of early adopters and design partners.</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="premium-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true, margin: "-50px" }}
                >
                  <div className="card-header">
                    <div className="card-icon-box">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                    </div>
                    <div className="card-number">02</div>
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">Market Feedback</h3>
                    <p className="card-desc">Bypass the guesswork. Gain direct, unfiltered insights from decision-makers who define your industry's future.</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="premium-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true, margin: "-50px" }}
                >
                  <div className="card-header">
                    <div className="card-icon-box">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3m10-10h-3M5 12H2m14.24-7.24-2.12 2.12m-8.48 8.48-2.12 2.12m12.72 0-2.12-2.12M7.76 7.76 5.64 5.64"/></svg>
                    </div>
                    <div className="card-number">03</div>
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">Industry Exposure</h3>
                    <p className="card-desc">Scale through authority. We place your product in front of industry leaders, removing the traditional barriers to entry.</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="premium-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true, margin: "-50px" }}
                >
                  <div className="card-header">
                    <div className="card-icon-box">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
                    </div>
                    <div className="card-number">04</div>
                  </div>
                  <div className="card-content">
                    <h3 className="card-title">Validation Opportunities</h3>
                    <p className="card-desc">Accelerate to product-market fit. Access pilot programs and technical validation tracks designed for high-growth potential.</p>
                  </div>
                </motion.div>
              </div>

              <div className="dark-solution-box">
                <div className="solution-animated-bg"></div>
                <div className="solution-corner-animation">
                  <div className="corner-orb orb-a"></div>
                  <div className="corner-orb orb-b"></div>
                  <div className="corner-orb orb-c"></div>
                </div>
                <div className="solution-badge">
                  <span className="dot"></span> STRATEGIC INSIGHT
                </div>
                <h3 className="solution-title">Our Solution</h3>
                <p className="solution-desc">
                  At Startups India, Market Access helps startups test, validate, and enter<br/>
                  <span className="solution-underline">the real market in a structured way</span>.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Why It Matters - Dark Premium */}
        <section className="why-section-dark">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="why-header-left">
                <h2 className="why-title">Why Market Access <br/><span className="why-highlight">is Important</span></h2>
                <div className="why-header-divider"></div>
                <p className="why-subtitle">
                  Strengthening the core of your digital platform and strategic<br/> ecosystem.
                </p>
              </div>

              <div className="why-premium-grid">
                <div className="why-premium-top">
                  <motion.div 
                    className="why-card-premium card-help"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="why-card-icon-box">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff5252" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon-anim">
                        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
                        <path d="M20 3v4"/>
                        <path d="M22 5h-4"/>
                        <path d="M4 17v2"/>
                        <path d="M5 18H3"/>
                      </svg>
                    </div>
                    <h3 className="why-card-title">Helping Startups Succeed</h3>
                    <ul className="why-check-list">
                      <li>
                        <svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="#ff5252"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg> 
                        <span>Startups get real-world validation</span>
                      </li>
                      <li>
                        <svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="#ff5252"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg> 
                        <span>Founders understand customer needs</span>
                      </li>
                      <li>
                        <svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="#ff5252"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg> 
                        <span>Products improve based on feedback</span>
                      </li>
                      <li>
                        <svg className="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="#ff5252"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg> 
                        <span>Reduced risk of failure</span>
                      </li>
                    </ul>
                  </motion.div>

                  <motion.div 
                    className="why-card-premium card-eco"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <div className="eco-content">
                      <div className="why-card-icon-box">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff5252" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon-anim delay-1">
                          <circle cx="12" cy="12" r="3" />
                          <path d="M12 9V4" />
                          <circle cx="12" cy="3" r="1" />
                          <path d="M14.5 10.5l4-3" />
                          <circle cx="19" cy="7" r="1" />
                          <path d="M14.5 13.5l3.5 3.5" />
                          <circle cx="19" cy="18" r="1" />
                          <path d="M9.5 13.5l-3.5 3.5" />
                          <circle cx="5" cy="18" r="1" />
                          <path d="M9.5 10.5l-4-3" />
                          <circle cx="5" cy="7" r="1" />
                        </svg>
                      </div>
                      <h3 className="why-card-title">Increasing<br/>Ecosystem Value</h3>
                      <p className="why-card-p">
                        Strategic growth through high-value networking and professional validation structures.
                      </p>
                    </div>
                    <div className="eco-list-box">
                      <ul className="why-square-list">
                        <li><span className="square-bullet"></span> Attracts serious founders</li>
                        <li><span className="square-bullet"></span> Builds investor credibility</li>
                        <li><span className="square-bullet"></span> Shows real outcomes</li>
                        <li><span className="square-bullet"></span> Clear differentiation</li>
                      </ul>
                    </div>
                  </motion.div>
                </div>

                <motion.div 
                  className="why-premium-bottom"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <div className="bottom-card-header">
                    <div className="bottom-badge">INNOVATION ENGINE</div>
                    <h3 className="bottom-title">Supporting Innovation</h3>
                  </div>
                  <div className="bottom-card-cols">
                    <div className="bottom-col">
                      <div className="bottom-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff5252" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon-anim delay-2">
                          <path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1.5.5 3 1.5 4.1.76.76 1.23 1.52 1.41 2.5"/>
                        </svg>
                      </div>
                      <p>Industry problems meet startup solutions</p>
                    </div>
                    <div className="bottom-col">
                      <div className="bottom-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff5252" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon-anim delay-1">
                          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
                        </svg>
                      </div>
                      <p>Encourages applied innovation</p>
                    </div>
                    <div className="bottom-col">
                      <div className="bottom-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff5252" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="svg-icon-anim delay-3">
                          <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"/>
                        </svg>
                      </div>
                      <p>Creates win-win collaboration</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* How It Works - Premium Dark */}
        <section className="process-section-premium">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="process-header-left">
                <h2 className="process-title">How <span className="process-highlight">Market Access</span><br/>Works</h2>
                <p className="process-subtitle">
                  A structured 5-step process to connect startups with real markets
                </p>
              </div>

              <div className="process-important-box">
                <div className="process-important-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                </div>
                <div className="process-important-content">
                  <div className="pi-title">Important Notice</div>
                  <div className="pi-desc">
                    Important: Market Access is facilitated, not guaranteed. Startups India acts as a connector and enabler, not a sales or funding platform.
                  </div>
                </div>
              </div>

              <div className="process-steps-premium">
                
                {/* Step 1 */}
                <div className="process-step-card">
                  <div className="step-card-left">
                    <div className="step-badge-tag">STEP 01</div>
                    <h3 className="step-card-title">Startup Identification</h3>
                    <p className="step-card-text">
                      Market Access opportunities are provided to startups in incubation, advanced programs, and high-potential early-stage ventures.
                    </p>
                    <div className="step-pills-row">
                      <div className="step-pill">
                        <svg className="pill-ico" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffb099" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                        Problem relevance
                      </div>
                      <div className="step-pill">
                        <svg className="pill-ico" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffb099" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        Product readiness
                      </div>
                      <div className="step-pill">
                        <svg className="pill-ico" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffb099" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
                        Market potential
                      </div>
                    </div>
                  </div>
                  <div className="step-card-right tech-bg-1"></div>
                </div>

                {/* Step 2 */}
                <div className="process-step-card">
                  <div className="step-card-left">
                    <div className="step-badge-tag">STEP 02</div>
                    <h3 className="step-card-title">Market Readiness Support</h3>
                    <p className="step-card-text">
                      Before market exposure, startups receive guidance to ensure they are market-ready, not just idea-ready.
                    </p>
                    <div className="step-pills-row">
                      <div className="step-pill">Target customer definition</div>
                      <div className="step-pill">Value proposition clarity</div>
                      <div className="step-pill">Pitch/positioning</div>
                    </div>
                  </div>
                  <div className="step-card-right tech-bg-2"></div>
                </div>

                {/* Step 3 */}
                <div className="process-step-card">
                  <div className="step-card-left">
                    <div className="step-badge-tag">STEP 03</div>
                    <h3 className="step-card-title">Industry & Partner Mapping</h3>
                    <p className="step-card-text">
                      We identify relevant industry partners, corporate entities, institutions, and community networks.
                    </p>
                    <div className="step-pills-row">
                      <div className="step-pill">Industry sector matching</div>
                      <div className="step-pill">Solution relevance</div>
                      <div className="step-pill">Target networking</div>
                    </div>
                  </div>
                  <div className="step-card-right tech-bg-3"></div>
                </div>

                {/* Step 4 */}
                <div className="process-step-card">
                  <div className="step-card-left">
                    <div className="step-badge-tag">STEP 04</div>
                    <h3 className="step-card-title">Curated Market Exposure</h3>
                    <p className="step-card-text">
                      Startups get controlled exposure through managed channels and curated events.
                    </p>
                    <div className="step-pills-row">
                      <div className="step-pill">Demo days</div>
                      <div className="step-pill">Pilot discussions</div>
                      <div className="step-pill">Industry showcases</div>
                    </div>
                    <div className="step-inline-note">
                      📌 All exposure is curated and managed by Startups India
                    </div>
                  </div>
                  <div className="step-card-right tech-bg-4"></div>
                </div>

                {/* Step 5 */}
                <div className="process-step-card">
                  <div className="step-card-left">
                    <div className="step-badge-tag">STEP 05</div>
                    <h3 className="step-card-title">Feedback & Learning</h3>
                    <p className="step-card-text">
                      Startups receive valuable insights to refine their products and strategies.
                    </p>
                    <div className="step-pills-row">
                      <div className="step-pill">Market feedback</div>
                      <div className="step-pill">Use-case insights</div>
                      <div className="step-pill">GTM Strategy</div>
                    </div>
                  </div>
                  <div className="step-card-right tech-bg-5"></div>
                </div>

              </div>
            </motion.div>
          </div>
        </section>

        {/* Who Benefits - Premium Dark */}
        <section className="benefits-section-premium">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="benefits-grid-premium">
                
                {/* Card 1: Startups */}
                <motion.div 
                  className="benefit-card-premium"
                  initial={{ opacity: 0, y: 40, rotateX: -15 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 0.6, delay: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                >
                  <div className="ben-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#ff5252" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-5c1.62-2.2 5-4 5-4"/><path d="M12 15v5s3.03-.55 5-2c2.2-1.62 4-5 4-5"/></svg>
                  </div>
                  <h3 className="ben-title">For Startups</h3>
                  <ul className="ben-list">
                    <li><span className="ben-check"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff5252" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>Early customer insights</li>
                    <li><span className="ben-check"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff5252" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>Product validation</li>
                    <li><span className="ben-check"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff5252" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>Industry exposure</li>
                    <li><span className="ben-check"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff5252" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>Stronger investor readiness</li>
                  </ul>
                </motion.div>

                {/* Card 2: Industry & Partners */}
                <motion.div 
                  className="benefit-card-premium"
                  initial={{ opacity: 0, y: 40, rotateX: -15 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                >
                  <div className="ben-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#ff5252" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  </div>
                  <h3 className="ben-title">For Industry & Partners</h3>
                  <ul className="ben-list">
                    <li><span className="ben-check"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff5252" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>Access to innovative solutions</li>
                    <li><span className="ben-check"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff5252" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>Early engagement with startups</li>
                    <li><span className="ben-check"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff5252" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>Opportunity to explore pilots</li>
                  </ul>
                </motion.div>

                {/* Card 3: Startups India */}
                <motion.div 
                  className="benefit-card-premium"
                  initial={{ opacity: 0, y: 40, rotateX: -15 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                >
                  <div className="ben-icon-box">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#ff5252" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                  </div>
                  <h3 className="ben-title">For Startups India</h3>
                  <ul className="ben-list">
                    <li><span className="ben-check"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff5252" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>Strong ecosystem credibility</li>
                    <li><span className="ben-check"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff5252" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>Measurable impact</li>
                    <li><span className="ben-check"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff5252" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>Long-term partnerships</li>
                    <li><span className="ben-check"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff5252" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>Sustainable ecosystem growth</li>
                  </ul>
                </motion.div>

              </div>
            </motion.div>
          </div>
        </section>


        {/* Disclaimer - Premium Dark */}
        <section className="disclaimer-section-premium">
          <div className="container">
            <motion.div
              className="disclaimer-wrapper"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="disclaimer-top-box">
                <div className="disclaimer-icon-shield">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ff5252" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <path d="m9 12 2 2 4-4"/>
                  </svg>
                </div>
                <h2 className="disclaimer-large-title">IMPORTANT DISCLAIMER</h2>
                <div className="title-bottom-line"></div>
              </div>

              <div className="disclaimer-content-card">
                <div className="disclaimer-list">
                  <div className="disclaimer-item-premium">
                    <div className="item-icon-box">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff5252" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>                    </div>
                    <p>Market Access <strong>does not guarantee</strong> customers, revenue, or investments</p>
                  </div>
                  
                  <div className="disclaimer-item-premium">
                    <div className="item-icon-box">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff5252" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m14 13-2-2 2 2Zm-7 7 4-4-4 4Zm10-10 4-4-4 4ZM7 7l4 4-4-4Z"/><path d="m8 7 4 4-4-4Zm8 8 4 4-4-4Z"/><path d="m21 11-8-8 1.5-1.5L22.5 9.5 21 11ZM3 13l8 8-1.5 1.5L1.5 14.5 3 13Z"/><path d="m14 13 4 4-1.5 1.5L12.5 14.5 14 13Zm-8-8 4 4-1.5 1.5L6.5 6.5 8 5Z"/></svg>                    </div>
                    <p>Startups India <strong>does not act</strong> as a sales agent or broker</p>
                  </div>

                  <div className="disclaimer-item-premium">
                    <div className="item-icon-box">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ff5252" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>                    </div>
                    <p>All engagements are <strong>exploratory and learning-driven</strong></p>
                  </div>
                </div>
              </div>

              <div className="disclaimer-sub-footer">
                <span className="red-dot"></span> THIS ENSURES TRANSPARENCY, TRUST, AND COMPLIANCE.
              </div>
            </motion.div>
          </div>
        </section>

      </div>
    </>
  );
}
