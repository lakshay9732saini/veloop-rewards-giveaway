import { createContext, useContext, useState, useEffect, useRef } from 'react';
import ADMIN_USER from '../config/adminUser';
import { fetchUserBalance } from '../services/api';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Always start with ADMIN_USER defaults, never trust cached balance
    return { ...ADMIN_USER };
  });

  // Track if we are currently fetching to avoid race conditions
  const isFetchingRef = useRef(false);
  // Track the latest balance version to discard stale responses
  const balanceVersionRef = useRef(0);

  // Fetch real balance from API
  const loadBalance = async () => {
    if (isFetchingRef.current) return; // skip if already fetching
    isFetchingRef.current = true;
    const version = ++balanceVersionRef.current;
    try {
      const balance = await fetchUserBalance(ADMIN_USER.id);
      // Only apply if this is still the latest request
      if (balance && version === balanceVersionRef.current) {
        setUser(prev => ({ ...prev, balance }));
      }
    } catch (error) {
      console.error('Failed to fetch balance:', error);
    } finally {
      isFetchingRef.current = false;
    }
  };

  // Fetch on mount only (NOT when user changes - avoids race condition)
  useEffect(() => {
    loadBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ← empty array: only on mount

  // Refresh balance from API (call this after join/transaction)
  const refreshBalance = async () => {
    // Increment version so any in-flight stale request is discarded
    balanceVersionRef.current++;
    const version = balanceVersionRef.current;
    try {
      const balance = await fetchUserBalance(ADMIN_USER.id);
      if (balance && version === balanceVersionRef.current) {
        setUser(prev => ({ ...prev, balance }));
        return balance;
      }
    } catch (error) {
      console.error('Failed to refresh balance:', error);
    }
    return null;
  };

  // Add participation record locally
  const addParticipation = (giveawayId, prizeId, prizeName, entryFee, entryCurrency) => {
    setUser(prev => ({
      ...prev,
      participations: [
        ...(prev.participations || []),
        { giveawayId, prizeId, prizeName, entryFee, entryCurrency, joinedAt: new Date().toISOString() }
      ],
      entries: (prev.entries || 0) + 1
    }));
  };

  // Update balance locally (immediate UI feedback, then refreshBalance confirms)
  const updateBalance = (currency, amount) => {
    setUser(prev => ({
      ...prev,
      balance: {
        ...prev.balance,
        [currency]: Math.max(0, (prev.balance?.[currency] || 0) - amount)
      }
    }));
  };

  const setWinner = (wonPrize) => {
    setUser(prev => ({ ...prev, userState: 'winner', wonPrize }));
  };

  const resetUser = () => {
    setUser({ ...ADMIN_USER });
    localStorage.removeItem('veloop_user_state');
  };

  return (
    <UserContext.Provider value={{
      user,
      setUser,
      updateBalance,
      refreshBalance,
      addParticipation,
      setWinner,
      resetUser
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
}
