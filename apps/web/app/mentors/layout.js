import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Startup Mentors in India 2026 — Connect with Expert Startup Advisors',
  description:
    "Find and connect with India's top startup mentors across fintech, healthtech, edtech, SaaS, D2C, agritech, and more. Get expert guidance from serial founders, CXOs, angel investors, and industry veterans who have built and scaled successful startups in India.",
  path: '/mentors',
  section: 'Mentors',
  keywords: [
    'startup mentors india', 'startup mentorship india', 'find startup mentor india',
    'entrepreneur mentor india', 'startup advisor india', 'business mentor india',
    'startup coach india', 'startup guidance india', 'startup expert india',
    'startup mentor bangalore', 'startup mentor mumbai', 'startup mentor delhi',
    'startup mentor hyderabad', 'startup mentor chennai', 'startup mentor pune',
    'startup mentor fintech india', 'startup mentor healthtech india',
    'startup mentor edtech india', 'startup mentor saas india',
    'startup mentor d2c india', 'startup mentor agritech india',
    'angel investor mentor india', 'vc mentor india', 'cxo mentor india',
    'serial founder mentor india', 'iit alumni mentor india',
    'iim alumni mentor india', 'mentor for first time founders india',
    'startup mentor for students india', 'free startup mentorship india',
    'how to find startup mentor india', 'best startup mentors india 2026',
    'startup advisory board india', 'startup mentor network india',
    'mentor match startup india', 'startup mentor platform india',
    'startup mentorship program india', 'one-on-one startup mentoring india',
  ],
});

const mentorsSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Startup Mentors in India',
  description: 'Find and connect with India\'s top startup mentors, advisors, and coaches across all sectors',
  url: 'https://startupsindia.in/mentors',
  speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', '.speakable'] },
  about: { '@type': 'Thing', name: 'Startup Mentorship India' },
  mentions: [
    { '@type': 'Thing', name: 'Fintech Mentors India' },
    { '@type': 'Thing', name: 'Healthtech Mentors India' },
    { '@type': 'Thing', name: 'EdTech Mentors India' },
    { '@type': 'Thing', name: 'SaaS Startup Mentors India' },
    { '@type': 'Thing', name: 'D2C Brand Mentors India' },
  ],
};

export default function MentorsLayout({ children }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(mentorsSchema) }} />
      {children}
    </>
  );
}
