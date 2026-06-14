const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://startupsindia.in';
const SITE_NAME = 'Startups India';
const DEFAULT_OG_IMAGE = `${SITE_URL}/assets/images/og-default.jpg`;

export const BASE_URL = SITE_URL;

// ─── Global keyword bank ─────────────────────────────────────────
// Covers Google, Bing, AI Overviews, PAA, voice, featured snippets
const GLOBAL_KEYWORDS = [
  // Core brand
  'startups india', 'startupsindia', 'startupsindia.in',
  // Ecosystem — tier 1
  'startup india', 'startup ecosystem india', 'indian startup ecosystem',
  'startup hub india', 'startup culture india', 'startup nation india',
  // Incubation
  'startup incubation india', 'startup incubator india', 'best incubators india',
  'incubation program india', 'pre-incubation program india', 'startup incubation centre india',
  'technology incubator india', 'business incubator india', 'iit incubator',
  'government incubator india', 'dpiit incubator', 'atal incubation centre',
  // Funding
  'startup funding india', 'startup fundraising india', 'how to get funding for startup india',
  'seed funding india', 'pre-seed funding india', 'series a funding india',
  'angel funding india', 'venture funding india', 'startup grant india',
  'government grant startup india', 'sisfs grant', 'startup india seed fund',
  // Angel & VC
  'angel investors india', 'angel investing india', 'angel network india',
  'indian angel network', 'venture capital india', 'vc firms india',
  'top vc india', 'early stage investors india', 'seed investors india',
  // Programs
  'startup programs india', 'entrepreneur program india', 'startup scheme india',
  'startup india initiative', 'dpiit recognition', 'startup india registration',
  'startup india scheme benefits', 'startup india tax benefits',
  // Entrepreneurship
  'entrepreneurship india', 'how to start startup india', 'entrepreneur india',
  'young entrepreneur india', 'student entrepreneur india', 'first time founder india',
  'solopreneur india', 'side hustle india', 'build startup india',
  // Mentorship
  'startup mentors india', 'startup mentorship india', 'startup advisor india',
  'startup coach india', 'find mentor india', 'startup guidance india',
  'business mentor india', 'entrepreneur mentor india',
  // Events
  'startup events india', 'startup summit india', 'startup conference india',
  'pitch competition india', 'startup hackathon india', 'demo day india',
  'startup networking india', 'entrepreneur meetup india',
  // Community
  'startup community india', 'founder community india', 'entrepreneur community india',
  'startup network india', 'startup forum india', 'startup group india',
  // Courses & Education
  'startup courses india', 'entrepreneurship course india', 'startup training india',
  'learn startup india', 'online startup course india', 'startup education india',
  // Registration & Legal
  'startup registration india', 'register startup india', 'company registration india',
  'startup compliance india', 'startup legal india', 'startup tax benefits india',
  'msme registration india', 'pvt ltd registration india',
  // Sectors
  'fintech startups india', 'healthtech india', 'edtech india', 'agritech india',
  'cleantech india', 'saas startup india', 'd2c startup india', 'deeptech india',
  'spacetech india', 'foodtech india', 'ev startup india', 'climate tech india',
  // Student & college
  'student startup india', 'college startup india', 'campus startup india',
  'iit startup', 'iim startup', 'nit startup', 'student entrepreneur india',
  'startup competition college india', 'e-cell india',
  // Success stories
  'startup success stories india', 'indian unicorns', 'unicorn startup india',
  'startup founder story india', 'indian entrepreneur success story',
  // Resources
  'startup resources india', 'startup tools india', 'startup checklist india',
  'startup guide india', 'startup ideas india', 'startup opportunities india',
  // Hiring
  'startup jobs india', 'startup hiring india', 'work at startup india',
  'esop startup india', 'startup salary india', 'startup career india',
  // Cities
  'startup bangalore', 'startup mumbai', 'startup delhi', 'startup hyderabad',
  'startup chennai', 'startup pune', 'startup ahmedabad', 'startup jaipur',
];

