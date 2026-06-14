import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  title: 'Startup Events in India 2026 — Calendar, Hackathons, Pitch Competitions',
  description:
    "Discover and register for startup events across India in 2026 — hackathons, pitch competitions, demo days, startup summits, networking events, bootcamps, and webinars. Find startup events in Bangalore, Mumbai, Delhi, Hyderabad, Chennai, Pune, and every major Indian city.",
  path: '/events',
  section: 'Events',
  keywords: [
    'startup events india 2026', 'startup summit india 2026',
    'startup conference india 2026', 'pitch competition india 2026',
    'startup hackathon india', 'demo day india', 'startup networking india',
    'entrepreneur events india', 'tech events india', 'startup workshops india',
    'startup bootcamp india', 'startup webinar india',
    'startup events bangalore 2026', 'startup events mumbai 2026',
    'startup events delhi 2026', 'startup events hyderabad 2026',
    'startup events chennai 2026', 'startup events pune 2026',
    'startup events ahmedabad', 'startup events jaipur',
    'startup events kolkata', 'startup events kochi',
    'startup competition india 2026', 'startup pitch event india',
    'angel investor meetup india', 'vc networking event india',
    'founder networking india', 'startup ecosystem event india',
    'techsparks india', 'nasscom startup event', 'tie summit india',
    'startup india event', 'dpiit event startup', 'shark tank india event',
    'student startup event india', 'women entrepreneur event india',
    'free startup events india', 'online startup events india',
  ],
});

const eventsSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Startup Events in India',
  description: 'Comprehensive calendar of startup events across India including hackathons, pitch competitions, demo days, summits, and networking events',
  url: 'https://startupsindia.in/events',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Startup Hackathons India', url: 'https://startupsindia.in/events/hackathon' },
    { '@type': 'ListItem', position: 2, name: 'Startup Pitch Competitions India', url: 'https://startupsindia.in/events/pitch' },
    { '@type': 'ListItem', position: 3, name: 'Demo Days India', url: 'https://startupsindia.in/events/demo-day' },
    { '@type': 'ListItem', position: 4, name: 'Startup Summits India', url: 'https://startupsindia.in/events/summit' },
    { '@type': 'ListItem', position: 5, name: 'Startup Networking Events India', url: 'https://startupsindia.in/events/networking' },
    { '@type': 'ListItem', position: 6, name: 'Startup Bootcamps India', url: 'https://startupsindia.in/events/bootcamp' },
  ],
};

export default function EventsLayout({ children }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventsSchema) }} />
      {children}
    </>
  );
}
