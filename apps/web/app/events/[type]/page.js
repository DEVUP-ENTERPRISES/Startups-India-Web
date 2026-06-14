'use client';

import Link from 'next/link';

const EVENT_DATA = {
  hackathon: {
    display: 'Hackathons', emoji: '⚡',
    tagline: 'Build, Compete & Win at India\'s Top Startup Hackathons',
    description: 'Startup hackathons in India are the fastest way to validate ideas, build prototypes, and get noticed by investors and incubators. India hosts 500+ hackathons annually — from 24-hour coding sprints to week-long innovation challenges sponsored by MNCs, government, and startup ecosystems.',
    stats: [
      { label: 'Hackathons Per Year', value: '500+' },
      { label: 'Avg Prize Pool', value: '₹5L+' },
      { label: 'Top Organizers', value: '100+' },
      { label: 'Participants/Year', value: '2L+' },
    ],
    benefits: [
      'Win prize money and startup funding',
      'Get noticed by investors and incubators',
      'Build your MVP in 24–48 hours',
      'Expand your network with co-founders',
      'Get featured in startup media',
      'Direct access to industry mentors',
    ],
    topOrganizers: ['Smart India Hackathon', 'HackIndia', 'AngelHack', 'MLH', 'ETHIndia', 'HackBout', 'IIT Bombay Techfest', 'Flipkart Grid'],
    faqs: [
      {
        q: 'What is a startup hackathon in India?',
        a: 'A startup hackathon is a timed innovation competition (24–72 hours) where teams build working prototypes of startup ideas. Winners receive cash prizes, incubation opportunities, and investor introductions. India hosts 500+ hackathons per year including Smart India Hackathon, ETHIndia, and corporate hackathons.',
      },
      {
        q: 'How do I find hackathons in India?',
        a: 'You can find upcoming hackathons in India on Startups India, Devfolio, Unstop, HackerEarth, and LinkedIn. Filter by city (Bangalore, Mumbai, Delhi), domain (fintech, healthtech, AI), or format (online, in-person). Register early as top hackathons fill fast.',
      },
      {
        q: 'Do I need a team to participate in a hackathon?',
        a: 'Most hackathons allow both solo participants and teams of 2–5 members. Many events also have team formation sessions before the hack begins. If you don\'t have a team, attending the pre-hackathon networking is the best way to find co-founders with complementary skills.',
      },
      {
        q: 'What should I build at a startup hackathon?',
        a: 'Build a working MVP that solves a real problem — judges reward impact, innovation, and feasibility. Use no-code tools or existing APIs to ship faster. Prepare a clear 3-minute demo. Focus on the problem more than the tech.',
      },
    ],
    howTo: {
      title: 'How to Win a Startup Hackathon in India',
      steps: [
        { name: 'Find the Right Hackathon', text: 'Choose a hackathon aligned with your skills (tech, design, business) and interests. Check the problem statements, prize pool, and judges in advance.' },
        { name: 'Build a Strong Team', text: 'Ideal teams have a developer, designer, and business/domain expert. Diverse teams win more often. Use pre-hack networking sessions if you need teammates.' },
        { name: 'Validate the Problem First', text: 'Spend the first hour defining the exact problem. Interview potential users, check if the problem is real, and scope your solution to what\'s buildable in 24–48 hours.' },
        { name: 'Ship a Working Demo', text: 'Judges want to see working software, not slides. Use Figma for UI mockups + a real backend or no-code tool. A live demo with real data wins over static presentations.' },
        { name: 'Tell a Compelling Story', text: 'In your final pitch: lead with the problem, show the demo, explain your traction or validation, and end with the business model and ask. Practice under time pressure.' },
      ],
    },
    relatedTypes: ['pitch', 'demo-day', 'workshop', 'bootcamp'],
  },
  pitch: {
    display: 'Pitch Competitions', emoji: '🎤',
    tagline: 'Win Funding & Investors at India\'s Top Startup Pitch Competitions',
    description: 'Startup pitch competitions in India offer early-stage founders the opportunity to present to angel investors, VCs, and industry leaders for funding, mentorship, and visibility. From ₹1L to ₹1Cr prize pools, India\'s pitch circuit is one of the most active startup ecosystems in Asia.',
    stats: [
      { label: 'Pitch Events Per Year', value: '200+' },
      { label: 'Max Prize Pool', value: '₹1Cr' },
      { label: 'Active VC Judges', value: '500+' },
      { label: 'Startups Funded via Pitches', value: '1,000+' },
    ],
    benefits: [
      'Win non-dilutive prize money',
      'Get direct investor introductions',
      'Receive live feedback from VCs',
      'Build your public founder brand',
      'Get media and press coverage',
      'Fast-track incubation opportunities',
    ],
    topOrganizers: ['IIM Ahmedabad CIIE', 'TiE Global', 'NASSCOM Emerge50', 'Startup India Showcase', 'YourStory TechSparks', 'IAN Fund', 'Venture CatalYSTs', 'Axilor Ventures'],
    faqs: [
      {
        q: 'What is a startup pitch competition in India?',
        a: 'A startup pitch competition is an event where early-stage founders present their business idea to a panel of investors, mentors, and industry experts. Winners receive funding, incubation, mentorship, or cash prizes. India hosts 200+ pitch competitions annually across cities and online.',
      },
      {
        q: 'How do I apply for pitch competitions in India?',
        a: 'Apply via the event\'s official website, Startups India, Unstop, or LinkedIn. Prepare your pitch deck (10–12 slides), financial projections, and a 3–5 minute demo video. Applications typically require a business summary, team details, and product screenshots.',
      },
      {
        q: 'What do judges look for in a startup pitch?',
        a: 'Judges evaluate: problem-solution fit, market size (TAM/SAM/SOM), team credentials, traction (users, revenue, pilots), defensibility (moat/IP), and the ask. The clearer your vision and the stronger your traction, the better your chances of winning.',
      },
      {
        q: 'Can a pre-revenue startup win a pitch competition?',
        a: 'Yes. Many pitch competitions have pre-revenue categories specifically for idea-stage or pre-product startups. What matters is the quality of your research, the strength of your team, and the clarity of your vision. Customer validation (even letters of intent) significantly strengthens your case.',
      },
    ],
    howTo: {
      title: 'How to Win a Startup Pitch Competition in India',
      steps: [
        { name: 'Build a 10-Slide Pitch Deck', text: 'Cover: problem, solution, market size, product demo, business model, traction, team, competition, financials, and the ask. Keep each slide to one idea. Use visuals over text.' },
        { name: 'Know Your Numbers', text: 'Memorize your TAM, SAM, SOM, current MRR/ARR, CAC, LTV, and burn rate. Investors will always ask. If you\'re pre-revenue, know your user acquisition plan and unit economics assumptions.' },
        { name: 'Practice Your Pitch 50+ Times', text: 'Time your pitch to the event limit (usually 3–7 min). Record yourself and review. Practice with people who will give harsh feedback, not just friends.' },
        { name: 'Prepare for Q&A', text: 'The Q&A is where deals are won or lost. Prepare for: "Who are your competitors?", "What\'s your moat?", "Why now?", "What will you do with the money?". Honest, confident answers beat defensive ones.' },
        { name: 'Follow Up Immediately', text: 'Within 24 hours of pitching, email every judge and investor you spoke to. Reference the conversation, attach your deck, and include your calendar link for a follow-up call.' },
      ],
    },
    relatedTypes: ['hackathon', 'demo-day', 'investor-meet', 'summit'],
  },
  'demo-day': {
    display: 'Demo Days', emoji: '🚀',
    tagline: 'Showcase Your Startup to Investors at India\'s Top Demo Days',
    description: 'Startup demo days in India are the culmination of incubation and accelerator programs where cohort startups showcase their progress to investors, corporates, and media. India\'s top incubators — including IIM, IIT, and private accelerators — host quarterly and annual demo days attracting hundreds of investors.',
    stats: [
      { label: 'Demo Days Per Year', value: '150+' },
      { label: 'Avg Startups Per Cohort', value: '10–20' },
      { label: 'Investor Attendance', value: '50–200' },
      { label: 'Avg Funding Post Demo Day', value: '₹50L–₹5Cr' },
    ],
    benefits: [
      'Present to 50–200 investors in one day',
      'Get funded at or after demo day',
      'Validate your product with investor feedback',
      'Build your public startup profile',
      'Get featured in startup media',
      'Join a strong alumni network',
    ],
    topOrganizers: ['IIM Bangalore NSRCEL', 'IIT Delhi Foundation for Innovation', 'T-Hub Hyderabad', 'Startup India', 'Sequoia Surge', 'Antler India', ' 100X.VC', 'Blume Ventures'],
    faqs: [
      {
        q: 'What is a startup demo day in India?',
        a: 'A startup demo day is an event organized by incubators and accelerators where startups from a cohort present their product, traction, and business to investors. It\'s the most efficient way for early-stage startups to get investor introductions and funding in India.',
      },
      {
        q: 'How can I attend a startup demo day in India?',
        a: 'Most demo days require registration as an investor, mentor, or media representative. Apply via the incubator\'s website or Startups India. Some demo days are public — check event listings on LinkedIn, YourStory, and startup community Slack channels.',
      },
      {
        q: 'How do I get selected for a demo day cohort?',
        a: 'Apply to incubator programs that host demo days: IIM, IIT, T-Hub, Sequoia Surge, Antler India, 100X.VC. Each has its own application process and selection criteria. Key factors: founding team quality, problem-solution fit, market size, and early traction.',
      },
    ],
    howTo: {
      title: 'How to Prepare for a Startup Demo Day',
      steps: [
        { name: 'Perfect Your 5-Minute Demo', text: 'Demo days give you 5–10 minutes. Lead with the problem and live product demo. Show real users and real data. No slides for the demo portion — let the product speak.' },
        { name: 'Prepare Your One-Pager', text: 'Print or send a one-page startup summary: logo, tagline, problem, solution, traction, team, ask, and contact. Investors will take 20 seconds to scan it before your pitch.' },
        { name: 'Set Up 1:1 Meetings in Advance', text: 'Email investors before demo day. Say you\'re pitching at [Incubator] Demo Day and would love 10 minutes. Getting commitments in advance increases your odds of funding.' },
        { name: 'Know Your Funding Ask', text: 'Be specific: "We\'re raising ₹1Cr at a ₹5Cr pre-money valuation, and we have ₹50L committed." Vague asks waste everyone\'s time.' },
        { name: 'Follow Up Within 48 Hours', text: 'Send personalized follow-up emails to every investor you spoke to. Reference what they said, attach your deck, and propose next steps.' },
      ],
    },
    relatedTypes: ['pitch', 'investor-meet', 'hackathon', 'summit'],
  },
};

