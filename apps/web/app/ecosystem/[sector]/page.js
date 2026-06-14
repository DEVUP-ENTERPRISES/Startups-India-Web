'use client';

import Link from 'next/link';

const SECTOR_DATA = {
  fintech: {
    display: 'Fintech', emoji: '💳',
    tagline: 'Transforming Finance Through Technology',
    description: 'India\'s fintech sector is the third largest in the world, with 2,100+ startups and $29B+ in total funding. From digital payments to neo-banking, lending, insurtech, and wealthtech — Indian fintech is reshaping how 1.4 billion people access financial services.',
    stats: [{ label: 'Fintech Startups', value: '2,100+' }, { label: 'Total Funding', value: '$29B+' }, { label: 'Unicorns', value: '18+' }, { label: 'UPI Transactions/Month', value: '10B+' }],
    topCompanies: ['Razorpay', 'PhonePe', 'Paytm', 'Zerodha', 'Groww', 'CRED', 'BharatPe', 'Slice'],
    opportunities: ['Digital lending for underserved', 'Insurance distribution via tech', 'CBDC and digital rupee', 'Cross-border remittance', 'B2B payments infrastructure'],
  },
  healthtech: {
    display: 'Healthtech', emoji: '🏥',
    tagline: 'Making Healthcare Accessible Across India',
    description: 'India\'s healthtech ecosystem is booming with 5,000+ startups addressing healthcare access, telemedicine, diagnostics, mental health, and medical devices. The sector received $4B+ in funding and is poised for massive growth driven by India\'s digital health mission.',
    stats: [{ label: 'Healthtech Startups', value: '5,000+' }, { label: 'Total Funding', value: '$4B+' }, { label: 'Unicorns', value: '7+' }, { label: 'Telemedicine Users', value: '50M+' }],
    topCompanies: ['Practo', 'PharmEasy', 'Pristyn Care', 'MediBuddy', 'Niramai', '1mg', 'Portea', 'Mfine'],
    opportunities: ['Rural healthcare access', 'Mental health platforms', 'Diagnostic AI tools', 'Hospital management software', 'Senior care technology'],
  },
  edtech: {
    display: 'EdTech', emoji: '📚',
    tagline: 'Reimagining Education for 500 Million Learners',
    description: 'India has the world\'s largest youth population and one of the fastest-growing edtech markets. With 4,500+ edtech startups and $7B+ in funding, the sector spans K-12, higher education, upskilling, test prep, and corporate learning.',
    stats: [{ label: 'EdTech Startups', value: '4,500+' }, { label: 'Total Funding', value: '$7B+' }, { label: 'Unicorns', value: '11+' }, { label: 'Online Learners', value: '50M+' }],
    topCompanies: ['BYJU\'S', 'Unacademy', 'upGrad', 'Vedantu', 'Physics Wallah', 'Scaler', 'Simplilearn', 'Eruditus'],
    opportunities: ['Vernacular language learning', 'Skilling for gig economy', 'AI-powered personalized learning', 'Vocational training tech', 'Assessment and credentialing'],
  },
};

const DEFAULT_SECTOR = (sector) => ({
  display: sector.charAt(0).toUpperCase() + sector.slice(1),
  emoji: '🚀',
  tagline: `Building the Future of ${sector.charAt(0).toUpperCase() + sector.slice(1)} in India`,
  description: `India's ${sector} startup ecosystem is growing rapidly with hundreds of startups, significant venture capital investment, and government support. Startups India tracks the leading companies, investors, incubators, and opportunities in this sector.`,
  stats: [
    { label: 'Startups in Sector', value: '500+' },
    { label: 'Total Funding', value: '$1B+' },
    { label: 'Active Investors', value: '50+' },
    { label: 'Job Created', value: '10,000+' },
  ],
  topCompanies: [],
  opportunities: ['Market entry', 'Product innovation', 'Government contracts', 'Export opportunities', 'B2B partnerships'],
});

