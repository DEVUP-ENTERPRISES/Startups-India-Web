'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export default function SuccessSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const sectionRef = useRef(null);

  const achievements = [
    {
      id: 1,
      title: 'INSPIREX 2025',
      subtitle: 'Where Student Ideas Met Innovation at NMIMS Hyderabad',
      description: 'On November 11, 2025, the campus of NMIMS Hyderabad buzzed with entrepreneurial energy as the Entrepreneurship Cell hosted INSPIREX 2025.',
      image: '/assets/images/success/inspirex-2025.jpg',
      stats: { year: '2025', category: 'Innovation Event' },
      gradient: 'linear-gradient(135deg, #ff9a56 0%, #ff6a00 100%)'
    },
    {
      id: 2,
      title: 'MEGATHON 2025',
      subtitle: "Hyderabad's Biggest Student-Run Hackathon is Back!",
      description: 'Get ready, innovators! Megathon 2025: The Deccan Edition is here, and it\'s going to be bigger than ever.',
      image: '/assets/images/success/megathon-2025.jpg',
      stats: { year: '2025', category: 'Hackathon' },
      gradient: 'linear-gradient(135deg, #ff9a56 0%, #ff6a00 100%)'
    },
    {
      id: 3,
      title: 'STARTUPS INDIA IDEAX PITCHFEST 2025',
      subtitle: 'Pitch Your Startup Idea & Win Seed Funding up to ₹5 Lakhs',
      description: 'StartupsIndia PitchFest 2025, India\'s #1 Student Startup PitchFest, is here and it\'s bigger than ever! Happening on 15th & 16th October 2025 at Methodist College, Hyderabad',
      image: '/assets/images/success/pitch event.jpg',
      stats: { year: '2025', category: 'PitchFest' },
      gradient: 'linear-gradient(135deg, #ff9a56 0%, #ff6a00 100%)'
    },
    {
      id: 4,
      title: 'STARTUP ECOSYSTEM AWARENESS PROGRAM',
      subtitle: 'Startup Ecosystem Awareness Program – IGNITE TO INNOVATE',
      description: 'On 15th September 2025, VJIT, in collaboration with IEC & StartupsIndia.in, hosted a 2-hour session inspiring students to explore the startup ecosystem in India.',
      image: '/assets/images/success/ecosystem-awareness-2025.jpg',
      stats: { year: '2025', category: 'Awareness Program' },
      gradient: 'linear-gradient(135deg, #ff9a56 0%, #ff6a00 100%)'
    },
    {
      id: 5,
      title: 'SHARK TANK STYLE FUNDING ROUNDS',
      subtitle: 'Pitch to Investors & Secure Seed Funding for Your Startup',
      description: 'Experience the thrill of pitching your startup idea to a panel of seasoned investors and VCs. Our Shark Tank-style funding rounds have helped 50+ startups secure seed funding ranging from ₹5L to ₹50L, with expert feedback and mentorship included.',
      image: '/assets/images/success/pitchfest-2025.jpg',
      stats: { year: '2024-25', category: 'Funding' },
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      id: 6,
      title: 'MENTORSHIP CONNECT PROGRAM',
      subtitle: '200+ Expert Mentors Guiding the Next Generation of Founders',
      description: 'Connect with industry veterans, successful entrepreneurs, and domain experts through our exclusive mentorship program. Get personalized guidance, strategic advice, and hands-on support to navigate your startup journey from ideation to scale.',
      image: '/assets/images/mentoring image.jpg',
      stats: { year: 'Ongoing', category: 'Mentoring' },
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % achievements.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, achievements.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % achievements.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + achievements.length) % achievements.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  return (
    <section className="success-section" ref={sectionRef}>
      <div className="success-bg-pattern"></div>
      
      <div className="container">
        {/* Section Header */}
        <motion.div 
          className="success-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="success-badge"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="badge-icon">🏆</span>
            <span className="badge-text">Our Success Story</span>
          </motion.div>
          
          <motion.h2 
            className="success-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Celebrating <span className="success-highlight">Achievements</span> & Milestones
          </motion.h2>
          
          <motion.p 
            className="success-description"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            A journey of excellence, recognition, and transformative impact in the startup ecosystem
          </motion.p>
        </motion.div>

        {/* Slider Container */}
        <div className="success-slider-wrapper">
          <div className="success-slider-container">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                className="success-slide"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                {/* Image Side */}
                <div className="success-slide-image">
                  <div className="success-image-wrapper">
                    <div 
                      className="success-image-gradient"
                      style={{ background: achievements[currentSlide].gradient }}
                    ></div>
                    
                    {/* Actual Image */}
                    <img 
                      src={achievements[currentSlide].image}
                      alt={achievements[currentSlide].title}
                      className="success-actual-image"
                    />
                    
                    {/* Stats Overlay */}
                    <div className="success-stats-overlay">
                      <div className="success-stat-item">
                        <span className="stat-label">Year</span>
                        <span className="stat-value">{achievements[currentSlide].stats.year}</span>
                      </div>
                      <div className="success-stat-item">
                        <span className="stat-label">Category</span>
                        <span className="stat-value">{achievements[currentSlide].stats.category}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Side */}
                <div className="success-slide-content">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="success-slide-number">
                      {String(currentSlide + 1).padStart(2, '0')}
                    </div>
                    <h3 className="success-slide-title">
                      {achievements[currentSlide].title}
                    </h3>
                    {achievements[currentSlide].subtitle && (
                      <h4 className="success-slide-subtitle">
                        {achievements[currentSlide].subtitle}
                      </h4>
                    )}
                    <p className="success-slide-description">
                      {achievements[currentSlide].description}
                    </p>
                    
                    {/* Read More Button */}
                    <motion.button
                      className="success-read-more-btn"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Read More
                    </motion.button>
                    
                    {/* Progress Bar */}
                    <div className="success-progress-wrapper">
                      <div className="success-progress-bar">
                        <motion.div 
                          className="success-progress-fill"
                          initial={{ width: '0%' }}
                          animate={{ width: isAutoPlaying ? '100%' : '0%' }}
                          transition={{ duration: 5, ease: "linear" }}
                          key={currentSlide}
                        />
                      </div>
                      <span className="success-progress-text">
                        {currentSlide + 1} / {achievements.length}
                      </span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button 
              className="success-nav-btn success-nav-prev"
              onClick={prevSlide}
              aria-label="Previous slide"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
            <button 
              className="success-nav-btn success-nav-next"
              onClick={nextSlide}
              aria-label="Next slide"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          </div>

          {/* Thumbnail Navigation */}
          <div className="success-thumbnails">
            {achievements.map((achievement, index) => (
              <motion.button
                key={achievement.id}
                className={`success-thumbnail ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div 
                  className="thumbnail-gradient"
                  style={{ background: achievement.gradient }}
                ></div>
                <div className="thumbnail-content">
                  <span className="thumbnail-number">{String(index + 1).padStart(2, '0')}</span>
                  <span className="thumbnail-title">{achievement.stats.category}</span>
                </div>
                {index === currentSlide && (
                  <motion.div 
                    className="thumbnail-indicator"
                    layoutId="thumbnail-indicator"
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
