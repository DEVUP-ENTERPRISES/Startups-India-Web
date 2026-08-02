import { useRef, useState, useEffect } from 'react';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import '../../styles/training.css';

const trainingData = [
  {
    id: 1,
    title: 'Idea Validation',
    description:
      'Learn systematic approaches to validate your startup idea before investing significant resources.',
    instructorName: 'Vishwaraj Saude',
    instructorRole: 'Product & Tech Advisor',
    instructorAvatar: '/assets/images/Vishwaraj.jpg',
    tags: ['Idea Validation', 'Audience', 'Market'],
    views: '12.5K Views',
    image: '/thumbnails/demo-1.jpg',
    videoUrl: 'https://drive.google.com/file/d/1lKCjQY8BX6Fud1KcfJjp5ZT2vHBn01LO/view?usp=drive_link',
  },
  {
    id: 2,
    title: 'Market Understanding',
    description:
      'Understand your target market, audience needs, and opportunities before building your startup.',
    instructorName: 'Vishwaraj Saude',
    instructorRole: 'Product & Tech Advisor',
    instructorAvatar: '/assets/images/Vishwaraj.jpg',
    tags: ['Market', 'Audience', 'Research'],
    views: '15.2K Views',
    image: '/thumbnails/demo-2.jpg',
    videoUrl: 'https://drive.google.com/file/d/1PTcaoaKlN7IOJrcHmfd35j18WTdyJNQ2/view?usp=drive_link',
  },
  {
    id: 3,
    title: 'Marketing and Go To Market Strategy',
    description:
      'Plan your marketing approach and go-to-market strategy to reach customers effectively.',
    instructorName: 'Vishwaraj Saude',
    instructorRole: 'Product & Tech Advisor',
    instructorAvatar: '/assets/images/Vishwaraj.jpg',
    tags: ['Marketing', 'Strategy', 'Go To Market'],
    views: '18.7K Views',
    image: '/thumbnails/demo-3.jpg',
    videoUrl: 'https://drive.google.com/file/d/1mQUJSxCDhPa3mvDjqSyuWqo9oImsWYkW/view?usp=drive_link',
  },
];

export default function TrainingSection() {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const openVideo = videoUrl => {
    window.open(videoUrl, '_blank', 'noopener,noreferrer');
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const containerRect = scrollRef.current.getBoundingClientRect();
      const center = containerRect.left + containerRect.width / 2;
      
      const cards = scrollRef.current.querySelectorAll('.training-card');
      let closestIndex = 0;
      let minDistance = Infinity;
      
      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const distance = Math.abs(center - cardCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });
      
      setActiveIndex(closestIndex);
    }
  };

  const scrollToIndex = (index) => {
    if (scrollRef.current) {
      const cards = scrollRef.current.querySelectorAll('.training-card');
      if (cards[index]) {
        cards[index].scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  };

  const scrollPrev = () => {
    if (scrollRef.current) {
      const card = scrollRef.current.querySelector('.training-card');
      if (card) {
        const gap = window.innerWidth < 768 ? 16 : 20;
        const scrollAmount = card.offsetWidth + gap;
        scrollRef.current.scrollBy({
          left: -scrollAmount,
          behavior: 'smooth',
        });
      }
    }
  };

  const scrollNext = () => {
    if (scrollRef.current) {
      const card = scrollRef.current.querySelector('.training-card');
      if (card) {
        const gap = window.innerWidth < 768 ? 16 : 20;
        const scrollAmount = card.offsetWidth + gap;
        scrollRef.current.scrollBy({
          left: scrollAmount,
          behavior: 'smooth',
        });
      }
    }
  };

  useEffect(() => {
    const currentRef = scrollRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <section className="training-section">
      <div className="training-container">
        <div className="training-header">
          <span className="section-label-premium">FREE DEMO CLASSES</span>
          <h2>
            Experience Our <span className="highlight-red">World-Class</span> Training
          </h2>
          <p className="training-subtext">
            Get a sneak peek into our startup incubation curriculum designed by industry experts.
          </p>
        </div>

        <div className="carousel-wrapper">
          <button className="carousel-arrow left" onClick={scrollPrev} aria-label="Previous">
            <ChevronLeft size={24} />
          </button>
          
          <div className="training-grid" ref={scrollRef}>
            {trainingData.map(course => (
              <div key={course.id} className="training-card">
                {/* Top - Video Thumbnail */}
                <div className="training-thumbnail-container" onClick={() => openVideo(course.videoUrl)}>
                  <img src={course.image} alt={course.title} className="training-thumbnail" />
                  <div className="training-overlay"></div>
                  <div className="play-button">
                    <Play size={24} fill="currentColor" />
                  </div>
                </div>

                {/* Content */}
                <div className="training-content">
                  <div className="training-tags">
                    {course.tags.map((tag, idx) => (
                      <span key={idx} className="training-tag">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h3 className="training-title">{course.title}</h3>
                  <p className="training-desc">{course.description}</p>

                  {/* Instructor */}
                  <div className="training-instructor">
                    <img
                      src={course.instructorAvatar}
                      alt={course.instructorName}
                      className="instructor-avatar"
                    />
                    <div className="instructor-info">
                      <div className="instructor-name">{course.instructorName}</div>
                      <div className="instructor-role">{course.instructorRole}</div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="training-footer">
                  <span className="training-views">{course.views}</span>
                  <button className="training-cta" onClick={() => openVideo(course.videoUrl)}>Watch Demo</button>
                </div>
              </div>
            ))}
          </div>

          <button className="carousel-arrow right" onClick={scrollNext} aria-label="Next">
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="carousel-dots">
          {trainingData.map((_, idx) => (
            <button
              key={idx}
              className={`dot ${activeIndex === idx ? 'active' : ''}`}
              onClick={() => scrollToIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
