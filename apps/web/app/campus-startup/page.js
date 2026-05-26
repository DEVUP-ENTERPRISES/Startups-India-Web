'use client';

import '../../styles/campus-startup.css';

import CampusHero from '@/components/CampusHero';
import StatsSection from '@/components/StatsSection';
import ProgramTimeline from '@/components/ProgramTimeline';
import PrizePool from '@/components/PrizePool';
import PartnersSlider from '@/components/PartnersSlider';
import FinalCTA from '@/components/FinalCTA';

export default function CampusStartupPage() {
  return (
    <div className="campus-page">
      <CampusHero />
      <StatsSection />
      <ProgramTimeline />
      <PrizePool />
      <PartnersSlider />
      <FinalCTA />
    </div>
  );
}
