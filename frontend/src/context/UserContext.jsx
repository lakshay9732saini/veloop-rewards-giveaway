import { createContext, useContext, useState, useEffect } from 'react';
import ADMIN_USER from '../config/adminUser';
import { CURRENCY } from '../data/giveawayData';
import { fetchUserBalance } from '../services/api';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Load from localStorage or use default
    const stored = localStorage.getItem('veloop_user_state');
    if (stored) {
      try {
        const parsedUser = JSON.parse(stored);
        // Keep user data but DON'T trust cached balance
        return { ...parsedUser, balance: ADMIN_USER.balance };
      } catch (e) {
        console.error('Failed to parse user state:', e);
      }
    }
    return { ...ADMIN_USER };
  });

  // Fetch real-time balance from API on mount and periodically
  useEffect(() => {
    const loadBalance = async () => {
      try {
        const balance = await fetchUserBalance(user.id);
        setUser(prev => ({
          ...prev,
          balance
        }));
      } catch (error) {
        console.error('Failed to fetch balance:', error);
      }
    };

    loadBalance();
    
    // Refresh balance every 30 seconds
    const interval = setInterval(loadBalance, 30000);
    
    return () => clearInterval(interval);
  }, [user.id]);

  // Save to localStorage when user changes
  useEffect(() => {
    localStorage.setItem('veloop_user_state', JSON.stringify(user));
  }, [user]);

  // Update balance after transaction
  const updateBalance = (currency, amount) => {
    setUser(prev => ({
      ...prev,
      balance: {
        ...prev.balance,
        [currency]: (prev.balance[currency] || 0) - amount
      }
    }));
  };

  // Refresh balance from API
  const refreshBalance = async () => {
    try {
      const balance = await fetchUserBalance(user.id);
      setUser(prev => ({
        ...prev,
        balance
      }));
      return balance;
    } catch (error) {
      console.error('Failed to refresh balance:', error);
      return null;
    }
  };

  // Add participation
  const addParticipation = (giveawayId, prizeId, prizeName, entryFee, entryCurrency) => {
    setUser(prev => ({
      ...prev,
      participations: [
        ...(prev.participations || []),
        {
          giveawayId,
          prizeId,
          prizeName,
          entryFee,
          entryCurrency,
          joinedAt: new Date().toISOString()
        }
      ],
      entries: (prev.entries || 0) + 1
    }));
  };

  // Set winner status
  const setWinner = (wonPrize) => {
    setUser(prev => ({
      ...prev,
      userState: 'winner',
      wonPrize
    }));
  };

  // Reset to default (for testing)
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
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}
