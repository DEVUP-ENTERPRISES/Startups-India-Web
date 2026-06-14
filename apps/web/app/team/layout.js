import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Our Team — Startups India | The People Behind India\'s Leading Incubation Platform',
  description:
    'Meet the Startups India team — the founders, mentors, advisors, and operators driving India\'s startup incubation ecosystem. Learn about the people empowering the next generation of Indian entrepreneurs.',
  path: '/team',
  section: 'About',
  keywords: [
    'startups india team', 'startup india founders', 'startup incubation team india',
    'who is behind startups india', 'startup india leadership team',
    'startup india advisors', 'startup india mentors team',
    'startup ecosystem builders india', 'startup india core team',
    'startup india management team', 'startup india company',
    'startup india platform founders', 'incubation program team india',
  ],
});

const teamSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'Startups India Team',
  description: 'The founders, mentors, and operators behind Startups India — India\'s leading startup incubation platform',
  url: 'https://startupsindia.in/team',
  about: {
    '@type': 'Organization',
    name: 'Startups India',
    url: 'https://startupsindia.in',
    description: 'India\'s leading startup incubation and pre-incubation platform',
  },
};

export default function TeamLayout({ children }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(teamSchema) }} />
      {children}
    </>
  );
}
