// ─── Email ──────────────────────────────────────────────────────────────────
export function validateEmail(email) {
  if (!email?.trim()) return 'Email is required';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!re.test(email.trim())) return 'Enter a valid email address';
  return null;
}

// ─── Phone ──────────────────────────────────────────────────────────────────
export const COUNTRY_CODES = [
  { code: '+91',  country: 'IN', flag: '🇮🇳', name: 'India',        digits: 10, pattern: /^[6-9]\d{9}$/ },
  { code: '+1',   country: 'US', flag: '🇺🇸', name: 'United States', digits: 10, pattern: /^\d{10}$/ },
  { code: '+1',   country: 'CA', flag: '🇨🇦', name: 'Canada',        digits: 10, pattern: /^\d{10}$/ },
  { code: '+44',  country: 'GB', flag: '🇬🇧', name: 'UK',            digits: 10, pattern: /^\d{10,11}$/ },
  { code: '+971', country: 'AE', flag: '🇦🇪', name: 'UAE',           digits: 9,  pattern: /^[0-9]\d{8}$/ },
  { code: '+65',  country: 'SG', flag: '🇸🇬', name: 'Singapore',     digits: 8,  pattern: /^[689]\d{7}$/ },
  { code: '+61',  country: 'AU', flag: '🇦🇺', name: 'Australia',     digits: 9,  pattern: /^\d{9}$/ },
  { code: '+49',  country: 'DE', flag: '🇩🇪', name: 'Germany',       digits: 10, pattern: /^\d{10,11}$/ },
  { code: '+33',  country: 'FR', flag: '🇫🇷', name: 'France',        digits: 9,  pattern: /^\d{9}$/ },
  { code: '+81',  country: 'JP', flag: '🇯🇵', name: 'Japan',         digits: 10, pattern: /^\d{10,11}$/ },
];

export function validatePhone(digits, countryCode = '+91') {
  if (!digits?.trim()) return 'Phone number is required';
  const clean = digits.replace(/\D/g, '');
  const info = COUNTRY_CODES.find(c => c.code === countryCode);
  if (!info) return null;
  if (!info.pattern.test(clean)) {
    return `Enter a valid ${info.digits}-digit ${info.name} number`;
  }
  return null;
}

export function formatPhoneForSubmit(digits, countryCode) {
  const clean = digits.replace(/\D/g, '');
  return `${countryCode}${clean}`;
}
