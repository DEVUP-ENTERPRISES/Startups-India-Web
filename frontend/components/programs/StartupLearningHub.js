'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Play, Eye, ArrowRight, User, X } from 'lucide-react';
import '../../styles/startup-learning-hub.css';

const hubVideos = [
  {
    id: 1,
    title: 'IDEA VALIDATION',
    description: 'Learn systematic approaches to validate your startup idea before investing significant resources.',
    mentorName: 'Vishwaraj Saude',
    mentorRole: 'Product & Tech Advisor',
    mentorAvatar: '/assets/images/Vishwaraj.jpg',
    thumbnail: '/thumbnails/idea-validation.jpg',
    videoUrl: 'https://10ihs6meu0bf1qny.public.blob.vercel-storage.com/demo-2.mp4',
    tags: ['Idea Validation', 'Market'],
    views: '15.2K',
  },
  {
    id: 2,
    title: 'MARKET UNDERSTANDING',
    description: 'Gain deep insights into your target market and competition to build a solid foundation.',
    mentorName: 'Vishwaraj Saude',
    mentorRole: 'Product & Tech Advisor',
    mentorAvatar: '/assets/images/Vishwaraj.jpg',
    thumbnail: '/thumbnails/market-understanding.png',
    videoUrl: 'https://10ihs6meu0bf1qny.public.blob.vercel-storage.com/demo-2.mp4',
    tags: ['Market Research', 'Analysis'],
    views: '12.8K',
  },
  {
    id: 3,
    title: 'MARKETING AND GO TO MARKET STRATEGY',
    description: 'Structure your roadmap with a solid business plan that attracts investors and guides growth.',
    mentorName: 'Vishwaraj Saude',
    mentorRole: 'Product & Tech Advisor',
    mentorAvatar: '/assets/images/Vishwaraj.jpg',
    thumbnail: '/thumbnails/marketing-strategy.png',
    videoUrl: 'https://10ihs6meu0bf1qny.public.blob.vercel-storage.com/demo-3.mp4',
    tags: ['GTM Strategy', 'Marketing'],
    views: '18.7K',
  }
];

const VideoModal = ({ isOpen, onClose, video }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div 
            className="relative w-full max-w-5xl aspect-video bg-[#111] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              className="absolute top-4 right-4 z-10 w-10 height-10 bg-black/50 hover:bg-red-500/80 rounded-full flex items-center justify-center text-white transition-all duration-300"
              onClick={onClose}
            >
              <X size={24} />
            </button>

            {/* Video Player */}
            <video 
              className="w-full h-full object-cover"
              controls
              autoPlay
              playsInline
            >
              <source src={video.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Modal Info Overlay (Optional) */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
              <h3 className="text-xl font-bold text-white mb-2">{video.title}</h3>
              <p className="text-white/60 text-sm flex items-center gap-2">
                <User size={14} className="text-red-500" /> {video.mentorName}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const VideoCard = ({ video, index }) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-50px" });
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <motion.div
        ref={cardRef}
        className="hub-video-card"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, delay: index * 0.1, ease: [0.23, 1, 0.32, 1] }}
        whileHover={{ y: -10 }}
      >
        {/* Shimmer Effect */}
        <div className="active-shimmer" />

        {/* Thumbnail Section - Full Width */}
        <div className="hub-thumbnail-wrapper" onClick={() => setIsModalOpen(true)}>
          <motion.img 
            src={video.thumbnail} 
            alt={video.title} 
            className="hub-thumbnail"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.6 }}
          />
          <div className="hub-thumbnail-overlay" />
          
          <motion.div 
            className="hub-play-button-center"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Play size={24} fill="currentColor" />
          </motion.div>
        </div>

        {/* Minimal Content Section */}
        <div className="hub-card-content">
          <h3 className="hub-card-title">{video.title}</h3>
          
          <div className="hub-mentor-minimal">
            <span className="text-red-500 font-bold text-xs uppercase tracking-widest">Masterclass</span>
            <span className="text-white/40 mx-2">•</span>
            <span className="text-white/60 text-xs font-medium">{video.mentorName}</span>
          </div>
        </div>

        {/* Footer Section */}
        <div className="hub-card-footer">
          <div className="hub-views">
            <Eye size={14} className="text-red-500" />
            <span>{video.views} Views</span>
          </div>
          <button className="hub-watch-btn" onClick={() => setIsModalOpen(true)}>
            Watch Now <ArrowRight size={14} />
          </button>
        </div>
      </motion.div>

      <VideoModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        video={video} 
      />
    </>
  );
};

export default function StartupLearningHub() {
  return (
    <section className="learning-hub-section">
      {/* Background FX */}
      <div className="hub-background-fx">
        <div className="hub-mesh-grid" />
        <div className="hub-ambient-glows">
          <motion.div 
            className="glow-orb hub-glow-1"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.15, 0.1],
              x: [0, 50, 0],
              y: [0, -30, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="glow-orb hub-glow-2"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.08, 0.12, 0.08],
              x: [0, -40, 0],
              y: [0, 20, 0]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
        </div>
      </div>

      <div className="hub-container">
        {/* Header */}
        <div className="hub-header">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="section-label-premium">Startup Academy</div>
          </motion.div>
          
          <motion.h2 
            className="hub-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Learn From Real <span className="text-[#e53935] drop-shadow-[0_0_15px_rgba(229,57,53,0.5)]">Startup Experiences</span>
          </motion.h2>
          
          <motion.p 
            className="hub-subtitle"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Watch startup insights, mentoring sessions, investor guidance, and innovation workshops. 
            Direct wisdom from founders who have built and scaled successful ventures.
          </motion.p>
        </div>

        {/* Video Grid */}
        <div className="hub-video-grid">
          {hubVideos.map((video, index) => (
            <VideoCard key={video.id} video={video} index={index} />
          ))}
        </div>

        {/* Footer Actions */}
        <motion.div 
          className="hub-footer-actions"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <a href="/learn" className="btn-view-all">
            View All Videos <ArrowRight size={20} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
