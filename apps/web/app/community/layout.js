import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Startup Community India — Connect with 50,000+ Founders & Entrepreneurs',
  description:
    "Join India's most active startup community. Connect with founders, co-founders, mentors, investors, and ecosystem builders across India. Discuss startup ideas, share resources, find co-founders, and grow together in the Startups India community.",
  path: '/community',
  section: 'Community',
  keywords: [
    'startup community india', 'founder community india', 'entrepreneur community india',
    'startup network india', 'startup forum india', 'startup group india',
    'startup discussion india', 'startup peer group india',
    'startup community bangalore', 'startup community mumbai', 'startup community delhi',
    'online startup community india', 'startup whatsapp group india',
    'startup discord india', 'startup slack community india',
    'co-founder search india', 'find co-founder india', 'startup co-founder platform india',
    'startup peer learning india', 'founder meetup india',
    'early stage founder community india', 'student startup community india',
    'women entrepreneur community india', 'startup community platform india',
    'best startup community india', 'join startup community india',
    'startup networking platform india', 'indian startup founders network',
    'startup india community membership', 'startup community events india',
  ],
});

const communitySchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Startup Community India — Connect with 50,000+ Founders',
  description: 'India\'s most active startup community for founders, co-founders, investors, and ecosystem builders',
  url: 'https://startupsindia.in/community',
  speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', '.speakable'] },
  about: { '@type': 'Thing', name: 'Startup Community India' },
  audience: { '@type': 'Audience', audienceType: 'Startup Founders and Entrepreneurs in India' },
};

export default function CommunityLayout({ children }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(communitySchema) }} />
      {children}
    </>
  );
}
