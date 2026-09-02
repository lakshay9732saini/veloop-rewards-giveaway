import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, LogOut } from 'lucide-react';
import styles from './Navbar.module.css';
import { CURRENCY } from '../../data/giveawayData';
import { useUser } from '../../context/UserContext';

const NAV_LINKS = [
  { label: 'Dashboard',  to: '/', isExternal: false },
  { label: 'Activities', to: '/', isExternal: false },
  { label: 'Giveaways',  to: '/', isExternal: false },
  { label: 'Winners',    to: '#winners', isHash: true },
  { label: 'My Entries', to: '/', isExternal: false },
];

export default function Navbar({ showBack = false, backLabel = 'Giveaway Home' }) {
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user } = useUser(); // Get user from context
  
  const loggedIn = true; // Always logged in as admin
  const balance = user.balance?.[CURRENCY.VE] ?? 0;

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showUserMenu && !e.target.closest(`.${styles.userDropdown}`)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showUserMenu]);

  const handleLogout = () => {
    // Just close menu (no actual logout since always admin)
    setShowUserMenu(false);
  };

  return (
    <nav className={styles.nav} role="navigation" aria-label="Main navigation">
      <div className="container">
        <div className={styles.inner}>

          {/* Brand */}
          <Link to="/" className={styles.brand} aria-label="VELOOP Rewards Home">
            <div className={styles.logoMark} aria-hidden="true">VL</div>
            <div>
              <div className={styles.brandName}>VELOOP</div>
              <div className={styles.brandSub}>Rewards</div>
            </div>
          </Link>

          {/* Center nav */}
          {showBack ? (
            <Link to="/" className={styles.backLink}>
              <ChevronLeft size={15} aria-hidden="true" />
              {backLabel}
            </Link>
          ) : (
            <div className={styles.navLinks}>
              {NAV_LINKS.map((l) => {
                if (l.isHash) {
                  return (
                    <a
                      key={l.label}
                      href={l.to}
                      className={styles.navLink}
                      onClick={(e) => {
                        if (location.pathname === '/') {
                          e.preventDefault();
                          const element = document.querySelector(l.to);
                          element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }}
                    >
                      {l.label}
                    </a>
                  );
                }
                return (
                  <Link
                    key={l.label}
                    to={l.to}
                    className={`${styles.navLink} ${location.pathname === l.to ? styles.navLinkActive : ''}`}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </div>
          )}

          {/* Right */}
          <div className={styles.right}>
            {/* Always show admin user */}
            <>
              <div className={styles.balance} aria-label={`${balance.toLocaleString()} VEs balance`} title={`VE: ${user.balance?.VEs || user.balance?.[CURRENCY.VE] || 0} | SVE: ${user.balance?.SVEs || user.balance?.[CURRENCY.SVE] || 0} | Tokens: ${user.balance?.Tokens || user.balance?.[CURRENCY.TOKEN] || 0}`}>
                <div className={styles.coinIcon} aria-hidden="true">🪙</div>
                {balance.toLocaleString()} VE
              </div>
              <div className={styles.userDropdown}>
                <div 
                  className={styles.avatarChip} 
                  role="button" 
                  tabIndex={0} 
                  aria-label={`User ${user.displayId}`}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  onKeyDown={(e) => e.key === 'Enter' && setShowUserMenu(!showUserMenu)}
                >
                  <div className={styles.avatar} aria-hidden="true">
                    A
                  </div>
                </div>
                {showUserMenu && (
                  <div className={styles.userMenu}>
                    <div className={styles.userMenuHeader}>
                      <div className={styles.userName}>{user.name}</div>
                      <div className={styles.userEmail}>{user.email}</div>
                    </div>
                    <button className={styles.logoutBtn} onClick={handleLogout}>
                      <LogOut size={14} aria-hidden="true" />
                      Close Menu
                    </button>
                  </div>
                )}
              </div>
            </>
          </div>

        </div>
      </div>
    </nav>
  );
}
