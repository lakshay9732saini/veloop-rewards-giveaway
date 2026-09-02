import styles from './PreviousWinnerCard.module.css';

export default function PreviousWinnerCard({ winner }) {
  const date = new Date(winner.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  return (
    <div className={styles.card} role="article" aria-label={`${winner.displayName} won ${winner.prize} on ${date}`}>
      <div className={styles.top}>
        <span className={styles.giveaway}>{winner.giveawayTitle}</span>
        <span className={styles.date}>{date}</span>
      </div>
      <div className={styles.bottom}>
        <div className={styles.left}>
          <span className={styles.trophy} aria-hidden="true">🏆</span>
          <div>
            <div className={styles.userId}>{winner.displayName}</div>
            <div className={styles.prize}>{winner.prize}</div>
          </div>
        </div>
        <span className={styles.badge}>Winner</span>
      </div>
    </div>
  );
}
