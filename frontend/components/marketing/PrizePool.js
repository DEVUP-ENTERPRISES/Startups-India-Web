'use client';

import { motion } from 'framer-motion';

const prizes = [
  { place: '­ƒÑç First Prize', amount: 'Ôé╣1,00,000' },
  { place: '­ƒÑê Second Prize', amount: 'Ôé╣70,000' },
  { place: '­ƒÑë Third Prize', amount: 'Ôé╣50,000' },
];

export default function PrizePool() {
  return (
    <section className="prize-section">
      <div className="section-header">
        <p className="section-tag">Hackathon Prize Pool</p>
        <h2>Rewards for Innovation Winners ­ƒÅå</h2>
      </div>

      <div className="prize-container">
        {prizes.map((prize, index) => (
          <motion.div
            key={index}
            className="prize-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            viewport={{ once: true }}
          >
            <h3>{prize.place}</h3>
            <h1>{prize.amount}</h1>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
