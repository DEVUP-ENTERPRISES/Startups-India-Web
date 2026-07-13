'use client';

import { MAINTENANCE_MODE } from '@/config/maintenance';
import MaintenancePage from '../components/MaintenancePage';
import ScrollToTop from '@/components/ScrollToTop';
import NetworkHero from '@/components/NetworkHero';

import HowItWorksSection from '@/components/HowItWorksSection';
import EcosystemFeaturesSection from '@/components/EcosystemFeaturesSection';
import CollaborationFrameworkSection from '@/components/CollaborationFrameworkSection';
import FoundersTestimonialsSection from '@/components/FoundersTestimonialsSection';
import ApplyDarkSection from '@/components/ApplyDarkSection';
import ImpactSection from '@/components/ImpactSection';
import TrustedPartners from '@/components/TrustedPartners';
import AchievementsSection from '@/components/AchievementsSection';
import TrainingSection from '@/components/TrainingSection';
import { motion } from 'framer-motion';
import '../styles/iec-homepage.css';

export default function Home() {
  if (MAINTENANCE_MODE) {
    return <MaintenancePage />;
  }

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] } 
    }
  };

  const homepageSchemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': 'https://startupsindia.in/#webpage',
      url: 'https://startupsindia.in/',
      name: "Startups India — India's #1 Startup Ecosystem Platform",
      description:
        "India's most comprehensive startup ecosystem platform — incubation programs, startup funding, mentorship, events, and community for founders and entrepreneurs.",
      isPartOf: { '@id': 'https://startupsindia.in/#website' },
      about: { '@type': 'Thing', name: 'Indian Startup Ecosystem' },
      inLanguage: 'en-IN',
      speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', 'h2', '.hero-heading', '.speakable'] },
      primaryImageOfPage: { '@type': 'ImageObject', url: 'https://startupsindia.in/assets/images/og-default.jpg' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Startup Ecosystem Services — Startups India',
      description: "Core services and programs offered by Startups India",
      itemListElement: [
        {
          '@type': 'ListItem', position: 1,
          name: 'Startup Incubation Program', url: 'https://startupsindia.in/programs',
          description: 'Structured incubation program for early-stage startups in India',
        },
        {
          '@type': 'ListItem', position: 2,
          name: 'Pre-Incubation Cohort (SINPC)', url: 'https://startupsindia.in/programs',
          description: 'Pre-incubation program for idea-stage founders in India',
        },
        {
          '@type': 'ListItem', position: 3,
          name: 'Startup Mentorship', url: 'https://startupsindia.in/mentors',
          description: 'Connect with expert startup mentors and advisors across India',
        },
        {
          '@type': 'ListItem', position: 4,
          name: 'Startup Events', url: 'https://startupsindia.in/events',
          description: 'Discover startup events, hackathons, and pitch competitions in India',
        },
        {
          '@type': 'ListItem', position: 5,
          name: 'Startup Courses', url: 'https://startupsindia.in/courses',
          description: 'Learn startup building, fundraising, and growth with online courses',
        },
        {
          '@type': 'ListItem', position: 6,
          name: 'Startup Community', url: 'https://startupsindia.in/community',
          description: 'Join India\'s most active startup founder community',
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Startups India?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "Startups India (startupsindia.in) is India's most comprehensive startup ecosystem platform offering incubation programs, pre-incubation cohorts, startup funding resources, mentorship from serial founders, startup events, online courses, and a community of entrepreneurs across India.",
          },
        },
        {
          '@type': 'Question',
          name: 'How do I apply for the startup incubation program in India?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'To apply for the Startups India incubation program, visit startupsindia.in/programs, review eligibility criteria, and submit your startup application. The program is open to early-stage founders, students, and innovators with a validated or idea-stage startup.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is the Startups India program free?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Startups India offers both free and paid programs. The pre-incubation cohort (SINPC) is accessible to all eligible applicants. Visit startupsindia.in/programs for current program fees and scholarship details.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the difference between incubation and pre-incubation?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Pre-incubation is designed for idea-stage founders who need validation, mentorship, and early-stage support before formal incubation. Incubation is for startups with a validated idea or early product that are ready for structured business development, investor access, and scaling support.',
          },
        },
        {
          '@type': 'Question',
          name: 'Who can join Startups India?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Startups India is open to students, first-time founders, serial entrepreneurs, mentors, investors, and anyone passionate about the Indian startup ecosystem. Whether you have a startup idea or a funded company, there are programs and resources for every stage.',
          },
        },
        {
          '@type': 'Question',
          name: 'Which cities does Startups India operate in?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Startups India operates across all major Indian cities including Bangalore, Mumbai, Delhi, Hyderabad, Chennai, Pune, Ahmedabad, Jaipur, Kolkata, Kochi, and 50+ more cities. Our online programs are accessible from anywhere in India.',
          },
        },
      ],
    },
  ];

  return (
    <div className="iec-homepage relative overflow-hidden bg-white">
      {homepageSchemas.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      {/* Global Super UI Mesh Backdrop */}
      <div className="super-ui-mesh" aria-hidden="true" />
      
      <NetworkHero />

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionVariants}>
        <HowItWorksSection />
      </motion.div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionVariants}>
        <EcosystemFeaturesSection />
      </motion.div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionVariants}>
        <AchievementsSection />
      </motion.div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionVariants}>
        <ImpactSection />
      </motion.div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionVariants}>
       <TrustedPartners />
      </motion.div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionVariants}>
        <TrainingSection />
      </motion.div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionVariants}>
        <CollaborationFrameworkSection />
      </motion.div>

      {/* <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionVariants}>
        <FoundersTestimonialsSection />
      </motion.div> */}

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionVariants}>
        <ApplyDarkSection />
      </motion.div>

      <ScrollToTop />
    </div>
  );
}
