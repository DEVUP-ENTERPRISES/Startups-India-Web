'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import styles from './CampusHero.module.css';

export default function CampusHero() {
  return (
    <section className={styles.heroSection}>
      {/* LEFT SIDE */}
      <div className={styles.leftContent}>
        <motion.p
          className={styles.heroTag}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          ­ƒÜÇ StartupsIndia.in Presents
        </motion.p>

        <motion.h1
          className={styles.heroTitle}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          CAMPUS STARTUP & <br />
          <span>INNOVATION MISSION 2026</span>
        </motion.h1>

        <motion.p
          className={styles.heroSubtitle}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Building IndiaÔÇÖs next generation of innovators, startup founders &
          future leaders through startup awareness programs, innovation
          competitions, hackathons, pitching platforms & funding opportunities.
        </motion.p>

        {/* Logos */}
        <div className={styles.logoBox}>
          <div className={styles.logoItem}>
            <p>Presented By</p>
            <Image
              src="/images/presented-by-logo.png"
              alt="Presented By"
              width={160}
              height={60}
            />
          </div>

          <div className={styles.logoDivider}></div>

          <div className={styles.logoItem}>
            <p>Powered By</p>
            <Image
              src="/images/powered-by-logo.png"
              alt="Powered By"
              width={160}
              height={60}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className={styles.buttonGroup}>
          <button className={`${styles.heroBtn} ${styles.primaryBtn}`}>
            Become Sponsor
          </button>

          <button className={`${styles.heroBtn} ${styles.secondaryBtn}`}>
            Register College
          </button>

          <button className={`${styles.heroBtn} ${styles.secondaryBtn}`}>
            Join Innovation Movement
          </button>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className={styles.rightContent}>
        <div className={styles.rocketWrapper}>
          <Image
            src="/images/rocket.png"
            alt="Rocket"
            width={380}
            height={500}
            className={styles.rocketImage}
          />

          <div className={`${styles.floatingCard} ${styles.card1}`}>
            ­ƒôà June ÔÇô July 2026
          </div>

          <div className={`${styles.floatingCard} ${styles.card2}`}>
            ­ƒÅ½ 100+ Top Colleges
          </div>

          <div className={`${styles.floatingCard} ${styles.card3}`}>
            ­ƒæ¿ÔÇì­ƒÄô 35,000+ Students
          </div>

          <div className={`${styles.floatingCard} ${styles.card4}`}>
            ­ƒÜÇ 6,000+ Hackathon Participants
          </div>

          <div className={`${styles.floatingCard} ${styles.card5}`}>
            ­ƒÆí 2,000+ Startup Ideas
          </div>
        </div>
      </div>
    </section>
  );
}
