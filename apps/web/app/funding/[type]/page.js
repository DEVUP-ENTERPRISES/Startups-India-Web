'use client';

import Link from 'next/link';

const FUNDING_DATA = {
  'pre-seed': {
    display: 'Pre-Seed', emoji: '🌱',
    tagline: 'Raise Your First Pre-Seed Round in India — Complete Founder Guide',
    description: 'Pre-seed funding in India is the first institutional money a startup raises — typically ₹10L to ₹1Cr — to build an MVP, validate market fit, and prepare for a seed round. Pre-seed capital in India comes from friends & family, angel investors, incubators, accelerators, and early-stage micro-VCs.',
    rangeInr: '₹10L – ₹1Cr',
    stage: 'Idea / Pre-MVP / MVP Stage',
    dilution: '5–15%',
    timeline: '1–3 months',
    keyInvestors: ['AngelList India', 'Titan Capital', '100X.VC', 'Powerhouse Ventures', 'PointOne Capital', 'Antler India', 'Lead Angels', 'Maharashtra Angel Network'],
    useCases: ['Build MVP (2–6 months runway)', 'First 1–3 hires', 'Customer discovery & validation', 'Legal entity setup (Pvt Ltd, DPIIT)', 'Initial GTM and pilot customers'],
    faqs: [
      {
        q: 'What is pre-seed funding in India?',
        a: 'Pre-seed funding is the earliest stage of startup financing in India — typically ₹10L to ₹1Cr raised from friends & family, angel investors, or incubators. It\'s used to build an MVP, hire the first team member, and validate your business hypothesis before raising a formal seed round.',
      },
      {
        q: 'How do I raise pre-seed funding in India?',
        a: 'To raise pre-seed funding in India: 1) Build a compelling problem-solution thesis with early customer evidence, 2) Create a 10-slide pitch deck with team, market, and MVP plan, 3) Apply to incubators (100X.VC, Antler, Startups India), 4) Network with angel investors in your sector, 5) Use AngelList India and LetsVenture to connect with angels.',
      },
      {
        q: 'Do I need a product to raise pre-seed funding in India?',
        a: 'Not always. Pre-seed investors in India often back the team and the problem thesis more than the product. A strong founding team with domain expertise, a clear problem statement, and early customer conversations (even without a product) can raise pre-seed. What investors want: proof you understand the problem better than anyone else.',
      },
      {
        q: 'What valuation should I expect at pre-seed in India?',
        a: 'Pre-money valuations at pre-seed in India typically range from ₹1Cr to ₹5Cr for first-time founders, and ₹3Cr to ₹15Cr for second-time or pedigree founders (IIT/IIM, ex-FAANG, prior startup exit). Dilution is usually 10–20%. Use SAFE notes (Simple Agreement for Future Equity) to avoid premature valuation conversations.',
      },
    ],
    howTo: {
      title: 'How to Raise Pre-Seed Funding in India: Step-by-Step',
      steps: [
        { name: 'Document Your Problem & Vision', text: 'Write a clear 1-page problem statement: who suffers, why now, why you, and your unfair advantage. This becomes the foundation of your investor narrative.' },
        { name: 'Build a Minimal Viable Pitch', text: 'Create a 10-slide deck: Problem, Solution, Why Now, Market Size, MVP Plan, Team, Traction (even 5 user interviews), Ask, and Use of Funds. Skip financial projections at pre-seed — investors don\'t trust them anyway.' },
        { name: 'Apply to Pre-Seed Programs', text: 'Apply to Antler India, 100X.VC, Powerhouse Ventures, Startups India, and your city\'s top incubator. These programs write checks at pre-seed and provide structure without requiring a warm intro.' },
        { name: 'Build an Angel Pipeline', text: 'Target 30 angels in your sector. Get 3 warm intros per week. Tools: AngelList India, LetsVenture, LinkedIn. Start with angels who have built companies similar to yours — they\'re the most valuable.' },
        { name: 'Use SAFE Notes to Close Fast', text: 'Raise pre-seed on a SAFE note (iSAFE for India) with a valuation cap of ₹5–15Cr. This avoids complex term sheet negotiations and lets you close within 2–4 weeks per investor.' },
      ],
    },
  },
  'angel': {
    display: 'Angel', emoji: '😇',
    tagline: 'Raise Angel Investment for Your Startup in India — 2025 Guide',
    description: 'Angel investment in India comes from high-net-worth individuals (HNIs) who invest ₹5L to ₹2Cr of personal money in early-stage startups in exchange for equity. India has 10,000+ active angel investors across cities, sector-specific angel networks, and family office angels who are the backbone of the early-stage startup ecosystem.',
    rangeInr: '₹5L – ₹2Cr per angel',
    stage: 'Pre-Seed to Seed',
    dilution: '5–20% (combined)',
    timeline: '2–6 months',
    keyInvestors: ['Indian Angel Network (IAN)', 'Mumbai Angels', 'Lead Angels', 'Chennai Angels', 'Hyderabad Angels', 'Ah! Ventures', 'Venture Catalysts', ' CIIE.CO Angels'],
    useCases: ['MVP development', 'First product-market fit test', '3–6 months runway', 'First B2B pilots', 'Founding team salaries'],
    faqs: [
      {
        q: 'What is angel investment for startups in India?',
        a: 'Angel investment is early-stage funding from wealthy individuals (HNIs) who invest personal money (₹5L–₹2Cr) in startups in exchange for equity (1–5% per angel). Angels in India typically back idea-stage or MVP-stage startups before VCs enter. They also provide mentorship, networks, and customer introductions.',
      },
      {
        q: 'How do I find angel investors in India?',
        a: 'Find angel investors in India via: Indian Angel Network (IAN), Mumbai Angels, Lead Angels, Venture Catalysts, AngelList India, LetsVenture, and LinkedIn. The fastest path is warm introductions from other funded founders, incubator networks, or accelerator alumni. Cold outreach works too — personalize every message.',
      },
      {
        q: 'How long does it take to raise angel funding in India?',
        a: 'Raising angel funding in India typically takes 2–6 months. Building the pipeline takes 4–6 weeks; due diligence takes 2–4 weeks; paperwork (SHA, SPA, DPIIT exemption) takes 2–4 weeks. Speed up by running multiple conversations in parallel, using SAFE notes instead of priced rounds, and getting one lead angel who can anchor the round.',
      },
      {
        q: 'What equity do angel investors take in Indian startups?',
        a: 'Individual angels in India typically take 0.5–5% equity per investment. A full angel round of ₹50L–₹2Cr usually results in 10–25% dilution across 5–15 angels. Use a cap table model before raising to understand dilution impact on future rounds.',
      },
    ],
    howTo: {
      title: 'How to Raise Angel Funding in India: Step-by-Step',
      steps: [
        { name: 'Get DPIIT Startup India Recognition', text: 'Register at startupindia.gov.in and get DPIIT recognition. This gives tax benefits to your angel investors (Section 56(2)(viib) exemption) and makes them more likely to invest. Takes 2–3 weeks.' },
        { name: 'Build Your Target Investor List', text: 'Research 50 angels who have invested in startups like yours. Prioritize: operator angels (founders who built similar companies), domain angels (ex-executives in your sector), and network angels (who can open doors to VCs).' },
        { name: 'Get Warm Introductions', text: 'Cold emails to angels convert at <5%. Warm intros convert at 30–50%. Ask every founder, professor, and mentor you know for 3 intros. One quality intro per week is better than 20 cold emails.' },
        { name: 'Run a Fast, Focused Process', text: 'Don\'t negotiate term by term with each angel. Set a round structure (₹1Cr at ₹6Cr cap via iSAFE), send the same docs to everyone, set a closing date 8 weeks out, and create urgency with early commitments from 1–2 lead angels.' },
        { name: 'Close Paperwork Correctly', text: 'Use a startup lawyer for SHA, SPA, and DPIIT exemption filing. Cost: ₹30,000–₹1L. Don\'t skip legal docs — disputes with early angels can kill later VC rounds. File foreign investment (FEMA) compliance if any NRI angel invests.' },
      ],
    },
  },
  'venture-capital': {
    display: 'Venture Capital', emoji: '🏦',
    tagline: 'Raise Venture Capital Funding for Your Startup in India — VC Guide',
    description: 'Venture capital funding in India has grown to $12B+ annually, with 200+ active VC firms investing from pre-seed to growth stage. Indian VCs like Sequoia India, Accel, Blume Ventures, Nexus, and Elevation Capital have backed India\'s most successful startups. Raising VC requires strong traction, a scalable business model, and a large addressable market.',
    rangeInr: '₹1Cr – ₹500Cr+',
    stage: 'Seed to Series C+',
    dilution: '15–30% per round',
    timeline: '3–9 months',
    keyInvestors: ['Sequoia Capital India', 'Accel India', 'Blume Ventures', 'Nexus Venture Partners', 'Elevation Capital', 'Kalaari Capital', 'Matrix Partners India', '3one4 Capital'],
    useCases: ['Aggressive team expansion', 'Product scaling and R&D', 'Geographic expansion', 'Sales & marketing at scale', 'M&A and strategic acquisitions'],
    faqs: [
      {
        q: 'How does venture capital work for Indian startups?',
        a: 'VC firms in India raise money from LPs (pension funds, family offices, HNIs) and invest it in high-growth startups in exchange for equity (15–30% per round). In return for capital, VCs get board seats, pro-rata rights, and information rights. They aim for 10–100x returns by helping portfolio companies scale and exit via IPO or acquisition.',
      },
      {
        q: 'What do Indian VCs look for before investing?',
        a: 'Indian VCs evaluate: large market (₹10,000Cr+ TAM), strong founding team (domain expertise + execution ability), product-market fit evidence (strong retention, organic growth, NPS), scalable business model (unit economics: LTV > 3x CAC), defensibility (network effects, switching costs, IP), and growth trajectory (MoM growth >15–20%).',
      },
      {
        q: 'How do I approach VCs in India?',
        a: 'The best path to Indian VCs: warm intro from a portfolio founder (converts 5–10x better than cold), follow VCs on Twitter/LinkedIn and engage with their content, apply via their portfolio company network, or attend VC-hosted events. Cold emails work if highly personalized — reference a specific portfolio company and why you\'re similar/different.',
      },
      {
        q: 'How long does it take to close a VC round in India?',
        a: 'Closing a VC round in India typically takes 3–6 months from first meeting to wire. Stages: sourcing & pitch (4–8 weeks), term sheet (2–4 weeks post-pitch), due diligence (4–8 weeks), legal & closing (3–6 weeks). Seed rounds can close faster (6–12 weeks total). Series A takes longer due to deeper diligence.',
      },
    ],
    howTo: {
      title: 'How to Raise Venture Capital in India: Step-by-Step',
      steps: [
        { name: 'Build Metrics That Compel VCs', text: 'Before approaching VCs: show MoM growth >15–20%, low churn (<5%/month for SaaS), strong NPS (>50), and clear unit economics. VCs pattern-match to their best investments — be the data they want to see.' },
        { name: 'Create a 10-Slide VC-Ready Deck', text: 'Cover: Team, Problem, Solution, Market, Business Model, Traction, Competition, Roadmap, Ask, Financials (3-year model). Be brutally honest about risks — VCs know the space and will catch spin.' },
        { name: 'Build a Targeted VC List', text: 'Map 20 VCs by stage (seed, Series A), sector (fintech, consumer, B2B SaaS), and check size. Prioritize VCs who have invested in adjacent companies — they understand the market fastest.' },
        { name: 'Get Warm Intros to GPs/Partners', text: 'Email 10 portfolio founders of your target VCs and ask for an intro. A founder intro to a GP converts at 30–50%. A cold email converts at <1%. Time spent on intros > time spent on deck polish.' },
        { name: 'Run a Competitive Process', text: 'Approach 5–8 VCs simultaneously. Getting a term sheet from one creates urgency for others. Be transparent: "We\'re in conversations with 3 other firms and expect a term sheet by [date]." This is standard and expected.' },
      ],
    },
  },
  'grants': {
    display: 'Government Grants', emoji: '🏛️',
    tagline: 'Get Non-Dilutive Government Grants for Your Startup in India',
    description: 'Government grants for Indian startups provide non-dilutive funding — you don\'t give up equity. India\'s government offers ₹500Cr+ in annual startup grants through programs like BIRAC BIG, TIDE 2.0, NIDHI PRAYAS, DST NIDHI, and Startup India Seed Fund. Grants are ideal for deep-tech, social impact, agritech, and research-based startups.',
    rangeInr: '₹5L – ₹2Cr (non-dilutive)',
    stage: 'Idea to Prototype',
    dilution: '0% (non-dilutive)',
    timeline: '3–9 months to receive',
    keyInvestors: ['BIRAC BIG Grant', 'DST NIDHI PRAYAS', 'TIDE 2.0 (MeitY)', 'Startup India Seed Fund Scheme (SISFS)', 'MSME Technology Upgradation Scheme', 'AIM ATAL Innovation Mission', 'NABARD AgriTech Fund'],
    useCases: ['R&D and prototype development', 'Technology validation', 'Clinical trials (biotech)', 'Social impact proof-of-concept', 'Export market entry (MSME)', 'IP filing and patent costs'],
    faqs: [
      {
        q: 'What government grants are available for startups in India?',
        a: 'Key government grants for Indian startups include: BIRAC BIG Grant (₹50L for biotech), NIDHI PRAYAS (₹10L for prototype), TIDE 2.0 by MeitY (₹75L for tech startups), Startup India Seed Fund (₹20L–₹2Cr via incubators), AIM grants via Atal Innovation Mission, and MSME schemes for traditional businesses. Total government startup grants exceed ₹500Cr annually.',
      },
      {
        q: 'How do I apply for government startup grants in India?',
        a: 'Apply for government grants in India via the respective scheme portals (startup.gov.in, birac.nic.in, meity.gov.in). Steps: 1) Get DPIIT Startup India recognition, 2) Check eligibility for each scheme (sector, stage, entity type), 3) Prepare application with business plan, financial projections, and technical proposal, 4) Submit and attend evaluation calls. Most grants involve 2–3 rounds of review.',
      },
      {
        q: 'Are government grants better than VC funding for startups in India?',
        a: 'For early-stage deep-tech, biotech, agritech, and social impact startups, government grants are better because: zero dilution, validates technology before VC, signals government backing to future investors, and government is sometimes the first customer. Grants and VC are not mutually exclusive — many startups use grants to reduce burn while pursuing VC.',
      },
    ],
    howTo: {
      title: 'How to Win Government Startup Grants in India',
      steps: [
        { name: 'Get DPIIT Recognition First', text: 'All government grants require DPIIT Startup India recognition. Apply at startupindia.gov.in — it\'s free and takes 2–3 weeks. This unlocks tax benefits, easier government contracts, and grant eligibility.' },
        { name: 'Identify the Right Grant Scheme', text: 'Match your startup to the right scheme: Biotech → BIRAC BIG; Deep-tech prototype → NIDHI PRAYAS; Software/tech → TIDE 2.0; General → Startup India Seed Fund via your incubator. Don\'t apply to all — each application takes 20–40 hours.' },
        { name: 'Write a Strong Technical Proposal', text: 'Government grant applications are evaluated on: problem statement, technical innovation (is it novel?), commercialization plan, social/economic impact, and team credentials. Hire a grant writing consultant (cost: ₹20,000–₹80,000) if your first application is large (₹50L+).' },
        { name: 'Join an Incubator for SISFS Access', text: 'The Startup India Seed Fund Scheme (up to ₹2Cr) is disbursed via registered incubators. Apply to an SISFS-registered incubator at your IIT, IIM, or state technology park to access this fund with better success rates.' },
        { name: 'Track Disbursement & Reporting Carefully', text: 'Government grants come with reporting obligations: quarterly progress reports, utilization certificates, and periodic audits. Assign one team member to manage grant compliance — delays in reporting can hold future disbursements.' },
      ],
    },
  },
};

