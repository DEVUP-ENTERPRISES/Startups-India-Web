'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { apiGet, apiPost, apiDelete, isLoggedIn } from '@/lib/api';
import { getCurrentUser } from '@/lib/auth';
import '../../../styles/event-details.css';

const DEFAULT_EVENT_IMAGE = 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&q=80';

// Turns plain text with URLs into React nodes where each URL is a clickable link.
// Preserves line breaks (used inside white-space: pre-wrap containers).
function linkifyText(text) {
  if (!text) return null;
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return String(text).split(urlRegex).map((part, i) => {
    // A split part is a URL if it starts with http(s):// (avoids stateful regex.test)
    if (/^https?:\/\//.test(part)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#15803d', fontWeight: 700, textDecoration: 'underline', wordBreak: 'break-all' }}
        >
          {part}
        </a>
      );
    }
    return part;
  });
}

function guestRegStorageKey(slug) {
  return `guest_event_reg:${slug}`;
}

function getStoredGuestDetails(slug) {
  if (typeof window === 'undefined' || !slug) return null;
  try {
    const raw = sessionStorage.getItem(guestRegStorageKey(slug));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setStoredGuestDetails(slug, details) {
  if (typeof window === 'undefined' || !slug || !details?.email) return;
  sessionStorage.setItem(guestRegStorageKey(slug), JSON.stringify({
    fullName: details.fullName || '',
    email: details.email || '',
    phoneNumber: details.phoneNumber || '',
    collegeCompany: details.collegeCompany || '',
  }));
}

async function checkGuestRegistrationByEmail(slug, email) {
  if (!slug || !email?.trim()) return false;
  const res = await apiPost(`/api/v1/events/${slug}/guest-status`, { email: email.trim() });
  return Boolean(res.data?.isRegistered);
}

// Formats a paise integer as ₹X,XX,XXX. Returns 'FREE' for 0.
function formatMoney(paise) {
  if (typeof paise !== 'number' || !Number.isFinite(paise)) return null;
  if (paise <= 0) return 'FREE';
  return `₹${(paise / 100).toLocaleString('en-IN')}`;
}

function renderBoldText(text) {
  if (!text) return text;
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    const match = part.match(/^\*\*(.+)\*\*$/);
    return match ? <strong key={index}>{match[1]}</strong> : part;
  });
}

function renderBulletLines(text) {
  return text
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean)
    .map((line, index) => (
      <li key={index}>{renderBoldText(line.replace(/^[-*•]\s*/, ''))}</li>
    ));
}

