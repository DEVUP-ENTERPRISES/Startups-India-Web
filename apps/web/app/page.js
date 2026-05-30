'use client';

import { MAINTENANCE_MODE } from '@/config/maintenance';
import MaintenancePage from '../components/MaintenancePage';
import ScrollToTop from '@/components/ScrollToTop';
import NetworkHero from '@/components/NetworkHero';

import HowItWorksSection from '@/components/HowItWorksSection';
import EcosystemFeaturesSection from '@/components/EcosystemFeaturesSection';
import CollaborationFrameworkSection from '@/components/CollaborationFrameworkSection';
import FoundersTestimonialsSection from '@/components/FoundersTestimonialsSection';
import ApplyDarkSection from '@/components/ApplyDarkSection';
import ImpactSection from '@/components/ImpactSection';
import TrustedPartners from '@/components/TrustedPartners';
import AchievementsSection from '@/components/AchievementsSection';
import TrainingSection from '@/components/TrainingSection';


import { motion } from 'framer-motion';
import '../styles/iec-homepage.css';

export default function Home() {
  if (MAINTENANCE_MODE) {
    return <MaintenancePage />;
  }

  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] } 
    }
  };

  return (
    <div className="iec-homepage relative overflow-hidden bg-white">
      {/* Global Super UI Mesh Backdrop */}
      <div className="super-ui-mesh" aria-hidden="true" />
      
      <NetworkHero />

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionVariants}>
        <HowItWorksSection />
      </motion.div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionVariants}>
        <EcosystemFeaturesSection />
      </motion.div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionVariants}>
        <AchievementsSection />
      </motion.div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionVariants}>
        <ImpactSection />
      </motion.div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionVariants}>
       <TrustedPartners />
      </motion.div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionVariants}>
        <TrainingSection />
      </motion.div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionVariants}>
        <CollaborationFrameworkSection />
      </motion.div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionVariants}>
        <FoundersTestimonialsSection />
      </motion.div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={sectionVariants}>
        <ApplyDarkSection />
      </motion.div>

      <ScrollToTop />
    </div>
  );
}
