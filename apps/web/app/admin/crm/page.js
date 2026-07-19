'use client';

import { useState } from 'react';
import ListsTab from '@/components/admin/crm/ListsTab';
import TemplatesTab from '@/components/admin/crm/TemplatesTab';
import CampaignsTab from '@/components/admin/crm/CampaignsTab';

const TABS = [
  { id: 'campaigns', label: 'Campaigns' },
  { id: 'lists', label: 'Lead Lists' },
  { id: 'templates', label: 'Templates' },
];

export default function AdminCrmPage() {
  const [tab, setTab] = useState('campaigns');

  return (
    <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', margin: 0 }}>Email Campaigns</h1>
        <p style={{ fontSize: 14, color: '#64748b', margin: '4px 0 0' }}>
          Import lead lists, design templates, and send personalized email campaigns.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, borderBottom: '1px solid #e2e8f0' }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: '10px 18px', border: 'none', background: 'none', cursor: 'pointer',
              fontSize: 14, fontWeight: 600,
              color: tab === t.id ? '#e63946' : '#64748b',
              borderBottom: tab === t.id ? '2px solid #e63946' : '2px solid transparent',
              marginBottom: -1,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'campaigns' && <CampaignsTab />}
      {tab === 'lists' && <ListsTab />}
      {tab === 'templates' && <TemplatesTab />}
    </div>
  );
}