export default function EventDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [guestDetails, setGuestDetails] = useState({ fullName: '', email: '', phoneNumber: '', collegeCompany: '' });
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [guestStatusMessage, setGuestStatusMessage] = useState('');
  // Post-registration feedback modal (replaces the old alert() boxes)
  const [resultModal, setResultModal] = useState(null); // { type: 'success' | 'error', message: string }
  // Ticket selection
  const [selectedTicketName, setSelectedTicketName] = useState(null);
  const [couponInput, setCouponInput] = useState('');
  const [couponState, setCouponState] = useState({
    status: 'idle', // 'idle' | 'validating' | 'valid' | 'invalid'
    message: '',
    discountedPrice: null,
    discountAmount: 0,
  });

  // Derive active ticket types with effective pricing applied
  const activeTickets = useMemo(() => {
    if (!event?.ticketTypes?.length) return [];
    const now = new Date();
    return event.ticketTypes
      .filter(t => t.isActive !== false)
      .map(t => {
        const isEarlyBird = t.earlyBirdPrice > 0 && t.earlyBirdDeadline && now <= new Date(t.earlyBirdDeadline);
        const effectivePrice = isEarlyBird ? t.earlyBirdPrice : t.price;
        const soldOut = t.quota > 0 && (t.sold || 0) >= t.quota;
        return { ...t, effectivePrice, isEarlyBird, soldOut };
      })
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  }, [event]);

  // Auto-select first available ticket
  useEffect(() => {
    if (activeTickets.length > 0 && !selectedTicketName) {
      const first = activeTickets.find(t => !t.soldOut);
      if (first) setSelectedTicketName(first.name);
    }
  }, [activeTickets, selectedTicketName]);

  // Reset coupon when ticket changes
  useEffect(() => {
    setCouponInput('');
    setCouponState({ status: 'idle', message: '', discountedPrice: null, discountAmount: 0 });
  }, [selectedTicketName]);

  const selectedTicket = useMemo(
    () => activeTickets.find(t => t.name === selectedTicketName) || null,
    [activeTickets, selectedTicketName]
  );

  // Effective display price (paise) - uses coupon-discounted price when applied
  const displayPrice = useMemo(() => {
    if (couponState.status === 'valid' && couponState.discountedPrice !== null) {
      return couponState.discountedPrice;
    }
    if (selectedTicket) return selectedTicket.effectivePrice;
    return event?.price || 0;
  }, [couponState, selectedTicket, event]);

  // Keep the coupon field visible across ticket types so users can discover and
  // test event-level coupons; the server validates ticket eligibility.
  const hasCoupons = useMemo(() => {
    return Boolean(event?.hasCoupons);
  }, [event]);

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
        const [response, userRes] = await Promise.all([
          apiGet(`/api/v1/events/${params.slug}`),
          isLoggedIn() ? getCurrentUser() : Promise.resolve({ data: null }),
        ]);
        if (response.data && !response.error) {
          const eventData = response.data;
          setEvent(eventData);
          let registered = !!eventData.isRegistered;

          if (eventData.registrationType === 'guest' && !isLoggedIn()) {
            const storedGuest = getStoredGuestDetails(params.slug);
            if (storedGuest) {
              setGuestDetails(prev => ({
                fullName: storedGuest.fullName || prev.fullName,
                email: storedGuest.email || prev.email,
                phoneNumber: storedGuest.phoneNumber || prev.phoneNumber,
              }));
              if (storedGuest.email) {
                registered = await checkGuestRegistrationByEmail(params.slug, storedGuest.email);
              }
            }
          }

          setIsRegistered(registered);
        } else {
          setError('Event not found');
        }
        if (userRes?.data?.user || userRes?.data) {
          setCurrentUser(userRes.data?.user || userRes.data);
        }
      } catch (err) {
        setError('Failed to load event');
        console.error('Error fetching event:', err);
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchEvent();
    }
  }, [params.slug]);

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

  const isFreeEvent = activeTickets.length > 0
    ? selectedTicket?.effectivePrice === 0
    : !event.isPaid && (!event.price || event.price === 0);

  const validateCoupon = async () => {
    if (!couponInput.trim() || !selectedTicketName) return;
    setCouponState({ status: 'validating', message: '', discountedPrice: null, discountAmount: 0 });
    try {
      const res = await apiPost(`/api/v1/events/${params.slug}/validate-coupon`, {
        code: couponInput.trim().toUpperCase(),
        ticketTypeName: selectedTicketName,
      });
      if (res.error) {
        setCouponState({ status: 'invalid', message: res.error.message || 'Could not validate coupon.', discountedPrice: null, discountAmount: 0 });
        return;
      }
      if (res.data?.valid) {
        setCouponState({
          status: 'valid',
          message: res.data.message || 'Coupon applied!',
          discountedPrice: res.data.discountedPrice,
          discountAmount: res.data.discountAmount,
        });
      } else {
        setCouponState({ status: 'invalid', message: res.data?.message || 'Invalid coupon code.', discountedPrice: null, discountAmount: 0 });
      }
    } catch {
      setCouponState({ status: 'invalid', message: 'Could not validate coupon. Try again.', discountedPrice: null, discountAmount: 0 });
    }
  };

  const handleRegister = async ({ fromModal = false } = {}) => {
    try {
      const isGuestRegistration = event.registrationType === 'guest';
      if (isGuestRegistration && !isRegistered && !fromModal) {
        setShowRegistrationModal(true);
        return;
      }
      if (!isGuestRegistration && !isLoggedIn()) {
        router.push(`/login?returnUrl=/events/${params.slug}`);
        return;
      }

      setRegistering(true);

      const hasTicketTypes = activeTickets.length > 0;
      // A 100%-off coupon brings the payable amount to 0 - that must be treated
      // as a free registration (skip Razorpay), not a ₹0 paid order.
      const couponMakesFree = couponState.status === 'valid' && couponState.discountedPrice === 0;
      // H4 fix: use optional chaining so null selectedTicket → undefined === 0 → false
      const isFree = couponMakesFree || (hasTicketTypes
        ? selectedTicket?.effectivePrice === 0
        : !event.isPaid && (!event.price || event.price === 0));

      // Validate ticket selection for paid multi-ticket events
      if (hasTicketTypes && !selectedTicket) {
        alert('Please select a ticket type before registering.');
        setRegistering(false);
        return;
      }
      if (hasTicketTypes && selectedTicket?.soldOut) {
        alert('This ticket type is sold out. Please choose another.');
        setRegistering(false);
        return;
      }

      if (isGuestRegistration && (!guestDetails.fullName.trim() || !guestDetails.email.trim() || !guestDetails.phoneNumber.trim())) {
        alert('Please enter your name, email, and mobile number.');
        setRegistering(false);
        return;
      }

      if (isRegistered) {
        const res = await apiDelete(`/api/v1/events/${params.slug}/register`);
        if (res.error?.status === 401) {
          router.push(`/login?returnUrl=/events/${params.slug}`);
          return;
        }
        setIsRegistered(false);
        setRegistering(false);
      } else {
        if (!isFree) {
          setShowRegistrationModal(false);
          // Build the order request - server validates amount from ticketTypes
          const orderPayload = {
            eventId: event._id,
            // amount is in paise. Server overrides it when ticketTypeName is given.
            amount: displayPrice || event.price || 0,
            ...(selectedTicketName ? { ticketTypeName: selectedTicketName } : {}),
            ...(couponInput.trim() ? { couponCode: couponInput.trim().toUpperCase() } : {}),
            ...(isGuestRegistration ? { guest: guestDetails } : {}),
          };

          const orderEndpoint = isGuestRegistration
            ? '/api/v1/payments/razorpay/guest/order'
            : '/api/v1/payments/razorpay/order';
          const verifyEndpoint = isGuestRegistration
            ? '/api/v1/payments/razorpay/guest/verify'
            : '/api/v1/payments/razorpay/verify';

          const orderRes = await apiPost(orderEndpoint, orderPayload);

          if (orderRes.error) {
            if (!isGuestRegistration && (orderRes.error.status === 401 || orderRes.error.message?.includes('token'))) {
              router.push(`/login?returnUrl=/events/${params.slug}`);
              return;
            }
            setResultModal({ type: 'error', message: orderRes.error.message || 'Could not initiate payment' });
            setRegistering(false);
            return;
          }

          const orderData = orderRes.data?.order || orderRes.data;
          const keyId = orderRes.data?.keyId
            || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
            || orderData.key_id;

          const options = {
            key: keyId,
            amount: orderData.amount,
            currency: orderData.currency || 'INR',
            name: 'Startups India',
            description: selectedTicketName
              ? `${event.title} - ${selectedTicketName}`
              : `Registration: ${event.title}`,
            image: '/Startupsindia-favicon.png',
            order_id: orderData.id || orderData.orderId,
            prefill: {
              name: isGuestRegistration
                ? guestDetails.fullName
                : (currentUser?.fullName || currentUser?.name || ''),
              email: isGuestRegistration ? guestDetails.email : (currentUser?.email || ''),
              contact: isGuestRegistration
                ? guestDetails.phoneNumber
                : (currentUser?.phoneNumber || currentUser?.phone || ''),
            },
            notes: {
              eventId: event._id,
              ...(selectedTicketName ? { ticketTypeName: selectedTicketName } : {}),
            },
            theme: { color: '#e63946' },
            handler: async function (response) {
              try {
                const verifyRes = await apiPost(verifyEndpoint, {
                  orderId: response.razorpay_order_id,
                  paymentId: response.razorpay_payment_id,
                  signature: response.razorpay_signature,
                });
                const regResult = verifyRes.data?.registration;
                if (verifyRes.error) {
                  setResultModal({
                    type: 'error',
                    message: 'Your payment was received, but we could not confirm your registration automatically. Our team has been notified - please contact support if it is not resolved shortly.',
                  });
                } else if (regResult && regResult.ok === false) {
                  // Payment succeeded; registration is being finalised in the
                  // background (webhook/reconcile will complete it). Reassure the
                  // user rather than alarming them - their spot is secured.
                  setIsRegistered(true);
                  setShowRegistrationModal(false);
                  setResultModal({
                    type: 'success',
                    message: 'Your payment was successful and your spot is secured. Your confirmation email will arrive shortly. If you do not see it, please contact support.',
                  });
                } else {
                  setIsRegistered(true);
                  setShowRegistrationModal(false);
                  setResultModal({
                    type: 'success',
                    message: 'You are now registered for this event. A confirmation email with your ticket is on its way to your inbox.',
                  });
                }
              } catch (err) {
                setResultModal({
                  type: 'error',
                  message: 'We could not verify your payment. Please refresh the page to check your registration status, or contact support.',
                });
              } finally {
                setRegistering(false);
              }
            },
            modal: {
              ondismiss: () => {
                setRegistering(false);
              },
            },
          };

          if (window.Razorpay) {
            new window.Razorpay(options).open();
          } else {
            setResultModal({ type: 'error', message: 'Payment gateway is still loading. Please refresh the page and try again.' });
            setRegistering(false);
          }
        } else {
          const res = await apiPost(`/api/v1/events/${params.slug}/register`, {
            ...(selectedTicketName ? { ticketTypeName: selectedTicketName } : {}),
            ...(couponInput.trim() ? { couponCode: couponInput.trim().toUpperCase() } : {}),
            ...(isGuestRegistration ? { guest: guestDetails } : {}),
          });
          if (res.error) {
            if (res.error.status === 401 || res.error.message?.includes('token')) {
              router.push(`/login?returnUrl=/events/${params.slug}`);
              return;
            }
            setResultModal({ type: 'error', message: res.error.message || 'Could not register for event' });
            setRegistering(false);
            return;
          }
          setIsRegistered(true);
          setShowRegistrationModal(false);
          setRegistering(false);
          setResultModal({
            type: 'success',
            message: 'You are now registered for this event. A confirmation email with your ticket is on its way to your inbox.',
          });
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
    <div className="event-page-root" style={{ minHeight: '100vh', background: '#f1f5f9', paddingTop: 'var(--header-h, 72px)', paddingBottom: 60 }}>

      {/* Sticky back bar */}
      <div className="event-page-backbar" style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '12px 0', position: 'sticky', top: 'var(--header-h, 72px)', zIndex: 100 }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'transparent', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, fontWeight: 600, color: '#374151', cursor: 'pointer' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            Back to Events
          </button>
          <button onClick={handleShare} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'transparent', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#64748b', cursor: 'pointer' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
            Share
          </button>
        </div>
      </div>

      <div className="container event-page-container">

        {/* Two-column layout */}
        <div className="event-page-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24, marginTop: 24, alignItems: 'start' }}>

          {/* LEFT column */}
          <div className="event-page-main" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Event identity */}
            <div className="event-page-identity" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #fff7f7 100%)', borderRadius: 16, padding: '24px 26px', border: '1px solid #fee2e2', boxShadow: '0 4px 16px rgba(15,23,42,0.05)' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                {event.category && <span style={{ background: '#e63946', color: '#fff', fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{event.category}</span>}
                {event.mode && <span style={{ background: event.mode === 'Online' ? '#2563eb' : '#d97706', color: '#fff', fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{event.mode}</span>}
              </div>
              <h1 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 900, lineHeight: 1.12, color: '#111827', margin: 0 }}>{event.title}</h1>
              {event.subtitle && <p style={{ fontSize: 15, lineHeight: 1.6, color: '#64748b', margin: '10px 0 0', maxWidth: 680 }}>{renderBoldText(event.subtitle)}</p>}
            </div>

            {/* Quick meta chips */}
            <div className="event-page-meta" style={{ background: '#fff', borderRadius: 14, padding: '18px 22px', boxShadow: '0 1px 3px rgba(0,0,0,0.07)', display: 'flex', flexWrap: 'wrap', gap: 18 }}>
              {(event.eventStartDate || event.date) && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Date</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#374151' }}>{formatDate(event.eventStartDate || event.date)}{event.time && ` · ${event.time}`}</div>
                  </div>
                </div>
              )}
              {(event.venueName || event.city || event.mode) && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Venue</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#374151' }}>
                      {event.mode === 'Offline' ? (event.venueName || event.city || 'Offline') : 'Online'}
                      {event.googleMapsLink && <a href={event.googleMapsLink} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 6, color: '#3b82f6', fontSize: 11 }}>Map ↗</a>}
                    </div>
                  </div>
                </div>
              )}
              {event.duration && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#9ca3af', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Duration</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#374151' }}>{event.duration}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Tags */}
            {event.tags?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {event.tags.map((tag, i) => (
                  <span key={i} style={{ padding: '5px 14px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 20, fontSize: 12, fontWeight: 600, color: '#475569' }}>{tag}</span>
                ))}
              </div>
            )}

            {/* About */}
            {event.description && (
              <div style={{ background: '#fff', borderRadius: 14, padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#111827', margin: '0 0 14px' }}>About the Event</h2>
                <div style={{ fontSize: 14, lineHeight: 1.8, color: '#4b5563' }}>
                  {event.description.split('\n\n').filter(Boolean).map((p, i) => <p key={i} style={{ margin: '0 0 12px' }}>{renderBoldText(p)}</p>)}
                </div>
              </div>
            )}

            {/* Highlights */}
            {event.highlights?.filter(Boolean).length > 0 && (
              <div style={{ background: '#fff', borderRadius: 14, padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#111827', margin: '0 0 14px' }}>Highlights</h2>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {event.highlights.filter(Boolean).map((h, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: '#374151' }}>
                      <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#fef3c7', border: '1px solid #fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                      </span>
                      {renderBoldText(h)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Outcomes */}
            {event.outcomes?.filter(Boolean).length > 0 && (
              <div style={{ background: '#fff', borderRadius: 14, padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#111827', margin: '0 0 14px' }}>What You Will Gain</h2>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {event.outcomes.filter(Boolean).map((o, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: '#374151' }}>
                      <span style={{ width: 20, height: 20, borderRadius: '50%', background: '#dcfce7', border: '1px solid #86efac', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                      </span>
                      {renderBoldText(o)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Timeline */}
            {event.timeline?.length > 0 && (
              <div style={{ background: '#fff', borderRadius: 14, padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#111827', margin: '0 0 20px' }}>Agenda</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {event.timeline.map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: 14, paddingBottom: i < event.timeline.length - 1 ? 22 : 0, position: 'relative' }}>
                      {i < event.timeline.length - 1 && <div style={{ position: 'absolute', left: 15, top: 30, bottom: 0, width: 2, background: '#e2e8f0' }} />}
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#e63946', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1 }}>
                        <span style={{ color: '#fff', fontSize: 11, fontWeight: 800 }}>{i + 1}</span>
                      </div>
                      <div style={{ flex: 1, paddingTop: 4 }}>
                        {item.time && <div style={{ fontSize: 11, fontWeight: 700, color: '#e63946', marginBottom: 2 }}>{item.time}</div>}
                        <div style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>{renderBoldText(item.title)}</div>
                        {item.description && <div style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>{renderBoldText(item.description)}</div>}
                        {item.speaker && <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 3, fontStyle: 'italic' }}>- {renderBoldText(item.speaker)}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Speakers / Artists */}
            {(() => {
              const people = event.speakers?.length ? event.speakers : (event.artists || []);
              if (!people.length) return null;
              return (
                <div style={{ background: '#fff', borderRadius: 14, padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: '#111827', margin: '0 0 18px' }}>{event.speakers?.length ? 'Speakers' : 'Artists'}</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
                    {people.map((p, i) => (
                      <div key={i} style={{ display: 'flex', gap: 12, padding: 14, background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                        {p.photo || p.image ? (
                          <img src={p.photo || p.image} alt={p.name} style={{ width: 58, height: 58, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} />
                        ) : (
                          <div style={{ width: 58, height: 58, borderRadius: 10, background: '#f1f5f9', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                          </div>
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 800, fontSize: 14, color: '#111827' }}>{p.name}</div>
                          {(p.role || p.company) && <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2, fontWeight: 600 }}>{p.role}{p.company ? ` · ${p.company}` : ''}</div>}
                          {p.bio && <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 5, lineHeight: 1.5 }}>{renderBoldText(p.bio)}</div>}
                          {p.linkedinProfile && <a href={p.linkedinProfile} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', marginTop: 5, fontSize: 11, fontWeight: 700, color: '#0a66c2' }}>LinkedIn ↗</a>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Organized By - only if data exists */}
            {(event.organizedBy?.length > 0 || (event.organizer && event.organizer !== 'StartupsIndia')) && (
              <div style={{ background: '#fff', borderRadius: 14, padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#111827', margin: '0 0 14px' }}>Organized By</h2>
                {event.organizedBy?.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    {event.organizedBy.map(org => (
                      <a key={org._id} href={org.website || undefined} target={org.website ? '_blank' : undefined} rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 12, background: '#f8fafc', textDecoration: 'none' }}>
                        {org.logo && <img src={org.logo} alt={org.name} style={{ height: 32, maxWidth: 72, objectFit: 'contain' }} />}
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 13, color: '#111827' }}>{org.name}</div>
                          {org.description && <div style={{ fontSize: 11, color: '#6b7280' }}>{org.description}</div>}
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: 14, color: '#374151', fontWeight: 600 }}>{event.organizer}</div>
                )}
              </div>
            )}

            {/* Chief Guests - dignitaries shown as prominent person cards */}
            {event.chiefGuests?.length > 0 && (
              <div style={{ background: '#fff', borderRadius: 14, padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#111827', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 18 }}>🎖️</span> Chief Guests
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
                  {event.chiefGuests.map(guest => (
                    <div key={guest._id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14, borderRadius: 14, border: '1px solid #fecdd3', background: 'linear-gradient(135deg,#fff1f2,#ffffff)' }}>
                      {guest.logo ? (
                        <img src={guest.logo} alt={guest.name} style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', border: '2px solid #fecdd3', flexShrink: 0 }} />
                      ) : (
                        <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#fff', border: '2px solid #fecdd3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fb7185" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                        </div>
                      )}
                      <div style={{ minWidth: 0 }}>
                        {guest.website ? (
                          <a href={guest.website} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 800, fontSize: 15, color: '#111827', textDecoration: 'none' }}>{guest.name}</a>
                        ) : (
                          <div style={{ fontWeight: 800, fontSize: 15, color: '#111827' }}>{guest.name}</div>
                        )}
                        {guest.description && <div style={{ fontSize: 12, color: '#be123c', marginTop: 3, fontWeight: 600 }}>{guest.description}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Special Guests - shown as prominent person cards */}
            {event.specialGuests?.length > 0 && (
              <div style={{ background: '#fff', borderRadius: 14, padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#111827', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 18 }}>⭐</span> Special Guests
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
                  {event.specialGuests.map(guest => (
                    <div key={guest._id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14, borderRadius: 14, border: '1px solid #fed7aa', background: 'linear-gradient(135deg,#fff7ed,#ffffff)' }}>
                      {guest.logo ? (
                        <img src={guest.logo} alt={guest.name} style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', border: '2px solid #fed7aa', flexShrink: 0 }} />
                      ) : (
                        <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#fff', border: '2px solid #fed7aa', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fb923c" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                        </div>
                      )}
                      <div style={{ minWidth: 0 }}>
                        {guest.website ? (
                          <a href={guest.website} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 800, fontSize: 15, color: '#111827', textDecoration: 'none' }}>{guest.name}</a>
                        ) : (
                          <div style={{ fontWeight: 800, fontSize: 15, color: '#111827' }}>{guest.name}</div>
                        )}
                        {guest.description && <div style={{ fontSize: 12, color: '#c2410c', marginTop: 3, fontWeight: 600 }}>{guest.description}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Partner strips - only rendered when each list has data */}
            {[
              { key: 'supportingPartners', label: 'Supporting Partners', accent: '#15803d', bg: '#f0fdf4', border: '#bbf7d0' },
              { key: 'academicPartners',   label: 'Academic Partners',   accent: '#7e22ce', bg: '#fdf4ff', border: '#e9d5ff' },
              { key: 'sponsors',           label: 'Sponsors',            accent: '#b45309', bg: '#fffbeb', border: '#fde68a' },
            ].map(({ key, label, accent, bg, border }) => {
              const list = event[key];
              if (!list?.length) return null;
              return (
                <div key={key} style={{ background: '#fff', borderRadius: 14, padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.07)' }}>
                  <h2 style={{ fontSize: 18, fontWeight: 800, color: '#111827', margin: '0 0 14px' }}>{label}</h2>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                    {list.map(org => (
                      <a key={org._id} href={org.website || undefined} target={org.website ? '_blank' : undefined} rel="noopener noreferrer" title={org.name} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 10, border: `1px solid ${border}`, background: bg, textDecoration: 'none' }}>
                        {org.logo && <img src={org.logo} alt={org.name} style={{ height: 28, maxWidth: 68, objectFit: 'contain' }} />}
                        <span style={{ fontWeight: 700, fontSize: 12, color: '#111827' }}>{org.name}</span>
                      </a>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT column - compact poster and booking card */}
          <div className="event-page-sidebar" style={{ position: 'sticky', top: 100, display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Compact 4:5 poster */}
            <div className="event-page-poster" style={{ position: 'relative', width: 'min(100%, 320px)', aspectRatio: '4/5', alignSelf: 'center', borderRadius: 16, overflow: 'hidden', background: '#0f172a', boxShadow: '0 8px 24px rgba(15,23,42,0.16)' }}>
              <img
                src={event.images?.[currentImageIndex] || event.coverImage || DEFAULT_EVENT_IMAGE}
                alt={event.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.72, display: 'block' }}
                onError={e => { e.target.onerror = null; e.target.src = DEFAULT_EVENT_IMAGE; }}
              />
              {event.images?.length > 1 && (
                <>
                  <button onClick={prevImage} aria-label="Previous poster" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" /></svg>
                  </button>
                  <button onClick={nextImage} aria-label="Next poster" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5"><path d="M9 18l6-6-6-6" /></svg>
                  </button>
                  <div style={{ position: 'absolute', bottom: 94, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 5, zIndex: 2 }}>
                    {event.images.map((_, i) => (
                      <button key={i} onClick={() => setCurrentImageIndex(i)} aria-label={`Show poster ${i + 1}`} style={{ width: i === currentImageIndex ? 18 : 7, height: 7, borderRadius: 4, background: i === currentImageIndex ? '#fff' : 'rgba(255,255,255,0.5)', border: 'none', cursor: 'pointer', transition: 'all 0.2s', padding: 0 }} />
                    ))}
                  </div>
                </>
              )}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.85))', padding: '42px 18px 18px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 8 }}>
                  {event.category && <span style={{ background: '#e63946', color: '#fff', fontSize: 8, fontWeight: 800, padding: '3px 8px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{event.category}</span>}
                  {event.mode && <span style={{ background: event.mode === 'Online' ? '#3b82f6' : '#f59e0b', color: '#fff', fontSize: 8, fontWeight: 800, padding: '3px 8px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{event.mode}</span>}
                  <span style={{ background: event.status === 'live' ? '#10b981' : event.status === 'upcoming' ? '#6366f1' : '#64748b', color: '#fff', fontSize: 8, fontWeight: 800, padding: '3px 8px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{event.status}</span>
                </div>
                <h1 style={{ fontSize: 'clamp(18px, 2.4vw, 25px)', fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1.15 }}>{event.title}</h1>
                {event.subtitle && <p style={{ color: 'rgba(255,255,255,0.78)', fontSize: 11, fontWeight: 500, margin: '6px 0 0' }}>{event.subtitle}</p>}
              </div>
            </div>

            {/* Registered success banner */}
            {isRegistered && (
              <div style={{ background: 'linear-gradient(135deg,#dcfce7,#bbf7d0)', border: '1px solid #86efac', borderRadius: 14, padding: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#15803d', fontWeight: 800, fontSize: 14, marginBottom: (event.meetingLink || event.postRegistrationMessage) ? 12 : 0 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                  You are registered!
                </div>

                {/* Admin-defined post-registration message (e.g. WhatsApp group link) */}
                {event.postRegistrationMessage && (
                  <div style={{ background: '#fff', border: '1px solid #bbf7d0', borderRadius: 10, padding: '12px 14px', marginBottom: event.meetingLink ? 12 : 0 }}>
                    <div style={{ fontSize: 13.5, color: '#166534', lineHeight: 1.65, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {linkifyText(event.postRegistrationMessage)}
                    </div>
                  </div>
                )}

                {event.meetingLink && (
                  <a href={event.meetingLink} target="_blank" rel="noopener noreferrer" style={{ display: 'block', textAlign: 'center', background: '#16a34a', color: '#fff', padding: '12px', borderRadius: 10, fontWeight: 800, fontSize: 14, textDecoration: 'none' }}>
                    JOIN MEETING →
                  </a>
                )}
              </div>
            )}

            {/* Main card */}
            <div className="event-page-booking" style={{ background: '#fff', borderRadius: 16, padding: 22, boxShadow: '0 4px 20px rgba(0,0,0,0.09)', border: '1px solid #e2e8f0' }}>

              {/* Price */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 18 }}>
                <span style={{ fontSize: 28, fontWeight: 900, color: '#111827' }}>
                  {displayPrice > 0 ? formatMoney(displayPrice) : (event.priceLabel || 'FREE')}
                </span>
                {couponState.status === 'valid' && couponState.discountAmount > 0 && selectedTicket && (
                  <span style={{ fontSize: 14, color: '#9ca3af', textDecoration: 'line-through' }}>{formatMoney(selectedTicket.effectivePrice)}</span>
                )}
                {displayPrice === 0 && <span style={{ fontSize: 11, fontWeight: 700, background: '#dcfce7', color: '#16a34a', padding: '2px 8px', borderRadius: 6 }}>Free</span>}
              </div>

              {/* Key details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '14px 0', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', marginBottom: 16 }}>
                {(event.eventStartDate || event.date) && (
                  <div style={{ display: 'flex', gap: 8, fontSize: 13, color: '#374151', fontWeight: 600, alignItems: 'center' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                    {formatDate(event.eventStartDate || event.date)}
                    {event.time && <span style={{ color: '#9ca3af', fontWeight: 400 }}>· {event.time}</span>}
                  </div>
                )}
                {(event.mode || event.venueName || event.city) && (
                  <div style={{ display: 'flex', gap: 8, fontSize: 13, color: '#374151', fontWeight: 600, alignItems: 'center' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                    {event.mode === 'Offline' ? (event.venueName || event.city || 'Offline') : 'Online Event'}
                  </div>
                )}
              </div>

              {/* Countdown */}
              {event.date && !isRegistered && <div style={{ marginBottom: 14 }}><CountdownTimer targetDate={event.date} /></div>}

              {/* Ticket selector */}
              {!isRegistered && activeTickets.length > 0 && (
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 7 }}>Select Ticket</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {activeTickets.map(ticket => (
                      <label key={ticket.name} className="event-ticket-option" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '11px 12px', borderRadius: 10, cursor: ticket.soldOut ? 'not-allowed' : 'pointer', border: selectedTicketName === ticket.name ? '2px solid #e63946' : '1.5px solid #e5e7eb', background: ticket.soldOut ? '#f9fafb' : selectedTicketName === ticket.name ? '#fff5f5' : '#fff', opacity: ticket.soldOut ? 0.55 : 1, transition: 'all 0.15s' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9, minWidth: 0, flex: 1 }}>
                          <input type="radio" name="ticketType" value={ticket.name} checked={selectedTicketName === ticket.name} disabled={ticket.soldOut} onChange={() => !ticket.soldOut && setSelectedTicketName(ticket.name)} style={{ accentColor: '#e63946', marginTop: 2 }} />
                          <div style={{ minWidth: 0, overflowWrap: 'anywhere' }}>
                            <div style={{ fontWeight: 700, fontSize: 13, color: '#111827', display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
                              {ticket.name}
                              {ticket.isEarlyBird && <span style={{ fontSize: 9, fontWeight: 800, background: '#fef3c7', color: '#92400e', padding: '1px 5px', borderRadius: 4 }}>EARLY BIRD</span>}
                              {ticket.soldOut && <span style={{ fontSize: 9, fontWeight: 800, background: '#fee2e2', color: '#991b1b', padding: '1px 5px', borderRadius: 4 }}>SOLD OUT</span>}
                            </div>
                            {ticket.description && (
                              <ul className="event-ticket-bullets" style={{ margin: '3px 0 0', paddingLeft: 13, fontSize: 10, color: '#6b7280', lineHeight: 1.5 }}>
                                {renderBulletLines(ticket.description)}
                              </ul>
                            )}
                            {ticket.quota > 0 && !ticket.soldOut && <div style={{ fontSize: 10, color: '#f97316', fontWeight: 700, marginTop: 2 }}>{Math.max(0, ticket.quota - (ticket.sold || 0))} left</div>}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 8 }}>
                          <div style={{ fontWeight: 800, fontSize: 14, color: ticket.soldOut ? '#9ca3af' : '#e63946' }}>{ticket.effectivePrice > 0 ? formatMoney(ticket.effectivePrice) : 'FREE'}</div>
                          {(ticket.isEarlyBird ? ticket.originalPrice > 0 : ticket.originalPrice > ticket.price && ticket.originalPrice > 0) && (
                            <div style={{ fontSize: 10, color: '#9ca3af', textDecoration: 'line-through' }}>{formatMoney(ticket.isEarlyBird ? ticket.price : ticket.originalPrice)}</div>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Coupon */}
              {!isRegistered && hasCoupons && (
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Have a coupon?</div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <input value={couponInput} onChange={e => { setCouponInput(e.target.value.toUpperCase().replace(/\s/g, '')); if (couponState.status !== 'idle') setCouponState({ status: 'idle', message: '', discountedPrice: null, discountAmount: 0 }); }} onKeyDown={e => e.key === 'Enter' && validateCoupon()} placeholder="COUPON CODE" style={{ flex: 1, padding: '8px 10px', border: `1.5px solid ${couponState.status === 'valid' ? '#10b981' : couponState.status === 'invalid' ? '#ef4444' : '#e5e7eb'}`, borderRadius: 8, fontSize: 12, fontFamily: 'monospace', fontWeight: 700, textTransform: 'uppercase', outline: 'none' }} />
                    <button type="button" onClick={validateCoupon} disabled={!couponInput.trim() || couponState.status === 'validating'} style={{ padding: '8px 12px', background: couponState.status === 'valid' ? '#10b981' : '#1f2937', color: '#fff', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: couponInput.trim() ? 'pointer' : 'not-allowed', opacity: couponInput.trim() ? 1 : 0.5, flexShrink: 0 }}>
                      {couponState.status === 'validating' ? '…' : couponState.status === 'valid' ? '✓' : 'Apply'}
                    </button>
                  </div>
                  {couponState.status === 'valid' && (
                    <div style={{ marginTop: 5, display: 'flex', alignItems: 'center', gap: 5, color: '#059669', fontSize: 11, fontWeight: 700 }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                      {couponState.message}{couponState.discountAmount > 0 && ` - saving ${formatMoney(couponState.discountAmount)}`}
                      <button type="button" onClick={() => { setCouponInput(''); setCouponState({ status: 'idle', message: '', discountedPrice: null, discountAmount: 0 }); }} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 11 }}>Remove</button>
                    </div>
                  )}
                  {couponState.status === 'invalid' && (
                    <div style={{ marginTop: 5, display: 'flex', alignItems: 'center', gap: 5, color: '#dc2626', fontSize: 11, fontWeight: 600 }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                      {couponState.message}
                    </div>
                  )}
                </div>
              )}

              {/* CTA */}
              <button onClick={isRegistered ? null : () => handleRegister()} disabled={registering || isRegistered || (activeTickets.length > 0 && !selectedTicket)} style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', fontSize: 15, fontWeight: 800, cursor: registering || isRegistered ? 'default' : 'pointer', transition: 'all 0.2s', background: isRegistered ? '#f1f5f9' : 'linear-gradient(135deg,#e63946 0%,#b91c1c 100%)', color: isRegistered ? '#94a3b8' : '#fff', boxShadow: isRegistered ? 'none' : '0 4px 14px rgba(230,57,70,0.32)' }}>
                {registering ? 'Processing…' : isRegistered ? 'Successfully Registered ✓' : displayPrice > 0 ? `Register - ${formatMoney(displayPrice)}` : 'Register Now · Free'}
              </button>


            </div>

            {/* Organizer mini-card in sidebar */}
            {event.organizedBy?.length > 0 && (
              <div style={{ background: '#fff', borderRadius: 14, padding: 18, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Organized By</div>
                {event.organizedBy.map(org => (
                  <div key={org._id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {org.logo && <img src={org.logo} alt={org.name} style={{ width: 34, height: 34, objectFit: 'contain', borderRadius: 6, border: '1px solid #e2e8f0', background: '#f8fafc' }} />}
                    <div>
                      {org.website ? <a href={org.website} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 700, fontSize: 13, color: '#111827', textDecoration: 'none' }}>{org.name}</a> : <span style={{ fontWeight: 700, fontSize: 13, color: '#111827' }}>{org.name}</span>}
                      {org.description && <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>{org.description}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showRegistrationModal && event.registrationType === 'guest' && !isRegistered && (
        <div role="dialog" aria-modal="true" aria-labelledby="registration-modal-title" onMouseDown={e => e.target === e.currentTarget && setShowRegistrationModal(false)} style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, background: 'rgba(15,23,42,0.58)', backdropFilter: 'blur(5px)' }}>
          <form onSubmit={e => { e.preventDefault(); handleRegister({ fromModal: true }); }} style={{ width: '100%', maxWidth: 440, background: '#fff', borderRadius: 18, padding: 26, boxShadow: '0 24px 70px rgba(15,23,42,0.28)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 6 }}>
              <div>
                <div style={{ color: '#e63946', fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Almost there</div>
                <h2 id="registration-modal-title" style={{ margin: '5px 0 0', color: '#111827', fontSize: 22, fontWeight: 900 }}>Registration details</h2>
              </div>
              <button type="button" aria-label="Close registration form" onClick={() => setShowRegistrationModal(false)} style={{ border: 0, background: '#f1f5f9', color: '#64748b', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', fontSize: 20 }}>×</button>
            </div>
            <p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.6, margin: '8px 0 20px' }}>Enter your details to reserve your place at {event.title}.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input required type="text" value={guestDetails.fullName} onChange={e => setGuestDetails({ ...guestDetails, fullName: e.target.value })} placeholder="Full name" autoComplete="name" style={{ width: '100%', boxSizing: 'border-box', padding: '12px 13px', border: '1.5px solid #dbe3ee', borderRadius: 9, fontSize: 13, outline: 'none' }} />
              <input required type="email" value={guestDetails.email} onChange={e => setGuestDetails({ ...guestDetails, email: e.target.value })} placeholder="Email address" autoComplete="email" style={{ width: '100%', boxSizing: 'border-box', padding: '12px 13px', border: '1.5px solid #dbe3ee', borderRadius: 9, fontSize: 13, outline: 'none' }} />
              <input required type="tel" value={guestDetails.phoneNumber} onChange={e => setGuestDetails({ ...guestDetails, phoneNumber: e.target.value })} placeholder="Mobile number" autoComplete="tel" style={{ width: '100%', boxSizing: 'border-box', padding: '12px 13px', border: '1.5px solid #dbe3ee', borderRadius: 9, fontSize: 13, outline: 'none' }} />
              <input required type="text" value={guestDetails.collegeCompany} onChange={e => setGuestDetails({ ...guestDetails, collegeCompany: e.target.value })} placeholder="College / Organization" autoComplete="organization" style={{ width: '100%', boxSizing: 'border-box', padding: '12px 13px', border: '1.5px solid #dbe3ee', borderRadius: 9, fontSize: 13, outline: 'none' }} />
            </div>
            <button type="submit" disabled={registering} style={{ width: '100%', marginTop: 18, padding: 13, border: 0, borderRadius: 10, background: '#e63946', color: '#fff', fontWeight: 800, fontSize: 14, cursor: registering ? 'wait' : 'pointer' }}>{registering ? 'Processing...' : isFreeEvent ? 'Complete Registration' : `Continue to Payment - ${formatMoney(displayPrice)}`}</button>
          </form>
        </div>
      )}

      {resultModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="result-modal-title"
          onMouseDown={e => {
            if (e.target === e.currentTarget) {
              const wasSuccess = resultModal.type === 'success';
              setResultModal(null);
              if (wasSuccess && currentUser) window.location.reload();
            }
          }}
          style={{ position: 'fixed', inset: 0, zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, background: 'rgba(15,23,42,0.58)', backdropFilter: 'blur(5px)' }}
        >
          <div style={{ width: '100%', maxWidth: 420, background: '#fff', borderRadius: 18, padding: '30px 26px', boxShadow: '0 24px 70px rgba(15,23,42,0.28)', textAlign: 'center' }}>
            <div
              style={{
                width: 62,
                height: 62,
                margin: '0 auto 16px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 32,
                background: resultModal.type === 'success' ? '#dcfce7' : '#fee2e2',
                color: resultModal.type === 'success' ? '#16a34a' : '#dc2626',
              }}
            >
              {resultModal.type === 'success' ? '✓' : '!'}
            </div>
            <h2 id="result-modal-title" style={{ margin: '0 0 8px', color: '#111827', fontSize: 21, fontWeight: 900 }}>
              {resultModal.type === 'success' ? 'Registration successful' : 'Something went wrong'}
            </h2>
            <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.65, margin: '0 0 22px' }}>{resultModal.message}</p>
            <button
              type="button"
              onClick={() => {
                const wasSuccess = resultModal.type === 'success';
                setResultModal(null);
                if (wasSuccess && currentUser) window.location.reload();
              }}
              style={{ width: '100%', padding: 13, border: 0, borderRadius: 10, background: resultModal.type === 'success' ? '#16a34a' : '#e63946', color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}
            >
              {resultModal.type === 'success' ? 'Done' : 'Close'}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .container > div[style*="grid-template-columns: 1fr 360px"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="position: sticky"][style*="top: 100px"] {
            position: static !important;
          }
        }
      `}</style>
    </div>
  );
}