// ─── Base metadata builder ─────────────────────────────────────
export function buildMetadata({
  title,
  description,
  path = '',
  ogImage,
  keywords = [],
  type = 'website',
  publishedTime,
  modifiedTime,
  authors,
  noIndex = false,
  section,
} = {}) {
  const url = `${SITE_URL}${path}`;
  const fullTitle = title
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} — India's #1 Startup Ecosystem Platform`;

  const mergedKeywords = [...new Set([...GLOBAL_KEYWORDS, ...keywords])];

  return {
    title: fullTitle,
    description,
    keywords: mergedKeywords,
    authors: authors || [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: section || 'Startup Ecosystem',
    classification: 'Business/Entrepreneurship',
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      type,
      images: [
        {
          url: ogImage || DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: fullTitle,
          type: 'image/jpeg',
        },
      ],
      locale: 'en_IN',
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
      ...(section ? { section } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage || DEFAULT_OG_IMAGE],
      site: '@startupsindia',
      creator: '@startupsindia',
    },
    other: {
      'geo.region': 'IN',
      'geo.country': 'India',
      'content-language': 'en-IN',
      'og:locale:alternate': 'hi_IN',
      'revisit-after': '3 days',
      rating: 'General',
      language: 'English',
      distribution: 'Global',
      coverage: 'India',
      target: 'Entrepreneurs, Founders, Students, Investors',
    },
  };
}

// ─── Organization (E-E-A-T anchor) ────────────────────────────
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'EducationalOrganization'],
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    alternateName: ['Startups India', 'StartupIndia Platform', 'Startupsindia.in'],
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      '@id': `${SITE_URL}/#logo`,
      url: `${SITE_URL}/Startupsindia-favicon.png`,
      width: 512,
      height: 512,
      caption: 'Startups India Logo',
    },
    image: `${SITE_URL}/assets/images/og-default.jpg`,
    description:
      "Startups India (startupsindia.in) is India's most comprehensive startup ecosystem platform providing incubation programs, startup funding resources, mentorship, events, courses, and a community for founders, entrepreneurs, and innovators across India.",
    slogan: "Empowering India's Next Generation of Entrepreneurs",
    foundingDate: '2024',
    foundingLocation: { '@type': 'Place', addressCountry: 'IN' },
    areaServed: [
      { '@type': 'Country', name: 'India' },
      { '@type': 'Country', name: 'IN' },
    ],
    knowsAbout: [
      'Startup Incubation', 'Startup Funding', 'Venture Capital', 'Angel Investing',
      'Entrepreneurship', 'Startup Mentorship', 'Startup Events', 'Business Development',
      'Startup Ecosystem India', 'DPIIT Recognition', 'Pre-Incubation Programs',
      'Startup Competitions', 'EdTech', 'FinTech', 'AgriTech', 'HealthTech',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Startup Ecosystem Services',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Startup Incubation Program' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Pre-Incubation Cohort' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Startup Mentorship' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Startup Events & Networking' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Course', name: 'Entrepreneurship Online Courses' } },
      ],
    },
    sameAs: [
      'https://twitter.com/startupsindia',
      'https://linkedin.com/company/startupsindia',
      'https://instagram.com/startupsindia',
      'https://facebook.com/startupsindia',
      'https://youtube.com/@startupsindia',
      'https://www.crunchbase.com/organization/startupsindia',
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        availableLanguage: ['English', 'Hindi'],
        areaServed: 'IN',
      },
      {
        '@type': 'ContactPoint',
        contactType: 'sales',
        availableLanguage: ['English'],
        areaServed: 'IN',
      },
    ],
  };
}

// ─── WebSite + Sitelinks Searchbox ────────────────────────────
export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    alternateName: 'Startupsindia.in',
    description: "India's #1 startup ecosystem platform for founders, investors, and entrepreneurs",
    publisher: { '@id': `${SITE_URL}/#organization` },
    potentialAction: [
      {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    ],
    inLanguage: ['en-IN', 'hi'],
    copyrightYear: new Date().getFullYear(),
    copyrightHolder: { '@id': `${SITE_URL}/#organization` },
    about: { '@type': 'Thing', name: 'Startup Ecosystem India' },
    audience: {
      '@type': 'Audience',
      audienceType: 'Entrepreneurs, Startup Founders, Angel Investors, Students, Mentors',
      geographicArea: { '@type': 'Country', name: 'India' },
    },
  };
}

