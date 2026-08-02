'use client';

import { useEffect, useRef, useState } from 'react';

export default function VideoPlayer({ videoUrl, videoId, userId, onProgressUpdate }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.controlsList = 'nodownload noremoteplayback';
    video.disablePictureInPicture = true;

    video.addEventListener('contextmenu', e => e.preventDefault());

    video.addEventListener('timeupdate', () => {
      setCurrentTime(video.currentTime);
    });

    video.addEventListener('loadedmetadata', () => {
      setDuration(video.duration);
    });

    return () => {
      video.removeEventListener('contextmenu', e => e.preventDefault());
    };
  }, []);

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleEnded = () => setIsPlaying(false);

  return (
    <div className="video-player-wrapper no-select">
      <video
        ref={videoRef}
        className="video-player"
        src={videoUrl}
        controls
        controlsList="nodownload noremoteplayback"
        disablePictureInPicture
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        onContextMenu={e => e.preventDefault()}
      >
        Your browser does not support the video tag.
      </video>

      {/* Watermark overlay */}
      <div className="watermark-overlay">
        {userId ? `User: ${userId.substring(0, 8)}` : 'Protected Content'}
      </div>

      {/* Transparent overlay to deter screen recording */}
      <div className="video-overlay"></div>
    </div>
  );
}
