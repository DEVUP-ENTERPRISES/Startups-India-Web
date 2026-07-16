'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Search, Rocket, Settings as SettingsIcon, ClipboardCheck, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { getGrantStats, listGrantApplications, getStatusMachine, adminUrl } from '@/lib/grantsAdmin';
import StatusBadge from '@/components/grants/StatusBadge';

const card = {
  padding: '18px 20px',
  background: '#fff',
  border: '1px solid #f0f0f0',
  borderRadius: '16px',
};

const input = {
  padding: '10px 12px',
  border: '1.5px solid #e5e7eb',
  borderRadius: '10px',
  fontSize: '13.5px',
  color: '#111827',
  outline: 'none',
  background: '#fff',
  fontFamily: 'inherit',
};

function StatTile({ label, value, tone = '#111827' }) {
  return (
    <div style={card}>
      <p style={{ margin: '0 0 6px', fontSize: '11.5px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
        {label}
      </p>
      <p style={{ margin: 0, fontSize: '26px', fontWeight: 900, color: tone, lineHeight: 1 }}>
        {value ?? 0}
      </p>
    </div>
  );
}

function Rows({ n = 6 }) {
  return [...Array(n)].map((_, i) => (
    <div
      key={i}
      style={{
        height: '58px',
        marginBottom: '8px',
        background: 'linear-gradient(90deg,#f3f4f6 25%,#e9eaec 50%,#f3f4f6 75%)',
        backgroundSize: '200% 100%',
        animation: 'gShimmer 1.4s infinite',
        borderRadius: '12px',
      }}
    />
  ));
}

export default function AdminGrantsPage() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [machine, setMachine] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    const { data: res, error: err } = await listGrantApplications({
      search, status, page, limit: 20,
    });
    if (err) {
      setError(err.message || 'Could not load applications.');
      return;
    }
    setData(res);
  }, [search, status, page]);

  useEffect(() => {
    (async () => {
      const [{ data: s }, { data: m }] = await Promise.all([getGrantStats(), getStatusMachine()]);
      setStats(s);
      setMachine(m);
    })();
  }, []);

  // Debounced so typing in the search box doesn't fire a request per keystroke.
  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  return (
    <div style={{ padding: '32px 28px 80px', maxWidth: 1280, margin: '0 auto' }}>
      <style>{`@keyframes gShimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '26px', fontWeight: 900, color: '#111827', margin: '0 0 4px' }}>
            <Rocket size={24} color="#ef4444" /> Startup Grant Applications
          </h1>
          <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
            Review, shortlist and progress grant applications.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link href={adminUrl('/grants/evaluations')} style={{ ...input, display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: '#374151', textDecoration: 'none' }}>
            <ClipboardCheck size={15} /> Evaluations
          </Link>
          <Link href={adminUrl('/grants/settings')} style={{ ...input, display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: '#374151', textDecoration: 'none' }}>
            <SettingsIcon size={15} /> Settings
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: '12px', marginBottom: '22px' }}>
        <StatTile label="Total" value={stats?.total} />
        <StatTile label="Pending" value={stats?.pending} tone="#1d4ed8" />
        <StatTile label="Under Review" value={stats?.underReview} tone="#1d4ed8" />
        <StatTile label="Selected" value={stats?.selected} tone="#047857" />
        <StatTile label="Rejected" value={stats?.rejected} tone="#b91c1c" />
        <StatTile label="Grant Approved" value={stats?.grantApproved} tone="#047857" />
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search size={15} color="#9ca3af" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            placeholder="Search by ID, startup, founder or email…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            style={{ ...input, width: '100%', paddingLeft: '34px' }}
          />
        </div>

        {/* Options come from the status machine, so a new status appears here
            automatically rather than being duplicated in the UI. */}
        <select
          value={status}
          onChange={e => { setStatus(e.target.value); setPage(1); }}
          style={{ ...input, minWidth: '180px' }}
        >
          <option value="">All statuses</option>
          {machine?.statuses.map(s => (
            <option key={s} value={s}>{machine.labels[s]}</option>
          ))}
        </select>
      </div>

      {error && (
        <div style={{ padding: '12px 16px', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '12px', color: '#ef4444', fontSize: '13px', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      {/* Table */}
      <div style={{ ...card, padding: '10px' }}>
        {!data ? (
          <Rows />
        ) : data.items.length === 0 ? (
          <div style={{ padding: '56px 20px', textAlign: 'center' }}>
            <Rocket size={38} color="#d1d5db" style={{ margin: '0 auto 12px' }} />
            <p style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#374151' }}>
              No applications found
            </p>
            <p style={{ margin: '4px 0 0', fontSize: '13.5px', color: '#9ca3af' }}>
              {search || status ? 'Try a different search or filter.' : 'Applications will appear here once students apply.'}
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '760px' }}>
              <thead>
                <tr>
                  {['Application', 'Founder', 'Stage', 'Status', 'Submitted', ''].map((h, i) => (
                    <th key={i} style={{ textAlign: 'left', padding: '10px 12px', fontSize: '11.5px', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.items.map(a => (
                  // The whole row is the click target — an admin shouldn't have to
                  // hunt for the one clickable word. router.push keeps it a single
                  // navigation while leaving the cells as plain, copyable text.
                  <tr
                    key={a._id}
                    onClick={() => router.push(adminUrl(`/grants/${a._id}`))}
                    style={{ borderTop: '1px solid #f5f5f5', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#fafafa')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '14px 12px' }}>
                      <span style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#111827' }}>
                        {a.startup?.name}
                      </span>
                      <span style={{ fontSize: '12px', color: '#9ca3af' }}>{a.applicationId}</span>
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      <span style={{ display: 'block', fontSize: '13.5px', color: '#374151' }}>{a.founder?.fullName}</span>
                      <span style={{ fontSize: '12px', color: '#9ca3af' }}>{a.founder?.email}</span>
                    </td>
                    <td style={{ padding: '14px 12px', fontSize: '13px', color: '#6b7280' }}>
                      {a.startup?.stage}
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      <StatusBadge status={a.status} label={a.statusLabel} size="sm" />
                    </td>
                    <td style={{ padding: '14px 12px', fontSize: '13px', color: '#6b7280', whiteSpace: 'nowrap' }}>
                      {a.submittedAt
                        ? new Date(a.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                        : '—'}
                    </td>
                    <td style={{ padding: '14px 12px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12.5px', fontWeight: 700, color: '#ef4444' }}>
                        View <ChevronRight size={14} />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {data && data.pagination.pages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '18px' }}>
          <button
            type="button"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page <= 1}
            style={{ ...input, cursor: page <= 1 ? 'default' : 'pointer', opacity: page <= 1 ? 0.5 : 1, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            <ChevronLeft size={15} /> Prev
          </button>
          <span style={{ fontSize: '13px', color: '#6b7280' }}>
            Page {data.pagination.page} of {data.pagination.pages} · {data.pagination.total} total
          </span>
          <button
            type="button"
            onClick={() => setPage(p => Math.min(data.pagination.pages, p + 1))}
            disabled={page >= data.pagination.pages}
            style={{ ...input, cursor: page >= data.pagination.pages ? 'default' : 'pointer', opacity: page >= data.pagination.pages ? 0.5 : 1, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            Next <ChevronRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