// ─── Article (NewsArticle + speakable for AEO/voice) ──────────
export function articleSchema({ article, url }) {
  return {
    '@context': 'https://schema.org',
    '@type': ['Article', 'NewsArticle'],
    '@id': `${url}#article`,
    headline: article.title,
    name: article.title,
    description: article.summary || article.excerpt,
    abstract: article.summary || article.excerpt,
    image: {
      '@type': 'ImageObject',
      url: article.coverImage || DEFAULT_OG_IMAGE,
      width: 1200,
      height: 630,
    },
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    datePublished: article.publishedAt || article.createdAt,
    dateModified: article.updatedAt || article.publishedAt,
    author: {
      '@type': 'Person',
      name: article.author?.name || article.authorName || 'Startups India Editorial',
      url: article.author?.profileUrl || `${SITE_URL}/team`,
      jobTitle: article.author?.title || 'Startup Ecosystem Expert',
      worksFor: { '@id': `${SITE_URL}/#organization` },
    },
    publisher: {
      '@id': `${SITE_URL}/#organization`,
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/Startupsindia-favicon.png`,
        width: 512,
        height: 512,
      },
    },
    articleSection: article.category || 'Startup Ecosystem',
    articleBody: article.excerpt,
    keywords: (article.tags || []).join(', '),
    inLanguage: 'en-IN',
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@type': 'Thing', name: article.category || 'Indian Startup Ecosystem' },
    mentions: [
      { '@type': 'Organization', name: 'DPIIT' },
      { '@type': 'Organization', name: 'Startup India' },
      { '@type': 'Place', name: 'India' },
    ],
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', 'h2', '.article-summary', '[data-speakable]'],
    },
    isAccessibleForFree: true,
  };
}

// ─── Course (with AggregateRating + reviews) ─────────────────
export function courseSchema({ course, url }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    '@id': `${url}#course`,
    name: course.title,
    description: course.description || course.shortDescription,
    url,
    image: course.thumbnailUrl || DEFAULT_OG_IMAGE,
    inLanguage: 'en-IN',
    isAccessibleForFree: !course.priceInr || course.priceInr === 0,
    provider: {
      '@id': `${SITE_URL}/#organization`,
      '@type': ['Organization', 'EducationalOrganization'],
      name: SITE_NAME,
      sameAs: SITE_URL,
    },
    educationalCredentialAwarded: 'Certificate of Completion',
    teaches: course.whatYouLearn || course.outcomes || course.description,
    coursePrerequisites: course.prerequisites || 'No prior experience required',
    timeRequired: course.duration,
    numberOfCredits: 0,
    offers: {
      '@type': 'Offer',
      price: course.priceInr ? course.priceInr / 100 : 0,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      validFrom: course.createdAt,
      url,
      seller: { '@id': `${SITE_URL}/#organization` },
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: ['online', 'ONLINE'],
      courseWorkload: course.duration || 'PT8W',
      instructor: {
        '@type': 'Person',
        name: course.instructorName || 'Startups India Expert',
        jobTitle: 'Startup Ecosystem Expert',
        worksFor: { '@id': `${SITE_URL}/#organization` },
      },
    },
    about: [
      { '@type': 'Thing', name: 'Entrepreneurship' },
      { '@type': 'Thing', name: 'Startup Building' },
      { '@type': 'Thing', name: 'Indian Startup Ecosystem' },
    ],
    ...(course.enrolledCount > 5
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: course.rating || 4.7,
            reviewCount: course.enrolledCount || 10,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  };
}

// ─── Event ────────────────────────────────────────────────────
export function eventSchema({ event, url }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    '@id': `${url}#event`,
    name: event.title,
    description: event.description,
    image: event.imageUrl || DEFAULT_OG_IMAGE,
    url,
    startDate: event.startDate,
    endDate: event.endDate || event.startDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: event.isVirtual
      ? 'https://schema.org/OnlineEventAttendanceMode'
      : 'https://schema.org/OfflineEventAttendanceMode',
    location: event.isVirtual
      ? { '@type': 'VirtualLocation', url: event.streamUrl || url }
      : {
          '@type': 'Place',
          name: event.venueName || event.city || 'India',
          address: {
            '@type': 'PostalAddress',
            addressLocality: event.city || '',
            addressRegion: event.state || '',
            addressCountry: 'IN',
          },
        },
    organizer: {
      '@id': `${SITE_URL}/#organization`,
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    offers: {
      '@type': 'Offer',
      price: event.priceInr ? event.priceInr / 100 : 0,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      validThrough: event.startDate,
      url,
    },
    about: [
      { '@type': 'Thing', name: 'Startup Ecosystem India' },
      { '@type': 'Thing', name: 'Entrepreneurship' },
    ],
    audience: {
      '@type': 'Audience',
      audienceType: 'Entrepreneurs, Startup Founders, Investors',
    },
    inLanguage: 'en-IN',
    isAccessibleForFree: !event.priceInr || event.priceInr === 0,
    typicalAgeRange: '18-45',
  };
}

// ─── Breadcrumb ───────────────────────────────────────────────
export function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${SITE_URL}${items[items.length - 1]?.url || ''}#breadcrumb`,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url ? `${SITE_URL}${item.url}` : undefined,
    })),
  };
}

