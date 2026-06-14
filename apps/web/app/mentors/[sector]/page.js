'use client';

import Link from 'next/link';

const MENTOR_DATA = {
  fintech: {
    display: 'Fintech', emoji: '💳',
    tagline: 'Connect with India\'s Top Fintech Startup Mentors & Advisors',
    description: 'Find experienced fintech mentors in India — from payments, lending, and insurtech to wealthtech, neobanks, and CBDC. Our fintech mentor network includes founders of unicorns, ex-RBI officials, investment bankers, and serial fintech entrepreneurs who have built and scaled companies across India and Southeast Asia.',
    mentorTypes: ['Payments & UPI Experts', 'Lending & Credit Founders', 'InsurTech Builders', 'WealthTech Advisors', 'B2B Fintech CXOs', 'Angel Investors (Fintech)'],
    mentorSkills: ['Product-Market Fit in Fintech', 'RBI Regulatory Compliance', 'Fundraising from FinTech VCs', 'Building Lending Products', 'UPI & Payments Stack', 'Financial Modeling for Fintech'],
    topMentors: [
      { name: 'Ex-Razorpay Founder Network', expertise: 'Payments & Fintech Product' },
      { name: 'RBI Regulatory Advisors', expertise: 'Compliance & Licensing' },
      { name: 'VC Investors (Fintech Focus)', expertise: 'Funding Strategy' },
      { name: 'Neo-banking Founders', expertise: 'B2C Fintech Growth' },
    ],
    faqs: [
      {
        q: 'How do I find a fintech mentor in India?',
        a: 'Find fintech mentors in India on Startups India, LinkedIn, AngelList, and TiE mentorship programs. Look for mentors with direct experience building or investing in fintech startups — ideally those who have navigated RBI regulations, built payment products, or raised fintech VC funding.',
      },
      {
        q: 'What can a fintech mentor help me with?',
        a: 'A fintech mentor in India can help with: RBI regulatory compliance and licensing (Payment Aggregator, NBFC, IRDAI), product-market fit in payments or lending, fundraising from fintech-focused VCs, go-to-market strategy for B2B or B2C fintech, and building your tech stack (UPI, NACH, GSTN).',
      },
      {
        q: 'How much does fintech mentorship cost in India?',
        a: 'Fintech mentorship costs vary: free community mentorship via Startups India and TiE networks, paid 1:1 advisory at ₹5,000–₹50,000/hour for senior fintech founders and ex-regulators, and equity-based advisory where mentors take 0.25–1% for ongoing support. Apply through Startups India for free program-based mentorship.',
      },
    ],
  },
  healthtech: {
    display: 'Healthtech', emoji: '🏥',
    tagline: 'Find Expert Healthtech Mentors for Your Healthcare Startup in India',
    description: 'Connect with healthtech mentors in India who have built telemedicine platforms, diagnostic tools, hospital management software, mental health apps, and medical devices. Our healthtech mentor network includes doctors turned entrepreneurs, digital health investors, pharma executives, and healthcare AI builders.',
    mentorTypes: ['Doctor-Entrepreneurs', 'MedTech Product Builders', 'Healthcare AI Experts', 'Hospital Management Veterans', 'Digital Health Investors', 'Pharma & BioTech Advisors'],
    mentorSkills: ['Clinical Validation', 'CDSCO & FDA Compliance', 'Hospital Partnership Strategy', 'Healthcare AI/ML', 'Medical Device Regulation', 'Rural Healthcare Distribution'],
    topMentors: [
      { name: 'Doctor-Founders (Telemedicine)', expertise: 'Healthcare Product & Clinical' },
      { name: 'CDSCO Regulatory Advisors', expertise: 'Medical Device Compliance' },
      { name: 'Healthcare VC Partners', expertise: 'Healthtech Fundraising' },
      { name: 'Hospital CIOs', expertise: 'Enterprise Sales in Healthcare' },
    ],
    faqs: [
      {
        q: 'How do I find a healthtech mentor in India?',
        a: 'Find healthtech mentors in India via Startups India, NASSCOM Healthcare, BIRAC mentors, IIT/IIM incubator networks, and healthcare-focused angel investors. Look for mentors with clinical background, regulatory expertise, or experience scaling healthtech startups to hospitals and B2C users.',
      },
      {
        q: 'What should I look for in a healthtech mentor?',
        a: 'Key qualities in a healthtech mentor: clinical domain expertise (if building diagnostic or clinical tools), regulatory knowledge (CDSCO, FDA, HIPAA/DPDP), experience with hospital or pharma enterprise sales cycles, and network with healthtech investors (Healthquad, Endiya Partners, Ankur Capital).',
      },
      {
        q: 'Do I need a medical degree to build a healthtech startup in India?',
        a: 'No, but having a clinical co-founder or advisor is highly recommended. Healthcare is a deeply regulated, trust-sensitive domain. A medical advisor can help validate your product clinically, navigate CDSCO approval, and build credibility with hospital buyers and patients.',
      },
    ],
  },
  edtech: {
    display: 'EdTech', emoji: '📚',
    tagline: 'Connect with Top EdTech Mentors for Your Education Startup in India',
    description: 'Find EdTech mentors in India who have built learning platforms, tutoring apps, test prep products, and skilling startups. Our edtech mentor network includes founders from India\'s largest edtech companies, school district leaders, university heads, and EdTech-focused investors who understand the nuances of building for students, teachers, and institutions.',
    mentorTypes: ['EdTech Founders (K-12, Higher Ed)', 'Curriculum Design Experts', 'Learning Science Researchers', 'School & College Sales Veterans', 'EdTech VC Investors', 'Skilling & Vocational Experts'],
    mentorSkills: ['Student Engagement & Retention', 'B2B Sales to Schools & Colleges', 'Learning Management Systems', 'Content Monetization', 'SWAYAM & NEP 2020 Compliance', 'Vernacular & Rural EdTech'],
    topMentors: [
      { name: 'Ex-BYJU\'S / Unacademy Leaders', expertise: 'EdTech Scale & Growth' },
      { name: 'School Principal Networks', expertise: 'Institutional Sales' },
      { name: 'EdTech Angel Investors', expertise: 'Pre-Seed Funding' },
      { name: 'Learning Scientists', expertise: 'Pedagogy & Curriculum Design' },
    ],
    faqs: [
      {
        q: 'How do I find an EdTech mentor in India?',
        a: 'Find EdTech mentors in India on Startups India, EdTech India community, FICCI ARISE, and LinkedIn EdTech groups. The best EdTech mentors have built and scaled education products in India — ideally with experience in your specific vertical (K-12, higher ed, upskilling, test prep).',
      },
      {
        q: 'What can an EdTech mentor help me with?',
        a: 'An EdTech mentor can help with: product design for learners and teachers, B2B sales cycles to schools and colleges, content strategy for engagement, navigating NEP 2020 and government EdTech programs (SWAYAM, PM eVIDYA), fundraising from EdTech VCs, and building for vernacular/rural audiences.',
      },
      {
        q: 'Is it hard to build an EdTech startup in India after the edtech bust?',
        a: 'The edtech correction (2022–2024) wiped out over-leveraged B2C tutoring apps. However, B2B EdTech (selling to schools, colleges, corporates), skilling/vocational platforms, AI-powered learning tools, and vernacular content remain strong opportunities. Investors are backing EdTech that has strong unit economics and proven outcomes.',
      },
    ],
  },
};

