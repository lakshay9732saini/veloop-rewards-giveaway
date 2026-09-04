import { useState, useEffect } from 'react';
import { ArrowRight, Clock3, Coins, Gem, Sparkles, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './GiveawayHero.module.css';
import { GIVEAWAY_STATUS, ASSETS } from '../../data/giveawayData';
import ADMIN_USER from '../../config/adminUser';

function pad(n) { return String(n).padStart(2, '0'); }

function getTimeLeft(endDate) {
  const diff = new Date(endDate) - Date.now();
  if (diff <= 0) return null;
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000)  / 60000),
    s: Math.floor((diff % 60000)    / 1000),
  };
}

function getProgress(startDate, endDate) {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return 0;
  return Math.min(100, Math.max(0, ((Date.now() - start) / (end - start)) * 100));
}

function LiveCountdown({ endDate }) {
  const [t, setT] = useState(getTimeLeft(endDate));
  useEffect(() => {
    const id = setInterval(() => setT(getTimeLeft(endDate)), 1000);
    return () => clearInterval(id);
  }, [endDate]);
  if (!t) return <span className={styles.statValue} style={{ color: 'var(--red-light)' }}>Ended</span>;
  return (
    <div className={styles.countdownInline}>
      {[['d','Days'],['h','Hrs'],['m','Min'],['s','Sec']].map(([k, label], i) => (
        <span key={k} style={{ display: 'contents' }}>
          <span className={styles.cUnit}>
            <span className={styles.cVal}>{pad(t[k])}</span>
            <span className={styles.cLabel}>{label}</span>
          </span>
          {i < 3 && <span className={styles.cSep}>:</span>}
        </span>
      ))}
    </div>
  );
}

