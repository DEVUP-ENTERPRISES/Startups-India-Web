'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const carouselData = [
  {
    id: 1,
    title: 'Start your innovation ',
    subtitle: 'and startup journey',
    description: '',
    badge: 'Expert Mentorship',
    cardTitle: 'Mentorship Network',
    cardContent: {
      type: 'mentorship',
      stats: [
        { icon: 'industry', label: 'Industry Experts', value: '500+', color: '#3b82f6' },
        { icon: 'target', label: 'Success Rate', value: '95%', color: '#10b981' },
        { icon: 'clock', label: 'Avg Response', value: '24hrs', color: '#f59e0b' },
        { icon: 'chart', label: 'Growth Rate', value: '3.5x', color: '#ef4444' },
      ],
      highlight: 'One-on-one sessions with startup founders who have raised $100M+',
    },
  },
  {
    id: 2,
    title: 'Turn your idea into ',
    subtitle: 'reality with StartupsIndia',
    description: '',
    badge: 'Idea & Growth',
    cardTitle: 'Funding Dashboard',
    cardContent: {
      type: 'funding',
      mainValue: '₹50Cr+',
      mainLabel: 'Total Funding Raised',
      stats: [
        { label: 'Active Startups', value: '2000+', trend: '+12%', color: '#10b981' },
        { label: 'Avg Funding', value: '₹5L', trend: '+8%', color: '#3b82f6' },
        { label: 'Success Stories', value: '1500+', trend: '+25%', color: '#ef4444' },
      ],
      highlight: 'Pitch to 50+ investors quarterly',
    },
  },
  {
    id: 3,
    title: 'Master essential skills',
    subtitle: 'through structured learning',
    description: '',
    badge: 'Learning Programs',
    cardTitle: 'Learning Ecosystem',
    cardContent: {
      type: 'learning',
      totalCourses: '259+',
      categories: [
        { icon: '', name: 'Business', count: 45, color: '#3b82f6' },
        { icon: '', name: 'Technology', count: 62, color: '#8b5cf6' },
        { icon: '', name: 'Analytics', count: 38, color: '#10b981' },
        { icon: '', name: 'Design', count: 29, color: '#ec4899' },
        { icon: '', name: 'Marketing', count: 51, color: '#ef4444' },
        { icon: '', name: 'Product', count: 34, color: '#06b6d4' },
      ],
      highlight: 'Live workshops every week',
    },
  },
];