const DEFAULT_MENTOR_SECTOR = (sector) => {
  const display = sector.charAt(0).toUpperCase() + sector.slice(1).replace(/-/g, ' ');
  return {
    display,
    emoji: '🎯',
    tagline: `Find ${display} Startup Mentors & Advisors in India`,
    description: `Connect with experienced ${display} startup mentors in India. Our mentor network includes founders, investors, and domain experts who can guide your ${display} startup from idea to scale. Get mentorship in product, fundraising, go-to-market, regulatory compliance, and more.`,
    mentorTypes: ['Domain Experts', 'Angel Investors', 'Serial Entrepreneurs', 'Corporate Veterans', 'VC Partners', 'Technical Advisors'],
    mentorSkills: ['Product Strategy', 'Fundraising', 'Go-to-Market', 'Team Building', 'Financial Modeling', 'Regulatory Compliance'],
    topMentors: [],
    faqs: [
      {
        q: `How do I find a ${display} startup mentor in India?`,
        a: `Find ${display} mentors in India via Startups India, LinkedIn, AngelList, TiE chapters, and sector-specific industry associations. Look for mentors with direct experience in ${display} — ideally founders or investors who have built or funded companies in your exact space.`,
      },
      {
        q: `What should I look for in a ${display} startup mentor?`,
        a: `The best ${display} mentor for your startup has: direct domain experience (not just general startup knowledge), a relevant network (investors, customers, partners), willingness to make intros, honest about what they don't know, and time to be genuinely helpful. Equity-based advisors are more motivated than paid-by-hour ones.`,
      },
      {
        q: 'How do I structure a startup mentorship relationship?',
        a: 'Best practices for startup mentorship: Start with 3 specific goals for the mentorship. Meet bi-weekly with a clear agenda and prep. Give equity (0.1–0.5%) for high-commitment advisors. Don\'t ask for everything — come with specific, pre-researched questions. Send updates between calls to keep mentors engaged and informed.',
      },
    ],
  };
};

