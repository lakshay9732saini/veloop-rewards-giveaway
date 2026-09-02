import { useState, useEffect } from 'react';
import styles from './GiveawayLoader.module.css';

const ASSET = '/assets/ChatGPT Image Aug 19, 2026, 01_40_53 PM.png';

const MESSAGES = [
  "Preparing today's rewards...",
  'Checking active giveaways...',
  'Loading available prizes...',
  'Bringing your rewards closer...',
  'Almost there...',
];

/**
 * Full-page or inline themed giveaway loader.
 */
export default function GiveawayLoader({ inline = false }) {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setMsgIndex((i) => (i + 1) % MESSAGES.length), 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className={inline ? styles.inline : styles.overlay}
      role="status"
      aria-label="Loading giveaway"
    >
      {/* Gift box image — floats gently */}
      <img
        src={ASSET}
        alt=""
        className={styles.giftImg}
        aria-hidden="true"
      />

      {/* Brand */}
      <div className={styles.brand}>
        VELOOP <span className={styles.brandAccent}>Rewards</span>
      </div>

      {/* Rotating message */}
      <p className={styles.message} key={msgIndex}>
        {MESSAGES[msgIndex]}
      </p>

      {/* Animated dots */}
      <div className={styles.dots} aria-hidden="true">
        {[0,1,2,3,4].map((i) => (
          <span key={i} className={styles.dot} style={{ animationDelay: `${i * 0.16}s` }} />
        ))}
      </div>
    </div>
  );
}

/** Skeleton card for prize loading */
export function PrizeCardSkeleton() {
  return (
    <div className={styles.skeletonCard}>
      <div className={styles.skeletonImg} />
      <div className={styles.skeletonLine} style={{ width: '60%' }} />
      <div className={styles.skeletonLine} style={{ width: '80%' }} />
      <div className={styles.skeletonLine} style={{ width: '40%' }} />
    </div>
  );
}

/** Button-level joining state */
export function JoiningLoader() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
      Joining Giveaway...
    </span>
  );
}
