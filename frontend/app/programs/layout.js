import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Startup Incubation Programs in India 2026 - Apply to Startups India',
  description:
    "Apply to Startups India's flagship incubation and pre-incubation programs. Get mentorship from serial founders, investor access, product development support, and a path to startup funding. Open for students, early-stage founders, and innovative entrepreneurs across India.",
  path: '/programs',
  section: 'Programs',
  keywords: [
    'startup incubation program india', 'pre-incubation program india',
    'startup program apply india', 'startup acceleration india',
    'dpiit incubation program india', 'startup india scheme program',
    'incubation cohort india', 'startup mentorship program india',
    'startup incubator application india', 'best incubation program india',
    'startup india pre-incubation cohort', 'sinpc program',
    'startup program for students india', 'startup program for founders india',
    'funded startup program india', 'startup ecosystem program india',
    'startup development program india', 'entrepreneur program india 2026',
    'startup training program india', 'how to apply startup incubation india',
    'startup india program eligibility', 'startup incubation benefits india',
    'equity free incubation india', 'zero equity startup program india',
    'government startup incubation program india', 'private incubation india',
    'startup program bangalore', 'startup program mumbai', 'startup program delhi',
    'startup program hyderabad', 'startup program chennai', 'startup program pune',
  ],
});

const programsSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Startup Incubation Programs in India',
  description: 'India\'s leading startup incubation and pre-incubation programs for founders and entrepreneurs',
  url: 'https://startupsindia.in/programs',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Pre-Incubation Cohort (SINPC)', url: 'https://startupsindia.in/programs/pre-incubation' },
    { '@type': 'ListItem', position: 2, name: 'Startup Incubation Program', url: 'https://startupsindia.in/programs/incubation' },
    { '@type': 'ListItem', position: 3, name: 'Growth Stage Program', url: 'https://startupsindia.in/programs/growth' },
    { '@type': 'ListItem', position: 4, name: 'Master Classes', url: 'https://startupsindia.in/programs/master-classes' },
  ],
};

export default function ProgramsLayout({ children }) {
  return (
    <>
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(programsSchema) }} />
      {children}
    </>
  );
}