export default function EcosystemSectorPage({ params }) {
  const sector = params?.sector || 'general';
  const data = SECTOR_DATA[sector] || DEFAULT_SECTOR(sector);
  const year = new Date().getFullYear();

  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: `${data.display} Startups in India ${year}`,
      description: data.description,
      url: `https://startupsindia.in/ecosystem/${sector}`,
      about: { '@type': 'Thing', name: `${data.display} Startup Ecosystem India` },
      speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', 'h2', '.speakable'] },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: `What is the ${data.display} startup ecosystem in India?`,
          acceptedAnswer: { '@type': 'Answer', text: data.description },
        },
        {
          '@type': 'Question',
          name: `How do I start a ${data.display} startup in India?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `To start a ${data.display} startup in India: 1) Identify a problem in the ${data.display} space, 2) Validate with potential customers, 3) Build an MVP, 4) Apply for incubation programs like Startups India, 5) Seek sector-specific angel investors and VC firms, 6) Register your startup with DPIIT for tax benefits.`,
          },
        },
        {
          '@type': 'Question',
          name: `Which incubators support ${data.display} startups in India?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `Multiple incubators in India support ${data.display} startups including government-backed programs (BIRAC for biotech, NASSCOM for tech), IIT/IIM incubators, and private accelerators. Startups India connects ${data.display} founders with the right incubation program for their sector and stage.`,
          },
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://startupsindia.in' },
        { '@type': 'ListItem', position: 2, name: 'Startup Ecosystem', item: 'https://startupsindia.in/startup-ecosystem' },
        { '@type': 'ListItem', position: 3, name: `${data.display} Startups India` },
      ],
    },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, sans-serif' }}>
      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }} />
      ))}

      {/* Breadcrumb */}
      <nav style={{ fontSize: 13, color: '#64748b', marginBottom: 24 }}>
        <Link href="/">Home</Link> › <Link href="/startup-ecosystem">Startup Ecosystem</Link> › {data.display}
      </nav>

      {/* Hero */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>{data.emoji}</div>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, color: '#0f172a', lineHeight: 1.2, marginBottom: 12 }}>
          {data.display} Startups in India {year} — Ecosystem, Funding & Opportunities
        </h1>
        <p className="speakable" style={{ fontSize: 16, color: '#475569', lineHeight: 1.7, maxWidth: 760, marginBottom: 16 }}>
          {data.tagline}
        </p>
        <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.7, maxWidth: 760 }}>
          {data.description}
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 40, flexWrap: 'wrap' }}>
        {data.stats.map((s, i) => (
          <div key={i} style={{ flex: 1, minWidth: 130, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '16px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#e63946' }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Top Companies */}
      {data.topCompanies.length > 0 && (
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 14, color: '#1e293b' }}>
            Top {data.display} Startups in India
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {data.topCompanies.map((c, i) => (
              <span key={i} style={{ padding: '8px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, fontWeight: 600, color: '#1e293b' }}>
                {c}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Opportunities */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 14, color: '#1e293b' }}>
          {data.display} Startup Opportunities in India
        </h2>
        <ul style={{ paddingLeft: 20, fontSize: 15, color: '#475569', lineHeight: 2 }}>
          {data.opportunities.map((o, i) => <li key={i}>{o}</li>)}
        </ul>
      </section>

      {/* Related sectors */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 14, color: '#1e293b' }}>
          Explore Other Startup Sectors in India
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {['fintech', 'healthtech', 'edtech', 'agritech', 'saas', 'd2c', 'deeptech', 'cleantech', 'spacetech', 'foodtech']
            .filter(s => s !== sector)
            .map(s => (
              <Link key={s} href={`/ecosystem/${s}`} style={{ padding: '6px 14px', background: '#f1f5f9', borderRadius: 20, fontSize: 13, color: '#475569', textDecoration: 'none', border: '1px solid #e2e8f0', fontWeight: 500 }}>
                {s.charAt(0).toUpperCase() + s.slice(1)} Startups India
              </Link>
            ))}
        </div>
      </section>

      {/* CTA */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', borderRadius: 16, padding: '32px', textAlign: 'center', color: '#fff' }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Building a {data.display} Startup in India?</h2>
        <p style={{ marginBottom: 20, opacity: 0.8, fontSize: 15 }}>Apply for incubation, find mentors, and connect with the right investors for your {data.display} startup.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/programs" style={{ background: '#e63946', color: '#fff', padding: '12px 24px', borderRadius: 10, fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>Apply for Incubation</Link>
          <Link href={`/mentors/${sector}`} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '12px 24px', borderRadius: 10, fontWeight: 700, textDecoration: 'none', fontSize: 14, border: '1px solid rgba(255,255,255,0.2)' }}>Find {data.display} Mentors</Link>
        </div>
      </div>
    </div>
  );
}
