'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiGet, apiPost } from '@/lib/api';
import '../../styles/events.css';
import '../../styles/event-details.css';

const DEFAULT_EVENT_IMAGE = 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&q=80';

export default function EventsPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  const scrollBy = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 240, behavior: 'smooth' });
  };

  const formatPrice = event => {
    const rawPrice = event?.price;
    const price = rawPrice !== undefined && rawPrice !== null ? Number(rawPrice) : null;
    const originalPrice = event?.originalPrice ? Number(event.originalPrice) : null;
    
    // If isPaid is true or price > 0, it's not free
    const isActuallyFree = !event?.isPaid && (price === null || price <= 0);
    
    if (isActuallyFree) return { label: 'FREE', isFree: true, original: null };
    
    return {
      label: `₹${price || 0}`,
      isFree: false,
      original: originalPrice && originalPrice > (price || 0) ? `₹${originalPrice}` : null,
    };
  };

  const formatDateTime = event => {
    try {
      const date = event?.date ? new Date(event.date) : null;
      const dateLabel =
        date && !Number.isNaN(date.valueOf())
          ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          : 'Date TBD';
      const timeLabel = event?.time ? String(event.time) : null;
      return timeLabel ? `${dateLabel} • ${timeLabel}` : dateLabel;
    } catch {
      return 'Date TBD';
    }
  };

  // Fetch events from API
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.set('category', selectedCategory);
      params.set('status', 'upcoming,live');
      params.set('limit', '50');

      const response = await apiGet(`/api/v1/events?${params}`);
      if (!response.error && response.data) {
        setEvents(response.data.events || []);
      } else {
        setError('Failed to load events');
      }
    } catch (err) {
      setError('Failed to load events');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const heroBubbles = [
    { type: 'text', content: '+18%\ndemand spike', size: 110, x: -48, y: -5, delay: 0 },
    { type: 'text', content: '~13%', size: 70, x: -32, y: 20, delay: 0.5 },
    { type: 'text', content: 'Supply Risk', size: 100, x: -45, y: 48, delay: 1 },
    {
      type: 'image',
      content: 'https://randomuser.me/api/portraits/women/44.jpg',
      size: 65,
      x: -36,
      y: -38,
      delay: 0.8,
    },
    {
      type: 'image',
      content: 'https://randomuser.me/api/portraits/women/32.jpg',
      size: 75,
      x: -22,
      y: 52,
      delay: 1.2,
    },
    { type: 'icon', content: 'chart', size: 50, x: -16, y: -48, delay: 1.5 },

    // Right side
    { type: 'text', content: 'Probability\n72%', size: 100, x: 45, y: 2, delay: 0.2 },
    {
      type: 'image',
      content: 'https://randomuser.me/api/portraits/women/68.jpg',
      size: 55,
      x: 38,
      y: 35,
      delay: 0.7,
    },
    {
      type: 'image',
      content: 'https://randomuser.me/api/portraits/men/32.jpg',
      size: 85,
      x: 48,
      y: 45,
      delay: 1.1,
    },
    { type: 'icon', content: 'book', size: 60, x: 28, y: 48, delay: 0.9 },
    { type: 'icon', content: 'coins', size: 50, x: 42, y: -25, delay: 1.4 },
    { type: 'icon', content: 'star', size: 40, x: 24, y: -42, delay: 1.8 },
    {
      type: 'image',
      content: 'https://randomuser.me/api/portraits/men/44.jpg',
      size: 60,
      x: 35,
      y: -50,
      delay: 2.1,
    },

    // Abstract bubbles (no content)
    { type: 'empty', size: 140, x: -54, y: 18, delay: 0.3 },
    { type: 'empty', size: 120, x: 52, y: -20, delay: 0.6 },
    { type: 'empty', size: 90, x: -40, y: 32, delay: 1.3 },
    { type: 'empty', size: 130, x: 44, y: 18, delay: 1.6 },
  ];

  const categories = [
    {
      id: 'all',
      label: 'All Events',
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
      count: events.length,
    },
    {
      id: 'entertainment',
      label: 'Entertainment',
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
      ),
      count: events.filter(e => e.category === 'entertainment').length,
    },
    {
      id: 'workshops',
      label: 'Workshops',
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      ),
      count: events.filter(e => e.category === 'workshops').length,
    },
    {
      id: 'networking',
      label: 'Networking',
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      count: events.filter(e => e.category === 'networking').length,
    },
    {
      id: 'conferences',
      label: 'Conferences',
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
      ),
      count: events.filter(e => e.category === 'conferences').length,
    },
    {
      id: 'webinars',
      label: 'Webinars',
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      ),
      count: events.filter(e => e.category === 'webinars').length,
    },
    {
      id: 'meetups',
      label: 'Meetups',
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <line x1="23" y1="11" x2="17" y2="11" />
          <line x1="20" y1="8" x2="20" y2="14" />
        </svg>
      ),
      count: events.filter(e => e.category === 'meetups' || e.category === 'meetup').length,
    },
  ];

  const filteredEvents = events.filter(event => {
    const categoryMatch = 
      selectedCategory === 'all' || 
      event.category === selectedCategory || 
      (selectedCategory === 'meetups' && event.category === 'meetup') ||
      (selectedCategory === 'workshops' && event.category === 'workshop') ||
      (selectedCategory === 'conferences' && event.category === 'conference') ||
      (selectedCategory === 'webinars' && event.category === 'webinar');
    const priceMatch =
      priceFilter === 'all' ||
      (priceFilter === 'free' && (event.price === 0 || !event.price)) ||
      (priceFilter === 'paid' && event.price > 0);
    const searchMatch =
      !searchQuery ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.tags && event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));

    return categoryMatch && priceMatch && searchMatch;
  });

  const featuredEvents = events.filter(event => event.featured);
  const hasAnyEvents = events.length > 0;
  const hasActiveFilters = selectedCategory !== 'all' || priceFilter !== 'all' || !!searchQuery;

  return (
    <div className="events-page">
      {/* Hero Section */}
      <section className="events-hero">
        <div className="events-hero-bg">
          <div className="hero-radial-glow"></div>

          <div className="bubbles-container">
            {heroBubbles.map((bubble, i) => (
              <motion.div
                key={i}
                className={`floating-bubble bubble-${bubble.type}`}
                style={{
                  width: bubble.size,
                  height: bubble.size,
                  left: `calc(50% + ${bubble.x}vw)`,
                  top: `calc(50% + ${bubble.y}vh)`,
                }}
                animate={{
                  y: [0, -15, 0],
                  x: [0, 10, 0],
                }}
                transition={{
                  duration: 4 + Math.random() * 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: bubble.delay,
                }}
              >
                {bubble.type === 'image' && (
                  <img src={bubble.content} alt="" className="bubble-img" />
                )}
                {bubble.type === 'text' && <div className="bubble-text">{bubble.content}</div>}
                {bubble.type === 'icon' && (
                  <div className="bubble-icon">
                    {bubble.content === 'chart' && (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                      </svg>
                    )}
                    {bubble.content === 'book' && (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                      </svg>
                    )}
                    {bubble.content === 'coins' && (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <line x1="12" y1="1" x2="12" y2="23"></line>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                      </svg>
                    )}
                    {bubble.content === 'star' && (
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="16"></line>
                        <line x1="8" y1="12" x2="16" y2="12"></line>
                      </svg>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="container">
          <motion.div
            className="events-hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="events-hero-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Transform Your <span className="highlight">Startup Journey</span> with Expert Events
            </motion.h1>

            <motion.p
              className="events-hero-description"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Join workshops, conferences, and networking events designed to accelerate your growth.
              Connect with industry leaders, learn from experts, and build meaningful relationships.
            </motion.p>

            <motion.div
              className="hero-search-bar"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <svg
                className="search-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search events by name, category, or tag..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="hero-search-input"
              />
              <button className="hero-search-btn">Search Events</button>
            </motion.div>

            <motion.div
              className="hero-quick-stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="quick-stat">
                <span className="stat-number">45+</span>
                <span className="stat-label">Active Events</span>
              </div>
              <div className="quick-stat">
                <span className="stat-number">5000+</span>
                <span className="stat-label">Participants</span>
              </div>
              <div className="quick-stat">
                <span className="stat-number">100+</span>
                <span className="stat-label">Expert Speakers</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Category Filter Section */}
      <section className="category-filter-section">
        <div className="container">
          <motion.div
            className="category-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="header-left">
              <h2 className="category-title">Explore by Category</h2>
              <p className="category-subtitle">
                Find the perfect event that matches your interests
              </p>
            </div>
            <div className="filter-controls">
              <select
                className="price-filter"
                value={priceFilter}
                onChange={e => setPriceFilter(e.target.value)}
              >
                <option value="all">All Prices</option>
                <option value="free">Free Events</option>
                <option value="paid">Paid Events</option>
              </select>
            </div>
          </motion.div>

          <div className="categories-scroll-wrapper">
            {/* Left fade + arrow */}
            <div className={`scroll-edge scroll-edge-left ${canScrollLeft ? 'visible' : ''}`}>
              <button className="scroll-arrow scroll-arrow-left" onClick={() => scrollBy(-1)} aria-label="Scroll left">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
            </div>

            <div
              className="categories-horizontal"
              ref={scrollRef}
              onScroll={updateScrollState}
            >
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  className={`category-chip ${selectedCategory === category.id ? 'active' : ''}`}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ y: -4, scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <div className="chip-icon">{category.icon}</div>
                  <span className="chip-label">{category.label}</span>
                  <span className="chip-count">{category.count}</span>
                </motion.div>
              ))}
            </div>

            {/* Right fade + arrow */}
            <div className={`scroll-edge scroll-edge-right ${canScrollRight ? 'visible' : ''}`}>
              <button className="scroll-arrow scroll-arrow-right" onClick={() => scrollBy(1)} aria-label="Scroll right">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>

            {/* Swipe hint shown only once */}
            {canScrollRight && (
              <div className="swipe-hint">
                <span className="swipe-hint-arrow">›</span>
                <span>More categories</span>
                <span className="swipe-hint-arrow">›</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* All Events Section - Category Based */}
      <section className="all-events-section" id="all-events">
        <div className="container">
          <motion.div
            className="section-header-events"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="section-header-left">
              <h2 className="section-title-events">
                {selectedCategory === 'all'
                  ? 'All Events'
                  : categories.find(c => c.id === selectedCategory)?.label}
              </h2>
              <p className="section-subtitle-events">{filteredEvents.length} events available</p>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                className="loading-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="loading-spinner"></div>
                <p>Loading events...</p>
              </motion.div>
            ) : error ? (
              <motion.div
                className="error-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <p>{error}</p>
                <button onClick={fetchEvents} className="btn btn-primary">
                  Try Again
                </button>
              </motion.div>
            ) : !hasAnyEvents ? (
              <motion.div
                className="no-events no-events--upcoming"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <div className="no-events-hero">
                  <div className="no-events-icon" aria-hidden="true">
                    <svg
                      width="96"
                      height="96"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                      <path d="M8 15h8" />
                      <path d="M8 18h5" />
                    </svg>
                  </div>
                  <h3>No upcoming events yet</h3>
                  <p>
                    We&apos;re curating new sessions. Check back soon — or explore our programs
                    while you wait.
                  </p>
                </div>

                <div className="no-events-actions">
                  <button
                    onClick={() => router.push('/programs/incubation')}
                    className="no-events-primary"
                  >
                    Explore Programs
                  </button>
                  <button onClick={fetchEvents} className="no-events-secondary">
                    Refresh
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={selectedCategory + priceFilter}
                className="events-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {filteredEvents.map((event, index) => (
                  <motion.div
                    key={event._id || event.id}
                    className="event-card"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    whileHover={{ y: -10 }}
                    role="link"
                    tabIndex={0}
                    onClick={() => router.push(`/events/${event._id || event.id}`)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        router.push(`/events/${event._id || event.id}`);
                      }
                    }}
                  >
                    <div className="event-card-image-wrapper">
                      <img
                        src={event.coverImage || event.image || DEFAULT_EVENT_IMAGE}
                        alt={event.title}
                        className="event-card-image"
                        loading="lazy"
                        onError={e => {
                          e.target.onerror = null;
                          e.target.src = DEFAULT_EVENT_IMAGE;
                        }}
                      />
                      <div className="event-card-overlay">
                        {(() => {
                          const price = formatPrice(event);
                          if (price.isFree)
                            return (
                              <span className="event-card-price-badge free">{price.label}</span>
                            );
                          return (
                            <div className="event-card-price-badge">
                              <span className="current-price">{price.label}</span>
                              {price.original && (
                                <span className="original-price-small">{price.original}</span>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    </div>

                    <div className="event-card-content">
                      <div className="event-card-tags">
                        {(event.tags || []).slice(0, 2).map((tag, i) => (
                          <span key={i} className="event-card-tag">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <h3 className="event-card-title">{event.title}</h3>

                      <div className="event-card-details">
                        <div className="detail-row">
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                          <span>{formatDateTime(event)}</span>
                        </div>
                        <div className="detail-row">
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          <span>{event.venue || event.location || 'Online'}</span>
                        </div>
                      </div>

                      <div className="event-card-footer">
                        <div className="attendees-info">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                          </svg>
                          <span>
                            {event.registrations?.length || event.attendees || 0} registered
                          </span>
                        </div>
                        <Link
                          href={`/events/${event._id || event.id}`}
                          onClick={e => e.stopPropagation()}
                        >
                          <button className={`book-now-btn ${event.isRegistered ? 'registered' : ''}`}>
                            {event.isRegistered ? 'Registered' : 'Book Now'}
                          </button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {!loading && !error && hasAnyEvents && filteredEvents.length === 0 && (
            <motion.div
              className="no-events-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="no-events-card">
                <div className="no-events-icon-wrapper">
                  <svg
                    width="80"
                    height="80"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                    <circle cx="12" cy="15" r="2" fill="currentColor" />
                  </svg>
                </div>
                <h3 className="no-events-title">No Events Found</h3>
                <p className="no-events-description">
                  {hasActiveFilters
                    ? "We couldn't find any events matching your filters. Try adjusting your search."
                    : 'No upcoming events at the moment. Check back soon for exciting opportunities!'}
                </p>
                <div className="no-events-suggestions">
                  {hasActiveFilters ? (
                    <>
                      <button
                        className="no-events-btn primary"
                        onClick={() => {
                          setSelectedCategory('all');
                          setPriceFilter('all');
                          setSearchQuery('');
                        }}
                      >
                        Clear All Filters
                      </button>
                      <button
                        className="no-events-btn secondary"
                        onClick={() => setSearchQuery('')}
                      >
                        Clear Search
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="no-events-btn primary" onClick={fetchEvents}>
                        Refresh Events
                      </button>
                      <button
                        className="no-events-btn secondary"
                        onClick={() => setSelectedCategory('all')}
                      >
                        View All Categories
                      </button>
                    </>
                  )}
                </div>
                <div className="no-events-footer">
                  <p>💡 Tip: Follow us to get notified when new events are added!</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Featured Events Section */}
      {featuredEvents.length > 0 && (
        <section className="featured-events-section">
          <div className="container">
            <motion.div
              className="section-header-events"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="section-header-left">
                <h2 className="section-title-events">Featured Events</h2>
                <p className="section-subtitle-events">
                  Don't miss these handpicked premium events
                </p>
              </div>
            </motion.div>

            <div className="featured-events-grid">
              {featuredEvents.slice(0, 3).map((event, index) => (
                <motion.div
                  key={event._id || event.id}
                  className="featured-event-card"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -12 }}
                  role="link"
                  tabIndex={0}
                  onClick={() => router.push(`/events/${event._id || event.id}`)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      router.push(`/events/${event._id || event.id}`);
                    }
                  }}
                >
                  <div className="event-image-wrapper">
                    <img
                      src={(event.images && event.images[0]) || event.coverImage || DEFAULT_EVENT_IMAGE}
                      alt={event.title}
                      className="event-image"
                      loading="lazy"
                    />
                    <div className="event-overlay">
                      {(() => {
                        const price = formatPrice(event);
                        if (price.isFree)
                          return <span className="event-price-badge free">{price.label}</span>;
                        return (
                          <span className="event-price-badge">
                            {price.label}
                            {price.original && (
                              <span className="original-price">{price.original}</span>
                            )}
                          </span>
                        );
                      })()}
                      {(() => {
                        const max =
                          typeof event?.maxAttendees === 'number' ? event.maxAttendees : 0;
                        const registered = event?.registrations?.length || 0;
                        const left = max > 0 ? Math.max(0, max - registered) : null;
                        if (left === null || left > 50) return null;
                        return <span className="seats-badge">{left} seats left</span>;
                      })()}
                    </div>
                  </div>

                  <div className="event-content">
                    <div className="event-tags">
                      {(event.tags || []).slice(0, 2).map((tag, i) => (
                        <span key={i} className="event-tag">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h3 className="event-title">{event.title}</h3>

                    <div className="event-meta">
                      <div className="meta-item">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        <span>{formatDateTime(event)}</span>
                      </div>
                      <div className="meta-item">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <span>{event.duration || event.time || 'TBD'}</span>
                      </div>
                    </div>

                    <div className="event-location">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <span>{event.venue || event.location || 'Online'}</span>
                    </div>

                    <div className="event-footer">
                      <div className="event-organizer">
                        <div className="organizer-avatar">
                          {String(event.organizer || 'S').charAt(0)}
                        </div>
                        <div className="organizer-info">
                          <span className="organizer-name">
                            {event.organizer || 'StartupsIndia'}
                          </span>
                          <span className="attendees-count">
                            {event.registrations?.length || event.attendees || 0} attending
                          </span>
                        </div>
                      </div>

                      <button
                        className="register-btn"
                        onClick={e => {
                          e.stopPropagation();
                          router.push(`/events/${event._id || event.id}`);
                        }}
                      >
                        View Details
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter CTA Section */}
      {/* <section className="newsletter-cta-section">
        <div className="container">
          <motion.div 
            className="newsletter-content"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="newsletter-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <h2 className="newsletter-title">Never Miss an Event</h2>
            <p className="newsletter-description">
              Subscribe to our newsletter and get notified about upcoming events, exclusive offers, and early bird discounts.
            </p>
            <div className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email address"
                className="newsletter-input"
              />
              <button className="newsletter-btn">
                Subscribe Now
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>
            </div>
            <p className="newsletter-privacy">
              🔒 We respect your privacy. Unsubscribe at any time.
            </p>
          </motion.div>
        </div>
      </section> */}
    </div>
  );
}
