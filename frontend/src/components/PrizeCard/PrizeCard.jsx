import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './PrizeCard.module.css';

const BADGE_CLASS  = { 1: styles.b1, 2: styles.b2, 3: styles.b3 };
const fmt = (n) => (n ?? 0).toLocaleString();

export default function PrizeCard({ prize, index = 0, giveawayEndAt }) {
  const navigate  = useNavigate();
  const [imgErr, setImgErr] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');

  const badgeClass = BADGE_CLASS[prize.position] || styles.b4;
  const isFeatured = prize.position === 1;

  const handleClick = () => navigate(`/giveaway/${prize.slug}`);

  // Calculate remaining time
  const calculateRemaining = () => {
    if (!giveawayEndAt) return '12d : 08h : 45m';
    const diff = new Date(giveawayEndAt) - Date.now();
    if (diff <= 0) return 'Ended';
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return `${String(d).padStart(2,'0')}d : ${String(h).padStart(2,'0')}h : ${String(m).padStart(2,'0')}m`;
  };

  // Update countdown every minute
  useEffect(() => {
    setTimeRemaining(calculateRemaining());
    const interval = setInterval(() => {
      setTimeRemaining(calculateRemaining());
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [giveawayEndAt]);

  return (
    <motion.div
      className={`${styles.card} ${isFeatured ? styles.featured : ''}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      onClick={handleClick}
      role="article"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      aria-label={`${prize.label}: ${prize.name}. Entry: ${fmt(prize.entryFee)} ${prize.entryCurrency}`}
    >
      {/* Badge */}
      <span className={`${styles.badge} ${badgeClass}`} aria-hidden="true">
        {prize.label}
      </span>

      {/* Image */}
      <div className={styles.imgWrap}>
        {!imgErr && prize.image ? (
          <img
            src={prize.image}
            alt={prize.name}
            className={styles.img}
            loading="lazy"
            onError={() => setImgErr(true)}
          />
        ) : (
          <div className={styles.imgPlaceholder} aria-hidden="true">
            <span>🎁</span>
            <span>{prize.name}</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className={styles.body}>
        <h3 className={styles.name}>{prize.name}</h3>
        <p className={styles.desc}>{prize.shortDesc}</p>

        {/* Meta */}
        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <Users size={13} color="var(--purple-300)" aria-hidden="true" />
            {fmt(prize.participants ?? 0)}+ Participants
          </span>
          <span className={styles.metaItem}>
            <Clock size={13} color="var(--gold-400)" aria-hidden="true" />
            {timeRemaining}
          </span>
        </div>

        {/* Join button */}
        <button className={styles.cta} onClick={handleClick} aria-label={`View ${prize.name} and join`}>
          Join Now <ArrowRight size={14} aria-hidden="true" />
        </button>
      </div>
    </motion.div>
  );
}
