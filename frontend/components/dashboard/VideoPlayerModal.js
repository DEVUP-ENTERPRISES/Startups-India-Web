'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import '../../styles/video-player-modal.css';

export default function VideoPlayerModal({ isOpen, onClose, videoData }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      
      // Request fullscreen when modal opens
      const timer = setTimeout(() => {
        if (videoRef.current) {
          if (videoRef.current.requestFullscreen) {
            videoRef.current.requestFullscreen();
          } else if (videoRef.current.webkitRequestFullscreen) {
            videoRef.current.webkitRequestFullscreen();
          } else if (videoRef.current.mozRequestFullScreen) {
            videoRef.current.mozRequestFullScreen();
          } else if (videoRef.current.msRequestFullscreen) {
            videoRef.current.msRequestFullscreen();
          }
        }
      }, 300);

      // Listen for fullscreen exit
      const handleFullscreenChange = () => {
        if (!document.fullscreenElement && 
            !document.webkitFullscreenElement && 
            !document.mozFullScreenElement && 
            !document.msFullscreenElement) {
          // Fullscreen exited, close the modal
          onClose();
        }
      };

      document.addEventListener('fullscreenchange', handleFullscreenChange);
      document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.addEventListener('mozfullscreenchange', handleFullscreenChange);
      document.addEventListener('MSFullscreenChange', handleFullscreenChange);

      return () => {
        clearTimeout(timer);
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
        document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
        document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
        document.body.style.overflow = 'unset';
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, onClose]);

  if (!isOpen || !videoData) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="video-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="video-modal-container"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="video-modal-header">
            <div className="video-modal-info">
              <h3 className="video-modal-title">{videoData.title}</h3>
              <p className="video-modal-instructor">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                {videoData.instructor}
              </p>
            </div>
            <button className="video-modal-close" onClick={onClose}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Video Player */}
          <div className="video-player-wrapper">
            <video
              ref={videoRef}
              className="video-player"
              controls={true}
              autoPlay
              controlsList="nodownload"
              poster={videoData.thumbnail}
              preload="metadata"
              playsInline
              crossOrigin="anonymous"
              style={{ width: '100%', height: '100%' }}
            >
              <source src={videoData.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Video Details */}
          <div className="video-modal-details">
            <div className="video-meta">
              <span className="video-level">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                </svg>
                {videoData.level}
              </span>
              <span className="video-duration">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                {videoData.duration}
              </span>
              <span className="video-views">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                {videoData.views} views
              </span>
            </div>
            {videoData.tags && videoData.tags.length > 0 && (
              <div className="video-tags">
                {videoData.tags.map((tag, index) => (
                  <span key={index} className="video-tag">{tag}</span>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
