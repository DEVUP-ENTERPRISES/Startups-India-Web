import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: "About Startups India - India's Leading Startup Ecosystem Platform",
  description:
    "Learn about Startups India - the mission, team, and vision behind India's most comprehensive startup ecosystem platform. We empower founders, entrepreneurs, students, mentors, and investors to build the next generation of Indian startups.",
  path: '/about',
  section: 'About',
  keywords: [
    'about startups india', 'startups india mission', 'startups india team',
    'startup incubation platform india', 'who is startups india',
    'startup ecosystem builder india', 'india startup platform about',
    'startup india platform founders', 'startupsindia.in about',
    'best startup platform india', 'startup resource platform india',
    'startup india organization', 'startup empowerment india',
    'entrepreneurship platform india', 'startup enabler india',
  ],
});

const aboutSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: "About Startups India - India's Leading Startup Incubation Platform",
  description: "Startups India's mission, team, and vision for the Indian startup ecosystem",
  url: 'https://startupsindia.in/about',
  mainEntity: {
    '@type': 'Organization',
    '@id': 'https://startupsindia.in/#organization',
    name: 'Startups India',
    url: 'https://startupsindia.in',
    description: "India's most comprehensive startup incubation, mentorship, and ecosystem platform for founders, students, and entrepreneurs",
    foundingDate: '2023',
    areaServed: 'India',
    knowsAbout: [
      'Startup Incubation', 'Pre-Incubation Programs', 'Startup Mentorship',
      'Entrepreneurship Education', 'Startup Ecosystem India', 'DPIIT Startup India',
    ],
  },
};

export default function AboutLayout({ children }) {
  return (
    <>
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }} />
      {children}
    </>
  );
}
