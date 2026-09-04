import { createContext, useContext, useState, useEffect, useRef } from 'react';
import ADMIN_USER from '../config/adminUser';
import { fetchUserBalance } from '../services/api';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    const cachedUser = localStorage.getItem('veloop_user');
    let storedUser = ADMIN_USER;
    let balance = ADMIN_USER.balance;
    try {
      const parsedUser = cachedUser ? JSON.parse(cachedUser) : null;
      if (parsedUser && typeof parsedUser === 'object') {
        storedUser = { ...ADMIN_USER, ...parsedUser };
        balance = { ...balance, ...(parsedUser.balance || {}) };
      }
    } catch {
      localStorage.removeItem('veloop_user');
    }
    const cachedBalance = localStorage.getItem(`veloop_balance_${storedUser.id}`);
    try {
      const parsedBalance = cachedBalance ? JSON.parse(cachedBalance) : null;
      if (parsedBalance && typeof parsedBalance === 'object') {
        balance = { ...balance, ...parsedBalance };
      }
    } catch {
      localStorage.removeItem('veloop_balance');
    }
    return { ...storedUser, balance };
  });

  const saveBalance = (userId, balance) => {
    localStorage.setItem(`veloop_balance_${userId}`, JSON.stringify(balance));
  };

  // Track if we are currently fetching to avoid race conditions
  const isFetchingRef = useRef(false);
  // Track the latest balance version to discard stale responses
  const balanceVersionRef = useRef(0);

  // Fetch real balance from API
  const loadBalance = async () => {
    if (user.isDemoFallback || !localStorage.getItem('veloop_token')) return;
    if (isFetchingRef.current) return; // skip if already fetching
    isFetchingRef.current = true;
    const version = ++balanceVersionRef.current;
    try {
      const balance = await fetchUserBalance(user.id);
      // Only apply if this is still the latest request
      if (balance && version === balanceVersionRef.current) {
        setUser(prev => ({ ...prev, balance }));
        saveBalance(user.id, balance);
      }
    } catch (error) {
      console.error('Failed to fetch balance:', error);
    } finally {
      isFetchingRef.current = false;
    }
  };

  // Refresh after login and whenever the active account changes.
  useEffect(() => {
    loadBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  // Refresh balance from API (call this after join/transaction)
  const refreshBalance = async (userId = user.id) => {
    // Increment version so any in-flight stale request is discarded
    balanceVersionRef.current++;
    const version = balanceVersionRef.current;
    try {
      const balance = await fetchUserBalance(userId);
      if (balance && version === balanceVersionRef.current) {
        setUser(prev => ({ ...prev, balance }));
        saveBalance(userId, balance);
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
    setUser(prev => {
      const balance = {
        ...prev.balance,
        [currency]: Math.max(0, (prev.balance?.[currency] || 0) - amount)
      };
      saveBalance(user.id, balance);
      return { ...prev, balance };
    });
  };

  const setBalance = (currency, value) => {
    setUser(prev => {
      const balance = { ...prev.balance, [currency]: value };
      saveBalance(prev.id, balance);
      return { ...prev, balance };
    });
  };

  const setWinner = (wonPrize) => {
    setUser(prev => ({ ...prev, userState: 'winner', wonPrize }));
  };

  const markPrizeClaimed = (claimStatus = 'SUBMITTED') => {
    setUser(prev => {
      const updatedUser = {
        ...prev,
        wonPrize: prev.wonPrize ? { ...prev.wonPrize, claimStatus } : prev.wonPrize,
      };
      localStorage.setItem('veloop_user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const resetUser = () => {
    setUser({ ...ADMIN_USER });
    localStorage.removeItem('veloop_token');
    localStorage.removeItem('veloop_user');
    localStorage.removeItem('veloop_user_state');
    localStorage.removeItem(`veloop_balance_${user.id}`);
    localStorage.removeItem('veloop_balance');
  };

  return (
    <UserContext.Provider value={{
      user,
      setUser,
      isLoggedIn: Boolean(localStorage.getItem('veloop_token')),
      updateBalance,
      setBalance,
      refreshBalance,
      addParticipation,
      setWinner,
      markPrizeClaimed,
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
