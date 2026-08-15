'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, Building, ChevronDown, Plus, Loader2 } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

async function locationFetch(path) {
  const res = await fetch(`${API_BASE}${path}`);
  const json = await res.json();
  return json.data || [];
}

/**
 * LocationSelector - cascading State → City dropdowns.
 * Props:
 *   stateId, stateName, cityId, cityName - current values
 *   onStateChange(id, name)
 *   onCityChange(id, name)
 *   required
 */
export function LocationSelector({ stateId, stateName, cityId, cityName, onStateChange, onCityChange, required }) {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingStates, setLoadingStates] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);

  useEffect(() => {
    locationFetch('/api/v1/location/states')
      .then(setStates)
      .finally(() => setLoadingStates(false));
  }, []);

  useEffect(() => {
    if (!stateId) { setCities([]); return; }
    setLoadingCities(true);
    locationFetch(`/api/v1/location/cities?stateId=${stateId}`)
      .then(setCities)
      .finally(() => setLoadingCities(false));
  }, [stateId]);

  return (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      {/* State */}
      <div className="reg-v2-field-group" style={{ flex: 1, minWidth: '160px' }}>
        <label className="reg-v2-label">State {required && '*'}</label>
        <div className="reg-v2-input-wrapper">
          <MapPin className="reg-v2-input-icon" size={16} />
          <select
            className="reg-v2-select"
            style={{ paddingLeft: '36px' }}
            value={stateId || ''}
            onChange={(e) => {
              const opt = e.target.options[e.target.selectedIndex];
              onStateChange(e.target.value, opt.text);
              onCityChange('', '');
            }}
            required={required}
            disabled={loadingStates}
          >
            <option value="">{loadingStates ? 'Loading…' : 'Select state'}</option>
            {states.map((s) => (
              <option key={s._id} value={s._id}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* City - only shown after state is selected */}
      {stateId && (
        <div className="reg-v2-field-group" style={{ flex: 1, minWidth: '160px' }}>
          <label className="reg-v2-label">City {required && '*'}</label>
          <div className="reg-v2-input-wrapper">
            <MapPin className="reg-v2-input-icon" size={16} />
            <select
              className="reg-v2-select"
              style={{ paddingLeft: '36px' }}
              value={cityId || ''}
              onChange={(e) => {
                const opt = e.target.options[e.target.selectedIndex];
                onCityChange(e.target.value, opt.text);
              }}
              required={required}
              disabled={loadingCities}
            >
              <option value="">
                {loadingCities ? 'Loading…' : 'Select city'}
              </option>
              {cities.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * CollegeSelector - shows colleges for the selected city.
 * If not found, lets user type and submit a new one.
 * Props:
 *   cityId, stateId - required to load/add colleges
 *   value (college _id or '' for custom)
 *   valueName (displayed name)
 *   onChange(id, name)
 */
export function CollegeSelector({ cityId, stateId, value, valueName, onChange, required }) {
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [addName, setAddName] = useState('');
  const [adding, setAdding] = useState(false);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  // Load colleges when city changes
  useEffect(() => {
    if (!cityId) { setColleges([]); onChange('', ''); return; }
    setLoading(true);
    locationFetch(`/api/v1/location/colleges?cityId=${cityId}`)
      .then(setColleges)
      .finally(() => setLoading(false));
    // Reset selection when city changes
    onChange('', '');
    setQuery('');
    setShowAdd(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityId]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filtered = query.trim()
    ? colleges.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
    : colleges;

  const handleSelect = (col) => {
    onChange(col._id, col.name);
    setQuery(col.name);
    setOpen(false);
    setShowAdd(false);
  };

  const handleAddCollege = async () => {
    if (!addName.trim() || !cityId || !stateId) return;
    setAdding(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/location/colleges`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: addName.trim(), cityId, stateId }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        const newCollege = json.data;
        setColleges((prev) => [...prev, newCollege].sort((a, b) => a.name.localeCompare(b.name)));
        onChange(newCollege._id, newCollege.name);
        setQuery(newCollege.name);
        setShowAdd(false);
        setAddName('');
        setOpen(false);
      }
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="reg-v2-field-group" ref={wrapRef} style={{ position: 'relative' }}>
      <label className="reg-v2-label">College / University {required && '*'}</label>

      {/* Trigger input */}
      <div className="reg-v2-input-wrapper" style={{ cursor: cityId ? 'text' : 'not-allowed' }}>
        <Building className="reg-v2-input-icon" size={16} />
        <input
          type="text"
          className="reg-v2-input"
          placeholder={!cityId ? 'Select city first' : loading ? 'Loading…' : 'Search college…'}
          disabled={!cityId || loading}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); onChange('', ''); setShowAdd(false); }}
          onFocus={() => cityId && setOpen(true)}
          required={required}
          autoComplete="off"
        />
        {loading
          ? <Loader2 size={16} style={{ position: 'absolute', right: 12, color: '#94a3b8', animation: 'spin 1s linear infinite' }} />
          : <ChevronDown size={16} style={{ position: 'absolute', right: 12, color: '#94a3b8', pointerEvents: 'none' }} />
        }
      </div>

      {/* Dropdown */}
      {open && cityId && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 999,
          background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: '10px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)', maxHeight: '220px',
          overflowY: 'auto', marginTop: '4px',
        }}>
          {filtered.length === 0 && !showAdd && (
            <div style={{ padding: '12px 16px', fontSize: '13px', color: '#64748b' }}>
              {query.trim()
                ? 'No college found.'
                : 'No colleges listed for this city.'}
              <button
                type="button"
                onClick={() => { setShowAdd(true); setAddName(query.trim()); }}
                style={{
                  marginLeft: '8px', background: 'none', border: 'none', cursor: 'pointer',
                  color: '#dc2626', fontWeight: 600, fontSize: '13px', display: 'inline-flex',
                  alignItems: 'center', gap: '4px',
                }}
              >
                <Plus size={13} /> Add &quot;{query.trim() || 'new college'}&quot;
              </button>
            </div>
          )}

          {filtered.map((col) => (
            <div
              key={col._id}
              onMouseDown={() => handleSelect(col)}
              style={{
                padding: '10px 16px', fontSize: '13.5px', cursor: 'pointer',
                background: value === col._id ? '#fef2f2' : 'transparent',
                color: value === col._id ? '#dc2626' : '#1e293b',
                borderBottom: '1px solid #f1f5f9',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
              onMouseLeave={(e) => e.currentTarget.style.background = value === col._id ? '#fef2f2' : 'transparent'}
            >
              {col.name}
              {col.isUserAdded && (
                <span style={{ fontSize: '11px', color: '#94a3b8', marginLeft: '6px' }}>(user added)</span>
              )}
            </div>
          ))}

          {filtered.length > 0 && (
            <div
              onMouseDown={() => { setShowAdd(true); setAddName(query.trim()); }}
              style={{
                padding: '10px 16px', fontSize: '13px', cursor: 'pointer',
                color: '#dc2626', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px',
                borderTop: '1px solid #e2e8f0',
              }}
            >
              <Plus size={13} /> Add new college
            </div>
          )}
        </div>
      )}

      {/* Add new college inline form */}
      {showAdd && (
        <div style={{
          marginTop: '8px', padding: '12px', background: '#f8fafc',
          border: '1.5px dashed #dc2626', borderRadius: '10px',
        }}>
          <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px', fontWeight: 500 }}>
            Add your college (it will be saved for future users)
          </p>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="text"
              className="reg-v2-input no-icon"
              placeholder="Full college / university name"
              value={addName}
              onChange={(e) => setAddName(e.target.value)}
              style={{ flex: 1, fontSize: '13px' }}
            />
            <button
              type="button"
              onClick={handleAddCollege}
              disabled={!addName.trim() || adding}
              style={{
                background: '#dc2626', color: '#fff', border: 'none', borderRadius: '8px',
                padding: '8px 14px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {adding ? 'Adding…' : 'Add & Select'}
            </button>
            <button
              type="button"
              onClick={() => { setShowAdd(false); setAddName(''); }}
              style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                color: '#94a3b8', fontSize: '12px',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * IndustryDropdown - simple select from DB-seeded list.
 * Props: value, onChange(value), required, label
 */
export function IndustryDropdown({ value, onChange, required, label = 'Industry' }) {
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    locationFetch('/api/v1/location/industries')
      .then(setIndustries)
      .finally(() => setLoading(false));
  }, []);

  // Group by category for <optgroup>
  const grouped = industries.reduce((acc, ind) => {
    const cat = ind.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(ind);
    return acc;
  }, {});

  return (
    <div className="reg-v2-field-group">
      <label className="reg-v2-label">{label}{required && ' *'}</label>
      <select
        className="reg-v2-select no-icon"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={loading}
      >
        <option value="">{loading ? 'Loading…' : 'Select industry'}</option>
        {Object.entries(grouped).map(([cat, items]) => (
          <optgroup key={cat} label={cat}>
            {items.map((ind) => (
              <option key={ind._id} value={ind.name}>{ind.name}</option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}
