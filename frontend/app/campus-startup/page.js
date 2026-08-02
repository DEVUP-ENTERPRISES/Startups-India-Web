'use client';

import '../../styles/campus-startup.css';

import CampusHero from '@/components/marketing/CampusHero';
import StatsSection from '@/components/marketing/StatsSection';
import AboutInitiativeSection from '@/components/marketing/AboutInitiativeSection';
import WhyMissionMatters from '@/components/marketing/WhyMissionMatters';
import ProgramTimeline from '@/components/programs/ProgramTimeline';
import PartnersSlider from '@/components/marketing/PartnersSlider';
import FinalCTA from '@/components/marketing/FinalCTA';

export default function CampusStartupPage() {
  return (
    <div className="campus-page">
      <CampusHero />
      <StatsSection />
      <AboutInitiativeSection />
      <WhyMissionMatters />
      <ProgramTimeline />
      <PartnersSlider />
      <FinalCTA />
    </div>
  );
}

