import { Clock, CheckCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './UserStatusCard.module.css';
import { CLAIM_TYPE } from '../../data/giveawayData';

export default function UserStatusCard({ user, onClaim }) {
  if (!user || user.userState === 'visitor') return null;

  const claimStatus = user.wonPrize?.claimStatus;
  const deadline = user.wonPrize?.claimDeadline
    ? new Date(user.wonPrize.claimDeadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : null;

  // ── Winner ────────────────────────────────────────────────────────────────────
  if (user.userState === 'winner') {
    return (
      <motion.div
        className={styles.wrap}
        data-user-status-card="winner"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className={styles.winner} role="region" aria-label="You're a winner!">
          <span className={styles.trophyIcon} aria-hidden="true">🏆</span>

          <div className={styles.winnerInfo}>
            <p className={styles.congrats}>🎉 Congratulations!</p>
            <h2 className={styles.wonTitle}>You Won!</h2>
            <p className={styles.wonPrize}>{user.wonPrize?.prizeName}</p>

            {deadline && (
              <p className={styles.claimDeadline}>
                <Clock size={12} aria-hidden="true" />
                Claim by: {deadline}
              </p>
            )}
          </div>

          {/* Claim action based on claim status */}
          {claimStatus === 'NOT_SUBMITTED' && (
            <button className={styles.claimBtn} onClick={onClaim} aria-label="Claim your prize">
              🎁 Claim Your Prize
            </button>
          )}
          {claimStatus === 'SUBMITTED' && (
            <div>
              <span className={`${styles.claimStatus} ${styles.submitted}`}>
                <CheckCircle size={13} aria-hidden="true" />
                Claim Submitted ✓
              </span>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)', marginTop: '0.35rem' }}>
                Our team will process your prize.
              </p>
            </div>
          )}
          {claimStatus === 'PROCESSING' && (
            <span className={`${styles.claimStatus} ${styles.processing}`}>
              <Loader2 size={13} className="spin" aria-hidden="true" />
              Prize Verification In Progress
            </span>
          )}
          {claimStatus === 'COMPLETED' && (
            <span className={`${styles.claimStatus} ${styles.completed}`}>
              <CheckCircle size={13} aria-hidden="true" />
              Prize Delivered ✓
            </span>
          )}
          {claimStatus === 'EXPIRED' && (
            <span className={`${styles.claimStatus} ${styles.expired}`}>
              ⚠️ Claim Window Expired
            </span>
          )}
        </div>
      </motion.div>
    );
  }

  // ── Participating ─────────────────────────────────────────────────────────────
  if (user.userState === 'participating') {
    return (
      <motion.div
        className={styles.wrap}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className={styles.participating} role="region" aria-label="You are participating">
          <div className={styles.partIcon} aria-hidden="true">✅</div>
          <div className={styles.partInfo}>
            <div className={styles.partTitle}>
              <CheckCircle size={15} aria-hidden="true" />
              You're Participating!
            </div>
            <p className={styles.partSub}>
              Your Entries: <span>{user.entries}</span> · Keep completing tasks to earn more entries.
            </p>
          </div>
          <button className="btn btn-outline-primary btn-sm" aria-label="Earn more entries">
            Earn More Entries →
          </button>
        </div>
      </motion.div>
    );
  }

  // ── Non-winner ────────────────────────────────────────────────────────────────
  if (user.userState === 'nonWinner') {
    return (
      <motion.div
        className={styles.wrap}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className={styles.nonWinner} role="region" aria-label="Giveaway result">
          <span style={{ fontSize: '1.75rem', flexShrink: 0 }} aria-hidden="true">🙏</span>
          <div className={styles.nonWinnerInfo}>
            <div className={styles.nonWinnerTitle}>Thanks for participating!</div>
            <p className={styles.nonWinnerSub}>
              Winners have been announced. Better luck next time — the next giveaway is coming soon!
            </p>
          </div>
          <button className="btn btn-outline-primary btn-sm">
            Explore Next Giveaway →
          </button>
        </div>
      </motion.div>
    );
  }

  return null;
}
