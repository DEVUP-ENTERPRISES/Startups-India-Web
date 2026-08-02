import { buildMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  const { sector } = await params;
  const display = sector.charAt(0).toUpperCase() + sector.slice(1).replace(/-/g, ' ');

  return buildMetadata({
    title: `${display} Startup Mentors in India - Find Expert ${display} Advisors`,
    description: `Connect with India's top ${display} startup mentors and advisors. Find experienced ${display} founders, CXOs, and investors who can guide your startup journey in the ${display} sector.`,
    path: `/mentors/${sector}`,
    section: 'Mentors',
    keywords: [
      `${display.toLowerCase()} mentor india`,
      `${display.toLowerCase()} startup mentor india`,
      `${display.toLowerCase()} advisor india`,
      `${display.toLowerCase()} expert india`,
      `startup mentor ${display.toLowerCase()} india`,
      `find ${display.toLowerCase()} mentor india`,
      `${display.toLowerCase()} founder mentor india`,
      `${display.toLowerCase()} coach india`,
      `best ${display.toLowerCase()} mentors india`,
      `${display.toLowerCase()} startup advisor india`,
      `${display.toLowerCase()} investor mentor india`,
      `${display.toLowerCase()} mentorship program india`,
    ],
  });
}

export default function MentorsSectorLayout({ children }) {
  return children;
}
