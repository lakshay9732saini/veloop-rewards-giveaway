import { motion } from 'framer-motion';
import { Trophy, Clock, CheckCircle, Gift } from 'lucide-react';
import styles from './MyParticipations.module.css';
import { useUser } from '../../context/UserContext';

const fmt = (n) => (n ?? 0).toLocaleString();

export default function MyParticipations() {
  const { user } = useUser();
  const participations = user.participations || [];
  const wonPrize = user.wonPrize;

  if (participations.length === 0 && !wonPrize) {
    return null; // Don't show section if no participations
  }

  return (
    <section className={styles.section} id="my-participations">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className={styles.header}>
            <div>
              <h2 className={styles.title}>
                <Trophy size={24} className={styles.icon} />
                My Participations
              </h2>
              <p className={styles.subtitle}>
                Track your active giveaway entries and prizes won
              </p>
            </div>
            <div className={styles.stats}>
              <div className={styles.statItem}>
                <div className={styles.statValue}>{participations.length}</div>
                <div className={styles.statLabel}>Active Entries</div>
              </div>
              {wonPrize && (
                <div className={styles.statItem}>
                  <div className={styles.statValue} style={{ color: 'var(--veloop-gold-400)' }}>1</div>
                  <div className={styles.statLabel}>Prize Won</div>
                </div>
              )}
            </div>
          </div>

          <div className={styles.grid}>
            {/* Won Prize Card (if exists) */}
            {wonPrize && (
              <motion.div
                className={`${styles.card} ${styles.winnerCard}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className={styles.winnerBadge}>
                  <Trophy size={14} />
                  Winner
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.prizeIcon}>🏆</div>
                  <div className={styles.cardInfo}>
                    <h3 className={styles.cardTitle}>{wonPrize.prizeName}</h3>
                    <p className={styles.cardSubtitle}>{wonPrize.giveawayTitle}</p>
                    <div className={styles.cardMeta}>
                      <span className={styles.metaItem}>
                        <Gift size={12} />
                        Prize Value: {wonPrize.prizeValue || 'Premium'}
                      </span>
                      <span className={`${styles.metaItem} ${styles.statusPending}`}>
                        {wonPrize.claimStatus === 'NOT_SUBMITTED' ? (
                          <>
                            <Clock size={12} />
                            Awaiting Claim
                          </>
                        ) : wonPrize.claimStatus === 'SUBMITTED' ? (
                          <>
                            <CheckCircle size={12} />
                            Claim Submitted
                          </>
                        ) : (
                          <>
                            <CheckCircle size={12} />
                            Claimed
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                {wonPrize.claimStatus === 'NOT_SUBMITTED' && (
                  <button 
                    className={styles.claimBtn}
                    onClick={() => {
                      // Scroll to claim section
                      const claimSection = document.querySelector('[data-user-status-card]');
                      if (claimSection) {
                        claimSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }
                    }}
                  >
                    <Gift size={14} />
                    Claim Your Prize
                  </button>
                )}
              </motion.div>
            )}

            {/* Participation Cards */}
            {participations.map((participation, index) => (
              <motion.div
                key={`${participation.giveawayId}-${participation.prizeId}`}
                className={styles.card}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div className={styles.cardContent}>
                  <div className={styles.prizeIcon}>🎁</div>
                  <div className={styles.cardInfo}>
                    <h3 className={styles.cardTitle}>{participation.prizeName}</h3>
                    <p className={styles.cardSubtitle}>
                      Joined {new Date(participation.joinedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                    <div className={styles.cardMeta}>
                      <span className={styles.metaItem}>
                        Entry Fee: {fmt(participation.entryFee)} {participation.entryCurrency}
                      </span>
                      <span className={`${styles.metaItem} ${styles.statusActive}`}>
                        <CheckCircle size={12} />
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {participations.length > 0 && (
            <div className={styles.footer}>
              <p className={styles.footerText}>
                <Clock size={14} />
                Winners are announced within 24 hours of the giveaway ending. Good luck! 🍀
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
