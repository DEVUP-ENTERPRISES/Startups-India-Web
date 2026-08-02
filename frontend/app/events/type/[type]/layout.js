import { buildMetadata } from '@/lib/seo';

const EVENT_META = {
  hackathon: { display: 'Hackathons', desc: 'coding competitions and innovation challenges for startup builders' },
  pitch: { display: 'Pitch Competitions', desc: 'startup pitch events where founders present to investors and win funding' },
  'demo-day': { display: 'Demo Days', desc: 'startup demo days where incubated startups showcase to investors' },
  workshop: { display: 'Workshops', desc: 'hands-on startup workshops on product, growth, fundraising, and legal' },
  summit: { display: 'Startup Summits', desc: 'large-scale startup conferences and summits for founders and investors' },
  networking: { display: 'Networking Events', desc: 'startup networking events for founders, investors, and ecosystem builders' },
  bootcamp: { display: 'Bootcamps', desc: 'intensive startup bootcamps for early-stage founders and entrepreneurs' },
  webinar: { display: 'Webinars', desc: 'online startup webinars and virtual events on entrepreneurship topics' },
  'investor-meet': { display: 'Investor Meets', desc: 'exclusive meetings and introductions between startups and investors' },
};

export async function generateMetadata({ params }) {
  const { type } = await params;
  const meta = EVENT_META[type] || {
    display: type.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    desc: `${type} startup events in India`,
  };
  const year = new Date().getFullYear();

  return buildMetadata({
    title: `Startup ${meta.display} in India ${year} - Upcoming Events, Calendar & Registration`,
    description: `Find upcoming startup ${meta.display.toLowerCase()} in India ${year}. Complete calendar of ${meta.desc}. Register for the best startup ${meta.display.toLowerCase()} across Bangalore, Mumbai, Delhi, Hyderabad, and online.`,
    path: `/events/type/${type}`,
    section: 'Startup Events',
    keywords: [
      `startup ${meta.display.toLowerCase()} india`,
      `${meta.display.toLowerCase()} india ${year}`,
      `upcoming ${meta.display.toLowerCase()} india`,
      `best startup ${meta.display.toLowerCase()} india`,
      `${meta.display.toLowerCase()} bangalore`,
      `${meta.display.toLowerCase()} mumbai`,
      `${meta.display.toLowerCase()} delhi`,
      `${meta.display.toLowerCase()} hyderabad`,
      `${meta.display.toLowerCase()} online india`,
      `startup events india ${year}`,
      `startup ${type} india`,
      `register ${meta.display.toLowerCase()} india`,
      `entrepreneur ${type} india`,
      `free startup ${meta.display.toLowerCase()} india`,
      `virtual ${meta.display.toLowerCase()} india`,
      `${meta.display.toLowerCase()} for founders india`,
      `startup calendar india ${year}`,
    ],
  });
}

export default function EventTypeLayout({ children }) {
  return children;
}
