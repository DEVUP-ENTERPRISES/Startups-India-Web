'use client';

import { useMemo } from 'react';
import Link from 'next/link';

const CITY_META = {
  bangalore: { displayName: 'Bangalore', state: 'Karnataka', description: 'Silicon Valley of India with 400+ startups and top-tier tech incubators.' },
  mumbai: { displayName: 'Mumbai', state: 'Maharashtra', description: 'India\'s financial capital with a thriving fintech and D2C startup ecosystem.' },
  delhi: { displayName: 'Delhi NCR', state: 'Delhi', description: 'Government startup hub with strong policy support and enterprise ecosystem.' },
  hyderabad: { displayName: 'Hyderabad', state: 'Telangana', description: 'T-Hub and WE-Hub make Hyderabad one of India\'s fastest-growing startup cities.' },
  chennai: { displayName: 'Chennai', state: 'Tamil Nadu', description: 'Strong manufacturing and deeptech startup ecosystem in South India.' },
  pune: { displayName: 'Pune', state: 'Maharashtra', description: 'Emerging startup city with top engineering talent and EV/mobility focus.' },
  ahmedabad: { displayName: 'Ahmedabad', state: 'Gujarat', description: 'IIM Ahmedabad and GUSEC fuel a strong entrepreneurship culture.' },
  jaipur: { displayName: 'Jaipur', state: 'Rajasthan', description: 'Rising tier-2 startup city with strong D2C and handicrafts innovation.' },
  kochi: { displayName: 'Kochi', state: 'Kerala', description: 'Kerala Startup Mission drives one of India\'s best state startup ecosystems.' },
  kolkata: { displayName: 'Kolkata', state: 'West Bengal', description: 'Growing startup scene with focus on social enterprise and agritech.' },
  chandigarh: { displayName: 'Chandigarh', state: 'Punjab/Haryana', description: 'Planned city with growing startup ecosystem and IIT Ropar proximity.' },
  indore: { displayName: 'Indore', state: 'Madhya Pradesh', description: 'Fastest-growing startup hub in Central India with strong MSME support.' },
};

const FAQS_TEMPLATE = (city) => [
  {
    q: `What are the best startup incubators in ${city}?`,
    a: `${city} has several top startup incubators including government-backed and private programs. Startups India maintains the most up-to-date directory of incubators in ${city} with application details, focus sectors, and founder reviews.`,
  },
  {
    q: `How do I apply to a startup incubator in ${city}?`,
    a: `To apply to a startup incubator in ${city}, you typically need a business idea or early-stage startup, a founder team, and a pitch deck. Most incubators have an online application. Startups India lists all incubators in ${city} with direct application links.`,
  },
  {
    q: `Are there free incubators for startups in ${city}?`,
    a: `Yes, ${city} has government-backed incubators that offer free or equity-free support to early-stage startups. Programs like DPIIT-recognized incubators, IIT/IIM incubators, and state government programs often provide free incubation.`,
  },
  {
    q: `What sectors do incubators in ${city} focus on?`,
    a: `Startup incubators in ${city} support a wide range of sectors including fintech, healthtech, edtech, agritech, D2C, SaaS, deeptech, cleantech, and more. Sector-specific incubators also exist for focused support.`,
  },
];

