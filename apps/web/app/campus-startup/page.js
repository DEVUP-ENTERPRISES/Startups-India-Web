'use client';

import '../../styles/campus-startup.css';

import CampusHero from '@/components/CampusHero';
import StatsSection from '@/components/StatsSection';
import AboutInitiativeSection from '@/components/AboutInitiativeSection';
import WhyMissionMatters from '@/components/WhyMissionMatters';
import ProgramTimeline from '@/components/ProgramTimeline';
import PartnersSlider from '@/components/PartnersSlider';
import FinalCTA from '@/components/FinalCTA';

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

