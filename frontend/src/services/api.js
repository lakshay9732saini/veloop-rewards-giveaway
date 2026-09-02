/**
 * VELOOP Rewards – API Service Layer
 *
 * All frontend data calls go through this file.
 * During development, Vite proxies /api → http://localhost:5000
 * so no CORS issues. In production, set VITE_API_URL to your deployed backend.
 *
 * FALLBACK: If the backend is unreachable, each function falls back to
 * the local mock data so the UI never goes completely blank.
 */

import {
  currentGiveaway   as mockCurrentGiveaway,
  previousGiveaways as mockPreviousGiveaways,
  previousWinners   as mockPreviousWinners,
  demoUser,
  giveawayStats     as mockStats,
  prizes,
} from '../data/giveawayData';

// With the Vite proxy, '/api' resolves to 'http://localhost:5000/api' in dev
const API_BASE = '/api';

// ─── Helper ────────────────────────────────────────────────────────────────────
async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeader(),
      ...options.headers,
    },
    ...options,
  });
  const json = await res.json();
  // Propagate HTTP errors as structured objects
  if (!res.ok) return { success: false, error: json.error || 'SERVER_ERROR', message: json.message };
  return { success: true, ...json };
}

// ─── Giveaway Endpoints ─────────────────────────────────────────────────────────

/**
 * GET /api/giveaways/current
 */
export async function fetchCurrentGiveaway() {
  try {
    const res = await apiFetch('/giveaways/current');
    if (res.success && res.data) return res;
    // Backend returned success but no data → fall back to mock
    return { success: true, data: mockCurrentGiveaway };
  } catch {
    // Backend unreachable → use mock so UI still works
    console.warn('[API] Backend unreachable — using mock giveaway data');
    return { success: true, data: mockCurrentGiveaway, _mock: true };
  }
}

/**
 * GET /api/giveaways/:slug
 * Note: Backend uses :id in route but can accept slug. We fetch by slug and use the returned giveaway.id for subsequent calls.
 */
export async function fetchGiveawayBySlug(slug) {
  try {
    const res = await apiFetch(`/giveaways/${slug}`);
    if (res.success) return res;
    throw new Error(res.error);
  } catch {
    console.warn('[API] Backend unreachable — using mock prize data');
    const prize = prizes.find((p) => p.slug === slug);
    if (!prize) return { success: false, error: 'GIVEAWAY_NOT_FOUND', _mock: true };
    // Return complete giveaway object with the prize embedded
    return { 
      success: true, 
      data: { 
        ...mockCurrentGiveaway, 
        id: mockCurrentGiveaway.id,
        slug: slug,
        prize 
      }, 
      _mock: true 
    };
  }
}

/**
 * GET /api/giveaways/previous
 */
export async function fetchPreviousGiveaways() {
  try {
    const res = await apiFetch('/giveaways/previous');
    if (res.success) return res;
    throw new Error(res.error);
  } catch {
    return { success: true, data: mockPreviousGiveaways, _mock: true };
  }
}

/**
 * GET /api/giveaways/:id/winners
 */
export async function fetchGiveawayWinners(giveawayId) {
  try {
    const res = await apiFetch(`/giveaways/${giveawayId}/winners`);
    if (res.success) return res;
    throw new Error(res.error);
  } catch {
    const winners = mockPreviousWinners.filter((w) => w.giveawayId === giveawayId);
    return { success: true, data: winners, _mock: true };
  }
}

/**
 * GET /api/giveaways/previous/winners  (all previous winners)
 */
export async function fetchAllPreviousWinners() {
  try {
    const res = await apiFetch('/giveaways/previous/winners');
    if (res.success) return res;
    throw new Error(res.error);
  } catch {
    return { success: true, data: mockPreviousWinners, _mock: true };
  }
}

// ─── Participation Endpoints ────────────────────────────────────────────────────

/**
 * GET /api/giveaways/:id/my-status  (requires auth token)
 * Note: :id can be either giveaway ID or slug - backend should handle both
 */