// ─── FAQ (AEO — Featured Snippets + PAA + AI Overviews) ───────
export function faqSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
        dateCreated: new Date().toISOString(),
        author: { '@type': 'Organization', name: SITE_NAME },
      },
    })),
  };
}

// ─── HowTo (AEO — numbered guides, voice search) ─────────────
export function howToSchema({ name, description, steps, totalTime, image }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    image: image || DEFAULT_OG_IMAGE,
    totalTime: totalTime || 'PT30M',
    supply: [{ '@type': 'HowToSupply', name: 'Business Idea' }],
    step: steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
      url: s.url,
      image: s.image || DEFAULT_OG_IMAGE,
    })),
    author: { '@id': `${SITE_URL}/#organization` },
  };
}

// ─── ItemList (directory pages — incubators, mentors, events) ─
export function itemListSchema({ name, description, url, items }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    description,
    url,
    numberOfItems: items.length,
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: item.url,
      description: item.description,
    })),
  };
}

// ─── LocalBusiness (for city pages) ──────────────────────────
export function localBusinessSchema({ city, category }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_URL}/${category}/${city}#localbusiness`,
    name: `Startups India — ${category.charAt(0).toUpperCase() + category.slice(1)} in ${city.charAt(0).toUpperCase() + city.slice(1)}`,
    url: `${SITE_URL}/${category}/${city}`,
    image: DEFAULT_OG_IMAGE,
    description: `Discover the best startup ${category} in ${city}. Startups India curates the top resources for entrepreneurs and founders in ${city}, India.`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: city.charAt(0).toUpperCase() + city.slice(1),
      addressCountry: 'IN',
    },
    areaServed: {
      '@type': 'City',
      name: city.charAt(0).toUpperCase() + city.slice(1),
    },
    parentOrganization: { '@id': `${SITE_URL}/#organization` },
    sameAs: [SITE_URL],
  };
}

// ─── Person / Mentor ─────────────────────────────────────────
export function personSchema({ person, url }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${url}#person`,
    name: person.fullName,
    url,
    image: person.avatarUrl || DEFAULT_OG_IMAGE,
    jobTitle: person.headline,
    description: person.bio,
    worksFor: person.company
      ? { '@type': 'Organization', name: person.company }
      : { '@id': `${SITE_URL}/#organization` },
    alumniOf: person.education,
    knowsAbout: person.expertise || ['Entrepreneurship', 'Startups', 'India'],
    sameAs: (Array.isArray(person.socialLinks)
      ? person.socialLinks.map(l => l.url)
      : []
    ).filter(Boolean),
    address: person.city
      ? { '@type': 'PostalAddress', addressLocality: person.city, addressCountry: 'IN' }
      : undefined,
  };
}

// ─── SpeakableSpecification (GEO — voice / AI citation) ──────
export function speakableSchema(cssSelectors = ['h1', 'h2', '.speakable']) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SpeakableSpecification',
    cssSelector: cssSelectors,
  };
}

// ─── WebPage (AEO anchor for every page) ─────────────────────
export function webPageSchema({ title, description, url, breadcrumb, dateModified }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: title,
    description,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@type': 'Thing', name: 'Indian Startup Ecosystem' },
    primaryImageOfPage: { '@type': 'ImageObject', url: DEFAULT_OG_IMAGE },
    datePublished: dateModified || new Date().toISOString(),
    dateModified: dateModified || new Date().toISOString(),
    breadcrumb,
    inLanguage: 'en-IN',
    potentialAction: {
      '@type': 'ReadAction',
      target: [url],
    },
    speakable: speakableSchema(),
  };
}

// ─── Service schema (for programs/incubation) ────────────────
export function serviceSchema({ name, description, url, category }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${url}#service`,
    name,
    description,
    url,
    provider: { '@id': `${SITE_URL}/#organization` },
    serviceType: category || 'Startup Incubation',
    areaServed: { '@type': 'Country', name: 'India' },
    audience: {
      '@type': 'Audience',
      audienceType: 'Startup Founders, Entrepreneurs, Students',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Incubation Services',
    },
    termsOfService: `${SITE_URL}/terms`,
    inLanguage: 'en-IN',
  };
}
