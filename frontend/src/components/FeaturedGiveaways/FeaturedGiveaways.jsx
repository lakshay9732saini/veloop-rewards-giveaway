import { useState, useMemo } from 'react';
import styles from './FeaturedGiveaways.module.css';
import PrizeCard from '../PrizeCard/PrizeCard';
import { PRIZE_TYPE } from '../../data/giveawayData';

export default function FeaturedGiveaways({ prizes = [], giveawayEndAt }) {
  const [filter, setFilter] = useState('all');

  // Filter prizes based on selected filter
  const filteredPrizes = useMemo(() => {
    if (filter === 'all') return prizes;
    if (filter === 'physical') return prizes.filter(p => p.type === PRIZE_TYPE.PHYSICAL);
    if (filter === 'gift_card') return prizes.filter(p => p.type === PRIZE_TYPE.GIFT_CARD || p.type === PRIZE_TYPE.DIGITAL);
    return prizes;
  }, [prizes, filter]);

  return (
    <section className={styles.section} id="prizes" aria-label="Active giveaway prizes">
      <div className="container">
        <div className={styles.header}>
          <div className={styles.titleRow}>
            <p className="section-label">
              <span className={styles.sectionIcon}>✨</span>
              Active Giveaways
            </p>
            <p className="section-subtitle" style={{ marginTop: '0.25rem' }}>
              Join and stand a chance to win amazing rewards.
            </p>
          </div>
          <select 
            className={styles.filterSelect} 
            aria-label="Filter giveaways" 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Giveaways ({prizes.length})</option>
            <option value="physical">Physical Prizes ({prizes.filter(p => p.type === PRIZE_TYPE.PHYSICAL).length})</option>
            <option value="gift_card">Gift Cards ({prizes.filter(p => p.type === PRIZE_TYPE.GIFT_CARD || p.type === PRIZE_TYPE.DIGITAL).length})</option>
          </select>
        </div>

        {filteredPrizes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--color-text-muted)' }}>
            <p>No prizes match the selected filter.</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {filteredPrizes.map((prize, i) => (
              <PrizeCard
                key={prize.id}
                prize={prize}
                index={i}
                giveawayEndAt={giveawayEndAt}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
