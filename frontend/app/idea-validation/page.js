import { buildMetadata } from '@/lib/seo';
import dynamic from 'next/dynamic';

const IdeaValidationClient = dynamic(() => import('./IdeaValidationClient'), {
  ssr: false,
});

export const metadata = buildMetadata({
  title: 'Idea Validation Program - Test Your Startup Idea Before You Build',
  description:
    "StartupsIndia's Idea Validation Program helps founders and aspiring entrepreneurs test their ideas, understand real user needs, and gather evidence to build solutions people actually want. Validate your idea before investing time and money.",
  path: '/idea-validation',
  section: 'Programs',
  keywords: [
    'idea validation india',
    'startup idea validation',
    'validate startup idea',
    'idea validation program india',
    'startup idea testing',
    'customer discovery india',
    'problem validation startup',
    'market validation india',
    'user research startup india',
    'startup hypothesis testing',
    'lean startup india',
    'mvp validation india',
    'startup idea feedback',
    'startup idea assessment',
    'idea validation workshop india',
  ],
});

const ideaValidationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: 'Idea Validation Program',
  description:
    "Test your startup idea, understand real user needs, and gather evidence to build solutions people actually want.",
  provider: {
    '@type': 'Organization',
    name: 'Startups India',
    url: 'https://startupsindia.in',
  },
  url: 'https://startupsindia.in/idea-validation',
  hasCourseInstance: {
    '@type': 'CourseInstance',
    courseMode: 'blended',
    courseWorkload: 'P4W',
  },
};

export default function IdeaValidationPage() {
  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ideaValidationSchema) }}
      />
      <IdeaValidationClient />
    </>
  );
}