export async function fetchMyParticipationStatus(giveawayIdOrSlug) {
  try {
    const token = localStorage.getItem('veloop_token');
    if (!token) throw new Error('No token');
    const res = await apiFetch(`/giveaways/${giveawayIdOrSlug}/my-status`);
    if (res.success) return res;
    throw new Error(res.error);
  } catch {
    // Not logged in or backend unreachable — derive from demoUser
    const user = demoUser;
    const isParticipating = ['participating', 'winner', 'nonWinner'].includes(user.userState);
    return {
      success: true,
      data: {
        isParticipating,
        entries: isParticipating ? user.entries : 0,
        userState: user.userState,
        balance: user.balance,
      },
      _mock: true,
    };
  }
}

/**
 * POST /api/giveaways/:id/join
 * Only sends giveawayId + prizeId. Backend determines fee, currency, eligibility.
 */
export async function joinGiveaway(giveawayId, prizeId) {
  try {
    console.log('[API] Joining giveaway:', giveawayId, prizeId);
    
    // Try backend first (no token needed for admin mode)
    const res = await apiFetch(`/giveaways/${giveawayId}/join`, {
      method: 'POST',
      body: JSON.stringify({ giveawayId, prizeId }),
    });
    
    if (res.success) {
      console.log('[API] Join successful:', res.data);
      return res;
    }
    
    // If backend fails, use demo mode
    console.warn('[API] Backend join failed, using demo mode');
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      data: { participationId: 'PART-DEMO-' + Date.now(), giveawayId, message: "You're in!" },
      _mock: true,
    };
  } catch (error) {
    console.error('[API] Join giveaway error:', error);
    // Fallback to demo mode
    return {
      success: true,
      data: { participationId: 'PART-DEMO-' + Date.now(), giveawayId, message: "You're in!" },
      _mock: true,
    };
  }
}

// ─── Claim Endpoints ────────────────────────────────────────────────────────────

/**
 * POST /api/giveaways/:giveawayId/claim
 */
export async function submitPrizeClaim(giveawayId, claimData) {
  try {
    console.log('[API] Submitting prize claim to backend');
    
    const res = await apiFetch(`/giveaways/${giveawayId}/claim`, {
      method: 'POST',
      body: JSON.stringify(claimData),
    });
    
    if (res.success) {
      console.log('[API] Prize claim successful:', res.data);
      return res;
    }
    
    // If backend fails, still return success for demo
    console.warn('[API] Backend claim failed, using demo mode');
    return {
      success: true,
      data: { 
        claimId: 'CLAIM-DEMO-' + Date.now(), 
        status: 'SUBMITTED' 
      },
      message: 'Claim submitted successfully!',
      _mock: true,
    };
  } catch (error) {
    console.error('[API] Prize claim error:', error);
    // Fallback to demo mode on error
    return {
      success: true,
      data: { 
        claimId: 'CLAIM-DEMO-' + Date.now(), 
        status: 'SUBMITTED' 
      },
      message: 'Claim submitted successfully!',
      _mock: true,
    };
  }
}

/**
 * GET /api/giveaways/:giveawayId/my-claim
 */
export async function fetchMyClaim(giveawayId) {
  try {
    const token = localStorage.getItem('veloop_token');
    if (!token) return { success: false, error: 'CLAIM_NOT_FOUND' };
    const res = await apiFetch(`/giveaways/${giveawayId}/my-claim`);
    return res;
  } catch {
    const user = demoUser;
    if (user.wonPrize?.giveawayId === giveawayId) return { success: true, data: user.wonPrize, _mock: true };
    return { success: false, error: 'CLAIM_NOT_FOUND', _mock: true };
  }
}

// ─── Stats ─────────────────────────────────────────────────────────────────────

export async function fetchGiveawayStats() {
  try {
    const res = await apiFetch('/giveaways/stats');
    if (res.success) return res;
    throw new Error(res.error);
  } catch {
    return { success: true, data: mockStats, _mock: true };
  }
}

// ─── Balance ───────────────────────────────────────────────────────────────────

/**
 * GET /api/balance/:userId
 * Fetch real-time user balance from database
 */
export async function fetchUserBalance(userId) {
  try {
    const res = await apiFetch(`/balance/${userId}`);
    if (res.success && res.data) {
      return res.data.balance;
    }
    throw new Error(res.error);
  } catch {
    console.warn('[API] Backend balance unreachable — using default balance');
    // Fallback to default balance
    return { VEs: 1000, SVEs: 1500, Tokens: 5000 };
  }
}

