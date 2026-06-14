import { buildMetadata } from '@/lib/seo';

const SECTOR_META = {
  fintech: { display: 'Fintech', desc: 'financial technology, digital payments, lending, insurance, and wealthtech' },
  healthtech: { display: 'Healthtech', desc: 'healthcare technology, telemedicine, diagnostics, and medical devices' },
  edtech: { display: 'EdTech', desc: 'education technology, online learning, skill development, and learning management' },
  agritech: { display: 'AgriTech', desc: 'agricultural technology, farm management, precision farming, and food supply chain' },
  cleantech: { display: 'CleanTech', desc: 'clean energy, solar, wind, waste management, and sustainability technology' },
  saas: { display: 'SaaS', desc: 'software as a service, B2B tools, cloud software, and enterprise applications' },
  d2c: { display: 'D2C', desc: 'direct-to-consumer brands, e-commerce, consumer products, and retail tech' },
  deeptech: { display: 'Deep Tech', desc: 'AI/ML, semiconductor, quantum computing, robotics, and advanced manufacturing' },
  spacetech: { display: 'Space Tech', desc: 'space technology, satellite, launch vehicles, and earth observation' },
  foodtech: { display: 'FoodTech', desc: 'food technology, alternative proteins, delivery, restaurant tech, and food supply' },
  legaltech: { display: 'LegalTech', desc: 'legal technology, contract management, compliance, and access to justice' },
  hrtech: { display: 'HRTech', desc: 'human resources technology, recruitment, payroll, and employee engagement' },
  climatetech: { display: 'Climate Tech', desc: 'climate change solutions, carbon markets, ESG, and green infrastructure' },
  ev: { display: 'Electric Vehicle (EV)', desc: 'electric vehicles, EV charging, battery technology, and sustainable mobility' },
  biotech: { display: 'Biotech', desc: 'biotechnology, genomics, drug discovery, and life sciences' },
};

export async function generateMetadata({ params }) {
  const { sector } = await params;
  const meta = SECTOR_META[sector] || { display: sector.charAt(0).toUpperCase() + sector.slice(1), desc: `${sector} startups` };

  return buildMetadata({
    title: `${meta.display} Startups in India ${new Date().getFullYear()} — Ecosystem, Funding & Opportunities`,
    description: `Comprehensive guide to ${meta.display} startups in India — top companies, funding landscape, key investors, incubators, events, mentors, and growth opportunities in ${meta.desc} sector.`,
    path: `/ecosystem/${sector}`,
    section: 'Startup Ecosystem',
    keywords: [
      `${meta.display.toLowerCase()} startups india`,
      `${meta.display.toLowerCase()} startup ecosystem india`,
      `${meta.display.toLowerCase()} startup india ${new Date().getFullYear()}`,
      `top ${meta.display.toLowerCase()} startups india`,
      `best ${meta.display.toLowerCase()} companies india`,
      `${meta.display.toLowerCase()} funding india`,
      `${meta.display.toLowerCase()} investors india`,
      `${meta.display.toLowerCase()} incubator india`,
      `${meta.display.toLowerCase()} startup opportunities india`,
      `invest in ${meta.display.toLowerCase()} india`,
      `${meta.display.toLowerCase()} market india`,
      `${meta.display.toLowerCase()} growth india`,
      `${meta.display.toLowerCase()} entrepreneur india`,
      `${sector} startup india`,
      `indian ${meta.display.toLowerCase()} ecosystem`,
      `startup india ${sector} sector`,
    ],
  });
}

export default function EcosystemSectorLayout({ children }) {
  return children;
}
