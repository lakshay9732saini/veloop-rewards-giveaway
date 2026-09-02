import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, LogOut, Menu, X } from 'lucide-react';
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
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { user } = useUser(); // Get user from context
  
  const loggedIn = true; // Always logged in as admin
  const balance = user.balance?.[CURRENCY.VE] ?? 0;

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showUserMenu && !e.target.closest(`.${styles.userDropdown}`)) {
        setShowUserMenu(false);
      }
      if (showMobileMenu && !e.target.closest(`.${styles.mobileMenuContainer}`) && !e.target.closest(`.${styles.hamburger}`)) {
        setShowMobileMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showUserMenu, showMobileMenu]);

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
            {/* Balance */}
            <div className={styles.balance} aria-label={`${balance.toLocaleString()} VEs balance`} title={`VE: ${user.balance?.VEs || user.balance?.[CURRENCY.VE] || 0} | SVE: ${user.balance?.SVEs || user.balance?.[CURRENCY.SVE] || 0} | Tokens: ${user.balance?.Tokens || user.balance?.[CURRENCY.TOKEN] || 0}`}>
              <div className={styles.coinIcon} aria-hidden="true">🪙</div>
              <span className={styles.balanceText}>{balance.toLocaleString()} VE</span>
            </div>

            {/* User Avatar */}
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

            {/* Hamburger Menu (Mobile) */}
            <button 
              type="button"
              className={styles.hamburger}
              aria-expanded={showMobileMenu}
              aria-controls="mobile-navigation-menu"
              onClick={(e) => {
                e.stopPropagation();
                setShowMobileMenu((isOpen) => !isOpen);
              }}
              aria-label="Toggle menu"
            >
              {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div id="mobile-navigation-menu" className={styles.mobileMenuContainer}>
          <div className={styles.mobileMenu}>
            {NAV_LINKS.map((l) => {
              if (l.isHash) {
                return (
                  <a
                    key={l.label}
                    href={l.to}
                    className={styles.mobileNavLink}
                    onClick={(e) => {
                      if (location.pathname === '/') {
                        e.preventDefault();
                        const element = document.querySelector(l.to);
                        element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                      setShowMobileMenu(false);
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
                  className={`${styles.mobileNavLink} ${location.pathname === l.to ? styles.mobileNavLinkActive : ''}`}
                  onClick={() => setShowMobileMenu(false)}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
