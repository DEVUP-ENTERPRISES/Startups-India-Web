const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://startupsindia.in';
const API = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

async function fetchJson(path) {
  try {
    const res = await fetch(`${API}${path}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch {
    return null;
  }
}

// ─── Data ─────────────────────────────────────────────────────
const CITIES_T1 = ['bangalore', 'mumbai', 'delhi', 'hyderabad', 'chennai', 'pune'];
const CITIES_T2 = [
  'ahmedabad', 'kolkata', 'jaipur', 'chandigarh', 'kochi', 'indore',
  'lucknow', 'bhopal', 'coimbatore', 'surat', 'nagpur', 'mysore',
  'vizag', 'bhubaneswar', 'vadodara', 'rajkot', 'nashik', 'patna',
  'agra', 'meerut', 'varanasi', 'jodhpur', 'udaipur', 'guwahati',
];
const CITIES_T3 = [
  'tirupati', 'mangalore', 'hubballi', 'belgaum', 'kolhapur', 'aurangabad',
  'amritsar', 'ludhiana', 'jalandhar', 'faridabad', 'gurgaon', 'noida',
  'ghaziabad', 'dehradun', 'rishikesh', 'shimla', 'ranchi', 'raipur',
  'bhubaneswar', 'cuttack', 'siliguri', 'durgapur', 'dhanbad',
  'thiruvananthapuram', 'kozhikode', 'thrissur', 'madurai', 'tiruchirappalli',
];
const ALL_CITIES = [...CITIES_T1, ...CITIES_T2, ...CITIES_T3];

const STATES = [
  'maharashtra', 'karnataka', 'delhi', 'telangana', 'tamil-nadu', 'gujarat',
  'rajasthan', 'uttar-pradesh', 'west-bengal', 'kerala', 'andhra-pradesh',
  'madhya-pradesh', 'haryana', 'punjab', 'odisha', 'assam', 'jharkhand',
  'chhattisgarh', 'uttarakhand', 'himachal-pradesh', 'goa', 'bihar',
];

const SECTORS = [
  'fintech', 'healthtech', 'edtech', 'agritech', 'cleantech', 'climatetech',
  'saas', 'd2c', 'deeptech', 'spacetech', 'foodtech', 'legaltech',
  'hrtech', 'proptech', 'insurtech', 'logistics', 'ev', 'defense-tech',
  'biotech', 'medtech', 'retailtech', 'traveltech', 'govtech', 'civictech',
];

const CITY_CATEGORIES = [
  'incubators', 'accelerators', 'events', 'mentors', 'community',
  'funding', 'coworking', 'investors', 'startup-programs', 'networking',
];

const COLLEGES = [
  'iit-bombay', 'iit-delhi', 'iit-bangalore', 'iit-madras', 'iit-kharagpur',
  'iit-roorkee', 'iit-kanpur', 'iit-guwahati', 'iit-hyderabad', 'iit-gandhinagar',
  'iim-ahmedabad', 'iim-bangalore', 'iim-calcutta', 'iim-lucknow', 'iim-kozhikode',
  'bits-pilani', 'bits-goa', 'bits-hyderabad', 'nit-trichy', 'nit-surathkal',
  'vit-vellore', 'manipal-university', 'srm-university', 'amity-university',
];

const FUNDING_TYPES = [
  'pre-seed', 'seed', 'series-a', 'series-b', 'angel', 'venture-capital',
  'grants', 'government-schemes', 'crowdfunding', 'revenue-based',
];

const EVENT_TYPES = [
  'hackathons', 'pitch-competitions', 'demo-days', 'startup-summits',
  'networking-events', 'workshops', 'bootcamps', 'webinars', 'conferences',
];

const GUIDE_SLUGS = [
  'how-to-start-a-startup-in-india',
  'startup-registration-india-guide',
  'dpiit-recognition-guide',
  'startup-funding-guide-india',
  'how-to-pitch-to-investors-india',
  'angel-investor-guide-india',
  'venture-capital-guide-india',
  'startup-legal-guide-india',
  'esop-guide-startups-india',
  'startup-tax-benefits-india',
  'startup-india-scheme-guide',
  'sisfs-application-guide',
  'startup-incubation-guide-india',
  'pre-incubation-program-guide',
  'startup-pitch-deck-guide',
  'startup-valuation-guide-india',
  'startup-co-founder-guide',
  'product-market-fit-guide',
  'startup-marketing-guide-india',
  'startup-hiring-guide-india',
];

export default async function sitemap() {
  const now = new Date().toISOString();

  // ─── Core pages ───────────────────────────────────────────────
  const staticPages = [
    { url: `${BASE}/`, priority: 1.0, changeFrequency: 'daily' },
    { url: `${BASE}/about`, priority: 0.9, changeFrequency: 'monthly' },
    { url: `${BASE}/programs`, priority: 0.95, changeFrequency: 'weekly' },
    { url: `${BASE}/courses`, priority: 0.9, changeFrequency: 'daily' },
    { url: `${BASE}/events`, priority: 0.9, changeFrequency: 'daily' },
    { url: `${BASE}/source`, priority: 0.85, changeFrequency: 'daily' },
    { url: `${BASE}/mentors`, priority: 0.85, changeFrequency: 'weekly' },
    { url: `${BASE}/community`, priority: 0.75, changeFrequency: 'weekly' },
    { url: `${BASE}/team`, priority: 0.6, changeFrequency: 'monthly' },
    // Pillar pages
    { url: `${BASE}/startup-ecosystem`, priority: 0.9, changeFrequency: 'weekly' },
    { url: `${BASE}/startup-funding`, priority: 0.9, changeFrequency: 'weekly' },
    { url: `${BASE}/startup-incubation`, priority: 0.9, changeFrequency: 'weekly' },
    { url: `${BASE}/startup-mentorship`, priority: 0.85, changeFrequency: 'weekly' },
    { url: `${BASE}/startup-resources`, priority: 0.85, changeFrequency: 'weekly' },
    { url: `${BASE}/startup-registration`, priority: 0.85, changeFrequency: 'monthly' },
    { url: `${BASE}/startup-stories`, priority: 0.8, changeFrequency: 'weekly' },
    { url: `${BASE}/angel-investors`, priority: 0.85, changeFrequency: 'weekly' },
    { url: `${BASE}/venture-capital`, priority: 0.85, changeFrequency: 'weekly' },
    { url: `${BASE}/startup-events`, priority: 0.85, changeFrequency: 'daily' },
    { url: `${BASE}/startup-competition`, priority: 0.8, changeFrequency: 'weekly' },
    { url: `${BASE}/student-startups`, priority: 0.8, changeFrequency: 'weekly' },
    { url: `${BASE}/startup-hiring`, priority: 0.75, changeFrequency: 'weekly' },
    { url: `${BASE}/startup-community`, priority: 0.75, changeFrequency: 'weekly' },
  ].map(p => ({ ...p, lastModified: now }));

  // ─── Dynamic content from API ─────────────────────────────────
  const [articleData, courseData, eventData] = await Promise.all([
    fetchJson('/api/v1/articles?limit=1000&status=published'),
    fetchJson('/api/v1/courses?limit=500&status=published'),
    fetchJson('/api/v1/events?limit=500&status=published'),
  ]);

  const articlePages = (articleData?.articles || []).map(a => ({
    url: `${BASE}/source/${a.slug}`,
    lastModified: a.updatedAt || a.publishedAt || now,
    changeFrequency: 'weekly',
    priority: 0.75,
  }));

  const coursePages = (courseData?.courses || []).map(c => ({
    url: `${BASE}/courses/${c.slug}`,
    lastModified: c.updatedAt || now,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  const eventPages = (eventData?.events || []).map(e => ({
    url: `${BASE}/events/${e.slug || e._id}`,
    lastModified: e.updatedAt || now,
    changeFrequency: 'daily',
    priority: 0.8,
  }));

  // ─── Programmatic: City × Category (1,600+ pages) ─────────────
  const cityPages = ALL_CITIES.flatMap(city =>
    CITY_CATEGORIES.map(cat => ({
      url: `${BASE}/${cat}/${city}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: CITIES_T1.includes(city) ? 0.7 : 0.55,
    }))
  );

  // ─── Programmatic: State pages (440+ pages) ───────────────────
  const statePageCats = ['incubators', 'events', 'funding', 'startup-ecosystem', 'startup-policy'];
  const statePages = STATES.flatMap(state =>
    statePageCats.map(cat => ({
      url: `${BASE}/${cat}/${state}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    }))
  );

  // ─── Programmatic: Sector pages ───────────────────────────────
  const sectorPages = SECTORS.flatMap(sector => [
    { url: `${BASE}/ecosystem/${sector}`, lastModified: now, changeFrequency: 'weekly', priority: 0.65 },
    { url: `${BASE}/mentors/${sector}`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE}/funding/${sector}`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE}/investors/${sector}`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${BASE}/incubators/${sector}`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
  ]);

  // ─── Programmatic: Sector × City (top sectors × top cities) ──
  const TOP_SECTORS = ['fintech', 'healthtech', 'edtech', 'saas', 'd2c', 'agritech', 'deeptech'];
  const sectorCityPages = TOP_SECTORS.flatMap(sector =>
    CITIES_T1.map(city => ({
      url: `${BASE}/ecosystem/${sector}/${city}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.55,
    }))
  );

  // ─── Programmatic: College pages ─────────────────────────────
  const collegeCategories = ['startup-programs', 'incubator', 'e-cell', 'alumni-startups'];
  const collegePages = COLLEGES.flatMap(college =>
    collegeCategories.map(cat => ({
      url: `${BASE}/college/${college}/${cat}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.55,
    }))
  );

  // ─── Programmatic: Funding type pages ─────────────────────────
  const fundingPages = FUNDING_TYPES.flatMap(type => [
    { url: `${BASE}/funding/${type}`, lastModified: now, changeFrequency: 'weekly', priority: 0.65 },
    ...CITIES_T1.map(city => ({
      url: `${BASE}/funding/${type}/${city}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.55,
    })),
  ]);

  // ─── Programmatic: Event type pages ──────────────────────────
  const eventTypePages = EVENT_TYPES.flatMap(type => [
    { url: `${BASE}/events/${type}`, lastModified: now, changeFrequency: 'daily', priority: 0.65 },
    ...CITIES_T1.map(city => ({
      url: `${BASE}/events/${type}/${city}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    })),
  ]);

  // ─── Guides ──────────────────────────────────────────────────
  const guidePages = GUIDE_SLUGS.map(slug => ({
    url: `${BASE}/guides/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...articlePages,
    ...coursePages,
    ...eventPages,
    ...cityPages,
    ...statePages,
    ...sectorPages,
    ...sectorCityPages,
    ...collegePages,
    ...fundingPages,
    ...eventTypePages,
    ...guidePages,
  ];
}
