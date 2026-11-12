'use client';

import { useEffect } from 'react';

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:5000';

export default function QrScanBeacon() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const utmCampaign = params.get('utm_campaign');
    if (params.get('utm_medium') !== 'qr' || !utmCampaign) return;

    const key = `qr-scan:${utmCampaign}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, '1');
    } catch {
      // Storage can be unavailable (private mode); the server dedupes repeat visitors anyway.
    }

    fetch(`${API_BASE}/api/v1/campaigns/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ utmCampaign }),
      keepalive: true,
      credentials: 'omit',
    }).catch(() => {});
  }, []);

  return null;
}
