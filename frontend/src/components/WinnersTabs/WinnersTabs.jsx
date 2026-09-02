import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './WinnersTabs.module.css';
import { GIVEAWAY_STATUS, prizes } from '../../data/giveawayData';
import { fetchAllPreviousWinners } from '../../services/api';

// Prize image fallback map
const PRIZE_EMOJI = {
  'iPhone 15 Pro': '📱', 'iPhone 14': '📱', 'iPhone 13': '📱',
  'Apple Watch Series 9': '⌚', 'Apple Watch Series 8': '⌚',
  'AirPods Pro': '🎧',
  '₹2,000 Amazon Voucher': '🎁', '₹500 Amazon Voucher': '🎁', '₹20 Amazon Voucher': '🎁',
};
const getEmoji = (prize) => PRIZE_EMOJI[prize] || '🎁';

// Initials colors
const COLORS = ['#7c3aed','#2563eb','#059669','#dc2626','#d97706','#0891b2','#9333ea','#be185d'];

export default function WinnersTabs({ giveaway }) {
  const [tab, setTab] = useState('winners');
  const [prevWinners, setPrevWinners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAllWinners, setShowAllWinners] = useState(false);
  const status = giveaway?.status || GIVEAWAY_STATUS.ACTIVE;

  useEffect(() => {
    setLoading(true);
    fetchAllPreviousWinners()
      .then((r) => { if (r.success) setPrevWinners(r.data || []); })
      .finally(() => setLoading(false));
  }, []);

  // Demo stable winner cards for ended state
  const endedWinners = (giveaway?.prizes ?? []).flatMap((prize, pi) =>
    Array.from({ length: Math.min(prize.winnerCount ?? 1, 2) }).map((_, i) => ({
      id: `demo-${prize.id}-${i}`,
      displayName: `VE****${(pi * 10 + i + 21) % 90 + 10}`,
      prize: prize.name,
      image: prize.image,
      position: prize.position,
      date: giveaway?.endAt || new Date().toISOString(),
      initial: String.fromCharCode(65 + ((pi + i) % 26)),
      color: COLORS[(pi + i) % COLORS.length],
    }))
  );

  return (
    <section className={styles.section} id="winners" aria-label="Giveaway winners">
      <div className="container">
        {/* ── Tab: Current Winners ── */}
        <div className={styles.header}>
          <div>
            <p className="section-label">🏆 Winners</p>
          </div>
        </div>

        <div className={styles.tabs} role="tablist">
          <button
            className={`${styles.tab} ${tab === 'winners' ? styles.tabActive : ''}`}
            onClick={() => setTab('winners')}
            role="tab" aria-selected={tab === 'winners'}
          >
            Current Winners
          </button>
          <button
            className={`${styles.tab} ${tab === 'previous' ? styles.tabActive : ''}`}
            onClick={() => setTab('previous')}
            role="tab" aria-selected={tab === 'previous'}
          >
            Previous Winners
          </button>
        </div>

        <AnimatePresence mode="wait">
          {tab === 'winners' && (
            <motion.div key="current" initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} transition={{ duration:0.2 }}>
              {status === GIVEAWAY_STATUS.ACTIVE ? (
                <div className={styles.liveState}>
                  <div className={styles.liveIcon} aria-hidden="true">🎯</div>
                  <h3 className={styles.liveTitle}>Giveaway is Still Live!</h3>
                  <p className={styles.liveDesc}>
                    Winners will be announced within 24 hours after the giveaway ends. Keep participating!
                  </p>
                  <div className={styles.statusRow}>
                    <div><span className={styles.statusLabel}>Giveaway </span><span className={styles.statusVal}>{giveaway?.title}</span></div>
                    <div className={styles.statusDivider} />
                    <span className="badge-live"><span className="live-dot" />LIVE</span>
                    <div className={styles.statusDivider} />
                    <div><span className={styles.statusLabel}>Announcement </span><span className={styles.statusVal}>After giveaway ends</span></div>
                  </div>
                </div>
              ) : (
                <div className={styles.prevGrid}>
                  {(endedWinners.length ? endedWinners : []).map((w) => (
                    <WinnerCard key={w.id} winner={w} />
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {tab === 'previous' && (
            <motion.div key="previous" initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} transition={{ duration:0.2 }}>
              {/* Previous Winners section header */}
              <div className={styles.header} style={{ marginBottom: '1rem' }}>
                <div>
                  <p className="section-label">🏆 Previous Winners</p>
                  <p className="section-subtitle" style={{ marginTop: '0.2rem' }}>Real people. Real rewards.</p>
                </div>
                <button 
                  className={styles.viewBtn}
                  onClick={() => setShowAllWinners(!showAllWinners)}
                >
                  {showAllWinners ? 'Show Less' : 'View All Winners'} <ArrowRight size={13} />
                </button>
              </div>

              {loading ? (
                <div className={styles.prevGrid}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className={styles.prevCard} style={{ height: 200 }}>
                      <div className="skeleton" style={{ height: 130 }} />
                      <div style={{ padding: '0.875rem' }}>
                        <div className="skeleton" style={{ height: 12, borderRadius: 4, marginBottom: 8, width: '70%' }} />
                        <div className="skeleton" style={{ height: 10, borderRadius: 4, width: '50%' }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : prevWinners.length === 0 ? (
                <div className={styles.empty}>
                  <h3>No Previous Winners</h3>
                  <p>Previous winners will appear here after a giveaway is completed.</p>
                </div>
              ) : (
                <div className={styles.prevGrid}>
                  {(showAllWinners ? prevWinners : prevWinners.slice(0, 6)).map((w, i) => (
                    <PrevWinnerCard key={w.id || i} winner={w} index={i} />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// ── Current ended winner card ──────────────────────────────────────────────────
function WinnerCard({ winner }) {
  const [imgErr, setImgErr] = useState(false);
  const dateStr = new Date(winner.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  return (
    <div className={styles.prevCard}>
      <div className={styles.prevImgWrap}>
        {!imgErr && winner.image ? (
          <img src={winner.image} alt={winner.prize} className={styles.prevImg} onError={() => setImgErr(true)} />
        ) : (
          <span style={{ fontSize: '2.5rem' }}>{getEmoji(winner.prize)}</span>
        )}
        <span className={styles.prevPrizeBadge}>{winner.prize}</span>
      </div>
      <div className={styles.prevCardBody}>
        <div className={styles.prevWinner}>
          <div className={styles.prevAvatar} style={{ background: `linear-gradient(135deg, ${winner.color}, #1e1848)` }}>{winner.initial}</div>
          <div className={styles.prevName}>{winner.displayName}</div>
        </div>
        <div className={styles.prevDate}>Won on {dateStr}</div>
      </div>
    </div>
  );
}

// ── Previous winner card ───────────────────────────────────────────────────────
function PrevWinnerCard({ winner, index }) {
  const [imgErr, setImgErr] = useState(false);
  const color   = COLORS[index % COLORS.length];
  const initial = winner.displayId?.charAt(0) ?? winner.displayName?.charAt(0) ?? 'V';
  const dateStr = winner.date || winner.selectedAt
    ? new Date(winner.date || winner.selectedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : 'Recently';

  // Find prize image from giveaway data
  const matchPrize = prizes.find((p) => p.name === winner.prize || p.id === winner.prizeId);

  return (
    <div className={styles.prevCard}>
      <div className={styles.prevImgWrap}>
        {!imgErr && matchPrize?.image ? (
          <img src={matchPrize.image} alt={winner.prize} className={styles.prevImg} onError={() => setImgErr(true)} />
        ) : (
          <span style={{ fontSize: '2.5rem' }}>{getEmoji(winner.prize)}</span>
        )}
        <span className={styles.prevPrizeBadge}>{winner.prize || matchPrize?.name}</span>
      </div>
      <div className={styles.prevCardBody}>
        <div className={styles.prevWinner}>
          <div className={styles.prevAvatar} style={{ background: `linear-gradient(135deg, ${color}, #1e1848)` }}>{initial}</div>
          <div className={styles.prevName}>{winner.displayId || winner.displayName}</div>
        </div>
        <div className={styles.prevDate}>Won on {dateStr}</div>
      </div>
    </div>
  );
}
