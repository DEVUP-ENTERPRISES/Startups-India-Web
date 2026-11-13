import { MAINTENANCE_MODE } from '@/config/maintenance';
import MaintenancePage from '@/components/layout/MaintenancePage';
import NetworkHero from '@/components/marketing/NetworkHero';
import HowItWorksSection from '@/components/programs/HowItWorksSection';
import EcosystemFeaturesSection from '@/components/ecosystem/EcosystemFeaturesSection';
import CollaborationFrameworkSection from '@/components/marketing/CollaborationFrameworkSection';
import ApplyDarkSection from '@/components/marketing/ApplyDarkSection';
import ImpactSection from '@/components/marketing/ImpactSection';
import TrustedPartners from '@/components/marketing/TrustedPartners';
import AchievementsSection from '@/components/marketing/AchievementsSection';
import TrainingSection from '@/components/programs/TrainingSection';
import '../styles/iec-homepage.css';

// Server component: each section below is its own client island, so the page no longer hydrates as one tree.
const SECTIONS = [
  HowItWorksSection,
  EcosystemFeaturesSection,
  AchievementsSection,
  ImpactSection,
  TrustedPartners,
  TrainingSection,
  CollaborationFrameworkSection,
  ApplyDarkSection,
];

export default function HomeSections() {
  if (MAINTENANCE_MODE) {
    return <MaintenancePage />;
  }

  return (
    <div className="iec-homepage relative overflow-hidden bg-white">
      <div className="super-ui-mesh" aria-hidden="true" />
      <NetworkHero />
      {SECTIONS.map((Section, index) => (
        <div key={index} className="home-deferred home-reveal">
          <Section />
        </div>
      ))}
    </div>
  );
}
