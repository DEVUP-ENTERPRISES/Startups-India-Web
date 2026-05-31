'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { GraduationCap, Rocket, Globe, Landmark, ArrowRight, X, CheckCircle2, MessageSquare } from 'lucide-react';
import '../styles/collaboration-framework.css';

const COLLAB_PARTICLES = Array.from({ length: 6 }, () => ({
  left: Math.random() * 100,
  width: Math.random() * 8 + 4,
  height: Math.random() * 8 + 4,
  animationDuration: Math.random() * 10 + 10,
  animationDelay: Math.random() * 5,
}));

const pillars = [
  {
    number: '01',
    title: 'Academia',
    tagline: 'Research & Talent Pipeline',
    description: 'We nurture an innovative mindset within academic institutions through structured workshops, training programs, and deep institutional collaboration.',
    details: 'Our academic collaboration model is designed to bridge the gap between classroom learning and real-world entrepreneurship. We work with leading universities to create a sustainable pipeline of talent and research-driven startups.',
    points: [
      'Innovation & entrepreneurship workshops for students',
      'Faculty development & curriculum integration',
      'Student startup incubation pathways',
      'Joint research projects & technology transfer'
    ],
    icon: <GraduationCap size={28} strokeWidth={1.8} />,
  },
  {
    number: '02',
    title: 'Startups Ecosystem',
    tagline: 'Incubation & Acceleration',
    description: 'We create launchpads for disruptive ventures — supporting startups from ideation to scale with mentorship, funding access, and ecosystem connections.',
    details: 'The core of our platform is the startup incubator. We provide early-stage ventures with the resources, knowledge, and network needed to transform bold ideas into market-leading companies.',
    points: [
      '6–12 month structured incubation tracks',
      'Access to 200+ mentors & investor network',
      'Demo days, pitch events & grant programs',
      'Co-working spaces & technical resources'
    ],
    icon: <Rocket size={28} strokeWidth={1.8} />,
  },
  {
    number: '03',
    title: 'Corporates & International',
    tagline: 'Partnerships & Global Reach',
    description: 'We propel growth by establishing meaningful connections with corporates and cultivating international partnerships that open global doors for startups.',
    details: 'We facilitate high-impact partnerships between established corporate entities and agile startups. Our international network extends across major global innovation hubs.',
    points: [
      'B2B intros to 100+ corporate partners',
      'International delegation & exchange programs',
      'CSR-backed innovation initiatives',
      'Market expansion support in 10+ countries'
    ],
    icon: <Globe size={28} strokeWidth={1.8} />,
  },
  {
    number: '04',
    title: 'Government',
    tagline: 'Policy & Ecosystem Support',
    description: 'We bridge the gap between innovation and policy by working closely with state and central governments to scale high-impact initiatives.',
    details: 'We act as a catalyst for government-led innovation policies. By working with regulatory bodies and policy makers, we ensure a conducive environment for startup growth at a national scale.',
    points: [
      'Strategic partnership with Startup India & MeitY',
      'Policy advocacy & institutional frameworks',
      'Pan-India ecosystem scale-up programs',
      'Government grant management & distribution'
    ],
    icon: <Landmark size={28} strokeWidth={1.8} />,
  },
];

const PillarCard = ({ pillar, onOpen }) => {
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['10deg', '-10deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-10deg', '10deg']);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);

    // Set CSS variables for spotlight effect
    cardRef.current.style.setProperty('--mouse-x', `${mouseX}px`);
    cardRef.current.style.setProperty('--mouse-y', `${mouseY}px`);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onOpen(pillar)}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="collab-card group"
    >
      <div className="collab-step-badge">{pillar.number}</div>
      
      <div className="collab-icon-box">
        {pillar.icon}
      </div>

      <div className="collab-card-content">
        <p className="collab-tagline">{pillar.tagline}</p>
        <h3 className="collab-card-title">{pillar.title}</h3>
        <p className="collab-card-desc">{pillar.description}</p>
      </div>

      <div className="collab-read-more">
        <span>Read More</span>
        <ArrowRight size={16} />
      </div>
    </motion.div>
  );
};

export default function CollaborationFrameworkSection() {
  const [selectedPillar, setSelectedPillar] = useState(null);

  // Close modal on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setSelectedPillar(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <section className="collab-section">
      {/* Background Elements */}
      <div className="collab-bg-blob collab-bg-blob--1" />
      <div className="collab-bg-blob collab-bg-blob--2" />
      <div className="collab-bg-blob collab-bg-blob--3" />
      
      {/* Background Particles */}
      {COLLAB_PARTICLES.map((p, i) => (
        <div
          key={i}
          className="collab-particle"
          style={{
            left: `${p.left}%`,
            width: `${p.width}px`,
            height: `${p.height}px`,
            animationDuration: `${p.animationDuration}s`,
            animationDelay: `${p.animationDelay}s`,
          }}
        />
      ))}

      <div className="iec-container">
        <motion.div
          className="collab-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="collab-title">
            Collaboration <span className="collab-title-red">
              Framework
              <span className="collab-title-underline" />
            </span>
          </h2>
          <p className="collab-subtitle">
            Building bridges across academia, startups, corporates, and government to create a thriving innovation ecosystem.
          </p>
        </motion.div>

        <div className="collab-grid">
          {pillars.map((pillar) => (
            <PillarCard 
              key={pillar.number} 
              pillar={pillar} 
              onOpen={setSelectedPillar}
            />
          ))}
        </div>

        {/* Premium CTA at bottom */}
        <motion.div 
          className="collab-cta-footer"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="collab-cta-card">
            <h4 className="collab-cta-title">Let’s Build Innovation Together</h4>
            <a href="#apply-ecosystem" style={{ textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); document.querySelector('.apply-dark-section')?.scrollIntoView({ behavior: 'smooth' }); }}>
              <motion.button
                className="collab-cta-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MessageSquare size={20} />
                <span>Get in Touch</span>
              </motion.button>
            </a>
          </div>
        </motion.div>
      </div>

      {/* Pillar Details Modal */}
      <AnimatePresence>
        {selectedPillar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="collab-modal-overlay"
            onClick={() => setSelectedPillar(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="collab-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="collab-modal-close" 
                onClick={() => setSelectedPillar(null)}
              >
                <X size={20} />
              </button>
              
              <div className="collab-modal-icon-box">
                {selectedPillar.icon}
              </div>
              
              <h3 className="collab-modal-title">{selectedPillar.title}</h3>
              <p className="collab-modal-desc">{selectedPillar.details}</p>
              
              <div className="collab-modal-points">
                {selectedPillar.points.map((point, i) => (
                  <motion.div 
                    key={i} 
                    className="collab-modal-point"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i }}
                  >
                    <CheckCircle2 size={18} />
                    <span>{point}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
