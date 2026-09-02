import { useState, useEffect } from 'react';
import styles from './Countdown.module.css';

function pad(n) {
  return String(n).padStart(2, '0');
}

function getTimeLeft(endDate) {
  const diff = new Date(endDate) - Date.now();
  if (diff <= 0) return null;
  const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds };
}

/**
 * Countdown timer component.
 * @param {string}   endDate     - ISO date string for the giveaway end
 * @param {'sm'|'md'|'lg'} size  - display size
 * @param {Function} onEnd       - callback when countdown reaches zero
 */
export default function Countdown({ endDate, size = 'md', onEnd }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(endDate));

  useEffect(() => {
    const tick = () => {
      const t = getTimeLeft(endDate);
      setTimeLeft(t);
      if (!t && onEnd) onEnd();
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endDate, onEnd]);

  if (!timeLeft) {
    return <span className={styles.ended}>Giveaway Ended</span>;
  }

  const valueClass  = size === 'sm' ? `${styles.value} ${styles.valueSmall}` : size === 'lg' ? `${styles.value} ${styles.valueLarge}` : styles.value;
  const sepClass    = size === 'sm' ? `${styles.separator} ${styles.separatorSmall}` : styles.separator;
  const unitClass   = size === 'sm' ? `${styles.unit} ${styles.unitSmall}` : styles.unit;

  const units = [
    { v: timeLeft.days,    l: 'Days' },
    { v: timeLeft.hours,   l: 'Hrs' },
    { v: timeLeft.minutes, l: 'Min' },
    { v: timeLeft.seconds, l: 'Sec' },
  ];

  return (
    <div className={styles.countdown} role="timer" aria-live="polite" aria-label={`Ends in ${timeLeft.days} days ${timeLeft.hours} hours ${timeLeft.minutes} minutes`}>
      {units.map((u, i) => (
        <div key={u.l} style={{ display: 'contents' }}>
          <div className={unitClass}>
            <span className={valueClass}>{pad(u.v)}</span>
            <span className={styles.label}>{u.l}</span>
          </div>
          {i < units.length - 1 && <span className={sepClass} aria-hidden="true">:</span>}
        </div>
      ))}
    </div>
  );
}