const DEFAULT_EVENT = (type) => ({
  display: type.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
  emoji: '📅',
  tagline: `Startup ${type.replace(/-/g, ' ')} Events in India — Find, Register & Attend`,
  description: `India's startup ecosystem hosts hundreds of ${type.replace(/-/g, ' ')} events every year. Connect with founders, investors, and mentors at the best startup events across Bangalore, Mumbai, Delhi, Hyderabad, and online.`,
  stats: [
    { label: 'Events Per Year', value: '100+' },
    { label: 'Cities', value: '20+' },
    { label: 'Online Events', value: '50+' },
    { label: 'Avg Attendees', value: '200+' },
  ],
  benefits: [
    'Network with founders and investors',
    'Learn from experienced entrepreneurs',
    'Discover funding opportunities',
    'Build your startup community',
    'Get featured in ecosystem media',
    'Find co-founders and team members',
  ],
  topOrganizers: [],
  faqs: [
    {
      q: `What are startup ${type.replace(/-/g, ' ')} events in India?`,
      a: `Startup ${type.replace(/-/g, ' ')} events in India bring together founders, investors, mentors, and industry experts for learning, networking, and collaboration. India hosts 1,000+ startup events annually across cities and online platforms.`,
    },
    {
      q: `How do I find upcoming startup ${type.replace(/-/g, ' ')} events in India?`,
      a: `Find upcoming ${type.replace(/-/g, ' ')} events on Startups India, Eventbrite, LinkedIn, Meetup, and startup community groups. Subscribe to newsletters from NASSCOM, TiE, and local startup hubs to stay updated on the latest events.`,
    },
  ],
  howTo: {
    title: `How to Make the Most of Startup ${type.replace(/-/g, ' ')} Events in India`,
    steps: [
      { name: 'Research Attendees in Advance', text: 'Check the guest list or speakers list before attending. Identify the 5–10 people you most want to meet and research them beforehand.' },
      { name: 'Prepare Your 30-Second Pitch', text: 'Have a crisp intro: your name, your startup, the problem you solve, and your traction. Practice it until it\'s natural.' },
      { name: 'Bring Business Cards or a Digital Card', text: 'Use tools like Blinq or HiHello for digital business cards. Always have a way to share your LinkedIn and startup URL instantly.' },
      { name: 'Follow Up Within 24 Hours', text: 'Send a LinkedIn connection request or email within 24 hours while the conversation is fresh. Reference what you discussed.' },
      { name: 'Share Learnings Publicly', text: 'Post your key takeaways on LinkedIn after the event. Tag speakers. This builds your public founder brand and often leads to more connections.' },
    ],
  },
  relatedTypes: ['hackathon', 'pitch', 'demo-day', 'workshop', 'networking'],
});

