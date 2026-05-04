'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiGet, apiPost, apiPatch, apiDelete } from '@/lib/api';

export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'workshops',
    type: 'workshop',
    date: '',
    endDate: '',
    time: '',
    duration: '',
    venue: 'Online',
    location: '',
    locationUrl: '',
    meetingLink: '',
    coverImage: '',
    images: [],
    price: 0,
    originalPrice: 0,
    priceLabel: 'Free',
    maxAttendees: 0,
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
    artists: [],
  });

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
    setForm({
      title: '',
      description: '',
      category: 'workshops',
      type: 'workshop',
      date: '',
      endDate: '',
      time: '',
      duration: '',
      venue: 'Online',
      location: '',
      locationUrl: '',
      meetingLink: '',
      coverImage: '',
      images: [],
      price: 0,
      originalPrice: 0,
      priceLabel: 'Free',
      maxAttendees: 0,
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
      artists: [],
    });
    setShowModal(true);
  };

  const openEdit = ev => {
    setEditEvent(ev);
    setForm({
      title: ev.title || '',
      description: ev.description || '',
      category: ev.category || 'workshops',
      type: ev.type || 'workshop',
      date: ev.date ? new Date(ev.date).toISOString().slice(0, 16) : '',
      endDate: ev.endDate ? new Date(ev.endDate).toISOString().slice(0, 16) : '',
      time: ev.time || '',
      duration: ev.duration || '',
      venue: ev.venue || 'Online',
      location: ev.location || '',
      locationUrl: ev.locationUrl || '',
      meetingLink: ev.meetingLink || '',
      coverImage: ev.coverImage || '',
      images: ev.images || [],
      price: ev.price || 0,
      originalPrice: ev.originalPrice || 0,
      priceLabel: ev.priceLabel || 'Free',
      maxAttendees: ev.maxAttendees || 0,
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
      artists: ev.artists || [],
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.date) return;
    if (editEvent) {
      await apiPatch(`/api/v1/admin/events/${editEvent._id}`, form);
    } else {
      await apiPost('/api/v1/admin/events', form);
    }
    setShowModal(false);
    load();
  };

  const handleDelete = async id => {
    if (!confirm('Delete this event?')) return;
    await apiDelete(`/api/v1/admin/events/${id}`);
    load();
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
                <th>Title</th>
                <th>Category</th>
                <th>Date</th>
                <th>Time</th>
                <th>Location</th>
                <th>Price</th>
                <th>Registrations</th>
                <th>Status</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map(ev => (
                <tr key={ev._id}>
                  <td style={{ fontWeight: 600 }}>{ev.title}</td>
                  <td>
                    <span className="badge badge-purple">{ev.category}</span>
                  </td>
                  <td style={{ fontSize: 12.5 }}>{new Date(ev.date).toLocaleDateString()}</td>
                  <td style={{ fontSize: 12 }}>{ev.time || 'TBD'}</td>
                  <td style={{ color: '#64748b', fontSize: 12 }}>
                    {ev.venue || ev.location || 'Online'}
                  </td>
                  <td>
                    {ev.price === 0 ? (
                      <span style={{ color: '#10b981', fontWeight: 600 }}>Free</span>
                    ) : (
                      <span>₹{ev.price}</span>
                    )}
                  </td>
                  <td>
                    {(ev.registrations || []).length}
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
                    <span style={{ color: ev.featured ? '#f59e0b' : '#94a3b8' }}>
                      {ev.featured ? '⭐' : '☆'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(ev)}>
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(ev._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>
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
            style={{ maxWidth: 700, maxHeight: '90vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="admin-modal-header">
              <h2>{editEvent ? 'Edit Event' : 'New Event'}</h2>
              <button className="admin-modal-close" onClick={() => setShowModal(false)}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="admin-modal-body">
              <div className="admin-form-group">
                <label>Title *</label>
                <input
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="Event title"
                />
              </div>

              <div className="admin-form-group">
                <label>Description</label>
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
                    <option value="workshops">Workshops</option>
                    <option value="webinars">Webinars</option>
                    <option value="meetups">Meetups</option>
                    <option value="conferences">Conferences</option>
                    <option value="networking">Networking</option>
                    <option value="entertainment">Entertainment</option>
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Status</label>
                  <select
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value })}
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="live">Live</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="admin-form-group">
                  <label>Date *</label>
                  <input
                    type="datetime-local"
                    value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                  />
                </div>
                <div className="admin-form-group">
                  <label>End Date</label>
                  <input
                    type="datetime-local"
                    value={form.endDate}
                    onChange={e => setForm({ ...form, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="admin-form-group">
                  <label>Time</label>
                  <input
                    type="text"
                    value={form.time}
                    onChange={e => setForm({ ...form, time: e.target.value })}
                    placeholder="e.g. 2:00 PM - 5:00 PM"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Duration</label>
                  <input
                    type="text"
                    value={form.duration}
                    onChange={e => setForm({ ...form, duration: e.target.value })}
                    placeholder="e.g. 3 hours"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="admin-form-group">
                  <label>Venue</label>
                  <input
                    value={form.venue}
                    onChange={e => setForm({ ...form, venue: e.target.value })}
                    placeholder="Event venue"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Location</label>
                  <input
                    value={form.location}
                    onChange={e => setForm({ ...form, location: e.target.value })}
                    placeholder="City/Address"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="admin-form-group">
                  <label>Cover Image URL</label>
                  <input
                    value={form.coverImage}
                    onChange={e => setForm({ ...form, coverImage: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div className="admin-form-group">
                  <label>Meeting Link</label>
                  <input
                    type="url"
                    value={form.meetingLink}
                    onChange={e => setForm({ ...form, meetingLink: e.target.value })}
                    placeholder="Zoom/Google Meet link"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div className="admin-form-group">
                  <label>Price (₹)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={e => setForm({ ...form, price: Number(e.target.value) })}
                    min="0"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Original Price (₹)</label>
                  <input
                    type="number"
                    value={form.originalPrice}
                    onChange={e => setForm({ ...form, originalPrice: Number(e.target.value) })}
                    min="0"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Max Attendees</label>
                  <input
                    type="number"
                    value={form.maxAttendees}
                    onChange={e => setForm({ ...form, maxAttendees: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="admin-form-group">
                <label>Meeting Link</label>
                <input
                  value={form.meetingLink}
                  onChange={e => setForm({ ...form, meetingLink: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="admin-form-group">
                <label>Status</label>
                <select
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="live">Live</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label>Highlights (One per line)</label>
                <textarea
                  value={form.highlights?.join('\n') || ''}
                  onChange={e => setForm({ ...form, highlights: e.target.value.split('\n').filter(Boolean) })}
                  placeholder="Key highlights..."
                  rows={3}
                />
              </div>

              <div className="admin-form-group">
                <label>Outcomes (One per line)</label>
                <textarea
                  value={form.outcomes?.join('\n') || ''}
                  onChange={e => setForm({ ...form, outcomes: e.target.value.split('\n').filter(Boolean) })}
                  placeholder="Learning outcomes..."
                  rows={3}
                />
              </div>

              <div className="admin-form-group">
                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Timeline</span>
                  <button type="button" className="btn btn-sm" onClick={() => setForm({...form, timeline: [...(form.timeline || []), { time: '', title: '', description: '' }]})}>+ Add Item</button>
                </label>
                {(form.timeline || []).map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: 8, marginBottom: 8, background: '#f8fafc', padding: 8, borderRadius: 8 }}>
                    <input style={{ flex: 1 }} value={item.time} onChange={e => { const t = [...form.timeline]; t[idx].time = e.target.value; setForm({...form, timeline: t}); }} placeholder="Time (e.g. 10:00 AM)" />
                    <input style={{ flex: 1.5 }} value={item.title} onChange={e => { const t = [...form.timeline]; t[idx].title = e.target.value; setForm({...form, timeline: t}); }} placeholder="Title" />
                    <input style={{ flex: 2 }} value={item.description} onChange={e => { const t = [...form.timeline]; t[idx].description = e.target.value; setForm({...form, timeline: t}); }} placeholder="Description" />
                    <button type="button" onClick={() => { const t = [...form.timeline]; t.splice(idx, 1); setForm({...form, timeline: t}); }} style={{ color: 'red', background: 'transparent', border: 'none', cursor: 'pointer' }}>X</button>
                  </div>
                ))}
              </div>

              <div className="admin-form-group">
                <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Speakers / Artists</span>
                  <button type="button" className="btn btn-sm" onClick={() => setForm({...form, artists: [...(form.artists || []), { name: '', role: '', image: '', bio: '' }]})}>+ Add Speaker</button>
                </label>
                {(form.artists || []).map((artist, idx) => (
                  <div key={idx} style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8, background: '#f8fafc', padding: 8, borderRadius: 8 }}>
                    <input style={{ flex: '1 1 45%' }} value={artist.name} onChange={e => { const a = [...form.artists]; a[idx].name = e.target.value; setForm({...form, artists: a}); }} placeholder="Name" />
                    <input style={{ flex: '1 1 45%' }} value={artist.role} onChange={e => { const a = [...form.artists]; a[idx].role = e.target.value; setForm({...form, artists: a}); }} placeholder="Role" />
                    <input style={{ flex: '1 1 45%' }} value={artist.image} onChange={e => { const a = [...form.artists]; a[idx].image = e.target.value; setForm({...form, artists: a}); }} placeholder="Image URL" />
                    <input style={{ flex: '1 1 45%' }} value={artist.bio} onChange={e => { const a = [...form.artists]; a[idx].bio = e.target.value; setForm({...form, artists: a}); }} placeholder="Bio (Short)" />
                    <button type="button" onClick={() => { const a = [...form.artists]; a.splice(idx, 1); setForm({...form, artists: a}); }} style={{ color: 'red', background: 'transparent', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'right' }}>Remove Speaker</button>
                  </div>
                ))}
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
                {editEvent ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
