'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { apiGet, apiPost } from '@/lib/api';
import '../../../styles/event-details.css';

const DEFAULT_EVENT_IMAGE = 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&q=80';

export default function EventDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);

  const formatMoney = value => {
    if (typeof value !== 'number' || !Number.isFinite(value)) return null;
    if (value <= 0) return 'FREE';
    return `₹${value}`;
  };

  const formatDate = value => {
    try {
      const d = value ? new Date(value) : null;
      if (!d || Number.isNaN(d.valueOf())) return null;
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return null;
    }
  };

  const CountdownTimer = ({ targetDate }) => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const distance = new Date(targetDate).getTime() - now;

        if (distance < 0) {
          clearInterval(timer);
          return;
        }

        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }, 1000);

      return () => clearInterval(timer);
    }, [targetDate]);

    return (
      <div className="event-countdown" style={{
        display: 'flex',
        gap: '12px',
        marginTop: '16px',
        background: '#1f2937',
        padding: '12px',
        borderRadius: '12px',
        color: 'white',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: '800' }}>{timeLeft.days}</div>
          <div style={{ fontSize: '10px', opacity: 0.7, textTransform: 'uppercase' }}>Days</div>
        </div>
        <div style={{ fontSize: '18px', fontWeight: '800' }}>:</div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: '800' }}>{timeLeft.hours}</div>
          <div style={{ fontSize: '10px', opacity: 0.7, textTransform: 'uppercase' }}>Hours</div>
        </div>
        <div style={{ fontSize: '18px', fontWeight: '800' }}>:</div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: '800' }}>{timeLeft.minutes}</div>
          <div style={{ fontSize: '10px', opacity: 0.7, textTransform: 'uppercase' }}>Mins</div>
        </div>
        <div style={{ fontSize: '18px', fontWeight: '800' }}>:</div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: '800' }}>{timeLeft.seconds}</div>
          <div style={{ fontSize: '10px', opacity: 0.7, textTransform: 'uppercase' }}>Secs</div>
        </div>
      </div>
    );
  };

  // Fetch event data based on ID
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await apiGet(`/api/v1/events/${params.id}`);
        if (response.data && !response.error) {
          const eventData = response.data;
          setEvent(eventData);
          setIsRegistered(!!eventData.isRegistered);
        } else {
          setError('Event not found');
        }
      } catch (err) {
        setError('Failed to load event');
        console.error('Error fetching event:', err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchEvent();
    }
  }, [params.id]);

  useEffect(() => {
    if (typeof window !== 'undefined' && !document.getElementById('razorpay-script')) {
      const script = document.createElement('script');
      script.id = 'razorpay-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // If loading, show loading state
  if (loading) {
    return (
      <div className="event-details-page">
        <div className="container">
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div className="loading-spinner"></div>
            <p>Loading event details...</p>
          </div>
        </div>
      </div>
    );
  }

  // If event not found, show error
  if (!event || error) {
    return (
      <div className="event-details-page">
        <div className="container">
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <h1 style={{ fontSize: '24px', color: '#1f2937', marginBottom: '16px' }}>
              {error || 'Event Not Found'}
            </h1>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>
              The event you're looking for doesn't exist.
            </p>
            <button
              onClick={() => router.push('/events')}
              style={{
                padding: '12px 24px',
                background: '#e63946',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Back to Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    const images = event.images || [event.coverImage];
    setCurrentImageIndex(prev => (prev + 1) % images.length);
  };

  const prevImage = () => {
    const images = event.images || [event.coverImage];
    setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length);
  };

  const handleRegister = async () => {
    try {
      if (!localStorage.getItem('access_token')) {
        router.push(`/login?returnUrl=/events/${params.id}`);
        return;
      }

      setRegistering(true);
      const isFree = !event.isPaid && (event.price === 0 || !event.price);
      if (isRegistered) {
        const res = await apiGet(`/api/v1/events/${params.id}/register`, { method: 'DELETE' });
        if (res.error?.status === 401) {
          router.push(`/login?returnUrl=/events/${params.id}`);
          return;
        }
        setIsRegistered(false);
        setRegistering(false);
      } else {
        if (!isFree) {
          const orderRes = await apiPost('/api/v1/payments/razorpay/order', {
            eventId: event._id,
            amount: event.price,
          });

          if (orderRes.error) {
            if (orderRes.error.status === 401 || orderRes.error.message.includes('token')) {
              router.push(`/login?returnUrl=/events/${params.id}`);
              return;
            }
            alert(orderRes.error.message || 'Could not initiate payment');
            setRegistering(false);
            return;
          }

          const orderData = orderRes.data?.order || orderRes.data;
          const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || orderData.key_id || 'rzp_test_placeholder',
            amount: orderData.amount,
            currency: orderData.currency || 'INR',
            name: 'Startups India',
            description: `Registration for: ${event.title}`,
            order_id: orderData.id || orderData.orderId,
            handler: async function (response) {
              try {
                // 1. Immediate feedback to user
                console.log('Payment successful, verifying...', response);
                
                const verifyRes = await apiPost('/api/v1/payments/razorpay/verify', {
                  orderId: response.razorpay_order_id || orderData.id || orderData.orderId,
                  paymentId: response.razorpay_payment_id,
                  signature: response.razorpay_signature,
                });

                if (verifyRes.error) {
                  console.error('Verification error:', verifyRes.error);
                  alert('Payment verified on Razorpay, but enrollment failed. Please refresh the page.');
                } else {
                  // 2. Success state
                  setIsRegistered(true);
                  alert('Registration successful! Redirecting to event details...');
                  
                  // 3. Force reload to show the meeting link and updated status
                  window.location.reload();
                }
              } catch (err) {
                console.error('Handler error:', err);
                alert('Verification process failed. Please refresh the page to check your status.');
              } finally {
                setRegistering(false);
              }
            },
            modal: { 
              ondismiss: () => {
                setRegistering(false);
                console.log('Checkout modal closed');
              }
            },
            theme: { color: '#e63946' },
          };

          if (window.Razorpay) {
            new window.Razorpay(options).open();
          } else {
            alert('Payment gateway is still loading. Please refresh.');
            setRegistering(false);
          }
        } else {
          const res = await apiGet(`/api/v1/events/${params.id}/register`, { method: 'POST' });
          if (res.error) {
            if (res.error.status === 401 || res.error.message.includes('token')) {
              router.push(`/login?returnUrl=/events/${params.id}`);
              return;
            }
            alert(res.error.message || 'Could not register for event');
            setRegistering(false);
            return;
          }
          setIsRegistered(true);
          setRegistering(false);
        }
      }
    } catch (err) {
      console.error('Error managing registration:', err);
      setRegistering(false);
    }
  };

  const handleShare = async () => {
    try {
      const url = typeof window !== 'undefined' ? window.location.href : '';
      if (navigator.share) {
        await navigator.share({ title: event?.title || 'Event', url });
        return;
      }
      if (navigator.clipboard?.writeText && url) {
        await navigator.clipboard.writeText(url);
      }
    } catch {
      // ignore share errors
    }
  };

  return (
    <div className="event-details-page">
      {/* Header with Back Button */}
      <div className="event-details-header">
        <div className="container">
          <button onClick={() => router.back()} className="back-button">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Events
          </button>
        </div>
      </div>

      <div className="container">
        <div className="event-details-grid">
          {/* Left Column - Main Content */}
          <div className="event-main-content">
            {/* Title and Share */}
            <div className="event-title-section">
              <h1 className="event-title">{event.title}</h1>
              <button className="share-button" onClick={handleShare} aria-label="Share event">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
              </button>
            </div>

            {/* Image Carousel */}
            <div className="event-image-carousel">
              <div className="carousel-container">
                <img
                  src={(event.images && event.images[currentImageIndex]) || event.coverImage || DEFAULT_EVENT_IMAGE}
                  alt={event.title}
                  className="carousel-image"
                  onError={e => {
                    e.target.onerror = null;
                    e.target.src = DEFAULT_EVENT_IMAGE;
                  }}
                  style={{
                    objectFit: 'cover',
                    width: '100%',
                    height: 'auto',
                    borderRadius: '12px',
                  }}
                />
                {event.images && event.images.length > 1 && (
                  <>
                    <button className="carousel-btn prev-btn" onClick={prevImage}>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                    </button>
                    <button className="carousel-btn next-btn" onClick={nextImage}>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </button>
                  </>
                )}
                {event.images && event.images.length > 1 && (
                  <div className="carousel-indicators">
                    {event.images.map((_, index) => (
                      <button
                        key={index}
                        className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Category Tags */}
            {event.tags && event.tags.length > 0 && (
              <div className="event-tags">
                {event.tags.map((tag, index) => (
                  <span key={index} className="event-tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Register Button */}
            <div className="interested-section">
              <button
                className={`interested-btn ${isRegistered ? 'active' : ''}`}
                onClick={handleRegister}
                disabled={registering}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill={isRegistered ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                {event.registrations ? event.registrations.length : 0} registered
              </button>
              <button
                className={`im-interested-btn ${isRegistered ? 'active' : ''}`}
                onClick={handleRegister}
                disabled={registering}
              >
                {registering ? 'Loading...' : isRegistered ? 'Registered' : 'Register Now'}
              </button>
            </div>

            {/* About The Event */}
            <section className="event-section">
              <h2 className="section-title">About The Event</h2>
              <div className="event-description">
                {(event.description ? String(event.description) : 'Details will be updated soon.')
                  .split('\n\n')
                  .filter(Boolean)
                  .map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
              </div>
            </section>

            {/* You Should Know */}
            {Array.isArray(event.highlights) && event.highlights.length > 0 && (
              <section className="event-section">
                <h2 className="section-title">You Should Know</h2>
                <div className="highlights-box">
                  <div className="highlights-icon">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4M12 8h.01" />
                    </svg>
                  </div>
                  <ul className="highlights-list">
                    {event.highlights.map((highlight, index) => (
                      <li key={index}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            {Array.isArray(event.outcomes) && event.outcomes.length > 0 && (
              <section className="event-section">
                <h2 className="section-title">Outcomes</h2>
                <ul className="event-simple-list">
                  {event.outcomes.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </section>
            )}

            {Array.isArray(event.timeline) && event.timeline.length > 0 && (
              <section className="event-section">
                <h2 className="section-title">Event Timeline</h2>
                <div className="event-timeline">
                  {event.timeline.map((item, index) => (
                    <div key={index} className="timeline-item" style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                      <div className="timeline-time" style={{ minWidth: '100px', fontWeight: 'bold', color: '#e63946' }}>
                        {item.time}
                      </div>
                      <div className="timeline-content">
                        <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1rem' }}>{item.title}</h4>
                        <p style={{ margin: 0, color: '#6b7280' }}>{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Speakers / Artists */}
            {(() => {
              const participants = (Array.isArray(event.speakers) && event.speakers.length > 0) 
                ? event.speakers 
                : (Array.isArray(event.artists) ? event.artists : []);
              
              if (participants.length === 0) return null;

              return (
                <section className="event-section">
                  <h2 className="section-title">
                    {Array.isArray(event.speakers) && event.speakers.length > 0 ? 'Speakers' : 'Artists'}
                  </h2>
                  <div className="artists-grid">
                    {participants.map((person, index) => (
                      <div key={index} className="artist-card">
                        {person.photo || person.image ? (
                          <img
                            src={person.photo || person.image}
                            alt={person.name}
                            className="artist-image"
                          />
                        ) : (
                          <div className="artist-image artist-image-fallback">
                            {person.name ? person.name.charAt(0) : 'S'}
                          </div>
                        )}
                        <div className="artist-info">
                          <h3 className="artist-name">{person.name}</h3>
                          <p className="artist-role">
                            {person.role}
                            {person.company ? ` at ${person.company}` : ''}
                          </p>
                          {person.bio && <p className="artist-bio">{person.bio}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })()}
          </div>

          {/* Right Column - Booking Card */}
          <div className="event-sidebar">
            <div className="booking-card">
              <div className="booking-details">
                <div className="detail-item">
                  <svg
                    width="20"
                    height="20"
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
                  <span>
                    {formatDate(event.date) || 'Date TBD'}
                    {event.endDate ? ` - ${formatDate(event.endDate) || ''}` : ''}
                  </span>
                </div>

                <div className="detail-item">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>{event.duration || event.time || 'Time TBD'}</span>
                </div>

                <div className="detail-item">
                  <svg
                    width="20"
                    height="20"
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
                  <span>{event.ageLimit ? `Age Limit - ${event.ageLimit}` : 'Age Limit - NA'}</span>
                </div>

                <div className="detail-item">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <span>{event.language || 'Language - NA'}</span>
                </div>

                <div className="detail-item">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  <span>{event.genre || 'Category - NA'}</span>
                </div>

                <div className="detail-item location-item">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <div>
                    <span>{event.venue || event.location || 'Online'}</span>
                    {event.locationUrl && (
                      <a
                        href={event.locationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="location-link"
                        aria-label="Open location"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>

                {event.maxAttendees && (
                  <div className="detail-item">
                    <svg
                      width="20"
                      height="20"
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
                    <span>Max Attendees: {event.maxAttendees}</span>
                  </div>
                )}

                {event.organizer && (
                  <div className="detail-item">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 21v-2m0 0v-4a3 3 0 0 0-6 0m0 4v-4m0 4H6m12 0h-6m0 0v-4a3 3 0 0 0-6 0" />
                      <circle cx="12" cy="5" r="3" />
                    </svg>
                    <span>Organizer: {event.organizer}</span>
                  </div>
                )}

                {isRegistered && event.meetingLink && (
                  <div className="detail-item">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M23 7l-7 5 7 5V7z" />
                      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                    </svg>
                    <a
                      className="detail-link"
                      href={event.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Join link
                    </a>
                  </div>
                )}
                {isRegistered && (
                  <div className="registered-success-banner" style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid #10b981',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#059669', fontWeight: '700' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      You are officially registered!
                    </div>
                    {event.meetingLink && (
                      <a
                        href={event.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="join-now-btn"
                        style={{
                          background: '#10b981',
                          color: 'white',
                          padding: '12px',
                          borderRadius: '8px',
                          textAlign: 'center',
                          textDecoration: 'none',
                          fontWeight: '800',
                          fontSize: '15px',
                          boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)',
                          display: 'block'
                        }}
                      >
                        JOIN MEETING NOW
                      </a>
                    )}
                  </div>
                )}
                {event.date && (
                  <CountdownTimer targetDate={event.date} />
                )}
              </div>

              {event.date && !isRegistered && (
                <div className="booking-status">
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
                  <span>
                    Bookings closing soon!
                  </span>
                </div>
              )}

              <div className="booking-price">
                <span className="price-amount">
                  {event.price > 0 ? formatMoney(event.price) : (event.priceLabel || 'FREE')}
                </span>
                <span className={`price-status ${event.status}`}>
                  {event.status?.toUpperCase() || 'UPCOMING'}
                </span>
              </div>

              <button
                className={`book-now-btn-large ${isRegistered ? 'already-registered' : ''}`}
                onClick={isRegistered ? null : handleRegister}
                disabled={registering || isRegistered}
                style={isRegistered ? {
                  background: '#f3f4f6',
                  color: '#6b7280',
                  border: '1px solid #e5e7eb',
                  boxShadow: 'none',
                  cursor: 'default'
                } : {}}
              >
                {registering
                  ? 'Processing...'
                  : isRegistered
                    ? 'Successfully Registered ✓'
                    : 'Register Now'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