export default function IncubatorsInCityPage({ params }) {
  const city = params?.city || 'india';
  const meta = CITY_META[city] || { displayName: city.charAt(0).toUpperCase() + city.slice(1), state: 'India', description: `Explore top startup incubators and programs in ${city}.` };
  const faqs = useMemo(() => FAQS_TEMPLATE(meta.displayName), [meta.displayName]);

  const citySchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Startup Incubators in ${meta.displayName}`,
    description: `Complete list of startup incubators and incubation programs in ${meta.displayName}, ${meta.state}, India.`,
    url: `https://startupsindia.in/incubators/${city}`,
    about: { '@type': 'Thing', name: `Startup Ecosystem ${meta.displayName}` },
    areaServed: { '@type': 'City', name: meta.displayName },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://startupsindia.in' },
      { '@type': 'ListItem', position: 2, name: 'Incubators', item: 'https://startupsindia.in/incubators' },
      { '@type': 'ListItem', position: 3, name: `Incubators in ${meta.displayName}` },
    ],
  };

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 20px', fontFamily: 'system-ui, sans-serif' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(citySchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" style={{ fontSize: 13, color: '#64748b', marginBottom: 24 }}>
        <Link href="/">Home</Link> › <Link href="/incubators">Incubators</Link> › Incubators in {meta.displayName}
      </nav>

      {/* H1 — primary keyword target */}
      <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: '#0f172a', marginBottom: 12, lineHeight: 1.2 }}>
        Startup Incubators in {meta.displayName} ({new Date().getFullYear()}) — Complete List
      </h1>

      <p className="speakable" style={{ fontSize: 16, color: '#475569', lineHeight: 1.7, marginBottom: 32, maxWidth: 720 }}>
        Discover the best startup incubators in {meta.displayName}, {meta.state}. {meta.description} Startups India maintains the most comprehensive, up-to-date directory of incubation programs, with details on eligibility, sectors, application process, and founder reviews.
      </p>

      {/* Stats bar */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 36, flexWrap: 'wrap' }}>
        {[
          { label: 'Incubators Listed', value: '15+' },
          { label: 'Startups Supported', value: '500+' },
          { label: 'Sectors Covered', value: '12+' },
          { label: 'Government Backed', value: '8+' },
        ].map((s, i) => (
          <div key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '14px 20px', textAlign: 'center', minWidth: 120 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#e63946' }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* What to expect */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16, color: '#1e293b' }}>
          What is a Startup Incubator in {meta.displayName}?
        </h2>
        <p className="speakable" style={{ fontSize: 15, color: '#475569', lineHeight: 1.7 }}>
          A startup incubator in {meta.displayName} is a program that supports early-stage startups by providing mentorship, co-working space, investor access, legal support, and a structured curriculum to help founders validate their ideas and build scalable businesses. {meta.displayName} has a mix of government-backed, university, and private incubators catering to sectors like fintech, healthtech, edtech, agritech, SaaS, D2C, and deeptech.
        </p>
      </section>

      {/* How to apply */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16, color: '#1e293b' }}>
          How to Apply to an Incubator in {meta.displayName}
        </h2>
        <ol style={{ paddingLeft: 20, fontSize: 15, color: '#475569', lineHeight: 1.9 }}>
          <li><strong>Prepare your startup concept</strong> — You don't need a registered company. An idea with a clear problem statement is enough for pre-incubation.</li>
          <li><strong>Build your pitch deck</strong> — Most incubators ask for a 10-15 slide pitch covering problem, solution, market, traction, and team.</li>
          <li><strong>Search and shortlist incubators</strong> — Filter by sector, stage, and whether you need equity-free support.</li>
          <li><strong>Submit your online application</strong> — Applications are usually open quarterly or annually.</li>
          <li><strong>Interview and selection</strong> — Shortlisted startups pitch to a selection committee for final admission.</li>
        </ol>
      </section>

      {/* FAQ */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16, color: '#1e293b' }}>
          Frequently Asked Questions — Incubators in {meta.displayName}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {faqs.map((f, i) => (
            <div key={i} style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: '16px 20px', background: '#fff' }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#1e293b', marginBottom: 6 }}>{f.q}</div>
              <div style={{ fontSize: 14, color: '#475569', lineHeight: 1.7 }}>{f.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Related cities */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 14, color: '#1e293b' }}>
          Explore Incubators in Other Cities
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {['bangalore', 'mumbai', 'delhi', 'hyderabad', 'chennai', 'pune', 'ahmedabad', 'jaipur', 'kochi', 'kolkata']
            .filter(c => c !== city)
            .map(c => (
              <Link key={c} href={`/incubators/${c}`} style={{ padding: '6px 14px', background: '#f1f5f9', borderRadius: 20, fontSize: 13, color: '#475569', textDecoration: 'none', border: '1px solid #e2e8f0', fontWeight: 500 }}>
                Incubators in {c.charAt(0).toUpperCase() + c.slice(1)}
              </Link>
            ))}
        </div>
      </section>

      {/* CTA */}
      <div style={{ background: 'linear-gradient(135deg, #e63946 0%, #be123c 100%)', borderRadius: 16, padding: '32px', textAlign: 'center', color: '#fff' }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Apply to Startups India Incubation Program</h2>
        <p style={{ marginBottom: 20, opacity: 0.9, fontSize: 15 }}>Join our structured incubation cohort — mentorship, investor access, and startup support.</p>
        <Link href="/programs" style={{ background: '#fff', color: '#e63946', padding: '12px 28px', borderRadius: 10, fontWeight: 700, textDecoration: 'none', fontSize: 15 }}>
          Apply Now →
        </Link>
      </div>
    </div>
  );
}
