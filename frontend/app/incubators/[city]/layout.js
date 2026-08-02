import { buildMetadata } from '@/lib/seo';

const CITY_DISPLAY = {
  bangalore: 'Bangalore', mumbai: 'Mumbai', delhi: 'Delhi NCR',
  hyderabad: 'Hyderabad', chennai: 'Chennai', pune: 'Pune',
  ahmedabad: 'Ahmedabad', jaipur: 'Jaipur', kochi: 'Kochi',
  kolkata: 'Kolkata', chandigarh: 'Chandigarh', indore: 'Indore',
  lucknow: 'Lucknow', surat: 'Surat', nagpur: 'Nagpur',
};

export async function generateMetadata({ params }) {
  const { city } = await params;
  const displayName = CITY_DISPLAY[city] || (city.charAt(0).toUpperCase() + city.slice(1));

  return buildMetadata({
    title: `Startup Incubators in ${displayName} ${new Date().getFullYear()} - Complete List & How to Apply`,
    description: `Find the best startup incubators and incubation programs in ${displayName}. Complete directory of government, IIT/IIM, and private startup incubators in ${displayName} with application guides, sector focus, and founder reviews.`,
    path: `/incubators/${city}`,
    section: 'Incubators',
    keywords: [
      `startup incubators in ${displayName.toLowerCase()}`,
      `best incubators ${displayName.toLowerCase()}`,
      `incubation program ${displayName.toLowerCase()}`,
      `startup program ${displayName.toLowerCase()}`,
      `startup incubation ${displayName.toLowerCase()}`,
      `tech incubator ${displayName.toLowerCase()}`,
      `government incubator ${displayName.toLowerCase()}`,
      `iit incubator ${displayName.toLowerCase()}`,
      `startup support ${displayName.toLowerCase()}`,
      `startup hub ${displayName.toLowerCase()}`,
      `apply startup incubator ${displayName.toLowerCase()}`,
      `entrepreneur program ${displayName.toLowerCase()}`,
      `startup india incubator ${displayName.toLowerCase()}`,
      `dpiit incubator ${displayName.toLowerCase()}`,
      `business incubator ${displayName.toLowerCase()}`,
    ],
  });
}

export default function IncubatorsCityLayout({ children }) {
  return children;
}
