import { buildMetadata } from '@/lib/seo';

const FUNDING_META = {
  'pre-seed': { display: 'Pre-Seed', desc: 'the earliest stage of startup funding before product development' },
  'seed': { display: 'Seed', desc: 'early-stage funding for startups with initial traction' },
  'series-a': { display: 'Series A', desc: 'growth-stage funding for startups with proven product-market fit' },
  'series-b': { display: 'Series B', desc: 'expansion-stage funding for scaling a proven business model' },
  'angel': { display: 'Angel', desc: 'funding from individual angel investors at early stage' },
  'venture-capital': { display: 'Venture Capital', desc: 'institutional funding from VC firms for high-growth startups' },
  'grants': { display: 'Government Grants', desc: 'non-dilutive government funding for Indian startups' },
  'government-schemes': { display: 'Government Schemes', desc: 'startup India government support schemes and initiatives' },
  'crowdfunding': { display: 'Crowdfunding', desc: 'raising capital from many individuals via online platforms' },
  'revenue-based': { display: 'Revenue Based Financing', desc: 'non-dilutive financing based on monthly revenue share' },
};

export async function generateMetadata({ params }) {
  const { type } = await params;
  const meta = FUNDING_META[type] || {
    display: type.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    desc: `${type} startup funding in India`,
  };

  return buildMetadata({
    title: `${meta.display} Funding for Startups in India ${new Date().getFullYear()} — Complete Guide`,
    description: `Everything you need to know about ${meta.display.toLowerCase()} funding for Indian startups — what it is, how to raise it, top investors, eligibility, and step-by-step guide for founders in India.`,
    path: `/funding/${type}`,
    section: 'Startup Funding',
    keywords: [
      `${meta.display.toLowerCase()} funding india`,
      `${meta.display.toLowerCase()} startup funding india`,
      `how to get ${meta.display.toLowerCase()} funding india`,
      `${meta.display.toLowerCase()} investors india`,
      `${meta.display.toLowerCase()} funding guide india`,
      `startup ${meta.display.toLowerCase()} india`,
      `${type} funding startup india`,
      `${meta.display.toLowerCase()} round india`,
      `raise ${meta.display.toLowerCase()} funding india`,
      `${meta.display.toLowerCase()} pitch india`,
      `${meta.display.toLowerCase()} term sheet india`,
      `startup fundraising ${meta.display.toLowerCase()} india`,
      `best ${meta.display.toLowerCase()} investors india`,
      `${meta.display.toLowerCase()} startup ecosystem india`,
    ],
  });
}

export default function FundingTypeLayout({ children }) {
  return children;
}
