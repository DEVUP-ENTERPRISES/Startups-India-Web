'use client';

import { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';

export default function AboutUsIntroSection() {
  const videoRef = useRef(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  // Auto-play video when section comes into view
  useEffect(() => {
    if (isInView && videoRef.current) {
      videoRef.current.play().catch(error => {
        // Silently handle autoplay errors
        console.log('Video autoplay prevented:', error);
      });
    }
  }, [isInView]);

  return (
    <section className="about-intro-section" ref={sectionRef}>
      <div className="about-intro-bg">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <div className="container">
        <div className="about-intro-grid">
          {/* Left Content */}
          <motion.div 
            className="about-intro-content"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div 
              className="intro-badge"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
               India’s Complete Startup Ecosystem - From Idea to IPO
            </motion.div>

            <motion.h2 
              className="intro-title"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              The Voice of <span className="highlight-text">India’s</span> Entrepreneurial <span className="highlight-text">Ecosystem</span>.
            </motion.h2>

            <motion.div 
              className="intro-decorative-line"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
            />

            <motion.p 
              className="intro-description"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              StartupsIndia.in is a leading startup ecosystem platform in India dedicated to empowering entrepreneurs, startups, and innovators.
We provide end-to-end startup support including startup incubation, funding access, business mentorship, entrepreneurship development programs, startup events, and investor networking opportunities..
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <Link href="/about" className="intro-cta-button">
                <span>Find Out More</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Media */}
          <motion.div 
            className="about-intro-media"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            <div className="media-container">
              {/* Decorative Elements */}
              <motion.div 
                className="media-decoration decoration-1"
                animate={{ 
                  y: [0, -20, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{ 
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div 
                className="media-decoration decoration-2"
                animate={{ 
                  y: [0, 20, 0],
                  rotate: [0, -5, 0]
                }}
                transition={{ 
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Video/Image Circle */}
              <div className="media-circle">
                <div className="media-circle-inner">
                  {/* Local MP4 Video */}
                  <video 
                    ref={videoRef}
                    className="media-video"
                    loop
                    muted
                    playsInline
                    preload="none"
                    poster="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800"
                  >
                    <source src="/assets/videos/about-us-intro.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>

                {/* Animated Ring */}
                <motion.div 
                  className="media-ring"
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                  }}
                />
              </div>

              {/* Gradient Overlay */}
              <div className="media-gradient-overlay" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Premium Stats Section */}
      <motion.div 
        className="premium-stats-section"
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.9 }}
      >
        <div className="container">
          <div className="premium-stats-grid">
            <motion.div 
              className="premium-stat-card"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.0 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <div className="stat-icon-premium">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                  <path d="M2 17l10 5 10-5"/>
                  <path d="M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div className="stat-number-premium">500+</div>
              <div className="stat-label-premium">Startups Incubated</div>
              <div className="stat-description">Successfully launched and scaled</div>
            </motion.div>

            <motion.div 
              className="premium-stat-card"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <div className="stat-icon-premium">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div className="stat-number-premium">200+</div>
              <div className="stat-label-premium">Expert Mentors</div>
              <div className="stat-description">Industry leaders guiding you</div>
            </motion.div>

            <motion.div 
              className="premium-stat-card"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.2 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <div className="stat-icon-premium">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
              <div className="stat-number-premium">₹110Cr+</div>
              <div className="stat-label-premium">Funding Raised</div>
              <div className="stat-description">By our portfolio startups</div>
            </motion.div>

            <motion.div 
              className="premium-stat-card"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.3 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <div className="stat-icon-premium">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M2 12h20"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              </div>
              <div className="stat-number-premium">₹120cr+</div>
              <div className="stat-label-premium">Govt. Grants Raised</div>
              <div className="stat-description">Global impact and presence</div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
