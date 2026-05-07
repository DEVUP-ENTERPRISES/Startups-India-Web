import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Award, Calendar, ExternalLink } from 'lucide-react';
import '../styles/achievements.css';

const achievementsData = [
  {
    id: 'inspirex',
    label: 'Innovation Event',
    title: 'INSPIREX 2025',
    description:
      'Where Student Ideas Met Innovation at NMIMS Hyderabad. On November 11, 2025, the campus of NMIMS Hyderabad buzzed with entrepreneurial energy as the Entrepreneurship Cell hosted INSPIREX 2025.',
    year: '2025',
    category: 'Innovation Event',
    index: '01',
    image: '/assets/images/inspirex-new.jpg',
  },
  {
    id: 'hackathon',
    label: 'Hackathon',
    title: 'National Tech Hackathon',
    description:
      'A 48-hour intense coding and product development sprint where the brightest minds collaborate to solve pressing real-world challenges through technology.',
    year: '2024',
    category: 'Hackathon',
    index: '02',
    image:
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'pitchfest',
    label: 'PitchFest',
    title: 'Annual Startup PitchFest',
    description:
      'Our flagship event designed to connect early-stage founders with angel investors, offering a stage to present business ideas and secure critical early funding.',
    year: '2025',
    category: 'Pitching',
    index: '03',
    image: '/assets/images/IDEAX PITCHFEST.JPG',
  },
  {
    id: 'awareness',
    label: 'Awareness Program',
    title: 'Entrepreneurship Awareness Campaign',
    description:
      'A nationwide initiative to inspire students and young professionals by educating them on the fundamentals of building a sustainable scalable business.',
    year: '2024',
    category: 'Program',
    index: '04',
    image:
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'funding',
    label: 'Funding',
    title: 'Shark Tank Style Funding Rounds',
    description:
      'Provide startups with the rare opportunity to pitch directly to top-tier investors. Gain access to seed funding, comprehensive mentorship support, and unparalleled startup exposure to accelerate your growth.',
    year: '2024-25',
    category: 'Funding',
    index: '05',
    image:
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'mentoring',
    label: 'Mentoring',
    title: '1-on-1 Expert Mentorship',
    description:
      'Exclusive sessions matching startup founders with seasoned industry veterans to provide tailored guidance, strategic advice, and operational insights.',
    year: '2024-25',
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
            Our Journey
          </motion.span>
          <motion.h2 
            className="text-5xl md:text-6xl font-black mb-8 !text-white mt-8 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Celebrating <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e53935] to-[#ff7b72] drop-shadow-[0_0_15px_rgba(229,57,53,0.3)]">Achievements</span> & Milestones
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
                    
                    <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-4 z-20">
                      {/* Premium Glass Badges */}
                      <div className="flex items-center gap-2.5 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:scale-105 hover:bg-white/20 transition-all duration-300 cursor-default border border-white/20 group/badge">
                        <Calendar size={14} className="text-[#e53935] group-hover/badge:scale-110 transition-transform" />
                        <span className="text-[12px] font-bold text-white/90 tracking-[0.15em] uppercase">{activeItem.year}</span>
                      </div>
                      <div className="flex items-center gap-2.5 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:scale-105 hover:bg-white/20 transition-all duration-300 cursor-default border border-white/20 group/badge">
                        <Award size={14} className="text-[#e53935] group-hover/badge:scale-110 transition-transform" />
                        <span className="text-[12px] font-bold text-white/90 tracking-[0.15em] uppercase">{activeItem.category}</span>
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
                  className="relative z-10 flex flex-col gap-8 achievements-content-block"
                >
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={`title-${activeItem.id}`}
                    className="flex flex-col gap-5"
                  >
                    <h3 className="text-4xl md:text-5xl font-black !text-white leading-[1.15] tracking-tight">
                      {activeItem.title}
                    </h3>
                    <p className="text-lg md:text-xl font-medium !text-[#a1a1aa] leading-relaxed max-w-lg">
                      {activeItem.description}
                    </p>
                  </motion.div>

<<<<<<< HEAD
                  <div className="flex items-center">
=======
>>>>>>> c2041c35d6a29678761bf6de90471fa43c67c7c6
                    <button className="inline-flex items-center justify-center gap-2.5 px-7 py-2.5 bg-[#e53935] hover:bg-white text-white hover:text-black border border-[#e53935] hover:border-white rounded-full text-[13px] font-black group transition-all duration-500 w-fit shadow-[0_12px_24px_rgba(229,57,53,0.3)] hover:shadow-[0_12px_24px_rgba(255,255,255,0.15)] hover:-translate-y-0.5">
                      EXPLORE EVENT 
                      <ExternalLink size={16} className="text-white group-hover:text-[#e53935] group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-500" />
                    </button>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-6 mt-4">
                    <div className="flex gap-3">
                      <button 
                        onClick={handlePrev}
                        className="w-12 h-12 flex items-center justify-center rounded-full border border-white/10 hover:border-[#e53935] hover:bg-[#e53935]/10 transition-all duration-500 bg-white/[0.03] backdrop-blur-md shadow-2xl group"
                      >
                        <ChevronLeft size={22} className="!text-white/70 group-hover:!text-white group-hover:scale-110 transition-all duration-500" />
                      </button>
                      <button 
                        onClick={handleNext}
                        className="w-12 h-12 flex items-center justify-center rounded-full border border-white/10 hover:border-[#e53935] hover:bg-[#e53935]/10 transition-all duration-500 bg-white/[0.03] backdrop-blur-md shadow-2xl group"
                      >
                        <ChevronRight size={22} className="!text-white/70 group-hover:!text-white group-hover:scale-110 transition-all duration-500" />
                      </button>
                    </div>
                    
                    <div className="flex-1 h-[4px] bg-white/10 relative overflow-hidden rounded-full max-w-[200px]">
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
