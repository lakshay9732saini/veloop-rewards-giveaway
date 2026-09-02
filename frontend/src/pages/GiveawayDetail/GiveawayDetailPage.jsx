import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, Users, Trophy, Coins, Clock, Shield, CheckCircle,
  AlertCircle, ArrowRight, Info, Star, Tag
} from 'lucide-react';
import styles from './GiveawayDetailPage.module.css';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import Countdown from '../../components/Countdown/Countdown';
import ConfirmJoinModal from '../../components/ConfirmJoinModal/ConfirmJoinModal';
import GiveawayLoader from '../../components/GiveawayLoader/GiveawayLoader';
import { fetchGiveawayBySlug, fetchUserBalance } from '../../services/api';
import { GIVEAWAY_STATUS } from '../../data/giveawayData';
import ADMIN_USER from '../../config/adminUser';
import { useUser } from '../../context/UserContext';

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (n) => (n ?? 0).toLocaleString();

// ── Step-by-step how this giveaway works ──────────────────────────────────────
const HOW_STEPS = [
  { num: '01', title: 'Review the Giveaway',      desc: 'Read the prize details, entry fee, and terms carefully before joining.' },
  { num: '02', title: 'Check Eligibility',         desc: 'Ensure your VELOOP Rewards account is verified and in good standing.' },
  { num: '03', title: 'Pay Entry Fee',             desc: 'The required VEs/SVEs/Tokens will be deducted from your balance.' },
  { num: '04', title: 'Participation Recorded',    desc: 'Your entry is securely recorded in our system. One entry per user.' },
  { num: '05', title: 'Wait for the Draw',         desc: 'The giveaway runs until the end date. Keep checking your dashboard.' },
  { num: '06', title: 'Winner Selected',           desc: 'After the giveaway ends, a fair random draw selects the winner(s).' },
  { num: '07', title: 'Claim Your Prize',          desc: 'Winners are notified. Submit claim details within 7 days of announcement.' },
];

// ── Prize emoji map ───────────────────────────────────────────────────────────
const PRIZE_EMOJI = {
  'iphone-15-pro': '📱',
  'apple-watch':   '⌚',
  'airpods-pro':   '🎧',
  'amazon-2000':   '🎁',
  'amazon-500':    '🎁',
  'amazon-20':     '🎁',
};

