import { motion } from 'framer-motion';
import styles from './HowToParticipate.module.css';

const STEPS = [
  { num: '01', icon: '👤', title: 'Sign Up / Login',  desc: 'Create your account or log in to continue.' },
  { num: '02', icon: '✅', title: 'Complete Tasks',    desc: 'Complete eligible activities and tasks.' },
  { num: '03', icon: '🪙', title: 'Earn Entries',     desc: 'Earn more entries for more chances.' },
  { num: '04', icon: '🎁', title: 'Join Giveaway',    desc: 'Use your entries to participate.' },
  { num: '05', icon: '🏆', title: 'Winner Selected',  desc: 'Winners are selected fairly after it ends.' },
];

export default function HowToParticipate() {
  return (
    <section className={styles.section} id="how-to-participate" aria-label="How to participate">
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>
            <span className={styles.deco}>✨</span>
            How to Participate?
            <span className={styles.deco}>✨</span>
          </h2>
        </div>

        <div className={styles.steps} role="list">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.num}
              className={styles.step}
              role="listitem"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className={styles.circle} aria-hidden="true">
                <span>{s.icon}</span>
                <span className={styles.num}>{s.num}</span>
              </div>
              <div>
                <div className={styles.stepTitle}>{s.title}</div>
                <p className={styles.stepDesc}>{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
