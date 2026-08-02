'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Rocket, Users, Building2, GraduationCap, Link2 } from 'lucide-react';

const roadmapData = [
  {
    id: 1,
    title: 'Aspiring Founders & Startups',
    description: 'The primary engine of innovation, seeking guidance and capital to transform ideas into institutional-grade ventures.',
    icon: <Rocket size={20} />
  },
  {
    id: 2,
    title: 'Mentors & Industry Experts',
    description: 'Elite professionals providing the tactical precision and strategic oversight needed to navigate complex markets.',
    icon: <Users size={20} />
  },
  {
    id: 3,
    title: 'Incubators & Accelerators',
    description: 'The critical framework for high-frequency growth, offering localized support and operational resources.',
    icon: <Building2 size={20} />
  },
  {
    id: 4,
    title: 'Colleges & Institutions',
    description: 'The bedrock of talent and research, supplying a steady stream of intellectual capital and fresh perspectives.',
    icon: <GraduationCap size={20} />
  },
  {
    id: 5,
    title: 'Investors & Organizations',
    description: 'Providing the essential fuel for expansion while seeking high-conviction opportunities within the network.',
    icon: <Link2 size={20} />
  }
];

export default function EcosystemImpactRoadmapVertical() {
  const containerRef = useRef(null);
  
  // Track scroll progress within the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  // Smooth out the scroll progress for the line
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <section className="ecosystem-roadmap-vertical">
      <div className="road-container">
        
        <motion.div 
          className="road-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="road-title">
            How We Help the<br />
            <span className="text-red">Ecosystem Grow</span>
          </h2>
          <p className="road-subtitle">
            A definitive, linear framework connecting high-impact stakeholders for institutional-grade growth.
          </p>
        </motion.div>

        <div className="road-timeline" ref={containerRef}>
          {/* Background subtle line */}
          <div className="road-line-bg" />
          
          {/* Animated red line */}
          <motion.div 
            className="road-line-progress"
            style={{ 
              height: useTransform(smoothProgress, [0, 1], ["0%", "100%"]),
              transformOrigin: "top",
              zIndex: 2
            }}
          />

          {roadmapData.map((item, index) => {
            // Distribute items across the 10% to 90% range of the progress line
            // This leaves 10% progress at the start (so the first card isn't pre-activated)
            // and 10% progress at the end (so the last card activates before progress hits 100%)
            const step = 0.8 / (roadmapData.length - 1);
            const targetProgress = 0.1 + (index * step);
            
            return (
              <RoadmapItem 
                key={item.id} 
                item={item} 
                index={index} 
                progress={smoothProgress} 
                targetProgress={targetProgress} 
              />
            );
          })}
        </div>

        <motion.div 
          className="road-quote-container"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="road-quote-box">
            <h2>
              "By connecting these stakeholders, we ensure founders don't just learn-but <span className="text-red">progress</span>."
            </h2>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

function RoadmapItem({ item, index, progress, targetProgress }) {
  // Determine if the line has reached this item
  // Add a small threshold (0.05) so it activates slightly before the line perfectly hits it
  const isActive = useTransform(
    progress,
    [targetProgress - 0.1, targetProgress],
    [0, 1]
  );

  return (
    <motion.div 
      className="road-item"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      style={{ zIndex: 10 }}
    >
      <motion.div 
        className="road-icon-box"
        style={{
          backgroundColor: useTransform(isActive, [0, 1], ["#18181b", "#E53935"]),
          color: useTransform(isActive, [0, 1], ["#E53935", "#ffffff"]),
          borderColor: useTransform(isActive, [0, 1], ["#E53935", "#E53935"]),
          scale: useTransform(isActive, [0, 1], [1, 1.15]),
          boxShadow: useTransform(isActive, [0, 1], ["0 8px 30px rgba(0,0,0,0.6)", "0 0 30px rgba(229,57,53,0.5)"])
        }}
      >
        {item.icon}
      </motion.div>

      <motion.div 
        className="road-card"
        style={{
          borderColor: useTransform(isActive, [0, 1], ["rgba(255,255,255,0.05)", "rgba(229,57,53,0.4)"]),
          backgroundColor: useTransform(isActive, [0, 1], ["#0d0d0e", "#111112"])
        }}
      >
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </motion.div>
    </motion.div>
  );
}
