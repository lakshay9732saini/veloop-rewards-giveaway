import { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import styles from './WinnerSlider.module.css';
import { previousWinners } from '../../data/giveawayData';

// Use previous winners as announcement data; add initials for avatar
const WINNERS = previousWinners.slice(0, 8).map((w, i) => ({
  ...w,
  initial: String.fromCharCode(65 + (i % 26)),
  bg: ['#7c3aed','#2563eb','#059669','#dc2626','#d97706','#7c3aed','#0891b2','#9333ea'][i % 8],
}));

const VISIBLE = 5;

export default function WinnerSlider() {
  const [index, setIndex] = useState(0);
  const maxIndex = Math.max(0, WINNERS.length - VISIBLE);

  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => Math.min(maxIndex, i + 1));

  const visiblePages = Math.ceil(WINNERS.length / VISIBLE);
  const currentPage  = Math.floor(index / VISIBLE);

  return (
    <section className={styles.section} aria-label="Winner announcement">
      <div className="container">
        <div className={styles.header}>
          <div>
            <p className="section-label">🎉 Winner Announcement</p>
            <p className="section-subtitle" style={{ marginTop: '0.25rem' }}>
              Congratulations to our recent lucky winners!
            </p>
          </div>
          <button className={styles.viewBtn} onClick={() => document.getElementById('winners')?.scrollIntoView({ behavior: 'smooth' })}>
            View All Winners <ArrowRight size={14} />
          </button>
        </div>

        <div className={styles.sliderWrap}>
          {/* Prev */}
          <button className={`${styles.navBtn} ${styles.navPrev}`} onClick={prev} aria-label="Previous winners" disabled={index === 0}>
            <ChevronLeft size={16} />
          </button>

          <div className={styles.sliderTrack} style={{ transform: `translateX(calc(-${index} * (100% / ${VISIBLE}) - ${index} * 1.25rem))` }}>
            {WINNERS.map((w) => (
              <div key={w.id} className={styles.winnerCard}>
                <div className={styles.avatarWrap}>
                  <div className={styles.avatar} style={{ background: `linear-gradient(135deg, ${w.bg}, #1e1848)` }} aria-hidden="true">
                    {w.initial}
                  </div>
                  <div className={styles.trophyBadge} aria-hidden="true">🏆</div>
                </div>
                <div className={styles.winnerName}>{w.displayName}</div>
                <div className={styles.wonPrize}>Won {w.prize}</div>
              </div>
            ))}
          </div>

          {/* Next */}
          <button className={`${styles.navBtn} ${styles.navNext}`} onClick={next} aria-label="Next winners" disabled={index >= maxIndex}>
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Dots */}
        <div className={styles.dots} role="tablist">
          {Array.from({ length: visiblePages }).map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === currentPage ? styles.dotActive : ''}`}
              onClick={() => setIndex(i * VISIBLE)}
              aria-label={`Winner page ${i + 1}`}
              role="tab"
              aria-selected={i === currentPage}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
