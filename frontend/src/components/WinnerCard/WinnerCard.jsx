import styles from './WinnerCard.module.css';

const RANK_STYLE = {
  1: { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)', emoji: '🥇' },
  2: { bg: 'rgba(148,163,184,0.12)', border: 'rgba(148,163,184,0.2)', emoji: '🥈' },
  3: { bg: 'rgba(161,100,69,0.12)', border: 'rgba(161,100,69,0.2)', emoji: '🥉' },
};

const STATUS_CLASS = {
  CLAIMED: styles.statusClaimed,
  DELIVERED: styles.statusDelivered,
  PENDING: styles.statusPending,
};

export default function WinnerCard({ winner }) {
  const rank = RANK_STYLE[winner.position] || { bg: 'rgba(139,92,246,0.12)', border: 'rgba(139,92,246,0.2)', emoji: '🎁' };
  const date = new Date(winner.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <div className={styles.card} role="article" aria-label={`Winner ${winner.displayName} won ${winner.prize}`}>
      <div
        className={styles.rank}
        style={{ background: rank.bg, border: `1.5px solid ${rank.border}` }}
        aria-hidden="true"
      >
        {rank.emoji}
      </div>

      <div className={styles.info}>
        <div className={styles.userId}>{winner.displayName}</div>
        <div className={styles.prize}>{winner.prize}</div>
        <div className={styles.meta}>{date}</div>
      </div>

      <span className={`${styles.statusBadge} ${STATUS_CLASS[winner.status] || styles.statusPending}`}>
        {winner.status === 'CLAIMED' ? 'Claimed' : winner.status === 'DELIVERED' ? 'Delivered' : 'Pending'}
      </span>
    </div>
  );
}
