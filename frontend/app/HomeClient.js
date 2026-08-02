'use client';

import { MAINTENANCE_MODE } from '@/config/maintenance';
import MaintenancePage from '@/components/layout/MaintenancePage';
import ScrollToTop from '@/components/ui/ScrollToTop';
import NetworkHero from '@/components/marketing/NetworkHero';
import HowItWorksSection from '@/components/programs/HowItWorksSection';
import EcosystemFeaturesSection from '@/components/ecosystem/EcosystemFeaturesSection';
import CollaborationFrameworkSection from '@/components/marketing/CollaborationFrameworkSection';
import ApplyDarkSection from '@/components/marketing/ApplyDarkSection';
import ImpactSection from '@/components/marketing/ImpactSection';
import TrustedPartners from '@/components/marketing/TrustedPartners';
import AchievementsSection from '@/components/marketing/AchievementsSection';
import TrainingSection from '@/components/programs/TrainingSection';
import { motion } from 'framer-motion';
import '../styles/iec-homepage.css';

const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] },
  },
};

export default function Home() {
  if (MAINTENANCE_MODE) {
    return <MaintenancePage />;
  }

  return (
    <div className="iec-homepage relative overflow-hidden bg-white">
      <div className="super-ui-mesh" aria-hidden="true" />

      <NetworkHero />

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={sectionVariants}>
        <HowItWorksSection />
      </motion.div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={sectionVariants}>
        <EcosystemFeaturesSection />
      </motion.div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={sectionVariants}>
        <AchievementsSection />
      </motion.div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={sectionVariants}>
        <ImpactSection />
      </motion.div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={sectionVariants}>
        <TrustedPartners />
      </motion.div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={sectionVariants}>
        <TrainingSection />
      </motion.div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={sectionVariants}>
        <CollaborationFrameworkSection />
      </motion.div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={sectionVariants}>
        <ApplyDarkSection />
      </motion.div>

      <ScrollToTop />
    </div>
  );
}