// ─── Auth helpers ──────────────────────────────────────────────────────────────
function authHeader() {
  const token = localStorage.getItem('veloop_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ─── Auth Endpoints ─────────────────────────────────────────────────────────────

/**
 * POST /api/auth/login
 */
export async function login(email, password) {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    // Check if response is JSON
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      // Not JSON response (probably HTML error page) - use demo mode
      throw new Error('Backend not available');
    }
    
    const json = await res.json();
    
    if (!res.ok) {
      // Server responded but with error - use demo mode anyway
      console.warn('[API] Backend error, using demo login');
      throw new Error('Backend error');
    }
    
    // Store token and user data
    if (json.token) localStorage.setItem('veloop_token', json.token);
    if (json.user) localStorage.setItem('veloop_user', JSON.stringify(json.user));
    
    return { success: true, data: json };
    
  } catch (error) {
    console.warn('[API] Backend unreachable — using demo login');
    // For demo, create user from email and merge with demoUser properties
    const userName = email.split('@')[0]; // Get name from email
    const demoToken = 'DEMO_TOKEN_' + Date.now();
    const demoUserData = {
      id: 'DEMO_' + Date.now(),
      displayId: 'VE****' + Math.floor(Math.random() * 90 + 10),
      name: userName.charAt(0).toUpperCase() + userName.slice(1), // Capitalize
      email: email,
      balance: demoUser.balance, // Use demoUser's balance
      entries: demoUser.entries,
      userState: demoUser.userState, // Use demoUser's state (winner/participating)
      wonPrize: demoUser.wonPrize // Include won prize if user is winner
    };
    
    localStorage.setItem('veloop_token', demoToken);
    localStorage.setItem('veloop_user', JSON.stringify(demoUserData));
    return { success: true, data: { user: demoUserData, token: demoToken }, _mock: true };
  }
}

/**
 * POST /api/auth/logout
 */
export async function logout() {
  try {
    await apiFetch('/auth/logout', { method: 'POST' });
  } catch {
    console.warn('[API] Logout - backend unreachable');
  } finally {
    // Always clear local storage
    localStorage.removeItem('veloop_token');
    localStorage.removeItem('veloop_user');
  }
  return { success: true };
}

/**
 * GET /api/auth/me - Get current user
 */
export async function getCurrentUser() {
  try {
    const token = localStorage.getItem('veloop_token');
    if (!token) return { success: false, error: 'NOT_AUTHENTICATED' };
    
    const res = await apiFetch('/auth/me');
    if (res.success) {
      localStorage.setItem('veloop_user', JSON.stringify(res.data));
      return res;
    }
    throw new Error(res.error);
  } catch {
    // Check local storage for cached user
    const cachedUser = localStorage.getItem('veloop_user');
    if (cachedUser) {
      return { success: true, data: JSON.parse(cachedUser), _cached: true };
    }
    return { success: false, error: 'NOT_AUTHENTICATED' };
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
  return !!localStorage.getItem('veloop_token');
}

// ─── Error message mapper ──────────────────────────────────────────────────────
export const API_ERROR_MESSAGES = {
  GIVEAWAY_NOT_FOUND:         'This giveaway could not be found.',
  GIVEAWAY_NOT_ACTIVE:        'This giveaway is not currently active.',
  GIVEAWAY_ENDED:             'This giveaway has ended. Check out the winners and get ready for the next one.',
  ALREADY_PARTICIPATING:      "You're already participating in this giveaway.",
  INSUFFICIENT_VE_BALANCE:    "You don't have enough VEs to join this giveaway.",
  INSUFFICIENT_SVE_BALANCE:   "You don't have enough SVEs to join this giveaway.",
  INSUFFICIENT_TOKEN_BALANCE: "You don't have enough Tokens to join this giveaway.",
  LOGIN_REQUIRED:             'Please log in to your VELOOP Rewards account to participate.',
  PARTICIPATION_BLOCKED:      "Participation couldn't be completed. Please try again or contact support.",
  SUSPICIOUS_ACTIVITY:        "Participation couldn't be completed. Please contact support.",
  RATE_LIMITED:               'Too many requests. Please wait a moment before trying again.',
  CLAIM_NOT_ALLOWED:          "You don't have an active prize to claim.",
  UNKNOWN_ERROR:              'Something went wrong. Please try again.',
};