export default function EventTypePage({ params }) {
  const type = params?.type || 'hackathon';
  const data = EVENT_DATA[type] || DEFAULT_EVENT(type);
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
      description: `Step-by-step guide: ${data.howTo.title}`,
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
        { '@type': 'ListItem', position: 2, name: 'Startup Events', item: 'https://startupsindia.in/events' },
        { '@type': 'ListItem', position: 3, name: `${data.display} India ${year}` },
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
        <Link href="/">Home</Link> › <Link href="/events">Startup Events</Link> › {data.display}
      </nav>

      {/* Hero */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>{data.emoji}</div>
        <h1 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 800, color: '#0f172a', lineHeight: 1.2, marginBottom: 12 }}>
          Startup {data.display} in India {year} — Upcoming Events, Calendar & Registration
        </h1>
        <p className="speakable" style={{ fontSize: 16, color: '#475569', lineHeight: 1.7, maxWidth: 760, marginBottom: 8 }}>
          {data.tagline}
        </p>
        <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.7, maxWidth: 760 }}>
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

      {/* Benefits */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 14, color: '#1e293b' }}>
          Why Attend Startup {data.display} in India?
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
          {data.benefits.map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: '#f8fafc', borderRadius: 10, padding: '12px 16px', border: '1px solid #e2e8f0' }}>
              <span style={{ color: '#10b981', fontWeight: 700, fontSize: 16, marginTop: 1 }}>✓</span>
              <span style={{ fontSize: 14, color: '#334155' }}>{b}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Top Organizers */}
      {data.topOrganizers?.length > 0 && (
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 14, color: '#1e293b' }}>
            Top Organizers of Startup {data.display} in India
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {data.topOrganizers.map((o, i) => (
              <span key={i} style={{ padding: '8px 16px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, fontWeight: 600, color: '#1e293b' }}>
                {o}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* HowTo */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20, color: '#1e293b' }}>
          {data.howTo.title}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {data.howTo.steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 16, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '16px 20px' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#e63946', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, flexShrink: 0 }}>
                {i + 1}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#1e293b', marginBottom: 4 }}>{step.name}</div>
                <div style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>{step.text}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20, color: '#1e293b' }}>
          Frequently Asked Questions: Startup {data.display} in India
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

      {/* Related Event Types */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 14, color: '#1e293b' }}>
          Explore Other Startup Events in India
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {(data.relatedTypes || ['hackathon', 'pitch', 'demo-day', 'workshop', 'networking', 'bootcamp', 'summit'])
            .filter(t => t !== type)
            .map(t => (
              <Link key={t} href={`/events/${t}`} style={{ padding: '7px 14px', background: '#f1f5f9', borderRadius: 20, fontSize: 13, color: '#475569', textDecoration: 'none', border: '1px solid #e2e8f0', fontWeight: 500 }}>
                {t.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} India
              </Link>
            ))}
        </div>
      </section>

      {/* CTA */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', borderRadius: 16, padding: '32px', textAlign: 'center', color: '#fff' }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Don't Miss the Next Startup Event</h2>
        <p style={{ marginBottom: 20, opacity: 0.8, fontSize: 15 }}>Get notified about upcoming {data.display.toLowerCase()}, pitch nights, and networking events across India.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/events" style={{ background: '#e63946', color: '#fff', padding: '12px 24px', borderRadius: 10, fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>Browse All Events</Link>
          <Link href="/programs" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', padding: '12px 24px', borderRadius: 10, fontWeight: 700, textDecoration: 'none', fontSize: 14, border: '1px solid rgba(255,255,255,0.2)' }}>Apply for Incubation</Link>
        </div>
      </div>
    </div>
  );
}