export default function MentorsSectorPage({ params }) {
  const sector = params?.sector || 'fintech';
  const data = MENTOR_DATA[sector] || DEFAULT_MENTOR_SECTOR(sector);
  const year = new Date().getFullYear();

  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: data.faqs.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `Top ${data.display} Startup Mentor Types in India`,
      description: `Types of ${data.display} mentors available for startups in India`,
      itemListElement: data.mentorTypes.map((m, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: m,
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://startupsindia.in' },
        { '@type': 'ListItem', position: 2, name: 'Startup Mentors', item: 'https://startupsindia.in/mentors' },
        { '@type': 'ListItem', position: 3, name: `${data.display} Mentors India` },
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
        <Link href="/">Home</Link> › <Link href="/mentors">Startup Mentors</Link> › {data.display}
      </nav>

      {/* Hero */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>{data.emoji}</div>
        <h1 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 800, color: '#0f172a', lineHeight: 1.2, marginBottom: 12 }}>
          {data.display} Startup Mentors in India {year} — Find Expert {data.display} Advisors
        </h1>
        <p className="speakable" style={{ fontSize: 16, color: '#475569', lineHeight: 1.7, maxWidth: 760, marginBottom: 8 }}>
          {data.tagline}
        </p>
        <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.7, maxWidth: 760 }}>
          {data.description}
        </p>
      </div>

      {/* Mentor Types */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 14, color: '#1e293b' }}>
          Types of {data.display} Mentors Available
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
          {data.mentorTypes.map((m, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, padding: '14px 16px', fontSize: 14, fontWeight: 600, color: '#1e293b', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: '#e63946', fontSize: 18 }}>→</span> {m}
            </div>
          ))}
        </div>
      </section>

      {/* Skills Mentors Cover */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 14, color: '#1e293b' }}>
          What {data.display} Mentors Can Help You With
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {data.mentorSkills.map((s, i) => (
            <span key={i} style={{ padding: '8px 16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 20, fontSize: 13, fontWeight: 600, color: '#166534' }}>
              {s}
            </span>
          ))}
        </div>
      </section>

      {/* Top Mentor Profiles */}
      {data.topMentors?.length > 0 && (
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 14, color: '#1e293b' }}>
            Top {data.display} Mentor Profiles on Startups India
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
            {data.topMentors.map((m, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '20px' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #e63946, #c1121f)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 18, marginBottom: 12 }}>
                  {m.name.charAt(0)}
                </div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#1e293b', marginBottom: 4 }}>{m.name}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>{m.expertise}</div>
                <Link href="/mentors" style={{ fontSize: 13, color: '#e63946', fontWeight: 600, textDecoration: 'none' }}>View Profile →</Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* How to Work with a Mentor */}
      <section style={{ marginBottom: 40, background: '#f8fafc', borderRadius: 16, padding: '28px' }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: '#1e293b' }}>
          How to Work with a {data.display} Mentor
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { step: '1', title: 'Apply to Startups India', desc: 'Create your startup profile and apply to the mentorship program. Share your startup stage, goals, and the specific {data.display} challenges you\'re facing.' },
            { step: '2', title: 'Get Matched with a Mentor', desc: `Our team matches you with ${data.display} mentors based on your sector focus, startup stage, and specific needs.` },
            { step: '3', title: 'Set Goals for the Relationship', desc: 'In your first session, define 3 specific outcomes: a fundraising close, a product decision, a market entry strategy. Clarity makes mentorship 10x more valuable.' },
            { step: '4', title: 'Meet Bi-weekly with Prep', desc: 'Come to every session with 3 specific questions, your latest metrics, and what you tried since last time. No prep = wasted mentor time.' },
            { step: '5', title: 'Give Equity for Deep Commitment', desc: 'For mentors who join as formal advisors, offer 0.1–0.5% equity with a 2-year vest. This aligns incentives and makes them true stakeholders in your success.' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#e63946', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, flexShrink: 0 }}>
                {item.step}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#1e293b', marginBottom: 3 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{item.desc.replace('{data.display}', data.display)}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20, color: '#1e293b' }}>
          FAQs: {data.display} Startup Mentorship in India
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {data.faqs.map((faq, i) => (
            <div key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '16px 20px' }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a', marginBottom: 8 }}>{faq.q}</div>
              <div style={{ fontSize: 14, color: '#475569', lineHeight: 1.7 }}>{faq.a}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Sector Navigation */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 14, color: '#1e293b' }}>
          Find Mentors in Other Startup Sectors
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {['fintech', 'healthtech', 'edtech', 'saas', 'd2c', 'agritech', 'cleantech', 'deeptech', 'spacetech', 'legaltech']
            .filter(s => s !== sector)
            .map(s => (
              <Link key={s} href={`/mentors/${s}`} style={{ padding: '7px 14px', background: '#f1f5f9', borderRadius: 20, fontSize: 13, color: '#475569', textDecoration: 'none', border: '1px solid #e2e8f0', fontWeight: 500 }}>
                {s.charAt(0).toUpperCase() + s.slice(1)} Mentors India
              </Link>
            ))}
        </div>
      </section>

      {/* CTA */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', borderRadius: 16, padding: '32px', textAlign: 'center', color: '#fff' }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Find Your {data.display} Mentor Today</h2>
        <p style={{ marginBottom: 20, opacity: 0.8, fontSize: 15 }}>Connect with India's best {data.display} founders, investors, and domain experts who can accelerate your startup journey.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/mentors" style={{ background: '#e63946', color: '#fff', padding: '12px 24px', borderRadius: 10, fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>Browse All Mentors</Link>
          <Link href="/programs" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '12px 24px', borderRadius: 10, fontWeight: 700, textDecoration: 'none', fontSize: 14, border: '1px solid rgba(255,255,255,0.2)' }}>Join Incubation Program</Link>
        </div>
      </div>
    </div>
  );
}
