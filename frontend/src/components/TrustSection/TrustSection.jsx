import { motion } from 'framer-motion';
import { Shield, Lock, Scale, Eye } from 'lucide-react';
import styles from './TrustSection.module.css';
import { trustPoints } from '../../data/giveawayData';

const ICON_MAP = { Shield, Lock, Scale, Eye };
const COLORS = [
  { color: '#6366f1', bg: 'rgba(99,102,241,0.12)' },
  { color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  { color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' },
];

export default function TrustSection() {
  return (
    <section className={styles.section} aria-label="Why trust VELOOP Rewards">
      <div className="container">
        <div className={styles.header}>
          <p className="section-label" style={{ justifyContent: 'center' }}>✅ Our Commitment</p>
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
            Why Trust VELOOP Rewards?
          </h2>
          <p className="section-subtitle" style={{ textAlign: 'center', margin: '0 auto' }}>
            We are committed to fair, transparent, and secure giveaway experiences.
          </p>
        </div>

        <div className={styles.grid}>
          {trustPoints.map((point, i) => {
            const IconComponent = ICON_MAP[point.icon];
            const { color, bg } = COLORS[i % COLORS.length];
            return (
              <motion.div
                key={point.id}
                className={styles.card}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className={styles.iconWrap} style={{ background: bg }} aria-hidden="true">
                  {IconComponent && <IconComponent size={24} color={color} />}
                </div>
                <h3 className={styles.title}>{point.title}</h3>
                <p className={styles.desc}>{point.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
