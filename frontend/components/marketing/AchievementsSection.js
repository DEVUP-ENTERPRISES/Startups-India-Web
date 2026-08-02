import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Award, Calendar, ExternalLink } from 'lucide-react';
import '../../styles/achievements.css';

const achievementsData = [
  {
    id: 'inspirex',
    label: 'Innovation Event',
    title: 'FAIL? - Learning Beyond Startup Failures',
    description:
      'In 2025, International Institute of Information Technology Hyderabad invited StartupsIndia as the Ecosystem Partner for FAIL?, an entrepreneurship-focused event centered around transforming startup failures into valuable learning experiences.',
    year: '2025',
    category: 'Innovation Event',
    index: '01',
    image: '/assets/images/inspirex-new.jpg',
  },
  {
    id: 'awareness',
    label: 'Awareness',
    title: 'Startup Ecosystem Awareness Program',
    description:
      'StartupsIndia conducted the Startup Ecosystem Awareness Program across colleges in Hyderabad to inspire students about entrepreneurship, innovation, and startup opportunities.',
    year: '2026',
    category: 'Awareness',
    index: '02',
    image:
      '/assets/images/event-images/Startup-Ecosystem-Awareness-Program.jpg',
  },
  {
    id: 'hackathon',
    label: 'Hackathon',
    title: 'Hackathon Competition',
    description:
      'StartupsIndia, along with VNR Vignana Jyothi Institute of Engineering and Technology, organized the Hackathon Competition as part of its active initiatives to promote innovation, problem-solving, and entrepreneurship through college and national-level hackathons.',
    year: '2026',
    category: 'Hackathon',
    index: '03',
    image: '/assets/images/event-images/Hackathon-Competition.jpeg',
  },
  {
    id: 'pitching competition',
    label: 'Pitching Competition',
    title: 'Startups India-Idea Pitching Competition',
    description:
      'The Idea Pitching Competition brought together students and aspiring founders to showcase innovative startup ideas, enhance pitching skills, and experience the entrepreneurial ecosystem with StartupsIndia.',
    year: '2026',
    category: 'Program',
    index: '04',
    image:
      '/assets/images/event-images/Pitching-Competition.jpg',
  },
  {
    id: 'funding',
    label: 'Funding',
    title: 'Shark Tank Style Funding Rounds',
    description:
      'Provide startups with the rare opportunity to pitch directly to top-tier investors. Gain access to seed funding, comprehensive mentorship support, and unparalleled startup exposure to accelerate your growth.',
    year: '2026',
    category: 'Funding',
    index: '05',
    image: '/assets/images/event-images/Funding.jpg',
  },
  {
    id: 'mentoring',
    label: 'Mentoring',
    title: 'Ecosystem Awareness Program For College Faculty',
    description:
      'The Startup Ecosystem Awareness Program engaged college faculty members through insightful sessions on entrepreneurship, innovation, and startup ecosystem development with support from StartupsIndia.',
    year: '2026',
    category: 'Mentoring',
    index: '06',
    image: '/assets/images/mentoring image.jpg',
  },
];

export default function AchievementsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleNext = () => {
    setDirection(1);
    setActiveIndex(prev => (prev + 1) % achievementsData.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex(prev => (prev - 1 + achievementsData.length) % achievementsData.length);
  };

  // Auto-play Carousel (8 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 8000);
    return () => clearInterval(timer);
  }, [activeIndex]);

  const activeItem = achievementsData[activeIndex];

  return (
    <section className="achievements-section overflow-hidden !py-16">
      <div className="iec-container relative z-10">
        {/* Adjusted gap between header and content */}
        <div className="achievements-header text-center" style={{ marginBottom: '40px' }}>
          <motion.span 
            className="section-label-premium mb-6 bg-gradient-to-r from-[#e53935]/20 to-red-600/10 backdrop-blur-md border-red-500/30 text-red-500 shadow-[0_0_20px_rgba(229,57,53,0.15)]"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Award size={14} className="mr-2" />
            Our Journey
          </motion.span>
          <motion.h2 
            className="section-title-premium !text-white mt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Empowering <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e53935] to-[#ff7b72] drop-shadow-[0_0_15px_rgba(229,57,53,0.3)]">The Next Era</span> of Innovation
          </motion.h2>
          <motion.p 
            className="!text-[#9ca3af] max-w-2xl mx-auto mt-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            A journey of excellence, recognition, and transformative impact in the startup ecosystem.
          </motion.p>
        </div>

        <div className="relative">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeIndex}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -50 : 50 }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center"
            >
              {/* Image side */}
              <div className="lg:col-span-7 relative z-10">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-[#e53935]/40 to-red-900/40 blur-[50px] rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  <div className="relative rounded-[32px] overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] aspect-[16/9] bg-[#0a0a0a] event-image">
                    <motion.img
                      src={activeItem.image}
                      alt={activeItem.title}
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                    />
                    
                    <div className="absolute bottom-8 left-8 right-8 flex flex-wrap gap-4 z-20">
                      {/* Premium Glass Pills */}
                      <div className="event-pill-premium">
                        <Calendar size={16} className="pill-icon" />
                        <span className="pill-text">{activeItem.year}</span>
                      </div>
                      <div className="event-pill-premium">
                        <Award size={16} className="pill-icon" />
                        <span className="pill-text">{activeItem.category}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Text side */}
              <div className="lg:col-span-5 flex flex-col h-full justify-center relative z-10">
                {/* Massive Index Background Number */}
                <div className="absolute -top-20 -left-10 md:-left-16 text-[180px] md:text-[220px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-white/[0.08] to-transparent select-none z-0 pointer-events-none tracking-tighter">
                  {activeItem.index}
                </div>
                
                <div 
                  className="relative z-10 flex flex-col gap-10 achievements-content-block"
                >
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={`title-${activeItem.id}`}
                    className="flex flex-col gap-6"
                  >
                    <h3 className="text-3xl md:text-4xl font-black !text-white leading-[1.15] tracking-tight">
                      {activeItem.title}
                    </h3>
                    <p className="text-lg md:text-xl font-medium !text-[#a1a1aa] leading-relaxed max-w-lg">
                      {activeItem.description}
                    </p>
                  </motion.div>

                  <div className="flex items-center">
                    <button className="event-cta-premium">
                      EXPLORE EVENT 
                      <ExternalLink size={20} className="cta-icon" />
                    </button>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-3 mt-4">
                    <div className="flex gap-3">
                      <button 
                        onClick={handlePrev}
                        className="nav-btn-premium"
                      >
                        <ChevronLeft size={24} className="nav-icon" />
                      </button>
                      <button 
                        onClick={handleNext}
                        className="nav-btn-premium"
                      >
                        <ChevronRight size={24} className="nav-icon" />
                      </button>
                    </div>
                    
                    <div className="flex-1 h-[4px] bg-white/10 relative overflow-hidden rounded-full max-w-[120px]">
                      <motion.div 
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#e53935] to-[#ff7b72] shadow-[0_0_10px_#e53935]"
                        initial={{ width: 0 }}
                        animate={{ width: `${((activeIndex + 1) / achievementsData.length) * 100}%` }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      />
                    </div>
                    
                    <span className="!text-white/80 font-mono text-sm font-bold tracking-widest">
                      {activeItem.index} <span className="!text-white/30">/</span> 0{achievementsData.length}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
