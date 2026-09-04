import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import styles from './GiveawayPage.module.css';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import GiveawayHero from '../../components/GiveawayHero/GiveawayHero';
import FeaturedGiveaways from '../../components/FeaturedGiveaways/FeaturedGiveaways';
import HowToParticipate from '../../components/HowToParticipate/HowToParticipate';
import WinnerSlider from '../../components/WinnerSlider/WinnerSlider';
import WinnersTabs from '../../components/WinnersTabs/WinnersTabs';
import TrustSection from '../../components/TrustSection/TrustSection';
import GiveawayRules from '../../components/GiveawayRules/GiveawayRules';
import FAQ from '../../components/FAQ/FAQ';
import UserStatusCard from '../../components/UserStatusCard/UserStatusCard';
import PrizeClaimModal from '../../components/PrizeClaimModal/PrizeClaimModal';
import GiveawayLoader from '../../components/GiveawayLoader/GiveawayLoader';
import MyParticipations from '../../components/MyParticipations/MyParticipations';
import { fetchCurrentGiveaway, fetchGiveawayStats, fetchMyClaim } from '../../services/api';
import { GIVEAWAY_STATUS } from '../../data/giveawayData';
import { useUser } from '../../context/UserContext';

export default function GiveawayPage() {
  const [giveaway,     setGiveaway]     = useState(null);
  const [stats,        setStats]        = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [showClaim,    setShowClaim]    = useState(false);
  const [claimDone,    setClaimDone]    = useState(false);

  const { user, setUser, markPrizeClaimed } = useUser(); // Use user from context

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [gRes, sRes] = await Promise.all([fetchCurrentGiveaway(), fetchGiveawayStats()]);
      if (gRes.success) setGiveaway(gRes.data);
      else setError('Unable to load the current giveaway.');
      if (sRes.success) setStats(sRes.data);
    } catch {
      setError("We couldn't load the giveaway information.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const giveawayId = user.wonPrize?.giveawayId;
    if (!giveawayId || user.wonPrize?.claimStatus !== 'NOT_SUBMITTED') return;

    fetchMyClaim(giveawayId).then((response) => {
      if (response.success && response.data?.status) {
        const status = response.data.status;
        setUser((currentUser) => ({
          ...currentUser,
          wonPrize: currentUser.wonPrize
            ? { ...currentUser.wonPrize, claimStatus: status }
            : currentUser.wonPrize,
        }));
        localStorage.setItem('veloop_user', JSON.stringify({
          ...user,
          wonPrize: { ...user.wonPrize, claimStatus: status },
        }));
      }
    });
  }, [user, setUser]);

  const handleCountdownEnd = useCallback(() => {
    setGiveaway((g) => g ? { ...g, status: GIVEAWAY_STATUS.ENDED } : g);
  }, []);

  if (loading) return <GiveawayLoader />;

  if (error) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <main className={`flex-grow-1 ${styles.error}`}>
          <div className="container">
            <div className={styles.errorIcon}>⚠️</div>
            <h1 className={styles.errorTitle}>Couldn't Load Giveaway</h1>
            <p className={styles.errorDesc}>{error}</p>
            <button className="btn btn-primary" onClick={load}>Try Again</button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">

        {/* 1. Hero + Stats bar */}
        <GiveawayHero giveaway={giveaway} stats={stats} onCountdownEnd={handleCountdownEnd} />

        {/* 2. User status banner (winner / participating / non-winner) */}
        {user.userState !== 'visitor' && (
          ['winner','participating','nonWinner'].includes(user.userState)
        ) && (
          <section style={{ background: 'var(--bg-base)', padding: '1.25rem 0 0' }}>
            <div className="container">
              <UserStatusCard user={user} onClaim={() => setShowClaim(true)} />
            </div>
          </section>
        )}

        {/* 3. Active Giveaway prize cards */}
        <FeaturedGiveaways
          prizes={giveaway?.prizes ?? []}
          giveawayEndAt={giveaway?.endAt}
        />

        {/* 4. How to Participate */}
        <HowToParticipate />

        {/* 5. Winner Announcement slider */}
        <WinnerSlider />

        {/* 6. Winners tabs (current + previous) */}
        <WinnersTabs giveaway={giveaway} />

        {/* 6.5 My Participations */}
        <MyParticipations />

        {/* 7. Trust section */}
        <TrustSection />

        {/* 8. Rules */}
        {giveaway && (
          <GiveawayRules rules={giveaway.rules ?? []} eligibility={giveaway.eligibility ?? []} />
        )}

        {/* 9. FAQ */}
        <FAQ />

      </main>
      <Footer />

      {/* Prize claim modal */}
      <AnimatePresence>
        {showClaim && user.wonPrize && !claimDone && (
          <PrizeClaimModal
            wonPrize={user.wonPrize}
            onClose={() => setShowClaim(false)}
            onSuccess={() => {
              markPrizeClaimed('SUBMITTED');
              setClaimDone(true);
              setShowClaim(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
