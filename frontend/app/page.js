// Server component - never add 'use client' here.
// JSON-LD is rendered server-side so it's identical on server and client,
// eliminating the dangerouslySetInnerHTML hydration mismatch.

import { webPageSchema, faqSchema, itemListSchema } from '@/lib/seo';
import HomeClient from './HomeClient';

const SITE_URL = 'https://startupsindia.in';

const webPage = webPageSchema({
  title: "Startups India - India's #1 Startup Ecosystem Platform",
  description:
    "India's most comprehensive startup ecosystem platform - incubation programs, startup funding, mentorship, events, and community for founders and entrepreneurs.",
  url: SITE_URL + '/',
});

const services = itemListSchema({
  name: 'Startup Ecosystem Services - Startups India',
  description: 'Core services and programs offered by Startups India',
  url: SITE_URL,
  items: [
    { name: 'Startup Incubation Program',   url: `${SITE_URL}/programs`,  description: 'Structured incubation program for early-stage startups in India' },
    { name: 'Pre-Incubation Cohort (SINPC)', url: `${SITE_URL}/programs`,  description: 'Pre-incubation program for idea-stage founders in India' },
    { name: 'Startup Mentorship',           url: `${SITE_URL}/mentors`,   description: 'Connect with expert startup mentors and advisors across India' },
    { name: 'Startup Events',              url: `${SITE_URL}/events`,    description: 'Discover startup events, hackathons, and pitch competitions in India' },
    { name: 'Startup Courses',             url: `${SITE_URL}/courses`,   description: 'Learn startup building, fundraising, and growth with online courses' },
    { name: 'Startup Community',           url: `${SITE_URL}/community`, description: "Join India's most active startup founder community" },
  ],
});

const faqs = faqSchema([
  {
    question: 'What is Startups India?',
    answer: "Startups India (startupsindia.in) is India's most comprehensive startup ecosystem platform offering incubation programs, pre-incubation cohorts, startup funding resources, mentorship from serial founders, startup events, online courses, and a community of entrepreneurs across India.",
  },
  {
    question: 'How do I apply for the startup incubation program in India?',
    answer: 'To apply for the Startups India incubation program, visit startupsindia.in/programs, review eligibility criteria, and submit your startup application. The program is open to early-stage founders, students, and innovators with a validated or idea-stage startup.',
  },
  {
    question: 'Is the Startups India program free?',
    answer: 'Startups India offers both free and paid programs. The pre-incubation cohort (SINPC) is accessible to all eligible applicants. Visit startupsindia.in/programs for current program fees and scholarship details.',
  },
  {
    question: 'What is the difference between incubation and pre-incubation?',
    answer: 'Pre-incubation is designed for idea-stage founders who need validation, mentorship, and early-stage support before formal incubation. Incubation is for startups with a validated idea or early product that are ready for structured business development, investor access, and scaling support.',
  },
  {
    question: 'Who can join Startups India?',
    answer: 'Startups India is open to students, first-time founders, serial entrepreneurs, mentors, investors, and anyone passionate about the Indian startup ecosystem. Whether you have a startup idea or a funded company, there are programs and resources for every stage.',
  },
  {
    question: 'Which cities does Startups India operate in?',
    answer: 'Startups India operates across all major Indian cities including Bangalore, Mumbai, Delhi, Hyderabad, Chennai, Pune, Ahmedabad, Jaipur, Kolkata, Kochi, and 50+ more cities. Our online programs are accessible from anywhere in India.',
  },
]);

const schemas = [webPage, services, faqs];

export default function Page() {
  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <HomeClient />
    </>
  );
}