export default function EcosystemCarouselSection() {
  const [activeIndex, setActiveIndex] = useState(1); // Start with middle card

  // Auto-rotate carousel every 8 seconds (slower for better readability)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % carouselData.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const handleNext = () => {
    setActiveIndex(prev => (prev + 1) % carouselData.length);
  };

  const handlePrev = () => {
    setActiveIndex(prev => (prev - 1 + carouselData.length) % carouselData.length);
  };

  const getCardPosition = index => {
    const diff = index - activeIndex;
    if (diff === 0) return 'center';
    if (diff === -1 || diff === carouselData.length - 1) return 'left';
    if (diff === 1 || diff === -carouselData.length + 1) return 'right';
    return 'hidden';
  };

  const activeCard = carouselData[activeIndex];

  return (
    <section className="ecosystem-carousel-section">
      {/* Animated Background */}
      <div className="carousel-bg-gradient"></div>

      {/* Animated Background Elements */}
      <div className="carousel-glow-orbs">
        <motion.div
          className="glow-orb orb-red-1"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="glow-orb orb-red-2"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />
      </div>

      {/* Floating Particles - Red and White Mix */}
      <div className="floating-particles">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className={`particle ${i % 3 === 0 ? 'particle-white' : 'particle-red'}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
            }}
            animate={{
              y: [0, Math.random() * -150 - 50, 0],
              x: [0, Math.random() * 40 - 20, 0],
              opacity: [0, Math.random() * 0.8 + 0.2, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 6 + 4,
              repeat: Infinity,
              delay: Math.random() * 8,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Grid Lines */}
      <div className="grid-lines"></div>

      {/* Floating Mini Cards - Dynamic Zigzag Animation */}
      <div className="floating-cards">
        {/* Left Side Cards */}
        {/* <motion.div 
          className="mini-card card-1"
          initial={{ y: 60, x: 0, opacity: 0, scale: 0.8 }}
          animate={{ 
            y: [0, -30, -60, -100],
            x: [0, 15, -10, 20],
            opacity: [0, 1, 1, 0],
            scale: [0.8, 1, 1, 0.9]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeOut",
            times: [0, 0.3, 0.6, 1]
          }}
        >
          <div className="card-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <div className="card-content">
            <div className="card-label">Funding</div>
            <div className="card-value">₹125Cr+</div>
          </div>
        </motion.div> */}

        {/* <motion.div 
          className="mini-card card-3"
          initial={{ y: 60, x: 0, opacity: 0, scale: 0.8 }}
          animate={{ 
            y: [0, -35, -70, -110],
            x: [0, -12, 18, -15],
            opacity: [0, 1, 1, 0],
            scale: [0.8, 1, 1, 0.9]
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeOut",
            delay: 3,
            times: [0, 0.3, 0.6, 1]
          }}
        >
          <div className="card-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div className="card-content">
            <div className="card-label">Mentors</div>
            <div className="card-value">200+</div>
          </div>
        </motion.div> */}

        {/* Right Side Cards */}
        {/* <motion.div 
          className="mini-card card-4"
          initial={{ y: 60, x: 0, opacity: 0, scale: 0.8 }}
          animate={{ 
            y: [0, -32, -65, -105],
            x: [0, -18, 12, -20],
            opacity: [0, 1, 1, 0],
            scale: [0.8, 1, 1, 0.9]
          }}
          transition={{
            duration: 4.2,
            repeat: Infinity,
            ease: "easeOut",
            delay: 1.5,
            times: [0, 0.3, 0.6, 1]
          }}
        >
          <div className="card-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          </div>
          <div className="card-content">
            <div className="card-label">Growth</div>
            <div className="card-value">3.5x</div>
          </div>
        </motion.div> */}

        {/* <motion.div 
          className="mini-card card-5"
          initial={{ y: 60, x: 0, opacity: 0, scale: 0.8 }}
          animate={{ 
            y: [0, -28, -58, -95],
            x: [0, 20, -15, 18],
            opacity: [0, 1, 1, 0],
            scale: [0.8, 1, 1, 0.9]
          }}
          transition={{
            duration: 4.3,
            repeat: Infinity,
            ease: "easeOut",
            delay: 4,
            times: [0, 0.3, 0.6, 1]
          }}
        >
          <div className="card-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
          <div className="card-content">
            <div className="card-label">Success</div>
            <div className="card-value">95%</div>
          </div>
        </motion.div> */}

        {/* <motion.div 
          className="mini-card card-6"
          initial={{ y: 60, x: 0, opacity: 0, scale: 0.8 }}
          animate={{ 
            y: [0, -33, -68, -108],
            x: [0, -16, 14, -18],
            opacity: [0, 1, 1, 0],
            scale: [0.8, 1, 1, 0.9]
          }}
          transition={{
            duration: 4.6,
            repeat: Infinity,
            ease: "easeOut",
            delay: 6,
            times: [0, 0.3, 0.6, 1]
          }}
        >
          <div className="card-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
              <path d="M4 22h16"/>
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>
            </svg>
          </div>
          <div className="card-content">
            <div className="card-label">Grants</div>
            <div className="card-value">120+</div>
          </div>
        </motion.div> */}
      </div>

      <div className="container">
        {/* Arc Line Above Heading - Larger with Fade In */}
        <motion.div
          className="arc-container"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <svg className="arc-line" viewBox="0 0 1000 200" preserveAspectRatio="xMidYMid meet">
            <motion.path
              d="M 50 180 Q 500 -60, 950 180"
              fill="none"
              stroke="url(#arcGradient)"
              strokeWidth="5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.8 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
            <defs>
              <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(239, 68, 68, 0.2)" />
                <stop offset="50%" stopColor="rgba(239, 68, 68, 1)" />
                <stop offset="100%" stopColor="rgba(239, 68, 68, 0.2)" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        {/* Top Badge */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCard.badge}
            className="carousel-top-badge"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <span className="badge-icon">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="1.5" />
                <path
                  d="M8 12l2 2 4-4"
                  stroke="#fff"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="badge-text">{activeCard.badge}</span>
          </motion.div>

          <div className="secondary-badge">
            <span>India’s #1 Startup Learning Platform</span>
          </div>
        </AnimatePresence>

        {/* Dynamic Headline */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCard.id}
            className="carousel-headline-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="carousel-main-title">
              {activeCard.title}
              <br />
              <span className="title-highlight">{activeCard.subtitle}</span>
            </h1>
            <p className="carousel-subtitle">{activeCard.description}</p>

            {/* Extended Description */}
            <motion.div
              className="carousel-extended-description"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {/* <p className="extended-text">
                Join India's fastest-growing startup ecosystem where innovation meets opportunity. 
                We provide comprehensive support from ideation to scale-up, including mentorship from 
                industry experts, seed funding up to ₹5 Lakhs, access to cutting-edge resources, and 
                a vibrant community of 10,000+ entrepreneurs. Whether you're a first-time founder or 
                a seasoned entrepreneur, we're here to accelerate your journey to success.
              </p> */}

              <div className="key-highlights">
                <div className="highlight-item">
                  <span className="highlight-icon">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M5 12h14" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
                      <path d="M12 5v14" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </span>
                  <span className="highlight-text">Fast-Track 1 Month Program</span>
                </div>
                <div className="highlight-item">
                  <span className="highlight-icon">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M4 12h16" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
                      <path d="M12 4v16" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </span>
                  <span className="highlight-text">Grants & Funding Support</span>
                </div>
                <div className="highlight-item">
                  <span className="highlight-icon">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="12" cy="12" r="4" stroke="#fff" strokeWidth="1.8" />
                    </svg>
                  </span>
                  <span className="highlight-text">200+ Experts Mentors</span>
                </div>
                {/* <div className="highlight-item">
                  <span className="highlight-icon">🎯</span>
                  <span className="highlight-text">95% success rate</span>
                </div> */}
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* 3D Carousel Cards */}
        {/* <div className="carousel-3d-container">
          <div className="carousel-track">
            {carouselData.map((card, index) => {
              const position = getCardPosition(index);
              if (position === 'hidden') return null;

              return (
                <motion.div
                  key={card.id}
                  className={`carousel-card carousel-card-${position}`}
                  initial={false}
                  animate={{
                    x: position === 'center' ? '0%' : position === 'left' ? '-85%' : '85%',
                    scale: position === 'center' ? 1 : 0.75,
                    rotateY: position === 'center' ? 0 : position === 'left' ? 25 : -25,
                    opacity: position === 'center' ? 1 : 0.5,
                    zIndex: position === 'center' ? 10 : 1
                  }}
                  transition={{
                    duration: 0.6,
                    ease: "easeInOut"
                  }}
                  onClick={() => {
                    if (position === 'left') handlePrev();
                    if (position === 'right') handleNext();
                  }}
                >
                  <div className="card-inner-3d">
                    <div className="card-header-carousel">
                      <h3 className="card-title-carousel">{card.cardTitle}</h3>
                    </div>
                    
                    
                    {card.cardContent.type === 'mentorship' && (
                      <div className="card-content-premium">
                        <div className="premium-stats-grid">
                          {card.cardContent.stats.map((stat, idx) => (
                            <div key={idx} className="premium-stat-item">
                              <div className="premium-stat-icon" style={{ color: stat.color }}>
                                {stat.icon}
                              </div>
                              <div className="premium-stat-value" style={{ color: stat.color }}>
                                {stat.value}
                              </div>
                              <div className="premium-stat-label">{stat.label}</div>
                            </div>
                          ))}
                        </div>
                        <div className="premium-highlight">
                          {card.cardContent.highlight}
                        </div>
                      </div>
                    )}

                    
                    {card.cardContent.type === 'funding' && (
                      <div className="card-content-premium">
                        <div className="premium-main-stat">
                          <div className="main-stat-icon"></div>
                          <div className="main-stat-content">
                            <div className="main-stat-label">{card.cardContent.mainLabel}</div>
                            <div className="main-stat-value">{card.cardContent.mainValue}</div>
                          </div>
                        </div>
                        <div className="premium-sub-stats">
                          {card.cardContent.stats.map((stat, idx) => (
                            <div key={idx} className="premium-sub-stat">
                              <div className="sub-stat-header">
                                <span className="sub-stat-label">{stat.label}</span>
                                <span className="sub-stat-trend" style={{ color: stat.color }}>
                                  {stat.trend}
                                </span>
                              </div>
                              <div className="sub-stat-value">{stat.value}</div>
                            </div>
                          ))}
                        </div>
                        <div className="premium-highlight">
                          <span className="highlight-icon">🎯</span>
                          {card.cardContent.highlight}
                        </div>
                      </div>
                    )}

                    
                    {card.cardContent.type === 'learning' && (
                      <div className="card-content-premium">
                        <div className="premium-courses-header">
                          <span className="courses-total">{card.cardContent.totalCourses}</span>
                          <span className="courses-label">Total Courses</span>
                        </div>
                        <div className="premium-categories-grid">
                          {card.cardContent.categories.map((cat, idx) => (
                            <div key={idx} className="premium-category">
                              <div className="category-icon" style={{ background: cat.color }}>
                                {cat.icon}
                              </div>
                              <div className="category-name">{cat.name}</div>
                              <div className="category-count">{cat.count}</div>
                            </div>
                          ))}
                        </div>
                        <div className="premium-highlight">
                          <span className="highlight-icon">🔥</span>
                          {card.cardContent.highlight}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div> */}

        {/* Stats Section - Inspired by Image */}
        {/* <motion.div 
          className="ecosystem-stats-section"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <div className="stats-grid">
            <motion.div 
              className="stat-card"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <h3 className="stat-value">₹50Cr+</h3>
              <p className="stat-label">FUNDED</p>
            </motion.div>
            
            <motion.div 
              className="stat-card"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <h3 className="stat-value">2000+</h3>
              <p className="stat-label">STARTUPS</p>
            </motion.div>
            
            <motion.div 
              className="stat-card"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <h3 className="stat-value">500+</h3>
              <p className="stat-label">MENTORS</p>
            </motion.div>
            
            <motion.div 
              className="stat-card"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <h3 className="stat-value">95%</h3>
              <p className="stat-label">Success Rate</p>
            </motion.div>
            
            <motion.div 
              className="stat-card"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <h3 className="stat-value">1:∞%</h3>
              <p className="stat-label">Programs</p>
            </motion.div>
            
            <motion.div 
              className="stat-card"
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <h3 className="stat-value">10K+</h3>
              <p className="stat-label">MEMBERS</p>
            </motion.div>
          </div>
        </motion.div> */}

        {/* Masonry Feature Cards */}
        {/* <motion.div 
          className="masonry-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.4 }}
        >
          <div className="masonry-grid">
           
            <motion.div 
              className="masonry-card masonry-large masonry-red-accent"
              initial={{ opacity: 0, scale: 0.8, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.5, type: "spring", bounce: 0.4 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <div className="masonry-card-header">
                <div className="masonry-icon-box red">🎯</div>
                <h3 className="masonry-title">AI-Powered Roadmap</h3>
              </div>
              <p className="masonry-description">
                Get a customized growth plan tailored to your startup's unique needs. Our AI analyzes your business model and creates a step-by-step roadmap to success.
              </p>
              <div className="masonry-metrics">
                <div className="metric-item">
                  <span className="metric-value">95%</span>
                  <span className="metric-label">Accuracy</span>
                </div>
                <div className="metric-item">
                  <span className="metric-value">24/7</span>
                  <span className="metric-label">Support</span>
                </div>
                <div className="metric-item">
                  <span className="metric-value">1000+</span>
                  <span className="metric-label">Plans Created</span>
                </div>
              </div>
              <div className="masonry-features">
                <span className="feature-tag">AI-Powered</span>
                <span className="feature-tag">Custom Plan</span>
                <span className="feature-tag">Weekly Updates</span>
              </div>
            </motion.div>

            
            <motion.div 
              className="masonry-card masonry-medium masonry-white"
              initial={{ opacity: 0, scale: 0.8, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.6, type: "spring", bounce: 0.4 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <div className="masonry-card-header">
                <div className="masonry-icon-box white">🚀</div>
                <h3 className="masonry-title">Rapid MVP Launch</h3>
              </div>
              <p className="masonry-description">
                Build and launch your MVP in 12 weeks with our proven framework and technical support.
              </p>
              <div className="masonry-stat-row">
                <div className="mini-stat">
                  <span className="mini-value">12</span>
                  <span className="mini-label">Weeks</span>
                </div>
                <div className="mini-stat">
                  <span className="mini-value">100+</span>
                  <span className="mini-label">Launched</span>
                </div>
              </div>
              <div className="masonry-badge">
                <span className="badge-dot"></span>
                <span>Fast-Track Program</span>
              </div>
            </motion.div>

            
            <motion.div 
              className="masonry-card masonry-small masonry-dark"
              initial={{ opacity: 0, scale: 0.8, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.7, type: "spring", bounce: 0.4 }}
              whileHover={{ y: -8, scale: 1.02, rotate: 2 }}
            >
              <div className="masonry-icon-large">💡</div>
              <h4 className="masonry-small-title">Innovation Hub</h4>
              <p className="masonry-small-text">Access cutting-edge tools & resources</p>
              <div className="masonry-count">
                <span className="count-number">50+</span>
                <span className="count-label">Tools</span>
              </div>
            </motion.div>

           
            <motion.div 
              className="masonry-card masonry-small masonry-red"
              initial={{ opacity: 0, scale: 0.8, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.8, type: "spring", bounce: 0.4 }}
              whileHover={{ y: -8, scale: 1.02, rotate: -2 }}
            >
              <div className="masonry-icon-large">🤝</div>
              <h4 className="masonry-small-title">Network Effect</h4>
              <p className="masonry-small-text">Connect with 10K+ entrepreneurs</p>
              <div className="masonry-count">
                <span className="count-number">10K+</span>
                <span className="count-label">Members</span>
              </div>
            </motion.div>

            
            <motion.div 
              className="masonry-card masonry-medium masonry-dark-accent"
              initial={{ opacity: 0, scale: 0.8, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.9, type: "spring", bounce: 0.4 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <div className="masonry-card-header">
                <div className="masonry-icon-box dark">📊</div>
                <h3 className="masonry-title">Data Analytics</h3>
              </div>
              <p className="masonry-description">
                Make informed decisions with real-time analytics and market intelligence.
              </p>
              <div className="masonry-progress">
                <div className="progress-item">
                  <div className="progress-header">
                    <span className="progress-label">Market Analysis</span>
                    <span className="progress-percent">90%</span>
                  </div>
                  <div className="progress-bar">
                    <motion.div 
                      className="progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: '90%' }}
                      transition={{ duration: 1, delay: 2.2 }}
                    ></motion.div>
                  </div>
                </div>
                <div className="progress-item">
                  <div className="progress-header">
                    <span className="progress-label">Competitor Tracking</span>
                    <span className="progress-percent">85%</span>
                  </div>
                  <div className="progress-bar">
                    <motion.div 
                      className="progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: '85%' }}
                      transition={{ duration: 1, delay: 2.3 }}
                    ></motion.div>
                  </div>
                </div>
              </div>
            </motion.div>

            
            <motion.div 
              className="masonry-card masonry-large masonry-white-accent"
              initial={{ opacity: 0, scale: 0.8, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 2.0, type: "spring", bounce: 0.4 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <div className="masonry-card-header">
                <div className="masonry-icon-box white">🎓</div>
                <h3 className="masonry-title">Expert Masterclasses</h3>
              </div>
              <p className="masonry-description">
                Learn from industry leaders through live workshops, Q&A sessions, and exclusive masterclasses covering everything from fundraising to scaling.
              </p>
              <div className="masonry-speakers">
                <div className="speaker-avatar">👨‍💼</div>
                <div className="speaker-avatar">👩‍💼</div>
                <div className="speaker-avatar">👨‍🏫</div>
                <div className="speaker-avatar">👩‍🏫</div>
                <div className="speaker-more">+50</div>
              </div>
              <div className="masonry-live-badge">
                <span className="live-dot"></span>
                <span>Live Sessions Weekly</span>
              </div>
            </motion.div>
          </div>
        </motion.div> */}

        {/* CTA Buttons - Two Buttons */}
        <motion.div
          className="carousel-cta-wrapper"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.6 }}
        >
          <Link href="/signup">
            <motion.button
              className="carousel-cta-button carousel-cta-primary"
              whileHover={{ scale: 1.05, boxShadow: '0 20px 60px rgba(239, 68, 68, 0.6)' }}
              whileTap={{ scale: 0.98 }}
            >
              Start Your Journey
            </motion.button>
          </Link>
          <Link href="/programs/pre-incubation">
            <motion.button
              className="carousel-cta-button carousel-cta-secondary"
              whileHover={{ scale: 1.05, boxShadow: '0 20px 60px rgba(239, 68, 68, 0.3)' }}
              whileTap={{ scale: 0.98 }}
            >
              View Programs
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
