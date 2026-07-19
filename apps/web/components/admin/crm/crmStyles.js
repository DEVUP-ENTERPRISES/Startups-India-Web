// Shared inline styles for the CRM admin tabs.
export const s = {
  btnPrimary: { padding: '10px 18px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg,#e63946,#ff6b6b)', color: '#fff', fontWeight: 700, fontSize: 13.5, cursor: 'pointer' },
  btnGhost: { padding: '9px 16px', borderRadius: 8, border: '1.5px solid #e2e8f0', background: '#fff', color: '#475569', fontWeight: 600, fontSize: 13, cursor: 'pointer' },
  btnDanger: { padding: '7px 13px', borderRadius: 8, border: '1px solid #fecaca', background: '#fff', color: '#b91c1c', fontWeight: 600, fontSize: 12.5, cursor: 'pointer' },
  input: { width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: 8, fontSize: 14, color: '#111827', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', background: '#fff' },
  card: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 18, marginBottom: 12 },
  table: { width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 12, overflow: 'hidden', border: '1px solid #e2e8f0' },
  th: { padding: '12px 14px', background: '#f8fafc', textAlign: 'left', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: 12.5, fontWeight: 700 },
  td: { padding: '12px 14px', borderBottom: '1px solid #f1f5f9', color: '#334155', fontSize: 13.5 },
  label: { display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20 },
  modal: { background: '#fff', borderRadius: 16, padding: 28, maxWidth: 640, width: '100%', maxHeight: '88vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
  empty: { textAlign: 'center', padding: '48px 24px', color: '#94a3b8' },
  err: { padding: '10px 14px', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: 8, color: '#ef4444', fontSize: 13, fontWeight: 500, marginBottom: 14 },
  toast: (type) => ({ position: 'fixed', bottom: 24, right: 24, padding: '13px 22px', borderRadius: 12, color: '#fff', fontWeight: 600, fontSize: 14, zIndex: 10000, boxShadow: '0 8px 30px rgba(0,0,0,0.15)', background: type === 'error' ? '#ef4444' : '#10b981' }),
};

export const FIELD_LABELS = {
  email: 'Email *', name: 'Name', phone: 'Phone', collegeName: 'College Name',
  additional1: 'Additional 1', additional2: 'Additional 2', additional3: 'Additional 3',
};