// ── Terms & Conditions ────────────────────────────────────────────────────────
function buildTerms(prize) {
  const fee      = prize?.entryFee      ?? 0;
  const currency = prize?.entryCurrency ?? '';
  const type     = prize?.type          ?? 'PHYSICAL';
  return [
    { icon: '👤', label: 'Eligibility',          text: 'Must have a verified VELOOP Rewards account in good standing.' },
    { icon: '💰', label: 'Entry Requirement',     text: `${fmt(fee)} ${currency} required to participate. Fee is deducted from your balance upon joining.` },
    { icon: '🔒', label: 'One Entry Per User',    text: 'Each user may participate only once in this giveaway event.' },
    { icon: '📅', label: 'Giveaway Duration',     text: 'Giveaway runs from the start date to the end date shown on this page.' },
    { icon: '🎲', label: 'Winner Selection',      text: 'Winners are selected by a fair, verifiable random draw from all eligible participants.' },
    { icon: '📢', label: 'Winner Announcement',   text: 'Winners are announced within 24 hours of the giveaway ending via dashboard and email.' },
    { icon: '📦', label: 'Prize Claim',           text: type === 'PHYSICAL' ? 'Winners must submit delivery details within 7 days. Physical prizes delivered in 7–14 business days.' : 'Winners must submit their email address within 7 days. Gift card delivered within 48 hours.' },
    { icon: '⏰', label: 'Claim Deadline',        text: 'Unclaimed prizes after 7 days may be forfeited. Contact support if you need an extension.' },
    { icon: '🚫', label: 'Disqualification',      text: 'Fraudulent, duplicate, or rule-breaking entries will be disqualified per platform rules.' },
    { icon: '💳', label: 'Refund / Entry Policy', text: 'Entry fees are non-refundable once participation is recorded. [Placeholder — confirm with VELOOP policy]' },
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
export default function GiveawayDetailPage() {
  const { slug }   = useParams();
  const navigate   = useNavigate();
  const { refreshBalance } = useUser();

  const [giveaway,    setGiveaway]    = useState(null);
  const [prize,       setPrize]       = useState(null);
  const [myStatus,    setMyStatus]    = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [joined,      setJoined]      = useState(false);
  const [imageError,  setImageError]  = useState(false);
  const [userBalance, setUserBalance] = useState(null); // Real balance from API (null initially)

  const user       = ADMIN_USER; // Use centralized admin user
  const isLoggedIn = true; // Always logged in as admin

  // ── Load ──────────────────────────────────────────────────────────────────
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const gRes = await fetchGiveawayBySlug(slug);
      if (!gRes.success) { setError('This giveaway could not be found.'); return; }
      setGiveaway(gRes.data);
      setPrize(gRes.data.prize ?? null);
      // Don't check participation status - allow joining all prizes
      setMyStatus(null);
      
      // Fetch real-time balance
      const balance = await fetchUserBalance(user.id);
      setUserBalance(balance);
    } catch {
      setError("We couldn't load this giveaway. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [slug, user.id]);

  useEffect(() => { loadData(); }, [loadData]);

  // ── Derived ───────────────────────────────────────────────────────────────
  const status          = giveaway?.status || GIVEAWAY_STATUS.ACTIVE;
  const isActive        = status === GIVEAWAY_STATUS.ACTIVE;
  const isEnded         = status === GIVEAWAY_STATUS.ENDED;
  const isParticipating = joined || myStatus?.isParticipating;
  const balance         = prize ? (userBalance?.[prize.entryCurrency] ?? 0) : 0;
  const hasEnough       = prize ? balance >= (prize.entryFee ?? 0) : false;
  const emoji           = PRIZE_EMOJI[slug] ?? '🎁';
  const terms           = prize ? buildTerms(prize) : [];

  // ── CTA ───────────────────────────────────────────────────────────────────
  const renderCTA = () => {
    if (!isLoggedIn) {
      return (
        <div className={styles.loginPrompt}>
          <div className={styles.loginPromptTitle}>Login Required</div>
          <div className={styles.loginPromptSub}>
            Please log in to your VELOOP Rewards account before participating.
          </div>
          <div className={styles.loginPromptBtns}>
            <button className="btn btn-primary btn-sm">Login</button>
            <button className="btn btn-outline-secondary btn-sm">Create Account</button>
          </div>
        </div>
      );
    }
    if (isEnded) {
      return (
        <button className={`btn btn-outline-primary ${styles.joinBtn}`} onClick={() => navigate('/')}>
          View Winners
        </button>
      );
    }
    if (isParticipating) {
      return (
        <div className={styles.alreadyJoined} role="status">
          <CheckCircle size={16} aria-hidden="true" />
          You're Already Participating ✓
        </div>
      );
    }
    if (!hasEnough) {
      return (
        <>
          <div className={styles.feeBox} style={{ borderColor: 'rgba(244,63,94,0.25)', background: 'rgba(244,63,94,0.06)' }}>
            <div className={styles.feeLabel}>Entry Fee</div>
            <div className={styles.feeAmount} style={{ color: 'var(--veloop-rose)' }}>
              {fmt(prize?.entryFee)} {prize?.entryCurrency}
            </div>
            <div className={styles.balanceRow}>
              <span className={styles.balanceLabel}>Your Balance: {fmt(balance)} {prize?.entryCurrency}</span>
              <span className={styles.balanceLow}>
                <AlertCircle size={11} aria-hidden="true" /> Insufficient
              </span>
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--veloop-rose)', marginTop: '0.4rem' }}>
              You need {fmt((prize?.entryFee ?? 0) - balance)} more {prize?.entryCurrency} to participate.
            </div>
          </div>
          <button className={`btn btn-outline-primary ${styles.earnBtn}`}>
            Earn More {prize?.entryCurrency} →
          </button>
        </>
      );
    }
    return (
      <>
        <div className={styles.feeBox}>
          <div className={styles.feeLabel}>Entry Fee</div>
          <div className={styles.feeAmount}>{fmt(prize?.entryFee)} {prize?.entryCurrency}</div>
          <div className={styles.balanceRow}>
            <span className={styles.balanceLabel}>Your Balance: {fmt(balance)} {prize?.entryCurrency}</span>
            <span className={styles.balanceOk}>
              <CheckCircle size={11} aria-hidden="true" /> Sufficient
            </span>
          </div>
        </div>
        <button
          className={`btn btn-primary ${styles.joinBtn}`}
          onClick={() => setShowConfirm(true)}
          aria-label={`Join ${prize?.name} for ${prize?.entryFee} ${prize?.entryCurrency}`}
        >
          Join for {fmt(prize?.entryFee)} {prize?.entryCurrency}
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </>
    );
  };

  // ── Loading / Error ───────────────────────────────────────────────────────
  if (loading) return <GiveawayLoader />;

  if (error || !prize) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <Navbar showBack backLabel="Giveaway Home" />
        <main className="flex-grow-1 d-flex align-items-center justify-content-center" style={{ padding: '4rem 0' }}>
          <div className="container text-center">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
              Giveaway Not Found
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginBottom: '1.5rem' }}>
              {error || 'This giveaway does not exist or is no longer available.'}
            </p>
            <button className="btn btn-primary me-2" onClick={loadData}>Try Again</button>
            <button className="btn btn-outline-secondary" onClick={() => navigate('/')}>Back to Giveaways</button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Safe accessors
  const participants = prize.participants ?? 0;
  const winnerCount  = prize.winnerCount  ?? 1;
  const entryFee     = prize.entryFee     ?? 0;

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar showBack backLabel="Giveaway Home" />

      <main className="flex-grow-1">
        {/* ── Hero ── */}
        <section className={styles.hero} aria-label={`${prize.name} giveaway`}>
          <div className="container">
            <div className={styles.heroInner}>

              {/* Left content */}
              <motion.div
                className={styles.heroContent}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <button className={styles.backLink} onClick={() => navigate('/')} aria-label="Back to Giveaway Home">
                  <ChevronLeft size={16} aria-hidden="true" />
                  Giveaway Home
                </button>

                <div className={styles.badgeRow}>
                  <span className="badge-exclusive">🎁 Exclusive Giveaway</span>
                  {isActive && <span className="badge-active"><span className="live-dot" />Giveaway Live</span>}
                  {isEnded  && <span className="badge-ended">Ended</span>}
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, padding: '0.2rem 0.65rem', borderRadius: 'var(--radius-full)', background: 'rgba(99,102,241,0.12)', color: 'var(--veloop-indigo-400)', border: '1px solid rgba(99,102,241,0.2)' }}>
                    {prize.label}
                  </span>
                </div>

                <h1 className={styles.heroTitle}>Win a <span>{prize.name}</span></h1>
                <p className={styles.heroDesc}>{prize.description}</p>

                {isActive && giveaway?.endAt && (
                  <div className={styles.countdown}>
                    <span className={styles.countdownLabel}>Ends In</span>
                    <Countdown endDate={giveaway.endAt} size="md" />
                  </div>
                )}

                <div className="d-flex flex-wrap gap-2 mt-3">
                  {[
                    { icon: <Users size={11} />,  text: `${fmt(participants)}+ Participants` },
                    { icon: <Trophy size={11} />, text: `${winnerCount} ${winnerCount === 1 ? 'Winner' : 'Winners'}` },
                    prize.prizeValue ? { icon: <Star size={11} />, text: `Worth ${prize.prizeValue}`, gold: true } : null,
                  ].filter(Boolean).map((item, i) => (
                    <span key={i} style={{
                      display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                      fontSize: 'var(--text-xs)', padding: '0.25rem 0.65rem',
                      borderRadius: 'var(--radius-full)',
                      background: item.gold ? 'rgba(245,158,11,0.1)' : 'var(--color-surface-3)',
                      border: `1px solid ${item.gold ? 'rgba(245,158,11,0.2)' : 'var(--color-border-soft)'}`,
                      color: item.gold ? 'var(--veloop-gold-400)' : 'var(--color-text-muted)',
                    }}>
                      {item.icon}{item.text}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Right visual */}
              <motion.div
                className={styles.heroVisual}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                aria-hidden="true"
              >
                <div className={styles.visualBg} />
                <div className={styles.prizeImageWrap}>
                  {!imageError && prize.image ? (
                    <img src={prize.image} alt={prize.name} className={styles.prizeImage} onError={() => setImageError(true)} />
                  ) : (
                    <div className={styles.prizeImagePlaceholder}>
                      <span style={{ fontSize: '5rem' }}>{emoji}</span>
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', fontWeight: 600 }}>{prize.name}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Main grid ── */}
        <div className={styles.mainGrid}>
          <div className="container">
            <div className={styles.layout}>

              {/* Left column */}
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>

                {/* About the Prize */}
                <section className={styles.contentSection} aria-label="About the prize">
                  <h2><Tag size={18} color="var(--veloop-indigo-400)" aria-hidden="true" />About the Prize</h2>
                  <div className={styles.prizeDetailCard}>
                    {!imageError && prize.image ? (
                      <img src={prize.image} alt={prize.name} className={styles.prizeDetailImg} onError={() => setImageError(true)} />
                    ) : (
                      <span style={{ fontSize: '3.5rem', flexShrink: 0 }}>{emoji}</span>
                    )}
                    <div className={styles.prizeDetailInfo}>
                      <h3 className={styles.prizeDetailName}>{prize.name}</h3>
                      <p className={styles.prizeDetailDesc}>{prize.description}</p>
                      <div className={styles.prizeDetailMeta}>
                        <span style={{ fontSize: 'var(--text-xs)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', background: 'var(--color-surface-3)', border: '1px solid var(--color-border-soft)', color: 'var(--color-text-muted)' }}>
                          {winnerCount} {winnerCount === 1 ? 'Winner' : 'Winners'}
                        </span>
                        {prize.prizeValue && (
                          <span style={{ fontSize: 'var(--text-xs)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: 'var(--veloop-gold-400)' }}>
                            Value: {prize.prizeValue}
                          </span>
                        )}
                        <span style={{ fontSize: 'var(--text-xs)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: 'var(--veloop-indigo-400)' }}>
                          {prize.type === 'PHYSICAL' ? '📦 Physical Delivery' : '📧 Email Delivery'}
                        </span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* How This Giveaway Works */}
                <section className={styles.contentSection} aria-label="How this giveaway works">
                  <h2><Info size={18} color="var(--veloop-indigo-400)" aria-hidden="true" />How This Giveaway Works</h2>
                  <div className={styles.howGrid} role="list">
                    {HOW_STEPS.map((s) => (
                      <div className={styles.howStep} key={s.num} role="listitem">
                        <div className={styles.howNum} aria-hidden="true">{s.num}</div>
                        <div className={styles.howText}>
                          <div className={styles.howTitle}>{s.title}</div>
                          <p className={styles.howDesc}>{s.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Terms & Conditions */}
                <section className={styles.contentSection} aria-label="Terms and conditions">
                  <h2><Shield size={18} color="var(--veloop-indigo-400)" aria-hidden="true" />Terms &amp; Conditions</h2>
                  <ul className={styles.tcList}>
                    {terms.map((t, i) => (
                      <li className={styles.tcItem} key={i}>
                        <div className={styles.tcIcon} aria-hidden="true"><span style={{ fontSize: '0.7rem' }}>{t.icon}</span></div>
                        <div>
                          <strong style={{ color: 'var(--color-text)', fontSize: 'var(--text-sm)' }}>{t.label}: </strong>
                          {t.text}
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Important Information */}
                <section className={styles.contentSection} aria-label="Important information">
                  <h2><AlertCircle size={18} color="var(--veloop-gold-400)" aria-hidden="true" />Important Information</h2>
                  <div className="accordion" id="importantAccordion">
                    {[
                      { id: 'ii1', q: 'Entry Currency & Amount',   a: `This giveaway requires ${fmt(entryFee)} ${prize.entryCurrency ?? ''}. The fee is deducted from your VELOOP Rewards balance when you join.` },
                      { id: 'ii2', q: 'Winner Selection Process',  a: 'Winners are selected through a verifiable fair random draw from all eligible participants after the giveaway ends.' },
                      { id: 'ii3', q: 'Account Eligibility',       a: 'Your account must be verified and in good standing. Accounts with active violations or suspicious activity may be ineligible.' },
                      { id: 'ii4', q: 'Fraud Prevention',          a: 'VELOOP Rewards employs anti-fraud measures. Multiple account abuse and fraudulent activity will result in disqualification.' },
                      { id: 'ii5', q: 'Platform Rules',            a: 'Participation is subject to the VELOOP Terms of Service and Giveaway Rules. VELOOP reserves the right to modify or cancel a giveaway.' },
                    ].map((item) => (
                      <div className="accordion-item" key={item.id}>
                        <h3 className="accordion-header">
                          <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#${item.id}`} aria-expanded="false">
                            {item.q}
                          </button>
                        </h3>
                        <div id={item.id} className="accordion-collapse collapse" data-bs-parent="#importantAccordion">
                          <div className="accordion-body">{item.a}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </motion.div>

              {/* Sidebar */}
              <motion.div className={styles.sidebar} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.25 }}>

                {/* Prize info + CTA card */}
                <div className={styles.infoCard} role="region" aria-label="Prize information and join">
                  <h2 className={styles.infoCardTitle}>{prize.name}</h2>

                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}><Users size={13} aria-hidden="true" /> Participants</span>
                    <span className={styles.infoValue}>{fmt(participants)}+</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}><Trophy size={13} aria-hidden="true" /> Winners</span>
                    <span className={styles.infoValue}>{winnerCount}</span>
                  </div>
                  {isActive && giveaway?.endAt && (
                    <div className={styles.infoRow}>
                      <span className={styles.infoLabel}><Clock size={13} aria-hidden="true" /> Ends</span>
                      <span className={styles.infoValue}><Countdown endDate={giveaway.endAt} size="sm" /></span>
                    </div>
                  )}
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}><Tag size={13} aria-hidden="true" /> Prize Value</span>
                    <span className={styles.infoValue} style={{ color: 'var(--veloop-gold-400)' }}>{prize.prizeValue || '—'}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}><Shield size={13} aria-hidden="true" /> Status</span>
                    <span>
                      {isActive
                        ? <span className="badge-active" style={{ fontSize: '0.68rem' }}><span className="live-dot" />Live</span>
                        : <span className="badge-ended"  style={{ fontSize: '0.68rem' }}>Ended</span>}
                    </span>
                  </div>

                  <div style={{ marginTop: '1.25rem' }}>{renderCTA()}</div>
                </div>

                {/* Giveaway details card */}
                <div className={styles.infoCard}>
                  <h3 className={styles.infoCardTitle} style={{ fontSize: 'var(--text-base)' }}>Giveaway Details</h3>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Event</span>
                    <span className={styles.infoValue} style={{ fontSize: 'var(--text-xs)', textAlign: 'right', maxWidth: 160 }}>{giveaway?.title}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Delivery</span>
                    <span className={styles.infoValue} style={{ fontSize: 'var(--text-xs)' }}>
                      {prize.type === 'PHYSICAL' ? '📦 Physical (7–14 days)' : '📧 Email (within 48h)'}
                    </span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Claim Window</span>
                    <span className={styles.infoValue} style={{ fontSize: 'var(--text-xs)' }}>7 days after win</span>
                  </div>
                  <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'var(--color-surface-3)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)', lineHeight: 1.5 }}>
                    <Info size={12} style={{ marginRight: '0.35rem', verticalAlign: 'middle', color: 'var(--veloop-indigo-400)' }} aria-hidden="true" />
                    Please review the giveaway rules and participation requirements carefully before joining.
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </main>

      <Footer />

      <AnimatePresence>
        {showConfirm && prize && giveaway && (
          <ConfirmJoinModal
            prize={prize}
            giveaway={giveaway}
            onClose={() => setShowConfirm(false)}
            onSuccess={async () => { 
              setJoined(true); 
              setShowConfirm(false); 
              // Refresh balance after successful join
              const balance = await fetchUserBalance(user.id);
              setUserBalance(balance);
              // Also refresh global balance in context
              await refreshBalance();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
