'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiGet, apiPost, apiPatch, apiDelete } from '@/lib/api';
import Link from 'next/link';

const ADMIN_BASE = `/${process.env.NEXT_PUBLIC_ADMIN_SLUG || 'ctrl-x9k2m3-panel'}`;

export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const initialFormState = {
    title: '',
    slug: '',
    subtitle: '',
    description: '',
    mode: 'Online',
    category: 'workshops',
    type: 'workshop',
    registrationStartDate: '',
    registrationEndDate: '',
    eventStartDate: '',
    eventEndDate: '',
    date: '', // for backward compat
    time: '',
    duration: '',
    
    // Offline Fields
    venueName: '',
    fullAddress: '',
    city: '',
    googleMapsLink: '',
    
    // Online Fields
    meetingPlatform: '',
    meetingLink: '',

    // Shown to attendees after they register (+ emailed to them)
    postRegistrationMessage: '',

    coverImage: '',
    images: [],
    
    // Pricing
    isPaid: false,
    price: 0,
    originalPrice: 0,
    discountedPrice: 0,
    earlyBirdPrice: 0,
    couponCode: '',
    priceLabel: 'Free',
    registrationType: 'login',
    ticketTypes: [],
    coupons: [],
    
    // Capacity
    maxAttendees: 0,
    waitlistEnabled: false,
    autoCloseRegistration: false,
    
    featured: false,
    tags: [],
    organizer: 'StartupsIndia',
    ageLimit: '18yrs +',
    language: 'English',
    genre: '',
    status: 'upcoming',
    highlights: [],
    outcomes: [],
    timeline: [],
    speakers: [],
    // Partner refs (array of _id strings)
    organizedBy: [],
    supportingPartners: [],
    academicPartners: [],
    sponsors: [],
    chiefGuests: [],
    specialGuests: [],
  };

  const [form, setForm] = useState(initialFormState);
  // Partner library - loaded once when the modal opens
  const [partnerLibrary, setPartnerLibrary] = useState([]);
  const [quickPartner, setQuickPartner] = useState(null); // null = hidden, {} = open

  const loadPartnerLibrary = useCallback(async () => {
    const { data } = await apiGet('/api/v1/admin/event-partners');
    if (data) setPartnerLibrary(Array.isArray(data) ? data : []);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 20 });
    if (statusFilter) params.set('status', statusFilter);
    const { data } = await apiGet(`/api/v1/admin/events?${params}`);
    if (data) {
      setEvents(data.events || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    }
    setLoading(false);
  }, [page, statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditEvent(null);
    setForm(initialFormState);
    setShowModal(true);
    loadPartnerLibrary();
  };

  // Format a stored Date into a `datetime-local` value (YYYY-MM-DDTHH:mm) in LOCAL
  // time. Using toISOString() here would render the instant in UTC, which shifts
  // the wall-clock (and can roll the calendar date back a day for IST-stored
  // times near midnight) - and that shift compounds on every edit/save. We build
  // the string from local getters so the admin sees exactly the time they entered.
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    if (Number.isNaN(d.valueOf())) return '';
    const pad = n => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  // Convert rupees → paise before sending to the backend
  function toPaise(rupees) {
    return Math.round(Number(rupees || 0) * 100);
  }

  // Mirrors the backend generateSlug - converts title to a URL-safe slug
  function slugify(text) {
    return (text || '')
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  const openEdit = ev => {
    setEditEvent(ev);
    setForm({
      title: ev.title || '',
      slug: ev.slug || '',
      subtitle: ev.subtitle || '',
      description: ev.description || '',
      mode: ev.mode || 'Online',
      category: ev.category || 'workshops',
      type: ev.type || 'workshop',
      registrationStartDate: formatDateForInput(ev.registrationStartDate),
      registrationEndDate: formatDateForInput(ev.registrationEndDate),
      eventStartDate: formatDateForInput(ev.eventStartDate || ev.date),
      eventEndDate: formatDateForInput(ev.eventEndDate || ev.endDate),
      date: formatDateForInput(ev.date),
      time: ev.time || '',
      duration: ev.duration || '',
      venueName: ev.venueName || '',
      fullAddress: ev.fullAddress || '',
      city: ev.city || '',
      googleMapsLink: ev.googleMapsLink || '',
      meetingPlatform: ev.meetingPlatform || '',
      meetingLink: ev.meetingLink || '',
      postRegistrationMessage: ev.postRegistrationMessage || '',
      coverImage: ev.coverImage || '',
      images: ev.images || [],
      isPaid: ev.isPaid || false,
      // DB stores paise - show rupees in the form
      price: ev.price ? ev.price / 100 : 0,
      originalPrice: ev.originalPrice ? ev.originalPrice / 100 : 0,
      discountedPrice: ev.discountedPrice ? ev.discountedPrice / 100 : 0,
      earlyBirdPrice: ev.earlyBirdPrice ? ev.earlyBirdPrice / 100 : 0,
      couponCode: ev.couponCode || '',
      priceLabel: ev.priceLabel || 'Free',
      registrationType: ev.registrationType || 'login',
      // Ticket types - paise → rupees for all price fields
      ticketTypes: (ev.ticketTypes || []).map(t => ({
        name: t.name || '',
        description: t.description || '',
        price: t.price ? t.price / 100 : 0,
        originalPrice: t.originalPrice ? t.originalPrice / 100 : 0,
        earlyBirdPrice: t.earlyBirdPrice ? t.earlyBirdPrice / 100 : 0,
        earlyBirdDeadline: formatDateForInput(t.earlyBirdDeadline),
        quota: t.quota || 0,
        sold: t.sold || 0,
        isActive: t.isActive !== false,
        sortOrder: t.sortOrder || 0,
      })),
      // Coupons - discountValue for percent stays as-is; flat is in paise → rupees
      coupons: (ev.coupons || []).map(c => ({
        code: c.code || '',
        discountType: c.discountType || 'percent',
        discountValue: c.discountType === 'flat' ? (c.discountValue ? c.discountValue / 100 : 0) : (c.discountValue || 0),
        maxUses: c.maxUses || 0,
        usedCount: c.usedCount || 0,
        validFrom: formatDateForInput(c.validFrom),
        validUntil: formatDateForInput(c.validUntil),
        applicableTickets: c.applicableTickets || [],
        isActive: c.isActive !== false,
      })),
      maxAttendees: ev.maxAttendees || 0,
      waitlistEnabled: ev.waitlistEnabled || false,
      autoCloseRegistration: ev.autoCloseRegistration || false,
      featured: ev.featured || false,
      tags: ev.tags || [],
      organizer: ev.organizer || 'StartupsIndia',
      ageLimit: ev.ageLimit || '18yrs +',
      language: ev.language || 'English',
      genre: ev.genre || '',
      status: ev.status || 'upcoming',
      highlights: ev.highlights || [],
      outcomes: ev.outcomes || [],
      timeline: ev.timeline || [],
      speakers: ev.speakers || ev.artists || [],
      // Partners - stored as ObjectIds; openEdit gets the populated objects,
      // so extract _id for the multi-select state
      organizedBy: (ev.organizedBy || []).map(p => (typeof p === 'object' ? p._id : p)),
      supportingPartners: (ev.supportingPartners || []).map(p => (typeof p === 'object' ? p._id : p)),
      academicPartners: (ev.academicPartners || []).map(p => (typeof p === 'object' ? p._id : p)),
      sponsors: (ev.sponsors || []).map(p => (typeof p === 'object' ? p._id : p)),
      chiefGuests: (ev.chiefGuests || []).map(p => (typeof p === 'object' ? p._id : p)),
      specialGuests: (ev.specialGuests || []).map(p => (typeof p === 'object' ? p._id : p)),
    });
    setShowModal(true);
    loadPartnerLibrary();
  };

  const handleSave = async () => {
    if (!form.title) return;
    
    const payload = { ...form };
    // Convert rupees → paise before saving (legacy flat fields)
    payload.price = toPaise(form.price);
    payload.originalPrice = toPaise(form.originalPrice);
    payload.discountedPrice = toPaise(form.discountedPrice);
    payload.earlyBirdPrice = toPaise(form.earlyBirdPrice);

    // Convert ticket types: rupees → paise for all monetary fields
    payload.ticketTypes = (form.ticketTypes || []).map((t, i) => ({
      ...t,
      price: toPaise(t.price),
      originalPrice: toPaise(t.originalPrice),
      earlyBirdPrice: toPaise(t.earlyBirdPrice),
      earlyBirdDeadline: t.earlyBirdDeadline ? new Date(t.earlyBirdDeadline).toISOString() : null,
      sortOrder: i,
    }));

    // Convert coupons: flat discountValue rupees → paise; percent stays as-is
    payload.coupons = (form.coupons || []).map(c => ({
      ...c,
      code: (c.code || '').toUpperCase().trim(),
      discountValue: c.discountType === 'flat' ? toPaise(c.discountValue) : Number(c.discountValue || 0),
      validFrom: c.validFrom ? new Date(c.validFrom).toISOString() : null,
      validUntil: c.validUntil ? new Date(c.validUntil).toISOString() : null,
    }));

    // Auto-derive legacy price field from lowest active ticket so legacy
    // display code (events list page) still works.
    if (payload.ticketTypes.length > 0) {
      const activePrices = payload.ticketTypes
        .filter(t => t.isActive !== false && t.price > 0)
        .map(t => t.price);
      if (activePrices.length > 0) {
        payload.price = Math.min(...activePrices);
        payload.isPaid = true;
      }
    }

    // Normalise event date fields to full ISO instants. The inputs are
    // `datetime-local` (local wall-clock, no timezone); `new Date(str)` parses
    // that as LOCAL time and toISOString() gives the correct UTC instant. Sending
    // the raw timezone-less string would let the server guess the zone and could
    // shift the day. Empty strings become null.
    const toIso = v => (v ? new Date(v).toISOString() : null);
    payload.registrationStartDate = toIso(form.registrationStartDate);
    payload.registrationEndDate = toIso(form.registrationEndDate);
    payload.eventStartDate = toIso(form.eventStartDate);
    payload.eventEndDate = toIso(form.eventEndDate);

    // Make sure date field is set for backward compatibility
    payload.date = payload.eventStartDate || toIso(form.date) || new Date().toISOString();
    // Strip empty lines from bullet-point fields before saving
    payload.highlights = (form.highlights || []).filter(Boolean);
    payload.outcomes = (form.outcomes || []).filter(Boolean);
    
    if (editEvent) {
      await apiPatch(`/api/v1/admin/events/${editEvent._id}`, payload);
    } else {
      await apiPost('/api/v1/admin/events', payload);
    }
    setShowModal(false);
    load();
  };

  const handleDelete = async id => {
    if (!confirm('Delete this event?')) return;
    await apiDelete(`/api/v1/admin/events/${id}`);
    load();
  };

  const handleDuplicate = async id => {
    if (!confirm('Duplicate this event?')) return;
    await apiPost(`/api/v1/admin/events/${id}/duplicate`);
    load();
  };

  const toggleFeatured = async (id, currentVal) => {
    await apiPatch(`/api/v1/admin/events/${id}`, { featured: !currentVal });
    load();
  };

  const handleImageUpload = async (file, onUploadSuccess) => {
    try {
      setUploadingImage(true);
      const { data } = await apiPost('/api/v1/admin/upload-url', {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        folder: 'events',
      });

      if (!data || !data.uploadUrl) {
        throw new Error('Failed to get upload URL');
      }

      const uploadResponse = await fetch(data.uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (uploadResponse.ok) {
        onUploadSuccess(data.fileUrl || data.url);
      } else {
        throw new Error('Failed to upload file to S3');
      }
    } catch (error) {
      console.error('Upload Error:', error);
      alert('Failed to upload image. Please check your AWS credentials or try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="admin-page">
      <div
        className="admin-topbar"
        style={{
          margin: '-28px -28px 24px',
          padding: '18px 28px',
          background: '#fff',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Events & Webinars</h1>
        <button className="btn btn-primary" onClick={openCreate}>
          + New Event
        </button>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <select
          value={statusFilter}
          onChange={e => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          style={{
            padding: '8px 14px',
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            fontSize: 13,
            outline: 'none',
          }}
        >
          <option value="">All Status</option>
          <option value="upcoming">Upcoming</option>
          <option value="live">Live</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div className="admin-loading">
          <div className="admin-spinner" />
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Mode</th>
                <th>Category</th>
                <th>Event Date</th>
                <th>Price</th>
                <th>Reg.</th>
                <th>Status</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map(ev => (
                <tr key={ev._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {ev.coverImage ? (
                        <img 
                          src={ev.coverImage} 
                          alt={ev.title} 
                          style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover' }} 
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://images.unsplash.com/photo-1557683316-973673baf926?w=100&q=80";
                          }}
                        />
                      ) : (
                        <img 
                          src="https://images.unsplash.com/photo-1557683316-973673baf926?w=100&q=80" 
                          alt={ev.title} 
                          style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover' }}
                        />
                      )}
                      <div>
                        <div style={{ fontWeight: 600 }}>{ev.title}</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>{ev.subtitle}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${ev.mode === 'Online' ? 'badge-blue' : 'badge-orange'}`}>{ev.mode || 'Online'}</span>
                  </td>
                  <td>
                    <span className="badge badge-purple">{ev.category}</span>
                  </td>
                  <td style={{ fontSize: 12.5 }}>
                    {ev.eventStartDate || ev.date ? new Date(ev.eventStartDate || ev.date).toLocaleDateString() : 'TBD'}
                    <div style={{ fontSize: 11, color: '#64748b' }}>{ev.time || ''}</div>
                  </td>
                  <td>
                    {!ev.isPaid || ev.price === 0 ? (
                      <span style={{ color: '#10b981', fontWeight: 600 }}>Free</span>
                    ) : (
                      <span>₹{(ev.price / 100).toLocaleString('en-IN')}</span>
                    )}
                  </td>
                  <td>
                    {typeof ev.registrationCount === 'number'
                      ? ev.registrationCount
                      : ((ev.registrations || []).length + (ev.guestRegistrations || 0))}
                    {ev.maxAttendees ? `/${ev.maxAttendees}` : ''}
                  </td>
                  <td>
                    <span
                      className={`badge ${ev.status === 'upcoming' ? 'badge-blue' : ev.status === 'live' ? 'badge-green' : ev.status === 'completed' ? 'badge-gray' : 'badge-red'}`}
                    >
                      {ev.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      onClick={() => toggleFeatured(ev._id, ev.featured)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}
                    >
                      <span style={{ color: ev.featured ? '#f59e0b' : '#94a3b8' }}>
                        {ev.featured ? '⭐' : '☆'}
                      </span>
                    </button>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <Link href={`${ADMIN_BASE}/events/${ev._id}/registrations`} className="btn btn-primary btn-sm">
                        Regs
                      </Link>
                      <Link href={`${ADMIN_BASE}/events/${ev._id}/analytics`} className="btn btn-secondary btn-sm" style={{background: '#e0e7ff', color: '#4338ca'}}>
                        Stats
                      </Link>
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(ev)}>
                        Edit
                      </button>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleDuplicate(ev._id)}>
                        Dup
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(ev._id)}
                      >
                        Del
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>
                    No events yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {pages > 1 && (
            <div className="admin-pagination">
              <span>
                Page {page} of {pages}
              </span>
              <div className="pagination-btns">
                <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                  Previous
                </button>
                <button disabled={page >= pages} onClick={() => setPage(p => p + 1)}>
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="admin-modal"
            style={{ maxWidth: 800, maxHeight: '90vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="admin-modal-header">
              <h2>{editEvent ? 'Edit Event' : 'New Event'}</h2>
              <button className="admin-modal-close" onClick={() => setShowModal(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="admin-modal-body">
              <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: 8, marginBottom: 16 }}>Basic Information</h3>
              <div className="admin-form-group">
                <label>Event Title *</label>
                <input
                  value={form.title}
                  onChange={e => {
                    const title = e.target.value;
                    // Auto-fill slug from title only when slug hasn't been manually edited
                    const autoSlug = !form.slug || form.slug === slugify(form.title);
                    setForm({ ...form, title, slug: autoSlug ? slugify(title) : form.slug });
                  }}
                  placeholder="Event title"
                />
              </div>

              {/* Slug - auto-filled, manually editable */}
              <div className="admin-form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  URL Slug
                  <span style={{ fontSize: 11, fontWeight: 400, color: '#94a3b8' }}>
                    /events/<strong style={{ color: '#374151' }}>{form.slug || 'slug-will-appear-here'}</strong>
                  </span>
                </label>
                <input
                  value={form.slug}
                  onChange={e => setForm({ ...form, slug: slugify(e.target.value) })}
                  placeholder="auto-generated-from-title"
                  style={{ fontFamily: 'monospace', fontSize: 13 }}
                />
              </div>
              <div className="admin-form-group">
                <label>Event Subtitle / Tagline</label>
                <input
                  value={form.subtitle}
                  onChange={e => setForm({ ...form, subtitle: e.target.value })}
                  placeholder="Brief tagline"
                />
              </div>
              <div className="admin-form-group">
                <label>Event Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Event description"
                  rows={4}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="admin-form-group">
                  <label>Category *</label>
                  <select
                    value={form.category}
                    onChange={e => setForm({ ...form, category: e.target.value })}
                  >
                    <option value="workshop">Workshop</option>
                    <option value="hackathon">Hackathon</option>
                    <option value="meetup">Meetup</option>
                    <option value="startup pitch">Startup Pitch</option>
                    <option value="networking">Networking</option>
                    <option value="tech talk">Tech Talk</option>
                    <option value="competition">Competition</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Event Mode</label>
                  <select
                    value={form.mode}
                    onChange={e => setForm({ ...form, mode: e.target.value })}
                  >
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>
              </div>

              <div style={{ marginTop: 16, marginBottom: 18, padding: '14px 16px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#1e3a8a', marginBottom: 5 }}>How should people register?</div>
                <div style={{ fontSize: 11, color: '#475569', marginBottom: 10 }}>Choose whether attendees sign in or provide their contact details directly.</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', fontSize: 13, color: '#1e293b' }}>
                    <input type="radio" name="registrationType" checked={form.registrationType === 'login'} onChange={() => setForm({ ...form, registrationType: 'login' })} />
                    Login required
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', fontSize: 13, color: '#1e293b' }}>
                    <input type="radio" name="registrationType" checked={form.registrationType === 'guest'} onChange={() => setForm({ ...form, registrationType: 'guest' })} />
                    Name, email & mobile
                  </label>
                </div>
              </div>

              <div className="admin-form-group">
                <label>
                  Post-Registration Message
                  <span style={{ fontWeight: 400, color: '#94a3b8', fontSize: 11, marginLeft: 6 }}>
                    - shown after they register &amp; included in the confirmation email
                  </span>
                </label>
                <textarea
                  value={form.postRegistrationMessage}
                  onChange={e => setForm({ ...form, postRegistrationMessage: e.target.value })}
                  placeholder={'e.g. Thank you for registering! Join our WhatsApp group for updates: https://chat.whatsapp.com/xxxx'}
                  rows={3}
                />
              </div>

              {form.mode === 'Online' && (
                <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, marginBottom: 16 }}>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: 14 }}>Online Meeting Details</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12 }}>
                    <div className="admin-form-group" style={{ marginBottom: 0 }}>
                      <label>Meeting Platform</label>
                      <select value={form.meetingPlatform} onChange={e => setForm({...form, meetingPlatform: e.target.value})}>
                        <option value="">Select Platform</option>
                        <option value="Zoom">Zoom</option>
                        <option value="Google Meet">Google Meet</option>
                        <option value="Teams">Microsoft Teams</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="admin-form-group" style={{ marginBottom: 0 }}>
                      <label>Meeting Link</label>
                      <input value={form.meetingLink} onChange={e => setForm({...form, meetingLink: e.target.value})} placeholder="https://..." />
                    </div>
                  </div>
                </div>
              )}

              {form.mode === 'Offline' && (
                <div style={{ background: '#f8fafc', padding: 12, borderRadius: 8, marginBottom: 16 }}>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: 14 }}>Offline Venue Details</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div className="admin-form-group">
                      <label>Venue Name</label>
                      <input value={form.venueName} onChange={e => setForm({...form, venueName: e.target.value})} placeholder="e.g. ITC Grand Chola" />
                    </div>
                    <div className="admin-form-group">
                      <label>City</label>
                      <input value={form.city} onChange={e => setForm({...form, city: e.target.value})} placeholder="e.g. Chennai" />
                    </div>
                  </div>
                  <div className="admin-form-group">
                    <label>Full Address</label>
                    <input value={form.fullAddress} onChange={e => setForm({...form, fullAddress: e.target.value})} placeholder="Complete street address" />
                  </div>
                  <div className="admin-form-group" style={{ marginBottom: 0 }}>
                    <label>Google Maps Link</label>
                    <input value={form.googleMapsLink} onChange={e => setForm({...form, googleMapsLink: e.target.value})} placeholder="https://maps.google.com/..." />
                  </div>
                </div>
              )}

              <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: 8, marginBottom: 16, marginTop: 24 }}>Event Scheduling</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="admin-form-group">
                  <label>Registration Start Date</label>
                  <input type="datetime-local" value={form.registrationStartDate} onChange={e => setForm({ ...form, registrationStartDate: e.target.value })} />
                </div>
                <div className="admin-form-group">
                  <label>Registration End Date</label>
                  <input type="datetime-local" value={form.registrationEndDate} onChange={e => setForm({ ...form, registrationEndDate: e.target.value })} />
                </div>
                <div className="admin-form-group">
                  <label>Event Start Date *</label>
                  <input type="datetime-local" value={form.eventStartDate} onChange={e => setForm({ ...form, eventStartDate: e.target.value })} />
                </div>
                <div className="admin-form-group">
                  <label>Event End Date</label>
                  <input type="datetime-local" value={form.eventEndDate} onChange={e => setForm({ ...form, eventEndDate: e.target.value })} />
                </div>
                <div className="admin-form-group">
                  <label>Time</label>
                  <input type="text" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} placeholder="e.g. 2:00 PM - 5:00 PM" />
                </div>
                <div className="admin-form-group">
                  <label>Duration</label>
                  <input type="text" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 3 hours" />
                </div>
              </div>

              <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: 8, marginBottom: 16, marginTop: 24 }}>Pricing & Capacity</h3>
              <div style={{ display: 'flex', gap: 20, marginBottom: 16 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="radio" checked={!form.isPaid} onChange={() => setForm({...form, isPaid: false, ticketTypes: []})} />
                  Free Event
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="radio" checked={form.isPaid} onChange={() => setForm({...form, isPaid: true})} />
                  Paid Event
                </label>
              </div>

              {form.isPaid && (
                <div style={{ marginBottom: 16 }}>
                  {/* ── Ticket type rows ── */}
                  {(form.ticketTypes || []).map((ticket, idx) => (
                    <div key={idx} style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 14, marginBottom: 12, background: ticket.isActive ? '#f8fafc' : '#fafafa', opacity: ticket.isActive ? 1 : 0.6 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <span style={{ fontWeight: 700, fontSize: 13, color: '#1e293b' }}>Ticket #{idx + 1}{ticket.name ? ` - ${ticket.name}` : ''}</span>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, cursor: 'pointer' }}>
                            <input type="checkbox" checked={ticket.isActive !== false} onChange={e => {
                              const t = [...form.ticketTypes]; t[idx] = { ...t[idx], isActive: e.target.checked }; setForm({ ...form, ticketTypes: t });
                            }} />
                            Active
                          </label>
                          <button type="button" onClick={() => {
                            const t = form.ticketTypes.filter((_, i) => i !== idx);
                            setForm({ ...form, ticketTypes: t });
                          }} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 6, padding: '3px 10px', fontSize: 12, cursor: 'pointer', fontWeight: 700 }}>
                            Remove
                          </button>
                        </div>
                      </div>

                      {/* Row 1: name + description */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 10, marginBottom: 10 }}>
                        <div className="admin-form-group" style={{ marginBottom: 0 }}>
                          <label>Name *</label>
                          <input value={ticket.name} onChange={e => {
                            const t = [...form.ticketTypes]; t[idx] = { ...t[idx], name: e.target.value }; setForm({ ...form, ticketTypes: t });
                          }} placeholder="e.g. Student, Professional" />
                        </div>
                        <div className="admin-form-group" style={{ marginBottom: 0 }}>
                          <label>Description <span style={{ fontWeight: 400, color: '#94a3b8', fontSize: 11 }}>- each line = bullet</span></label>
                          <textarea
                            rows={3}
                            value={ticket.description || ''}
                            onChange={e => {
                              const t = [...form.ticketTypes]; t[idx] = { ...t[idx], description: e.target.value }; setForm({ ...form, ticketTypes: t });
                            }}
                            placeholder={'Perk 1\nPerk 2\nPerk 3'}
                            style={{ fontFamily: 'inherit', lineHeight: 1.6, fontSize: 12, resize: 'vertical' }}
                          />
                        </div>
                      </div>

                      {/* Row 2: price + original price + quota */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 10 }}>
                        <div className="admin-form-group" style={{ marginBottom: 0 }}>
                          <label>Price (₹) *</label>
                          <input type="number" min="0" value={ticket.price} onChange={e => {
                            const t = [...form.ticketTypes]; t[idx] = { ...t[idx], price: Number(e.target.value) }; setForm({ ...form, ticketTypes: t });
                          }} />
                        </div>
                        <div className="admin-form-group" style={{ marginBottom: 0 }}>
                          <label>Original Price (₹)</label>
                          <input type="number" min="0" value={ticket.originalPrice || 0} onChange={e => {
                            const t = [...form.ticketTypes]; t[idx] = { ...t[idx], originalPrice: Number(e.target.value) }; setForm({ ...form, ticketTypes: t });
                          }} placeholder="Crossed-out was-price" />
                        </div>
                        <div className="admin-form-group" style={{ marginBottom: 0 }}>
                          <label>Quota (0 = unlimited)</label>
                          <input type="number" min="0" value={ticket.quota || 0} onChange={e => {
                            const t = [...form.ticketTypes]; t[idx] = { ...t[idx], quota: Number(e.target.value) }; setForm({ ...form, ticketTypes: t });
                          }} />
                        </div>
                      </div>

                      {/* Row 3: early bird price + deadline */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                        <div className="admin-form-group" style={{ marginBottom: 0 }}>
                          <label>Early Bird Price (₹) - 0 to disable</label>
                          <input type="number" min="0" value={ticket.earlyBirdPrice || 0} onChange={e => {
                            const t = [...form.ticketTypes]; t[idx] = { ...t[idx], earlyBirdPrice: Number(e.target.value) }; setForm({ ...form, ticketTypes: t });
                          }} />
                        </div>
                        <div className="admin-form-group" style={{ marginBottom: 0 }}>
                          <label>Early Bird Deadline</label>
                          <input type="datetime-local" value={ticket.earlyBirdDeadline || ''} onChange={e => {
                            const t = [...form.ticketTypes]; t[idx] = { ...t[idx], earlyBirdDeadline: e.target.value }; setForm({ ...form, ticketTypes: t });
                          }} />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => setForm({
                      ...form,
                      ticketTypes: [...(form.ticketTypes || []), {
                        name: '', description: '', price: 0, originalPrice: 0,
                        earlyBirdPrice: 0, earlyBirdDeadline: '', quota: 0,
                        isActive: true, sortOrder: 0,
                      }]
                    })}
                    style={{ width: '100%', padding: '10px', border: '2px dashed #cbd5e1', borderRadius: 10, background: '#f8fafc', color: '#475569', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                  >
                    + Add Ticket Type
                  </button>

                  {/* Legacy fallback price - shown only when no ticket types exist */}
                  {(form.ticketTypes || []).length === 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, background: '#f0fdf4', padding: 12, borderRadius: 8, marginTop: 12 }}>
                      <div className="admin-form-group" style={{ marginBottom: 0 }}>
                        <label>Original Price (₹)</label>
                        <input type="number" value={form.originalPrice} onChange={e => setForm({ ...form, originalPrice: Number(e.target.value) })} min="0" />
                      </div>
                      <div className="admin-form-group" style={{ marginBottom: 0 }}>
                        <label>Selling Price (₹)</label>
                        <input type="number" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} min="0" />
                      </div>
                      <div className="admin-form-group" style={{ marginBottom: 0 }}>
                        <label>Early Bird Price (₹)</label>
                        <input type="number" value={form.earlyBirdPrice} onChange={e => setForm({ ...form, earlyBirdPrice: Number(e.target.value) })} min="0" />
                      </div>
                      <div className="admin-form-group" style={{ marginBottom: 0, gridColumn: 'span 3' }}>
                        <label>Coupon Code (Optional)</label>
                        <input type="text" value={form.couponCode} onChange={e => setForm({ ...form, couponCode: e.target.value })} placeholder="e.g. STARTUP50" />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── Event Coupons ─────────────────────────────────────── */}
              {form.isPaid && (
                <div style={{ marginTop: 8 }}>
                  <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: 8, marginBottom: 4 }}>Coupons</h3>
                  <p style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>
                    Each coupon can apply to one or more ticket types. Leave "Applicable Tickets" empty to apply to all.
                  </p>

                  {(form.coupons || []).map((coupon, cidx) => {
                    const ticketNames = (form.ticketTypes || []).map(t => t.name).filter(Boolean);
                    return (
                      <div key={cidx} style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 14, marginBottom: 12, background: coupon.isActive ? '#fafafa' : '#f8fafc', opacity: coupon.isActive ? 1 : 0.55 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                          <span style={{ fontWeight: 700, fontSize: 13, color: '#1e293b', fontFamily: 'monospace' }}>
                            {coupon.code || `Coupon #${cidx + 1}`}
                          </span>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, cursor: 'pointer' }}>
                              <input type="checkbox" checked={coupon.isActive !== false} onChange={e => {
                                const c = [...form.coupons]; c[cidx] = { ...c[cidx], isActive: e.target.checked }; setForm({ ...form, coupons: c });
                              }} />
                              Active
                            </label>
                            <button type="button" onClick={() => {
                              const c = form.coupons.filter((_, i) => i !== cidx);
                              setForm({ ...form, coupons: c });
                            }} style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 6, padding: '3px 10px', fontSize: 12, cursor: 'pointer', fontWeight: 700 }}>
                              Remove
                            </button>
                          </div>
                        </div>

                        {/* Row 1: code + discount type + discount value */}
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 10, marginBottom: 10 }}>
                          <div className="admin-form-group" style={{ marginBottom: 0 }}>
                            <label>Coupon Code *</label>
                            <input
                              value={coupon.code}
                              onChange={e => { const c = [...form.coupons]; c[cidx] = { ...c[cidx], code: e.target.value.toUpperCase().replace(/\s/g, '') }; setForm({ ...form, coupons: c }); }}
                              placeholder="e.g. EARLY20"
                              style={{ textTransform: 'uppercase', fontFamily: 'monospace', fontWeight: 700 }}
                            />
                          </div>
                          <div className="admin-form-group" style={{ marginBottom: 0 }}>
                            <label>Discount Type</label>
                            <select value={coupon.discountType} onChange={e => { const c = [...form.coupons]; c[cidx] = { ...c[cidx], discountType: e.target.value }; setForm({ ...form, coupons: c }); }}>
                              <option value="percent">Percent (%)</option>
                              <option value="flat">Flat (₹)</option>
                            </select>
                          </div>
                          <div className="admin-form-group" style={{ marginBottom: 0 }}>
                            <label>{coupon.discountType === 'percent' ? 'Discount (%)' : 'Discount (₹)'}</label>
                            <input
                              type="number" min="0"
                              max={coupon.discountType === 'percent' ? 100 : undefined}
                              value={coupon.discountValue || 0}
                              onChange={e => { const c = [...form.coupons]; c[cidx] = { ...c[cidx], discountValue: Number(e.target.value) }; setForm({ ...form, coupons: c }); }}
                            />
                          </div>
                        </div>

                        {/* Row 2: max uses + valid from + valid until */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 10 }}>
                          <div className="admin-form-group" style={{ marginBottom: 0 }}>
                            <label>Max Uses (0 = unlimited)</label>
                            <input type="number" min="0" value={coupon.maxUses || 0} onChange={e => { const c = [...form.coupons]; c[cidx] = { ...c[cidx], maxUses: Number(e.target.value) }; setForm({ ...form, coupons: c }); }} />
                            {coupon.usedCount > 0 && <span style={{ fontSize: 11, color: '#64748b' }}>Used {coupon.usedCount} time{coupon.usedCount !== 1 ? 's' : ''}</span>}
                          </div>
                          <div className="admin-form-group" style={{ marginBottom: 0 }}>
                            <label>Valid From</label>
                            <input type="datetime-local" value={coupon.validFrom || ''} onChange={e => { const c = [...form.coupons]; c[cidx] = { ...c[cidx], validFrom: e.target.value }; setForm({ ...form, coupons: c }); }} />
                          </div>
                          <div className="admin-form-group" style={{ marginBottom: 0 }}>
                            <label>Valid Until</label>
                            <input type="datetime-local" value={coupon.validUntil || ''} onChange={e => { const c = [...form.coupons]; c[cidx] = { ...c[cidx], validUntil: e.target.value }; setForm({ ...form, coupons: c }); }} />
                          </div>
                        </div>

                        {/* Row 3: applicable tickets - dynamic checkboxes from ticketTypes */}
                        <div className="admin-form-group" style={{ marginBottom: 0 }}>
                          <label>Applicable Tickets {ticketNames.length === 0 && <span style={{ fontSize: 11, color: '#94a3b8' }}>(add ticket types above first)</span>}</label>
                          {ticketNames.length > 0 ? (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
                              {ticketNames.map(name => {
                                const checked = (coupon.applicableTickets || []).includes(name);
                                return (
                                  <label key={name} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 20, border: `1.5px solid ${checked ? '#7A1F2B' : '#e2e8f0'}`, background: checked ? '#fef2f2' : '#f8fafc', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      onChange={e => {
                                        const c = [...form.coupons];
                                        const current = c[cidx].applicableTickets || [];
                                        c[cidx] = {
                                          ...c[cidx],
                                          applicableTickets: e.target.checked
                                            ? [...current, name]
                                            : current.filter(t => t !== name),
                                        };
                                        setForm({ ...form, coupons: c });
                                      }}
                                      style={{ accentColor: '#7A1F2B' }}
                                    />
                                    {name}
                                  </label>
                                );
                              })}
                              <span style={{ fontSize: 11, color: '#94a3b8', alignSelf: 'center' }}>
                                {(coupon.applicableTickets || []).length === 0 ? '(applies to all tickets)' : ''}
                              </span>
                            </div>
                          ) : (
                            <p style={{ fontSize: 12, color: '#94a3b8', margin: '4px 0 0' }}>No ticket types defined yet - this coupon will apply to all.</p>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => setForm({
                      ...form,
                      coupons: [...(form.coupons || []), {
                        code: '', discountType: 'percent', discountValue: 0,
                        maxUses: 0, usedCount: 0, validFrom: '', validUntil: '',
                        applicableTickets: [], isActive: true,
                      }],
                    })}
                    style={{ width: '100%', padding: '10px', border: '2px dashed #cbd5e1', borderRadius: 10, background: '#f8fafc', color: '#475569', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                  >
                    + Add Coupon
                  </button>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div className="admin-form-group">
                  <label>Max Attendees</label>
                  <input type="number" value={form.maxAttendees} onChange={e => setForm({ ...form, maxAttendees: Number(e.target.value) })} placeholder="0 for unlimited" />
                </div>
                <div className="admin-form-group" style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 10 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', margin: 0 }}>
                    <input type="checkbox" checked={form.waitlistEnabled} onChange={e => setForm({...form, waitlistEnabled: e.target.checked})} />
                    Enable Waitlist
                  </label>
                </div>
                <div className="admin-form-group" style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: 10 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', margin: 0 }}>
                    <input type="checkbox" checked={form.autoCloseRegistration} onChange={e => setForm({...form, autoCloseRegistration: e.target.checked})} />
                    Auto Close Reg. when full
                  </label>
                </div>
              </div>

              <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: 8, marginBottom: 16, marginTop: 24 }}>Event Content</h3>
              
              <div className="admin-form-group">
                <label>Cover Image</label>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploadingImage}
                    onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        handleImageUpload(e.target.files[0], url => setForm({ ...form, coverImage: url }));
                      }
                    }}
                    style={{ flex: 1 }}
                  />
                  {uploadingImage && <span style={{ fontSize: 12, color: '#666' }}>Uploading...</span>}
                  {form.coverImage && (
                    <img src={form.coverImage} alt="Cover Preview" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4 }} />
                  )}
                </div>
                <input style={{ marginTop: 8 }} value={form.coverImage} onChange={e => setForm({ ...form, coverImage: e.target.value })} placeholder="Or enter image URL https://..." />
              </div>

              <div className="admin-form-group">
                <label>Highlights <span style={{ fontWeight: 400, color: '#94a3b8', fontSize: 11 }}>- each line becomes a bullet point</span></label>
                <textarea
                  value={form.highlights?.join('\n') || ''}
                  onChange={e => setForm({ ...form, highlights: e.target.value.split('\n') })}
                  placeholder={'Key highlight 1\nKey highlight 2\nKey highlight 3'}
                  rows={5}
                  style={{ fontFamily: 'inherit', lineHeight: 1.6 }}
                />
              </div>

              <div className="admin-form-group">
                <label>Outcomes <span style={{ fontWeight: 400, color: '#94a3b8', fontSize: 11 }}>- each line becomes a bullet point</span></label>
                <textarea
                  value={form.outcomes?.join('\n') || ''}
                  onChange={e => setForm({ ...form, outcomes: e.target.value.split('\n') })}
                  placeholder={'Outcome 1\nOutcome 2\nOutcome 3'}
                  rows={5}
                  style={{ fontFamily: 'inherit', lineHeight: 1.6 }}
                />
              </div>

              <div className="admin-form-group">
                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Agenda / Timeline</span>
                  <button type="button" className="btn btn-sm" onClick={() => setForm({...form, timeline: [...(form.timeline || []), { time: '', title: '', description: '', speaker: '' }]})}>+ Add Agenda Item</button>
                </label>
                {(form.timeline || []).map((item, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 8, marginBottom: 8, background: '#f8fafc', padding: 12, borderRadius: 8 }}>
                    <input value={item.time} onChange={e => { const t = [...form.timeline]; t[idx].time = e.target.value; setForm({...form, timeline: t}); }} placeholder="Time (e.g. 10:00 AM)" />
                    <input value={item.title} onChange={e => { const t = [...form.timeline]; t[idx].title = e.target.value; setForm({...form, timeline: t}); }} placeholder="Session Title" />
                    <input style={{ gridColumn: 'span 2' }} value={item.speaker} onChange={e => { const t = [...form.timeline]; t[idx].speaker = e.target.value; setForm({...form, timeline: t}); }} placeholder="Speaker Name (Optional)" />
                    <button type="button" onClick={() => { const t = [...form.timeline]; t.splice(idx, 1); setForm({...form, timeline: t}); }} style={{ color: 'red', background: 'transparent', border: 'none', cursor: 'pointer', gridColumn: 'span 2', textAlign: 'right', fontSize: 12 }}>Remove Item</button>
                  </div>
                ))}
              </div>

              <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: 8, marginBottom: 16, marginTop: 24 }}>Speakers</h3>
              <div className="admin-form-group">
                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Event Speakers</span>
                  <button type="button" className="btn btn-sm" onClick={() => setForm({...form, speakers: [...(form.speakers || []), { name: '', role: '', company: '', photo: '', linkedinProfile: '', bio: '' }]})}>+ Add Speaker</button>
                </label>
                {(form.speakers || []).map((speaker, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12, background: '#f8fafc', padding: 12, borderRadius: 8 }}>
                    <input value={speaker.name} onChange={e => { const s = [...form.speakers]; s[idx].name = e.target.value; setForm({...form, speakers: s}); }} placeholder="Name" />
                    <input value={speaker.role} onChange={e => { const s = [...form.speakers]; s[idx].role = e.target.value; setForm({...form, speakers: s}); }} placeholder="Role / Title" />
                    <input value={speaker.company} onChange={e => { const s = [...form.speakers]; s[idx].company = e.target.value; setForm({...form, speakers: s}); }} placeholder="Company" />
                    <input value={speaker.linkedinProfile} onChange={e => { const s = [...form.speakers]; s[idx].linkedinProfile = e.target.value; setForm({...form, speakers: s}); }} placeholder="LinkedIn URL" />
                    
                    <div style={{ gridColumn: 'span 2', display: 'flex', gap: 10, alignItems: 'center' }}>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploadingImage}
                        onChange={e => {
                          if (e.target.files && e.target.files[0]) {
                            handleImageUpload(e.target.files[0], url => {
                              const s = [...form.speakers];
                              s[idx].photo = url;
                              setForm({ ...form, speakers: s });
                            });
                          }
                        }}
                      />
                      {speaker.photo && (
                        <img src={speaker.photo} alt="Preview" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 20 }} />
                      )}
                      <input style={{ flex: 1 }} value={speaker.photo} onChange={e => { const s = [...form.speakers]; s[idx].photo = e.target.value; setForm({...form, speakers: s}); }} placeholder="Or enter photo URL" />
                    </div>

                    <textarea style={{ gridColumn: 'span 2' }} value={speaker.bio} onChange={e => { const s = [...form.speakers]; s[idx].bio = e.target.value; setForm({...form, speakers: s}); }} placeholder="Short Bio" rows={2} />
                    <button type="button" onClick={() => { const s = [...form.speakers]; s.splice(idx, 1); setForm({...form, speakers: s}); }} style={{ color: 'red', background: 'transparent', border: 'none', cursor: 'pointer', gridColumn: 'span 2', textAlign: 'right', fontSize: 12 }}>Remove Speaker</button>
                  </div>
                ))}
              </div>

              <div className="admin-form-group" style={{ marginTop: 24, padding: 16, background: '#fffbeb', borderRadius: 8, border: '1px solid #fde68a' }}>
                <label>Status</label>
                <select
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}
                  style={{ width: '100%', padding: 8 }}
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="live">Live</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* ── Organizer & Partners ──────────────────────────────────── */}
              <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: 8, marginBottom: 16, marginTop: 24 }}>Organizer & Partners</h3>
              <p style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>
                Select from the shared partners library. Each entry is stored once and reused across events.{' '}
                <Link href={`/${process.env.NEXT_PUBLIC_ADMIN_SLUG || 'ctrl-x9k2m3-panel'}/event-partners`} target="_blank" style={{ color: '#7A1F2B', fontWeight: 700 }}>
                  Manage library ↗
                </Link>
              </p>

              {/* Helper: multi-select pills for a partner category */}
              {[
                { key: 'organizedBy',       label: 'Organized By',         color: '#eff6ff', border: '#bfdbfe', badge: '#1d4ed8' },
                { key: 'chiefGuests',       label: 'Chief Guests',         color: '#fff1f2', border: '#fecdd3', badge: '#be123c' },
                { key: 'specialGuests',     label: 'Special Guests',       color: '#fff7ed', border: '#fed7aa', badge: '#c2410c' },
                { key: 'supportingPartners', label: 'Supporting Partners',  color: '#f0fdf4', border: '#bbf7d0', badge: '#15803d' },
                { key: 'academicPartners',   label: 'Academic Partners',    color: '#fdf4ff', border: '#e9d5ff', badge: '#7e22ce' },
                { key: 'sponsors',           label: 'Sponsors',             color: '#fffbeb', border: '#fde68a', badge: '#b45309' },
              ].map(({ key, label, color, border, badge }) => {
                const selectedIds = form[key] || [];
                const available = partnerLibrary.filter(p => !selectedIds.includes(p._id));
                return (
                  <div key={key} className="admin-form-group" style={{ background: color, border: `1px solid ${border}`, borderRadius: 10, padding: 14, marginBottom: 14 }}>
                    <label style={{ fontWeight: 700, fontSize: 13 }}>{label}</label>

                    {/* Selected pills */}
                    {selectedIds.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                        {selectedIds.map(id => {
                          const p = partnerLibrary.find(x => x._id === id);
                          if (!p) return null;
                          return (
                            <span key={id} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fff', border: `1px solid ${border}`, borderRadius: 20, padding: '4px 10px', fontSize: 12, fontWeight: 600 }}>
                              {p.logo && <img src={p.logo} alt="" style={{ width: 16, height: 16, borderRadius: '50%', objectFit: 'contain' }} />}
                              {p.name}
                              <button type="button" onClick={() => setForm({ ...form, [key]: selectedIds.filter(x => x !== id) })}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontWeight: 900, fontSize: 14, lineHeight: 1, padding: 0 }}>×</button>
                            </span>
                          );
                        })}
                      </div>
                    )}

                    {/* Dropdown to add */}
                    <select
                      value=""
                      onChange={e => {
                        if (e.target.value) setForm({ ...form, [key]: [...selectedIds, e.target.value] });
                      }}
                      style={{ width: '100%', padding: '7px 10px', borderRadius: 7, border: `1px solid ${border}`, fontSize: 13, background: '#fff' }}
                    >
                      <option value="">+ Select {label.toLowerCase()}…</option>
                      {available.map(p => (
                        <option key={p._id} value={p._id}>{p.name}</option>
                      ))}
                    </select>

                    {/* Quick-add new partner to library inline */}
                    {quickPartner?.for !== key ? (
                      <button type="button" onClick={() => setQuickPartner({ for: key, name: '', logo: '', website: '', description: '', type: key === 'organizedBy' ? 'organizer' : key === 'sponsors' ? 'sponsor' : key === 'academicPartners' ? 'academic' : key === 'chiefGuests' ? 'chiefGuest' : key === 'specialGuests' ? 'specialGuest' : 'supporting' })}
                        style={{ marginTop: 8, background: 'none', border: 'none', color: badge, cursor: 'pointer', fontSize: 12, fontWeight: 700, padding: 0 }}>
                        + Add new to library
                      </button>
                    ) : (
                      <div style={{ marginTop: 10, background: '#fff', border: `1px solid ${border}`, borderRadius: 8, padding: 12 }}>
                        <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 8, color: badge }}>
                          {(key === 'chiefGuests' || key === 'specialGuests') ? 'New guest (saves to shared library)' : 'New partner (saves to shared library)'}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr', gap: 8, marginBottom: 8 }}>
                          <input placeholder="Name *" value={quickPartner.name} onChange={e => setQuickPartner({ ...quickPartner, name: e.target.value })} style={{ padding: '6px 9px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 12 }} />
                          <input placeholder={(key === 'chiefGuests' || key === 'specialGuests') ? 'Photo URL' : 'Logo URL'} value={quickPartner.logo} onChange={e => setQuickPartner({ ...quickPartner, logo: e.target.value })} style={{ padding: '6px 9px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 12 }} />
                          <input placeholder="Website" value={quickPartner.website} onChange={e => setQuickPartner({ ...quickPartner, website: e.target.value })} style={{ padding: '6px 9px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 12 }} />
                        </div>
                        <input
                          placeholder={(key === 'chiefGuests' || key === 'specialGuests') ? 'Role / Designation (e.g. Minister of IT, Govt. of Telangana)' : 'Short description (optional)'}
                          value={quickPartner.description || ''}
                          onChange={e => setQuickPartner({ ...quickPartner, description: e.target.value })}
                          style={{ width: '100%', boxSizing: 'border-box', padding: '6px 9px', borderRadius: 6, border: '1px solid #e2e8f0', fontSize: 12, marginBottom: 8 }}
                        />
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button type="button"
                            onClick={async () => {
                              if (!quickPartner.name.trim()) return alert('Name is required');
                              const { data, error } = await apiPost('/api/v1/admin/event-partners', quickPartner);
                              if (error) return alert(error.message);
                              await loadPartnerLibrary();
                              setForm(f => ({ ...f, [key]: [...(f[key] || []), data._id] }));
                              setQuickPartner(null);
                            }}
                            style={{ background: badge, color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                            Save & Add
                          </button>
                          <button type="button" onClick={() => setQuickPartner(null)}
                            style={{ background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: 6, padding: '6px 12px', fontSize: 12, cursor: 'pointer' }}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

            </div>
            <div className="admin-modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
                {editEvent ? 'Update Event' : 'Create Event'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
