'use client';

import Link from 'next/link';

const EFFECTIVE_DATE = 'May 30, 2026';
const CONTACT_EMAIL = 'privacy@startupsindia.in';
const SUPPORT_EMAIL = 'info@startupsindia.in';

const S = {
  root: { minHeight: '100vh', background: '#f8f9fb', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },

  /* Hero */
  hero: { background: 'linear-gradient(135deg,#0b0b0c 0%,#1a0505 60%,#0b0b0c 100%)', padding: '72px 24px 64px', position: 'relative', overflow: 'hidden' },
  heroBg: { position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 50%,rgba(229,57,53,.18) 0%,transparent 60%)', pointerEvents: 'none' },
  heroInner: { maxWidth: 820, margin: '0 auto', position: 'relative', zIndex: 1 },
  badge: { display: 'inline-block', background: 'rgba(229,57,53,.15)', border: '1px solid rgba(229,57,53,.35)', color: '#ff7a7a', fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '5px 14px', borderRadius: 100, marginBottom: 20 },
  heroTitle: { fontSize: 'clamp(2rem,6vw,3.5rem)', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', margin: '0 0 12px', lineHeight: 1.1 },
  heroSub: { fontSize: 14, color: 'rgba(255,255,255,.55)', margin: '0 0 18px' },
  heroDesc: { fontSize: 15, color: 'rgba(255,255,255,.65)', lineHeight: 1.7, margin: '0 0 28px', maxWidth: 680 },
  heroActions: { display: 'flex', gap: 14, flexWrap: 'wrap' },
  ctaBtn: { display: 'inline-flex', alignItems: 'center', background: '#e63946', color: '#fff', fontSize: 14, fontWeight: 700, padding: '11px 24px', borderRadius: 10, textDecoration: 'none', boxShadow: '0 4px 16px rgba(230,57,70,.35)' },
  ctaGhost: { display: 'inline-flex', alignItems: 'center', background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.15)', color: '#fff', fontSize: 14, fontWeight: 600, padding: '11px 24px', borderRadius: 10, textDecoration: 'none' },

  /* TOC */
  tocWrap: { background: '#fff', borderBottom: '1px solid #eaecf0', padding: '0 24px' },
  toc: { maxWidth: 820, margin: '0 auto', padding: '20px 0' },
  tocLabel: { fontSize: 10, fontWeight: 800, color: '#9ca3af', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 12px' },
  tocGrid: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  tocLink: { fontSize: 12.5, fontWeight: 600, color: '#374151', background: '#f3f4f6', padding: '5px 12px', borderRadius: 6, textDecoration: 'none', border: '1px solid transparent' },

  /* Body */
  body: { padding: '56px 24px 80px' },
  container: { maxWidth: 820, margin: '0 auto' },
  section: { marginBottom: 52, paddingBottom: 52, borderBottom: '1px solid #eaecf0' },
  h2: { fontSize: 'clamp(1.3rem,3vw,1.7rem)', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em', margin: '0 0 16px', scrollMarginTop: 80 },
  h3: { fontSize: '1.05rem', fontWeight: 700, color: '#374151', margin: '24px 0 10px' },
  p: { fontSize: 15, lineHeight: 1.78, color: '#4b5563', margin: '0 0 14px' },
  link: { color: '#e63946', textDecoration: 'underline', textUnderlineOffset: 3 },

  /* List */
  list: { margin: '12px 0 16px', padding: 0, listStyle: 'none' },
  listItem: { fontSize: 15, lineHeight: 1.7, color: '#4b5563', padding: '5px 0 5px 24px', position: 'relative' },

  /* Callouts */
  calloutInfo: { padding: '16px 20px', borderRadius: 10, fontSize: 14, lineHeight: 1.65, margin: '20px 0', background: '#eff6ff', borderLeft: '4px solid #3b82f6', color: '#1e40af' },
  calloutGreen: { padding: '16px 20px', borderRadius: 10, fontSize: 14, lineHeight: 1.65, margin: '20px 0', background: '#f0fdf4', borderLeft: '4px solid #22c55e', color: '#166534' },
  calloutRed: { padding: '16px 20px', borderRadius: 10, fontSize: 14, lineHeight: 1.65, margin: '20px 0', background: '#fff0f0', borderLeft: '4px solid #e63946', color: '#991b1b' },

  /* Table */
  tableWrap: { overflowX: 'auto', margin: '20px 0', borderRadius: 12, border: '1px solid #eaecf0' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 14 },
  th: { textAlign: 'left', padding: '12px 16px', fontWeight: 700, color: '#374151', fontSize: 12, letterSpacing: '0.05em', textTransform: 'uppercase', borderBottom: '1px solid #eaecf0', background: '#f9fafb', whiteSpace: 'nowrap' },
  td: { padding: '12px 16px', color: '#4b5563', borderBottom: '1px solid #f3f4f6', verticalAlign: 'top', lineHeight: 1.5 },

  /* Providers */
  providerGrid: { display: 'flex', flexDirection: 'column', gap: 14, margin: '20px 0' },
  providerCard: { display: 'flex', alignItems: 'flex-start', gap: 16, background: '#fff', border: '1px solid #eaecf0', borderRadius: 12, padding: '18px 20px' },
  providerFlag: { fontSize: 24, flexShrink: 0, marginTop: 2 },
  providerName: { fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 4 },
  providerUse: { fontSize: 13.5, color: '#6b7280', lineHeight: 1.55, marginBottom: 8 },

  /* Rights */
  rightsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 14, margin: '20px 0 24px' },
  rightCard: { background: '#fff', border: '1px solid #eaecf0', borderRadius: 12, padding: '16px 18px' },
  rightTitle: { fontSize: 12, fontWeight: 800, color: '#e63946', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 },
  rightDesc: { fontSize: 13, color: '#6b7280', lineHeight: 1.55 },

  /* Delete CTA */
  deleteCta: { background: 'linear-gradient(135deg,#fff0f0,#fff5f5)', border: '1.5px solid rgba(230,57,70,.2)', borderRadius: 14, padding: '28px 24px', marginTop: 24, textAlign: 'center' },
  deleteBtn: { display: 'inline-flex', alignItems: 'center', background: '#e63946', color: '#fff', fontSize: 14, fontWeight: 700, padding: '12px 28px', borderRadius: 10, textDecoration: 'none', boxShadow: '0 4px 14px rgba(230,57,70,.3)', marginBottom: 12 },
  deleteNote: { fontSize: 13, color: '#9ca3af', margin: 0 },

  /* Contact */
  contactCard: { background: '#fff', border: '1px solid #eaecf0', borderRadius: 14, overflow: 'hidden', marginTop: 16 },
  contactRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, padding: '14px 20px', fontSize: 14, color: '#374151', borderBottom: '1px solid #f3f4f6', flexWrap: 'wrap' },
  contactLabel: { fontWeight: 700, fontSize: 12, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' },

  /* Footer */
  footerNav: { display: 'flex', flexWrap: 'wrap', gap: 8, paddingTop: 40, borderTop: '1px solid #eaecf0', marginTop: 8 },
  footerLink: { fontSize: 13, color: '#6b7280', textDecoration: 'none', padding: '5px 12px', borderRadius: 6, background: '#f3f4f6' },
};

const BulletItem = ({ children }) => (
  <li style={{ ...S.listItem }}>
    <span style={{ position: 'absolute', left: 0, top: 14, width: 7, height: 7, borderRadius: '50%', background: '#e63946', opacity: 0.7, display: 'inline-block' }} />
    {children}
  </li>
);

export default function PrivacyPolicy() {
  const tableRows = [
    ['Create & manage your account', 'Name, email, password, profile details', 'Contract performance'],
    ['Personalise your news feed', 'Selected topics & interests', 'Legitimate interest / consent'],
    ['Enable social features', 'Comments, likes, bookmarks, community activity', 'Contract performance'],
    ['Send push notifications', 'FCM token', 'Consent (opt-in)'],
    ['Content moderation & safety', 'User-generated content, reports', 'Legitimate interest'],
    ['Security & fraud prevention', 'Account data, Firebase App Check signals', 'Legitimate interest'],
    ['Troubleshoot app crashes', 'Crash reports (Crashlytics)', 'Legitimate interest'],
    ['Comply with legal obligations', 'Account data (limited, time-bound)', 'Legal obligation'],
  ];

  const providers = [
    { name: 'Firebase (Google LLC)', flag: '🇺🇸', use: 'Authentication, Firestore database, Cloud Messaging (push notifications), Crashlytics, App Check', link: 'https://firebase.google.com/support/privacy' },
    { name: 'Cloudinary', flag: '🌐', use: 'Profile image storage and delivery. Images are stored on Cloudinary servers.', link: 'https://cloudinary.com/privacy' },
    { name: 'Google Sign-In', flag: '🇺🇸', use: 'Optional OAuth login. Provides name, email and avatar from your Google account (with your consent).', link: 'https://policies.google.com/privacy' },
  ];

  const rights = [
    ['Access', 'Request a copy of the personal data we hold about you.'],
    ['Correction', 'Update inaccurate profile info directly in the app.'],
    ['Deletion', 'Request permanent deletion of your account and data.'],
    ['Portability', 'Request your data in a machine-readable format.'],
    ['Objection', 'Object to processing based on legitimate interest.'],
    ['Withdraw Consent', 'Withdraw consent (e.g. notifications) in device Settings.'],
  ];

  const toc = [
    ['#s1','1. Who We Are'],['#s2','2. Data We Collect'],['#s3','3. How We Use Data'],
    ['#s4','4. Third-Party Services'],['#s5','5. Data Sharing'],['#s6','6. Data Security'],
    ['#s7','7. Retention & Deletion'],['#s8','8. Your Rights'],["#s9","9. Children's Privacy"],
    ['#s10','10. Policy Changes'],['#s11','11. Contact Us'],
  ];

  return (
    <div style={S.root}>
      {/* Hero */}
      <div style={S.hero}>
        <div style={S.heroBg} />
        <div style={S.heroInner}>
          <div style={S.badge}>Legal</div>
          <h1 style={S.heroTitle}>Privacy Policy</h1>
          <p style={S.heroSub}>
            StartupsIndia &nbsp;·&nbsp; Effective Date: <strong style={{ color: 'rgba(255,255,255,.85)' }}>{EFFECTIVE_DATE}</strong>
          </p>
          <p style={S.heroDesc}>
            This Privacy Policy applies to the StartupsIndia mobile app (Android:{' '}
            <code style={{ background: 'rgba(255,255,255,.1)', borderRadius: 4, padding: '1px 6px', fontSize: 13 }}>in.startupsindia.app</code>
            ) and the website <strong style={{ color: 'rgba(255,255,255,.85)' }}>startupsindia.in</strong>.
            It explains what data we collect, why, how we use it, and your choices.
          </p>
          <div style={S.heroActions}>
            <Link href="/delete-account" style={S.ctaBtn}>Request Account Deletion →</Link>
            <a href={`mailto:${CONTACT_EMAIL}`} style={S.ctaGhost}>Contact Privacy Team</a>
          </div>
        </div>
      </div>

      {/* TOC */}
      <div style={S.tocWrap}>
        <div style={S.toc}>
          <p style={S.tocLabel}>Jump to section</p>
          <div style={S.tocGrid}>
            {toc.map(([href, label]) => (
              <a key={href} href={href} style={S.tocLink}>{label}</a>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={S.body}>
        <div style={S.container}>

          {/* §1 */}
          <section id="s1" style={S.section}>
            <h2 style={S.h2}>1. Who We Are</h2>
            <p style={S.p}>
              StartupsIndia ("<strong>we</strong>", "<strong>our</strong>") is operated by <strong>Startups India</strong>,
              a startup incubation platform headquartered in Hyderabad, Telangana, India.
              We provide news, communities, mentorship, funding, events, courses, bookmarks, and user profiles
              through our website and Android app (package: <code style={{ background: '#f3f4f6', borderRadius: 4, padding: '1px 5px', fontSize: 13 }}>in.startupsindia.app</code>).
            </p>
            <p style={S.p}>
              Privacy contact: <a href={`mailto:${CONTACT_EMAIL}`} style={S.link}>{CONTACT_EMAIL}</a>
            </p>
          </section>

          {/* §2 */}
          <section id="s2" style={S.section}>
            <h2 style={S.h2}>2. Data We Collect</h2>
            <p style={S.p}>We collect data in three ways: information you give us, content you create, and technical data from our infrastructure.</p>

            <h3 style={S.h3}>2.1 Account & Profile Information</h3>
            <ul style={S.list}>
              {['Full name and email address','Phone number (optional)','Username and profile photo (stored on Cloudinary)','Bio, website URL, professional role (Founder, Investor, Journalist, etc.)','Selected topics and interests (used to personalise your feed)','Password (stored as a secure hash - never plaintext)'].map(t=><BulletItem key={t}>{t}</BulletItem>)}
            </ul>
            <p style={S.p}>If you use <strong>Google Sign-In</strong>, we receive your name, email, and profile photo from Google with your consent.</p>

            <h3 style={S.h3}>2.2 User-Generated Content</h3>
            <ul style={S.list}>
              {['Comments you post on articles and community threads','Articles, posts, and images you upload','Articles you like or bookmark','Communities you join and your activity within them','Content reports you submit'].map(t=><BulletItem key={t}>{t}</BulletItem>)}
            </ul>

            <h3 style={S.h3}>2.3 Device & Notification Data</h3>
            <ul style={S.list}>
              <BulletItem><strong>Firebase Cloud Messaging (FCM) token</strong> - a unique device identifier used exclusively to deliver push notifications. Disable anytime in device Settings.</BulletItem>
              <BulletItem>Device type and OS version (for compatibility and analytics).</BulletItem>
            </ul>

            <h3 style={S.h3}>2.4 Diagnostics & Crash Data</h3>
            <ul style={S.list}>
              <BulletItem><strong>Firebase Crashlytics</strong> collects crash reports including stack trace, device model, OS version, and app version. Reports do <em>not</em> include your name, email, or message content.</BulletItem>
              <BulletItem><strong>Firebase App Check</strong> verifies traffic comes from our genuine app. It does not collect personal data.</BulletItem>
            </ul>
            <div style={S.calloutInfo}>
              <strong>We do not collect</strong> precise GPS location, contacts, camera/microphone access (unless you upload a profile photo), financial payment info, or any government ID.
            </div>
          </section>

          {/* §3 */}
          <section id="s3" style={S.section}>
            <h2 style={S.h2}>3. How We Use Your Data</h2>
            <div style={S.tableWrap}>
              <table style={S.table}>
                <thead>
                  <tr>
                    <th style={S.th}>Purpose</th>
                    <th style={S.th}>Data Used</th>
                    <th style={S.th}>Legal Basis</th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map(([purpose, data, basis], i) => (
                    <tr key={i}>
                      <td style={{ ...S.td, ...(i % 2 === 1 ? { background: '#fafafa' } : {}) }}>{purpose}</td>
                      <td style={{ ...S.td, ...(i % 2 === 1 ? { background: '#fafafa' } : {}) }}>{data}</td>
                      <td style={{ ...S.td, ...(i % 2 === 1 ? { background: '#fafafa' } : {}) }}>{basis}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={S.calloutGreen}>
              <strong>We do not sell your personal data</strong> to advertisers, data brokers, or any third party - ever.
            </div>
          </section>

          {/* §4 */}
          <section id="s4" style={S.section}>
            <h2 style={S.h2}>4. Third-Party Services</h2>
            <p style={S.p}>We use the following sub-processors to operate our platform:</p>
            <div style={S.providerGrid}>
              {providers.map(p => (
                <div key={p.name} style={S.providerCard}>
                  <div style={S.providerFlag}>{p.flag}</div>
                  <div>
                    <div style={S.providerName}>{p.name}</div>
                    <div style={S.providerUse}>{p.use}</div>
                    <a href={p.link} target="_blank" rel="noopener noreferrer" style={{ ...S.link, fontSize: 12.5, fontWeight: 600 }}>View Privacy Policy ↗</a>
                  </div>
                </div>
              ))}
            </div>
            <p style={S.p}>All data transmitted between the app and these services is encrypted using TLS (HTTPS). Firebase data resides on Google servers, primarily in the United States, under Google's standard contractual clauses.</p>
          </section>

          {/* §5 */}
          <section id="s5" style={S.section}>
            <h2 style={S.h2}>5. Data Sharing</h2>
            <p style={S.p}>We share personal data only in these limited circumstances:</p>
            <ul style={S.list}>
              <BulletItem><strong>Service Providers</strong> - Firebase and Cloudinary as described in Section 4, acting as data processors under our instructions.</BulletItem>
              <BulletItem><strong>Legal Obligations</strong> - If required by a court order, government authority, or applicable law.</BulletItem>
              <BulletItem><strong>Business Transfer</strong> - In the event of a merger or acquisition. We will notify you before data is subject to a different privacy policy.</BulletItem>
              <BulletItem><strong>Safety</strong> - To protect the rights, property, or safety of StartupsIndia, our users, or the public.</BulletItem>
            </ul>
            <div style={S.calloutInfo}>Public content (comments, posts) is visible to other users by design. Do not post information you wish to keep private.</div>
          </section>

          {/* §6 */}
          <section id="s6" style={S.section}>
            <h2 style={S.h2}>6. Data Security</h2>
            <ul style={S.list}>
              <BulletItem>All data in transit is encrypted via TLS/HTTPS.</BulletItem>
              <BulletItem>Passwords are never stored in plaintext; Firebase Authentication manages credentials using industry-standard hashing.</BulletItem>
              <BulletItem>Firestore security rules restrict each user's data to their own UID.</BulletItem>
              <BulletItem>Firebase App Check blocks unauthorized API calls from non-genuine clients.</BulletItem>
              <BulletItem>Access to production systems is restricted to authorised team members using multi-factor authentication.</BulletItem>
            </ul>
            <p style={S.p}>If you believe your account has been compromised, contact us immediately at <a href={`mailto:${SUPPORT_EMAIL}`} style={S.link}>{SUPPORT_EMAIL}</a>.</p>
          </section>

          {/* §7 */}
          <section id="s7" style={S.section}>
            <h2 style={S.h2}>7. Data Retention & Deletion</h2>
            <h3 style={S.h3}>Active Accounts</h3>
            <p style={S.p}>We retain your account data and user-generated content for as long as your account is active or as needed to provide our services.</p>
            <h3 style={S.h3}>Account Deletion</h3>
            <p style={S.p}>When you delete your account - either <strong>in-app</strong> (Profile → Settings → Delete Account) or via our <Link href="/delete-account" style={S.link}>web deletion request form</Link> - the following data is <strong>permanently removed within 30 days</strong>:</p>
            <ul style={S.list}>
              {['Firebase Authentication account (login credentials)','Firestore user profile document','Topic preferences and personalisation data','Your UID from liked/bookmarked article arrays','Profile photo on Cloudinary','Comments, posts, and community activity linked to your account'].map(t=><BulletItem key={t}>{t}</BulletItem>)}
            </ul>
            <h3 style={S.h3}>Limited Retention After Deletion</h3>
            <ul style={S.list}>
              <BulletItem><strong>Legal & tax records</strong> - up to 7 years (Indian law requirement).</BulletItem>
              <BulletItem><strong>Fraud/abuse logs</strong> - up to 90 days to prevent re-registration abuse.</BulletItem>
              <BulletItem><strong>Unresolved disputes</strong> - until the matter is closed.</BulletItem>
              <BulletItem><strong>Crash analytics</strong> - anonymised, not linked to your identity.</BulletItem>
            </ul>
            <div style={S.calloutRed}><strong>Account deletion is permanent.</strong> We cannot recover your profile, content, or activity after deletion is complete. Please save any data you wish to keep before submitting a deletion request.</div>
            <div style={S.deleteCta}>
              <Link href="/delete-account" style={{ ...S.deleteBtn, display: 'inline-block' }}>Request Account Deletion</Link>
              <p style={S.deleteNote}>Processed within 7 business days · All personal data permanently deleted within 30 days</p>
            </div>
          </section>

          {/* §8 */}
          <section id="s8" style={S.section}>
            <h2 style={S.h2}>8. Your Rights</h2>
            <p style={S.p}>Under India's DPDP Act, GDPR, and similar frameworks, you may have the right to:</p>
            <div style={S.rightsGrid}>
              {rights.map(([title, desc]) => (
                <div key={title} style={S.rightCard}>
                  <div style={S.rightTitle}>{title}</div>
                  <div style={S.rightDesc}>{desc}</div>
                </div>
              ))}
            </div>
            <p style={S.p}>To exercise any right, email <a href={`mailto:${CONTACT_EMAIL}`} style={S.link}>{CONTACT_EMAIL}</a>. We respond within <strong>30 days</strong>.</p>
          </section>

          {/* §9 */}
          <section id="s9" style={S.section}>
            <h2 style={S.h2}>9. Children's Privacy</h2>
            <p style={S.p}>StartupsIndia is not directed at children under <strong>13</strong>. We do not knowingly collect personal information from children. If you believe a child has created an account, contact us at <a href={`mailto:${CONTACT_EMAIL}`} style={S.link}>{CONTACT_EMAIL}</a> and we will delete the account promptly.</p>
          </section>

          {/* §10 */}
          <section id="s10" style={S.section}>
            <h2 style={S.h2}>10. Changes to This Policy</h2>
            <p style={S.p}>We may update this Privacy Policy to reflect changes in practices, technology, or legal requirements. Material changes will be communicated via in-app notification or email. Continued use after changes take effect constitutes acceptance.</p>
          </section>

          {/* §11 */}
          <section id="s11" style={{ ...S.section, borderBottom: 'none' }}>
            <h2 style={S.h2}>11. Contact Us</h2>
            <p style={S.p}>For privacy questions, access requests, deletion requests, or concerns:</p>
            <div style={S.contactCard}>
              {[
                { label: 'Privacy Email', val: <a key="pe" href={`mailto:${CONTACT_EMAIL}`} style={S.link}>{CONTACT_EMAIL}</a> },
                { label: 'General Support', val: <a key="gs" href={`mailto:${SUPPORT_EMAIL}`} style={S.link}>{SUPPORT_EMAIL}</a> },
                { label: 'Phone', val: <a key="ph" href="tel:+919014878887" style={S.link}>+91 9014878887</a> },
                { label: 'Office', val: 'Hyderabad, Telangana, India' },
                { label: 'Account Deletion', val: <Link key="ad" href="/delete-account" style={S.link}>startupsindia.in/delete-account</Link> },
              ].map(({ label, val }, i, arr) => (
                <div key={label} style={{ ...S.contactRow, ...(i === arr.length - 1 ? { borderBottom: 'none' } : {}) }}>
                  <span style={S.contactLabel}>{label}</span>
                  <span>{val}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Footer nav */}
          <div style={S.footerNav}>
            {[['/', 'Home'], ['/terms', 'Terms of Service'], ['/delete-account', 'Delete Account'], ['/cookies', 'Cookie Policy']].map(([href, label]) => (
              <Link key={href} href={href} style={S.footerLink}>{label}</Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
