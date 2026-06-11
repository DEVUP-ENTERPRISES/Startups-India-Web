'use client';

import { useState } from 'react';
import Link from 'next/link';

const EFFECTIVE_DATE = '11-06-2026';
const CONTACT_EMAIL = 'support@startupsindia.in';

const S = {
  root: { minHeight: '100vh', background: '#0b0b0c', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },

  /* Hero */
  hero: { background: 'linear-gradient(135deg,#0b0b0c 0%,#1a0505 60%,#0b0b0c 100%)', padding: '140px 24px 80px', position: 'relative', overflow: 'hidden' },
  heroBg: { position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 50%,rgba(229,57,53,.18) 0%,transparent 60%)', pointerEvents: 'none' },
  heroInner: { maxWidth: '100%', margin: '0 auto', position: 'relative', zIndex: 1 },
  badge: { display: 'inline-block', background: 'rgba(229,57,53,.15)', border: '1px solid rgba(229,57,53,.35)', color: '#ff7a7a', fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '5px 14px', borderRadius: 100, marginBottom: 20 },
  heroTitle: { fontSize: 'clamp(2rem,6vw,3.5rem)', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', margin: '0 0 12px', lineHeight: 1.1 },
  heroSub: { fontSize: 14, color: 'rgba(255,255,255,.55)', margin: '0 0 18px' },
  heroDesc: { fontSize: 15, color: 'rgba(255,255,255,.65)', lineHeight: 1.7, margin: '0 0 28px', maxWidth: 680 },
  heroActions: { display: 'flex', gap: 14, flexWrap: 'wrap' },
  ctaGhost: { display: 'inline-flex', alignItems: 'center', background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.15)', color: '#fff', fontSize: 14, fontWeight: 600, padding: '11px 24px', borderRadius: 10, textDecoration: 'none' },

  /* Tabs Navigation */
  tabsWrap: { background: '#0b0b0c', borderBottom: '1px solid #2a2a2a', padding: '0 24px' },
  tabs: { maxWidth: '100%', margin: '0 auto', display: 'flex', gap: 24, overflowX: 'auto', WebkitOverflowScrolling: 'touch' },
  tab: { padding: '20px 0', fontSize: 14, fontWeight: 700, color: '#9ca3af', cursor: 'pointer', borderBottom: '2px solid transparent', whiteSpace: 'nowrap', transition: 'all 0.2s' },
  tabActive: { color: '#e63946', borderBottomColor: '#e63946' },

  /* Body */
  body: { padding: '40px 24px 80px' },
  container: { maxWidth: '100%', margin: '0 auto', background: '#121212', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 30px rgba(0,0,0,0.5)', border: '1px solid #2a2a2a' },
  section: { marginBottom: 32 },
  h2: { fontSize: 'clamp(1.3rem,3vw,1.7rem)', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', margin: '0 0 24px' },
  h3: { fontSize: '1.05rem', fontWeight: 700, color: '#e5e7eb', margin: '24px 0 10px' },
  p: { fontSize: 15, lineHeight: 1.78, color: '#9ca3af', margin: '0 0 14px' },
  link: { color: '#e63946', textDecoration: 'underline', textUnderlineOffset: 3 },

  /* List */
  list: { margin: '12px 0 16px', padding: 0, listStyle: 'none' },
  listItem: { fontSize: 15, lineHeight: 1.7, color: '#9ca3af', padding: '5px 0 5px 24px', position: 'relative' },

  /* Footer */
  footerNav: { display: 'flex', flexWrap: 'wrap', gap: 8, paddingTop: 40, borderTop: '1px solid #2a2a2a', marginTop: 40 },
  footerLink: { fontSize: 13, color: '#9ca3af', textDecoration: 'none', padding: '5px 12px', borderRadius: 6, background: '#1f2937' },
};

const BulletItem = ({ children }) => (
  <li style={{ ...S.listItem }}>
    <span style={{ position: 'absolute', left: 0, top: 14, width: 7, height: 7, borderRadius: '50%', background: '#e63946', opacity: 0.7, display: 'inline-block' }} />
    {children}
  </li>
);

export default function PrivacyPolicy() {
  const [activeTab, setActiveTab] = useState('privacy');

  return (
    <div style={S.root}>
      {/* Hero */}
      <div style={S.hero}>
        <div style={S.heroBg} />
        <div style={S.heroInner}>
          <h1 style={S.heroTitle}>Legal & Policies</h1>
          <p style={S.heroSub}>
            StartupsIndia &nbsp;·&nbsp; Effective Date: <strong style={{ color: 'rgba(255,255,255,.85)' }}>{EFFECTIVE_DATE}</strong>
          </p>
          <p style={S.heroDesc}>
            Review our Privacy Policy, Terms & Conditions, and Refund Policy. These documents outline your rights and responsibilities when using StartupsIndia.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={S.tabsWrap}>
        <div style={S.tabs}>
          <div 
            style={{ ...S.tab, ...(activeTab === 'privacy' ? S.tabActive : {}) }}
            onClick={() => setActiveTab('privacy')}
          >
            Privacy Policy
          </div>
          <div 
            style={{ ...S.tab, ...(activeTab === 'terms' ? S.tabActive : {}) }}
            onClick={() => setActiveTab('terms')}
          >
            Terms & Conditions
          </div>
          <div 
            style={{ ...S.tab, ...(activeTab === 'refund' ? S.tabActive : {}) }}
            onClick={() => setActiveTab('refund')}
          >
            Refund & Cancellation Policy
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={S.body}>
        <div style={S.container}>
          
          {activeTab === 'privacy' && (
            <div style={S.section}>
              <h2 style={S.h2}>Privacy Policy</h2>
              <p style={S.p}>
                Welcome to STARTUPS INDIA. We respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how STARTUPS INDIA collects, uses, stores, and protects information when you use our website, mobile application, online courses, events, communities, and related services.
              </p>

              <h3 style={S.h3}>1. Scope</h3>
              <p style={S.p}>This Privacy Policy applies to all products and services offered by STARTUPS INDIA, including:</p>
              <ul style={S.list}>
                <BulletItem>Official Website</BulletItem>
                <BulletItem>Mobile Application</BulletItem>
                <BulletItem>Community Platforms</BulletItem>
                <BulletItem>Online Courses</BulletItem>
                <BulletItem>Events and Workshops</BulletItem>
                <BulletItem>Startup Support Services</BulletItem>
                <BulletItem>Media and Content Platforms</BulletItem>
              </ul>

              <h3 style={S.h3}>2. Information We Collect</h3>
              <p style={S.p}>We may collect:</p>
              <ul style={S.list}>
                <BulletItem><strong>Personal Information:</strong> Full Name, Email Address, Mobile Number, Organization Name, Profile Information</BulletItem>
                <BulletItem><strong>Account Information:</strong> Username, Login Credentials, User Preferences</BulletItem>
                <BulletItem><strong>Payment Information:</strong> Payments are processed through secure third-party payment providers. We do not store complete card details on our servers.</BulletItem>
                <BulletItem><strong>Technical Information:</strong> Device Information, IP Address, Browser Type, Operating System, Usage Analytics</BulletItem>
              </ul>

              <h3 style={S.h3}>3. How We Use Information</h3>
              <p style={S.p}>We use information to:</p>
              <ul style={S.list}>
                <BulletItem>Create and manage user accounts</BulletItem>
                <BulletItem>Deliver courses and educational content</BulletItem>
                <BulletItem>Facilitate event registrations</BulletItem>
                <BulletItem>Provide community access</BulletItem>
                <BulletItem>Improve platform performance</BulletItem>
                <BulletItem>Communicate updates and announcements</BulletItem>
                <BulletItem>Ensure security and prevent fraud</BulletItem>
              </ul>

              <h3 style={S.h3}>4. Community Features</h3>
              <p style={S.p}>
                Users may voluntarily share content, comments, posts, and discussions within community sections. Such content may be visible to other users.
              </p>

              <h3 style={S.h3}>5. Cookies and Analytics</h3>
              <p style={S.p}>
                We may use cookies and analytics tools to improve user experience and understand platform usage.
              </p>

              <h3 style={S.h3}>6. Data Security</h3>
              <p style={S.p}>
                We implement reasonable technical and organizational measures to protect personal information from unauthorized access, disclosure, or misuse.
              </p>

              <h3 style={S.h3}>7. Third-Party Services</h3>
              <p style={S.p}>We may use trusted third-party services including:</p>
              <ul style={S.list}>
                <BulletItem>Payment Gateways</BulletItem>
                <BulletItem>Analytics Providers</BulletItem>
                <BulletItem>Cloud Hosting Providers</BulletItem>
                <BulletItem>Communication Platforms</BulletItem>
              </ul>

              <h3 style={S.h3}>8. User Rights</h3>
              <p style={S.p}>Users may request:</p>
              <ul style={S.list}>
                <BulletItem>Access to their data</BulletItem>
                <BulletItem>Correction of inaccurate data</BulletItem>
                <BulletItem>Deletion of personal information</BulletItem>
                <BulletItem>Withdrawal of consent where applicable</BulletItem>
              </ul>

              <h3 style={S.h3}>9. Children's Privacy</h3>
              <p style={S.p}>
                Our services are not intended for children under the age of 13 without parental supervision.
              </p>

              <h3 style={S.h3}>10. Changes to this Policy</h3>
              <p style={S.p}>
                STARTUPS INDIA reserves the right to update this Privacy Policy at any time. Updates will be posted on this page.
              </p>

              <h3 style={S.h3}>11. Contact Us</h3>
              <p style={S.p}>
                STARTUPS INDIA<br />
                Email: <a href="mailto:support@startupsindia.in" style={S.link}>support@startupsindia.in</a><br />
                Website: <a href="https://www.startupsindia.in" style={S.link} target="_blank" rel="noopener noreferrer">www.startupsindia.in</a>
              </p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div style={S.section}>
              <h2 style={S.h2}>Terms & Conditions</h2>
              <p style={S.p}>
                By accessing or using STARTUPS INDIA's website, mobile application, community platforms, courses, events, or services, you agree to comply with these Terms and Conditions.
              </p>
              
              <h3 style={S.h3}>1. Services</h3>
              <p style={S.p}>STARTUPS INDIA provides:</p>
              <ul style={S.list}>
                <BulletItem>Startup Ecosystem Services</BulletItem>
                <BulletItem>Community Networking</BulletItem>
                <BulletItem>Media and Educational Content</BulletItem>
                <BulletItem>Online Courses</BulletItem>
                <BulletItem>Events and Workshops</BulletItem>
                <BulletItem>Business Support Programs</BulletItem>
              </ul>

              <h3 style={S.h3}>2. User Accounts</h3>
              <p style={S.p}>Users are responsible for:</p>
              <ul style={S.list}>
                <BulletItem>Maintaining account confidentiality</BulletItem>
                <BulletItem>Providing accurate information</BulletItem>
                <BulletItem>Activities conducted under their account</BulletItem>
              </ul>

              <h3 style={S.h3}>3. Acceptable Use</h3>
              <p style={S.p}>Users shall not:</p>
              <ul style={S.list}>
                <BulletItem>Violate any laws</BulletItem>
                <BulletItem>Upload harmful content</BulletItem>
                <BulletItem>Attempt unauthorized access</BulletItem>
                <BulletItem>Disrupt platform operations</BulletItem>
                <BulletItem>Harass other users</BulletItem>
              </ul>

              <h3 style={S.h3}>4. Community Conduct</h3>
              <p style={S.p}>
                Users must maintain professional and respectful communication within communities and discussion forums.
              </p>

              <h3 style={S.h3}>5. Intellectual Property</h3>
              <p style={S.p}>
                All content, branding, logos, designs, videos, courses, and materials available on STARTUPS INDIA are protected by intellectual property laws.
              </p>
              <p style={S.p}>
                Users may not copy, distribute, reproduce, or resell content without written permission.
              </p>

              <h3 style={S.h3}>6. Course Access</h3>
              <p style={S.p}>
                Course access is granted for personal educational purposes only. Sharing login credentials or course materials is prohibited.
              </p>

              <h3 style={S.h3}>7. Events</h3>
              <p style={S.p}>
                Event schedules, speakers, and formats may change without prior notice when necessary.
              </p>

              <h3 style={S.h3}>8. Limitation of Liability</h3>
              <p style={S.p}>
                STARTUPS INDIA shall not be liable for indirect, incidental, or consequential damages arising from platform usage.
              </p>

              <h3 style={S.h3}>9. Termination</h3>
              <p style={S.p}>
                We reserve the right to suspend or terminate accounts that violate these Terms.
              </p>

              <h3 style={S.h3}>10. Changes to Terms</h3>
              <p style={S.p}>
                STARTUPS INDIA may modify these Terms at any time.
              </p>

              <h3 style={S.h3}>11. Governing Law</h3>
              <p style={S.p}>
                These Terms shall be governed by the laws of India.
              </p>
            </div>
          )}

          {activeTab === 'refund' && (
            <div style={S.section}>
              <h2 style={S.h2}>Refund & Cancellation Policy</h2>
              
              <h3 style={S.h3}>1. Online Courses</h3>
              <p style={S.p}>
                Digital courses are generally non-refundable once access has been granted. Refund requests may be reviewed on a case-by-case basis within 7 days of purchase.
              </p>

              <h3 style={S.h3}>2. Events & Workshops</h3>
              <p style={S.p}>
                Cancellation requests received at least 7 days before the event may be eligible for a refund. No refund may be provided for cancellations made within 7 days of the event.
              </p>

              <h3 style={S.h3}>3. Memberships & Subscriptions</h3>
              <p style={S.p}>
                Subscription fees are generally non-refundable unless required by applicable law. Users may cancel future renewals according to subscription settings.
              </p>

              <h3 style={S.h3}>4. Failed Transactions</h3>
              <p style={S.p}>
                If an amount is deducted but services are not delivered, users may contact support for resolution.
              </p>

              <h3 style={S.h3}>5. Processing Time</h3>
              <p style={S.p}>
                Approved refunds may take 7–15 business days to reflect in the original payment method.
              </p>

              <h3 style={S.h3}>6. Contact</h3>
              <p style={S.p}>
                For refund-related concerns:<br />
                Email: <a href="mailto:support@startupsindia.in" style={S.link}>support@startupsindia.in</a><br />
                Website: <a href="https://www.startupsindia.in" style={S.link} target="_blank" rel="noopener noreferrer">www.startupsindia.in</a>
              </p>
            </div>
          )}

          {/* Footer nav */}
          <div style={S.footerNav}>
            {[['/', 'Home'], ['/terms', 'Terms of Service'], ['/privacy', 'Privacy Policy'], ['/cookies', 'Cookie Policy']].map(([href, label]) => (
              <Link key={href} href={href} style={S.footerLink}>{label}</Link>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