const DEFAULT_FUNDING = (type) => {
  const display = type.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return {
    display,
    emoji: '💰',
    tagline: `${display} Funding for Indian Startups — Complete Guide ${new Date().getFullYear()}`,
    description: `${display} is one of the funding pathways available to Indian startups looking to raise capital. This guide covers how ${display.toLowerCase()} works in India, who provides it, how to raise it, and what to watch out for as an Indian founder.`,
    rangeInr: 'Varies',
    stage: 'Varies by investor',
    dilution: 'Varies',
    timeline: '1–6 months',
    keyInvestors: ['Angel investors', 'VC firms', 'Incubators', 'Government schemes', 'Corporate venture arms'],
    useCases: ['Product development', 'Team hiring', 'Market expansion', 'Sales & marketing', 'Working capital'],
    faqs: [
      {
        q: `What is ${display.toLowerCase()} for startups in India?`,
        a: `${display} is a form of startup funding in India that provides capital to early-stage and growth-stage startups. Indian startups can raise ${display.toLowerCase()} from multiple sources including angel investors, VC firms, government programs, and incubators.`,
      },
      {
        q: `How do I raise ${display.toLowerCase()} for my startup in India?`,
        a: `To raise ${display.toLowerCase()} in India: build a compelling pitch deck, get DPIIT Startup India recognition, network with relevant investors, and apply to startup programs. Warm introductions from fellow founders and incubator networks are the fastest path to closing any funding round.`,
      },
    ],
    howTo: {
      title: `How to Raise ${display} for Your Startup in India`,
      steps: [
        { name: 'Get DPIIT Recognition', text: 'Register your startup at startupindia.gov.in and obtain DPIIT recognition. This is required for most government funding programs and provides tax benefits to your investors.' },
        { name: 'Build a Fundable Pitch Deck', text: 'Create a 10-slide deck: Problem, Solution, Market, Product, Traction, Team, Business Model, Competition, Financials, and Ask. Tailor it to your target investors\' portfolio and thesis.' },
        { name: 'Create Your Investor Pipeline', text: 'Identify 30–50 potential investors for this funding type. Prioritize warm introductions over cold outreach. One quality intro per day is better than 10 cold emails.' },
        { name: 'Run a Parallel Process', text: 'Approach multiple investors simultaneously. Create urgency with a closing date. First commitments from strong investors bring others in faster.' },
        { name: 'Close Correctly with Legal Support', text: 'Use a startup lawyer for term sheets and shareholder agreements. Don\'t skip legal documentation — it protects you in future rounds and exits.' },
      ],
    },
  };
};