export default function GiveawayHero({ giveaway, stats }) {
  const user   = ADMIN_USER;
  const status = giveaway?.status || GIVEAWAY_STATUS.ACTIVE;
  const progress = getProgress(giveaway?.startAt, giveaway?.endAt);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const getCtaLabel = () => {
    if (user.userState === 'visitor')        return 'Join Giveaway';
    if (user.userState === 'participating' ||
        user.userState === 'winner')         return "You're Participating ✓";
    if (status === GIVEAWAY_STATUS.ENDED)    return 'View Winners';
    if (status === GIVEAWAY_STATUS.UPCOMING) return 'Notify Me';
    return 'Join Giveaway';
  };

  const handleCta = () => {
    if (status === GIVEAWAY_STATUS.ENDED) scrollTo('winners');
    else scrollTo('prizes');
  };

  const STATS_DATA = [
    { icon: '🎁', bg: 'rgba(124,58,237,0.15)', label: 'Total Giveaways', value: `${stats?.totalGiveaways ?? 24}`, sub: 'Active' },
    { icon: '👥', bg: 'rgba(16,185,129,0.12)',  label: 'Total Participants', value: stats?.totalParticipants ? `${(stats.totalParticipants/1000).toFixed(1)}K+` : '8.5K+', sub: 'Users' },
    { icon: '🏆', bg: 'rgba(245,158,11,0.12)', label: 'Prizes Won', value: stats?.prizesWon ? `${(stats.prizesWon/1000).toFixed(1)}K+` : '1.2K+', sub: 'Rewards' },
    { icon: '⏰', bg: 'rgba(239,68,68,0.12)',  label: 'Giveaway Ends In', value: null },
  ];

  return (
    <>
      <section className={styles.hero} aria-label="Giveaway hero">
        <div className="container">
          <div className={styles.inner}>

            {/* LEFT */}
            <motion.div initial={{ opacity:0, x:-28 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.55 }}>
              <div className={styles.exclusiveBadge}>
                <span className="badge-exclusive">🔥 EXCLUSIVE GIVEAWAY</span>
                {status === GIVEAWAY_STATUS.ACTIVE   && <span className="badge-live"><span className="live-dot" />LIVE</span>}
                {status === GIVEAWAY_STATUS.ENDED    && <span className="badge-ended">ENDED</span>}
                {status === GIVEAWAY_STATUS.UPCOMING && <span className="badge-upcoming">COMING SOON</span>}
              </div>

              <h1 className={styles.heading}>
                Giveaway
                <span className={styles.headingLine2}>Rewards</span>
              </h1>

              <p className={styles.subtitle}>
                {status === GIVEAWAY_STATUS.ACTIVE
                  ? 'Complete eligible activities, collect entries and get a chance to win exciting rewards.'
                  : status === GIVEAWAY_STATUS.ENDED
                  ? 'This giveaway has ended. Winners have been announced.'
                  : 'Our next big giveaway is coming soon. Get ready!'}
              </p>

              <div className={styles.heroMeta}>
                <div className={styles.countdownCard}>
                  <div className={styles.countdownHeading}>
                    <span className={styles.countdownIcon}><Clock3 size={15} /></span>
                    <span>Time left to enter</span>
                    <span className={styles.livePill}><span className="live-dot" /> LIVE</span>
                  </div>
                  {giveaway?.endAt
                    ? <LiveCountdown endDate={giveaway.endAt} />
                    : <span className={styles.countdownUnavailable}>Countdown unavailable</span>}
                  <div className={styles.progressTrack} aria-label={`${Math.round(progress)}% of giveaway period elapsed`}>
                    <motion.span
                      className={styles.progressFill}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1.2, delay: 0.35, ease: 'easeOut' }}
                    />
                  </div>
                  <div className={styles.progressLabels}><span>Giveaway live</span><span>{Math.round(progress)}% elapsed</span></div>
                </div>
              </div>

              <div className={styles.ctaRow}>
                <button className={styles.ctaBtn} onClick={handleCta}>
                  {getCtaLabel()} <ArrowRight size={16} />
                </button>
              </div>

              {/* Social proof */}
              <div className={styles.socialProof}>
                <div className={styles.avatarStack} aria-hidden="true">
                  {['A','B','C','D'].map((l) => (
                    <div key={l} className={styles.miniAvatar}>{l}</div>
                  ))}
                </div>
                <span className={styles.socialText}>
                  <strong>{stats?.totalParticipants ? `${(stats.totalParticipants/1000).toFixed(1)}K+` : '8.5K+'}</strong> Users Participating
                </span>
              </div>
            </motion.div>

            {/* RIGHT illustration */}
            <motion.div
              className={styles.illustration}
              initial={{ opacity:0, scale:0.88 }}
              animate={{ opacity:1, scale:1 }}
              transition={{ duration:0.65, delay:0.1 }}
              aria-hidden="true"
            >
              <div className={styles.illustrationGlow} />
              <span className={`${styles.floatToken} ${styles.tokenOne}`}><Coins size={19} /></span>
              <span className={`${styles.floatToken} ${styles.tokenTwo}`}><Gem size={17} /></span>
              <span className={`${styles.floatToken} ${styles.tokenThree}`}><Sparkles size={14} /></span>
              <img src={ASSETS.ticket}    alt="" className={styles.heroImg} />
              <img src={ASSETS.giftBoxAlt} alt="" className={styles.accentImg} />
              <div className={`${styles.chip} ${styles.chip1}`}>
                <span>📱</span> iPhone 15 Pro
              </div>
              <div className={`${styles.chip} ${styles.chip2}`}>
                <Users size={11} /> 8.5K+ Joined
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div className={styles.statsBar}>
        <div className="container">
          <div className={styles.statsGrid}>
            {STATS_DATA.map((s, i) => (
              <div key={i} className={styles.statItem}>
                <div className={styles.statIcon} style={{ background: s.bg }}>{s.icon}</div>
                <div className={styles.statInfo}>
                  <div className={styles.statLabel}>{s.label}</div>
                  {s.value !== null
                    ? <div className={styles.statValue}>{s.value} <span className={styles.statSub}>{s.sub}</span></div>
                    : giveaway?.endAt
                      ? <LiveCountdown endDate={giveaway.endAt} />
                      : <div className={styles.statValue}>—</div>
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
