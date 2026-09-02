import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className="container">
        <div className={styles.grid}>
          {/* Brand column */}
          <div className={styles.brandCol}>
            <Link to="/" className={styles.brandMark} aria-label="VELOOP Rewards Home">
              <div className={styles.logoMark} aria-hidden="true">VL</div>
              <span className={styles.brandName}>VELOOP Rewards</span>
            </Link>
            <p className={styles.brandDesc}>
              Earn rewards, participate in giveaways, and win exclusive prizes through the VELOOP Rewards platform.
            </p>
            <span className={styles.support}>Have questions? Contact VELOOP Rewards support.</span>
          </div>

          {/* Giveaway column */}
          <div>
            <h3 className={styles.colTitle}>Giveaway</h3>
            <ul className={styles.links}>
              <li><Link to="/">Giveaway Home</Link></li>
              <li><Link to="/">Active Giveaways</Link></li>
              <li><Link to="/">Previous Winners</Link></li>
              <li><Link to="/">How to Participate</Link></li>
            </ul>
          </div>

          {/* Legal column */}
          <div>
            <h3 className={styles.colTitle}>Legal</h3>
            <ul className={styles.links}>
              <li><Link to="/">Rules & Guidelines</Link></li>
              <li><Link to="/">Terms of Service</Link></li>
              <li><Link to="/">Privacy Policy</Link></li>
              <li><Link to="/">Eligibility</Link></li>
            </ul>
          </div>

          {/* Support column */}
          <div>
            <h3 className={styles.colTitle}>Support</h3>
            <ul className={styles.links}>
              <li><Link to="/">FAQ</Link></li>
              <li><Link to="/">Contact Support</Link></li>
              <li><Link to="/">Report an Issue</Link></li>
              <li><Link to="/">Account Help</Link></li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copy}>
            © {year} VELOOP Rewards. All rights reserved.
          </p>
          <p className={styles.disclaimer}>
            This is a development demo. Giveaway data shown is for demonstration purposes only and does not represent actual VELOOP statistics.
          </p>
        </div>
      </div>
    </footer>
  );
}
