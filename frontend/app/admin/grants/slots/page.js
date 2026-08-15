'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CalendarClock, ChevronLeft, ChevronRight, Users, CheckCircle2 } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { adminUrl } from '@/lib/grantsAdmin';

function toYMD(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const BASE = '/api/v1/admin/grants';

export default function AdminSlotsPage() {
  const [weekStart, setWeekStart] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const [selectedDate, setSelectedDate] = useState(toYMD(new Date()));
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [saving, setSaving] = useState(false);
  const [flash, setFlash] = useState('');
  const [bookings, setBookings] = useState([]);
  const [tab, setTab] = useState('manage'); // 'manage' | 'bookings'

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const loadSlots = useCallback(async (date) => {
    setLoadingSlots(true);
    const { data } = await apiFetch(`${BASE}/slots?date=${date}`);
    setSlots(data?.slots || []);
    setLoadingSlots(false);
  }, []);

  const loadBookings = useCallback(async () => {
    const { data } = await apiFetch(`${BASE}/slots/bookings?limit=50`);
    setBookings(Array.isArray(data) ? data : []);
  }, []);

  useEffect(() => { loadSlots(selectedDate); }, [selectedDate, loadSlots]);
  useEffect(() => { if (tab === 'bookings') loadBookings(); }, [tab, loadBookings]);

  const toggleBlocked = (time) => {
    setSlots(prev => prev.map(s =>
      s.time === time ? { ...s, blocked: !s.blocked } : s
    ));
  };

  const saveBlocked = async () => {
    setSaving(true);
    const blockedTimes = slots.filter(s => s.blocked).map(s => s.time);
    const unblockedTimes = slots.filter(s => !s.blocked).map(s => s.time);

    await Promise.all([
      blockedTimes.length && apiFetch(`${BASE}/slots`, {
        method: 'PATCH',
        body: JSON.stringify({ date: selectedDate, times: blockedTimes, blocked: true }),
      }),
      unblockedTimes.length && apiFetch(`${BASE}/slots`, {
        method: 'PATCH',
        body: JSON.stringify({ date: selectedDate, times: unblockedTimes, blocked: false }),
      }),
    ].filter(Boolean));

    setSaving(false);
    setFlash('Availability saved for ' + new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }));
    setTimeout(() => setFlash(''), 3000);
    loadSlots(selectedDate);
  };

  const card = {
    background: '#fff', border: '1px solid #f0f0f0',
    borderRadius: '16px', padding: '20px',
  };

  return (
    <div style={{ padding: '28px 28px 80px', maxWidth: 960, margin: '0 auto' }}>
      <Link
        href={adminUrl('/grants')}
        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#6b7280', fontSize: '13.5px', fontWeight: 600, textDecoration: 'none', marginBottom: '18px' }}
      >
        <ArrowLeft size={15} /> Grant Applications
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
        <CalendarClock size={22} color="#ef4444" />
        <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#111827', margin: 0 }}>
          1:1 Slot Management
        </h1>
      </div>
      <p style={{ margin: '0 0 20px', fontSize: '14px', color: '#6b7280' }}>
        Office hours: <strong>11:00 AM – 5:00 PM</strong>, Mon–Sat. Deselect slots you're busy on - the rest are bookable by applicants.
      </p>

      {flash && (
        <div style={{ padding: '11px 16px', marginBottom: '14px', background: '#f0fdf4', border: '1px solid #dcfce7', borderRadius: '12px', color: '#047857', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={15} /> {flash}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {[['manage', 'Manage Availability'], ['bookings', 'All Bookings']].map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            style={{
              padding: '9px 18px', borderRadius: '100px',
              border: `1.5px solid ${tab === id ? '#ef4444' : '#e5e7eb'}`,
              background: tab === id ? '#fef2f2' : '#fff',
              color: tab === id ? '#ef4444' : '#6b7280',
              fontWeight: 700, fontSize: '13px', cursor: 'pointer',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'manage' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Calendar */}
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <button
                type="button"
                onClick={() => setWeekStart(d => addDays(d, -7))}
                style={{ width: '30px', height: '30px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <ChevronLeft size={15} />
              </button>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>
                {MONTHS[weekStart.getMonth()]} {weekStart.getFullYear()}
              </span>
              <button
                type="button"
                onClick={() => setWeekStart(d => addDays(d, 7))}
                style={{ width: '30px', height: '30px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <ChevronRight size={15} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '5px' }}>
              {weekDays.map(day => {
                const ymd = toYMD(day);
                const isSunday = day.getDay() === 0;
                const sel = selectedDate === ymd;
                return (
                  <button
                    key={ymd}
                    type="button"
                    disabled={isSunday}
                    onClick={() => !isSunday && setSelectedDate(ymd)}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      padding: '7px 3px', borderRadius: '10px', border: 'none', fontFamily: 'inherit',
                      background: sel ? 'linear-gradient(135deg, #e63946, #dc2626)' : isSunday ? '#f9fafb' : '#f3f4f6',
                      color: sel ? '#fff' : isSunday ? '#d1d5db' : '#111827',
                      cursor: isSunday ? 'default' : 'pointer',
                    }}
                  >
                    <span style={{ fontSize: '9px', fontWeight: 700, marginBottom: '2px', opacity: isSunday ? 0.4 : 1 }}>
                      {DAYS[day.getDay()]}
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: 800 }}>{day.getDate()}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Slot grid */}
          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#111827' }}>
                  {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
                </p>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9ca3af' }}>
                  Click to toggle availability · Grey = blocked · Green = available · Blue = booked
                </p>
              </div>
            </div>

            {loadingSlots ? (
              <p style={{ color: '#9ca3af', fontSize: '13.5px' }}>Loading…</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '16px' }}>
                {slots.map(slot => {
                  const isBooked = Boolean(slot.bookedBy);
                  const bg = isBooked
                    ? '#eff6ff'
                    : slot.blocked ? '#f3f4f6' : '#f0fdf4';
                  const border = isBooked
                    ? '#bfdbfe'
                    : slot.blocked ? '#e5e7eb' : '#bbf7d0';
                  const color = isBooked ? '#1d4ed8' : slot.blocked ? '#9ca3af' : '#047857';

                  return (
                    <button
                      key={slot.time}
                      type="button"
                      disabled={isBooked}
                      onClick={() => !isBooked && toggleBlocked(slot.time)}
                      style={{
                        padding: '10px 6px', borderRadius: '10px',
                        border: `1.5px solid ${border}`,
                        background: bg, color,
                        fontFamily: 'inherit', fontSize: '13px', fontWeight: 700,
                        cursor: isBooked ? 'default' : 'pointer',
                        textAlign: 'center',
                      }}
                      title={isBooked ? `Booked by ${slot.bookedBy?.fullName || 'user'}` : slot.blocked ? 'Blocked - click to unblock' : 'Available - click to block'}
                    >
                      {slot.time}
                      {isBooked && (
                        <>
                          <span style={{ display: 'block', fontSize: '9px', marginTop: '2px', opacity: 0.8 }}>BOOKED</span>
                          <span style={{ display: 'block', fontSize: '9px', marginTop: '2px', opacity: 0.9, lineHeight: 1.2 }}>
                            {slot.bookedBy?.fullName || 'User'}
                          </span>
                        </>
                      )}
                      {!isBooked && slot.blocked && <span style={{ display: 'block', fontSize: '9px', marginTop: '2px', opacity: 0.7 }}>BLOCKED</span>}
                    </button>
                  );
                })}
              </div>
            )}

            <button
              type="button"
              onClick={saveBlocked}
              disabled={saving || loadingSlots}
              style={{
                width: '100%', padding: '11px', borderRadius: '10px', border: 'none',
                background: (saving || loadingSlots) ? '#f3f4f6' : 'linear-gradient(135deg, #e63946, #dc2626)',
                color: (saving || loadingSlots) ? '#9ca3af' : '#fff',
                fontWeight: 700, fontSize: '13.5px',
                cursor: (saving || loadingSlots) ? 'default' : 'pointer',
              }}
            >
              {saving ? 'Saving…' : 'Save Availability'}
            </button>
          </div>
        </div>
      )}

      {tab === 'bookings' && (
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Users size={18} color="#6b7280" />
            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#111827' }}>
              All Booked Slots ({bookings.length})
            </h2>
          </div>

          {bookings.length === 0 ? (
            <p style={{ margin: 0, fontSize: '14px', color: '#9ca3af' }}>No slots booked yet.</p>
          ) : (
            <div style={{ display: 'grid', gap: '10px' }}>
              {bookings.map((b, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '14px 16px', background: '#fafafa',
                  border: '1px solid #f0f0f0', borderRadius: '12px',
                }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '10px',
                    background: '#eff6ff', border: '1px solid #bfdbfe',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <CalendarClock size={18} color="#1d4ed8" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: '0 0 2px', fontSize: '14.5px', fontWeight: 700, color: '#111827' }}>
                      {b.bookedBy?.fullName || 'User'}
                      {b.applicationId?.startup?.name && (
                        <span style={{ marginLeft: '8px', fontSize: '12px', color: '#9ca3af', fontWeight: 500 }}>
                          · {b.applicationId.startup.name}
                        </span>
                      )}
                    </p>
                    <p style={{ margin: 0, fontSize: '12.5px', color: '#6b7280' }}>
                      {new Date(b.date + 'T12:00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                      {' '} at <strong>{b.time}</strong>
                      {b.applicationId?.applicationId && (
                        <span style={{ marginLeft: '8px' }}>· {b.applicationId.applicationId}</span>
                      )}
                    </p>
                    {b.bookedBy?.email && (
                      <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#9ca3af' }}>
                        {b.bookedBy.email}
                      </p>
                    )}
                  </div>
                  {b.applicationId?._id && (
                    <Link
                      href={adminUrl(`/grants/${b.applicationId._id}`)}
                      style={{ fontSize: '12.5px', fontWeight: 700, color: '#ef4444', textDecoration: 'none', whiteSpace: 'nowrap' }}
                    >
                      View →
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