export default function FundingTypePage({ params }) {
  const type = params?.type || 'pre-seed';
  const data = FUNDING_DATA[type] || DEFAULT_FUNDING(type);
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
      '@type': 'HowTo',
      name: data.howTo.title,
      description: `Complete step-by-step guide: ${data.howTo.title}`,
      step: data.howTo.steps.map((s, i) => ({
        '@type': 'HowToStep',
        position: i + 1,
        name: s.name,
        text: s.text,
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://startupsindia.in' },
        { '@type': 'ListItem', position: 2, name: 'Startup Funding', item: 'https://startupsindia.in/funding' },
        { '@type': 'ListItem', position: 3, name: `${data.display} Funding India ${year}` },
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
        <Link href="/">Home</Link> › <Link href="/source">Resources</Link> › <span>Startup Funding</span> › {data.display}
      </nav>

      {/* Hero */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>{data.emoji}</div>
        <h1 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 800, color: '#0f172a', lineHeight: 1.2, marginBottom: 12 }}>
          {data.display} Funding for Indian Startups {year} — Complete Guide
        </h1>
        <p className="speakable" style={{ fontSize: 16, color: '#475569', lineHeight: 1.7, maxWidth: 760, marginBottom: 8 }}>
          {data.tagline}
        </p>
        <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.7, maxWidth: 760 }}>
          {data.description}
        </p>
      </div>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginBottom: 40 }}>
        {[
          { label: 'Typical Range', value: data.rangeInr },
          { label: 'Startup Stage', value: data.stage },
          { label: 'Typical Dilution', value: data.dilution },
          { label: 'Time to Close', value: data.timeline },
        ].map((s, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{s.label}</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Key Investors */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 14, color: '#1e293b' }}>
          Top {data.display} Investors & Programs in India
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {data.keyInvestors.map((inv, i) => (
            <span key={i} style={{ padding: '8px 16px', background: '#fef9ec', border: '1px solid #fde68a', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#92400e' }}>
              {inv}
            </span>
          ))}
        </div>
      </section>

      {/* Use of Funds */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 14, color: '#1e293b' }}>
          How Startups Use {data.display} Funding
        </h2>
        <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10, padding: 0, listStyle: 'none' }}>
          {data.useCases.map((u, i) => (
            <li key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '12px 16px', fontSize: 14, color: '#334155', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: '#3b82f6', fontWeight: 700 }}>→</span> {u}
            </li>
          ))}
        </ul>
      </section>

      {/* HowTo Steps */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20, color: '#1e293b' }}>
          {data.howTo.title}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {data.howTo.steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 16, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '18px 20px' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #e63946, #c1121f)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, flexShrink: 0 }}>
                {i + 1}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#1e293b', marginBottom: 5 }}>{step.name}</div>
                <div style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7 }}>{step.text}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20, color: '#1e293b' }}>
          FAQs: {data.display} Funding for Indian Startups
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

      {/* Related Funding Types */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 14, color: '#1e293b' }}>
          Other Startup Funding Types in India
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {['pre-seed', 'seed', 'angel', 'venture-capital', 'series-a', 'grants', 'government-schemes', 'revenue-based', 'crowdfunding']
            .filter(t => t !== type)
            .map(t => (
              <Link key={t} href={`/funding/${t}`} style={{ padding: '7px 14px', background: '#f1f5f9', borderRadius: 20, fontSize: 13, color: '#475569', textDecoration: 'none', border: '1px solid #e2e8f0', fontWeight: 500 }}>
                {t.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} India
              </Link>
            ))}
        </div>
      </section>

      {/* CTA */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', borderRadius: 16, padding: '32px', textAlign: 'center', color: '#fff' }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Ready to Raise {data.display} Funding?</h2>
        <p style={{ marginBottom: 20, opacity: 0.8, fontSize: 15 }}>Join thousands of Indian founders who have raised funding through Startups India's incubation and mentorship programs.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/programs" style={{ background: '#e63946', color: '#fff', padding: '12px 24px', borderRadius: 10, fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>Apply to Incubation Program</Link>
          <Link href="/mentors" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '12px 24px', borderRadius: 10, fontWeight: 700, textDecoration: 'none', fontSize: 14, border: '1px solid rgba(255,255,255,0.2)' }}>Find a Funding Mentor</Link>
        </div>
      </div>
    </div>
  );
}
