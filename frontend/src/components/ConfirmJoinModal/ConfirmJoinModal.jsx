import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ConfirmJoinModal.module.css';
import { joinGiveaway, API_ERROR_MESSAGES as apiErrors } from '../../services/api';
import { useUser } from '../../context/UserContext';

const PRIZE_EMOJI = {
  'iphone-15-pro': '📱',
  'apple-watch': '⌚',
  'airpods-pro': '🎧',
  'amazon-2000': '🎁',
  'amazon-500': '🎁',
  'amazon-20': '🎁',
};

/**
 * Entry fee confirmation modal before joining a giveaway.
 * @param {object}   prize     - prize object from giveawayData
 * @param {object}   giveaway  - giveaway object
 * @param {Function} onClose
 * @param {Function} onSuccess
 */
export default function ConfirmJoinModal({ prize, giveaway, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user, updateBalance, refreshBalance, addParticipation } = useUser();
  const balance = user.balance[prize.entryCurrency] || 0;
  const fee = prize.entryFee;
  const balanceAfter = balance - fee;
  const hasEnough = balance >= fee;
  const emoji = PRIZE_EMOJI[prize.slug] || '🎁';

  const handleConfirm = async () => {
    if (!hasEnough) {
      setError('Insufficient balance to join this giveaway.');
      return;
    }
    
    if (isSubmitting) return; // Prevent double submission
    
    setIsSubmitting(true);
    setLoading(true);
    setError(null);
    
    try {
      const res = await joinGiveaway(giveaway.id, prize.id);
      if (res.success) {
        setSuccess(true);
        
        // Update balance in context
        updateBalance(prize.entryCurrency, fee);
        // Reconcile both navbar and giveaway cards with the persisted balance.
        await refreshBalance();
        
        // Add participation to user
        addParticipation(giveaway.id, prize.id, prize.name, fee, prize.entryCurrency);
        
        // Call success callback after a brief delay
        setTimeout(() => {
          onSuccess && onSuccess();
        }, 1500);
      } else {
        setError(apiErrors[res.error] || apiErrors.UNKNOWN_ERROR);
      }
    } catch (err) {
      console.error('Join giveaway error:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label="Confirm giveaway participation"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        className={styles.modal}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.28 }}
      >
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              className={styles.successState}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <span className={styles.successIcon} aria-hidden="true">🎉</span>
              <h2 className={styles.successTitle}>You're In!</h2>
              <p className={styles.successSub}>
                Your participation for the <strong>{prize.name}</strong> giveaway has been successfully recorded.
              </p>
              <p className={styles.feeDeducted}>
                Entry Fee: {fee.toLocaleString()} {prize.entryCurrency} deducted
              </p>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                Good luck! 🍀
              </p>
              <button className="btn btn-primary" onClick={onClose} style={{ marginTop: '0.5rem' }}>
                View Giveaway
              </button>
            </motion.div>
          ) : (
            <motion.div key="confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Header */}
              <div className={styles.header}>
                <h2 className={styles.title}>Confirm Participation</h2>
                <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
                  <X size={15} aria-hidden="true" />
                </button>
              </div>

              {/* Body */}
              <div className={styles.body}>
                {/* Prize row */}
                <div className={styles.prizeRow}>
                  <span className={styles.prizeEmoji} aria-hidden="true">{emoji}</span>
                  <div>
                    <div className={styles.prizeName}>{prize.name}</div>
                    <div className={styles.prizeGiveaway}>{giveaway?.title}</div>
                  </div>
                </div>

                {/* Balance breakdown */}
                <div className={styles.breakdown}>
                  <div className={styles.row}>
                    <span className={styles.rowLabel}>Entry Fee</span>
                    <span className={`${styles.rowValue} ${styles.rowValueGold}`}>
                      {fee.toLocaleString()} {prize.entryCurrency}
                    </span>
                  </div>
                  <hr className={styles.divider} aria-hidden="true" />
                  <div className={styles.row}>
                    <span className={styles.rowLabel}>Your Balance</span>
                    <span className={styles.rowValue}>
                      {balance.toLocaleString()} {prize.entryCurrency}
                    </span>
                  </div>
                  <div className={styles.row}>
                    <span className={styles.rowLabel}>Balance After Joining</span>
                    <span className={`${styles.rowValue} ${hasEnough ? styles.rowValueGreen : ''}`}
                      style={!hasEnough ? { color: 'var(--veloop-rose)' } : {}}>
                      {hasEnough ? `${balanceAfter.toLocaleString()} ${prize.entryCurrency}` : 'Insufficient Balance'}
                    </span>
                  </div>
                </div>

                {/* Terms reminder */}
                <p className={styles.terms}>
                  By continuing, you confirm that you have reviewed the giveaway rules and terms.
                  Entry fees are non-refundable once participation is recorded. [Confirm with VELOOP policy]
                </p>

                {error && (
                  <div className="alert alert-danger p-2 mt-2" role="alert" style={{ fontSize: 'var(--text-sm)' }}>
                    {error}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className={styles.footer}>
                <button
                  className={`btn btn-outline-secondary ${styles.cancelBtn}`}
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  className={`btn btn-primary ${styles.confirmBtn}`}
                  onClick={handleConfirm}
                  disabled={loading || !hasEnough}
                  aria-label={hasEnough ? `Confirm and join for ${fee} ${prize.entryCurrency}` : 'Insufficient balance'}
                >
                  {loading ? (
                    <>
                      <Loader2 size={14} aria-hidden="true" />
                      Joining...
                    </>
                  ) : hasEnough ? (
                    `Confirm & Join`
                  ) : (
                    'Insufficient Balance'
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
