import { motion } from 'framer-motion';
import { Gift, Users, Trophy, Clock } from 'lucide-react';
import styles from './GiveawayStats.module.css';

const STATS = [
  { icon: Gift, label: 'Total Giveaways', value: '24', suffix: ' Active', color: '#6366f1', bg: 'rgba(99,102,241,0.12)' },
  { icon: Users, label: 'Total Participants', value: '8.5K+', suffix: '', color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  { icon: Trophy, label: 'Prizes Won', value: '1.2K+', suffix: '', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  { icon: Clock, label: 'Giveaway Ends In', value: '12d', suffix: ' : 08h : 45m', color: '#f43f5e', bg: 'rgba(244,63,94,0.12)' },
];

export default function GiveawayStats({ stats }) {
  return (
    <section className={styles.section} aria-label="Giveaway statistics">
      <div className="container">
        <div className={styles.grid}>
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              className={styles.card}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className={styles.iconWrap} style={{ background: s.bg }} aria-hidden="true">
                <s.icon size={22} color={s.color} />
              </div>
              <div className={styles.value} aria-label={`${s.value}${s.suffix} ${s.label}`}>
                {s.value}<span style={{ color: s.color, fontSize: '0.75em' }}>{s.suffix}</span>
              </div>
              <div className={styles.label}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
