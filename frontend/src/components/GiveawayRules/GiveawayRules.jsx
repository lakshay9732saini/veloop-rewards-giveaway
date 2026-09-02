import { motion } from 'framer-motion';
import styles from './GiveawayRules.module.css';

export default function GiveawayRules({ rules = [], eligibility = [] }) {
  const allRules = [...eligibility, ...rules];

  if (!allRules.length) return null;

  return (
    <section className={styles.section} aria-label="Giveaway rules and guidelines">
      <div className="container">
        <motion.div
          className={styles.card}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.titleWrap}>
              <div className={styles.iconBox} aria-hidden="true">📋</div>
              <h2 className={styles.title}>Giveaway Rules &amp; Guidelines</h2>
            </div>
            <span className={styles.officialBadge}>
              ✅ Official Rules
            </span>
          </div>

          {/* Rules grid */}
          <div className={styles.grid} role="list">
            {allRules.map((rule, i) => (
              <motion.div
                key={i}
                className={styles.rule}
                role="listitem"
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
              >
                <span className={styles.ruleDot} aria-hidden="true" />
                <span>{rule}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
