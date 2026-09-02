import { useState } from 'react';
import { X, Loader2, Mail, MapPin, Phone, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './PrizeClaimModal.module.css';
import { CLAIM_TYPE } from '../../data/giveawayData';
import { submitPrizeClaim } from '../../services/api';

const PRIZE_EMOJI = {
  'Apple Watch Series 9': '⌚',
  'iPhone 15 Pro': '📱',
  'AirPods Pro': '🎧',
};

function getEmoji(name) {
  return PRIZE_EMOJI[name] || '🎁';
}

/**
 * PrizeClaimModal – supports physical & gift card flows.
 * @param {object} wonPrize  - from demoUser.wonPrize
 * @param {Function} onClose
 * @param {Function} onSuccess
 */
export default function PrizeClaimModal({ wonPrize, onClose, onSuccess }) {
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pin: '',
    email: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isPhysical = wonPrize.claimType === CLAIM_TYPE.PHYSICAL_FORM;

  const validate = () => {
    const e = {};
    if (isPhysical) {
      if (!form.fullName.trim()) e.fullName = 'Full name is required.';
      if (!/^\d{10}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit phone number.';
      if (!form.address.trim()) e.address = 'Address is required.';
      if (!form.city.trim()) e.city = 'City is required.';
      if (!form.state.trim()) e.state = 'State is required.';
      if (!/^\d{6}$/.test(form.pin)) e.pin = 'Enter a valid 6-digit PIN code.';
    } else {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address.';
    }
    return e;
  };

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((err) => ({ ...err, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { 
      setErrors(errs); 
      return; 
    }

    setLoading(true);
    setErrors({});
    
    try {
      const payload = isPhysical
        ? { 
            type: 'physical', 
            fullName: form.fullName, 
            phone: form.phone, 
            address: form.address, 
            city: form.city, 
            state: form.state, 
            pin: form.pin,
            prizeId: wonPrize.prizeId,
            prizeName: wonPrize.prizeName
          }
        : { 
            type: 'gift_card', 
            email: form.email,
            prizeId: wonPrize.prizeId,
            prizeName: wonPrize.prizeName
          };

      console.log('Submitting claim with payload:', payload);
      const res = await submitPrizeClaim(wonPrize.giveawayId, payload);
      console.log('Claim response:', res);
      
      if (res.success || res._mock) {
        // Success - either real API or mock mode
        setSubmitted(true);
        // Auto close after showing success
        setTimeout(() => {
          onSuccess && onSuccess();
        }, 2000);
      } else {
        const errorMsg = res.message || res.error || 'Failed to submit claim. Please try again.';
        setErrors({ global: errorMsg });
        console.error('Claim submission failed:', res);
      }
    } catch (err) {
      console.error('Prize claim error:', err);
      setErrors({ global: 'Network error. Please check your connection and try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={`Claim your prize: ${wonPrize.prizeName}`}
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) {
          onClose();
        }
      }}
    >
      <motion.div
        className={styles.modal}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              className={styles.successState}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <span className={styles.successIcon} aria-hidden="true">🎉</span>
              <h2 className={styles.successTitle}>Claim Submitted!</h2>
              <p className={styles.successDesc}>
                Your claim has been submitted successfully. Our team will process your prize within 3–5 business days.
              </p>
              <button className="btn btn-primary" onClick={onClose} style={{ marginTop: '0.5rem' }}>
                Done
              </button>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Header */}
              <div className={styles.header}>
                <div className={styles.headerLeft}>
                  <p className={styles.modalBadge}>
                    {isPhysical ? '🎁 Claim Your Prize' : '🎫 Claim Gift Card'}
                  </p>
                  <h2 className={styles.modalTitle}>
                    {isPhysical ? 'Delivery Details' : 'Gift Card Delivery'}
                  </h2>
                  <p className={styles.modalPrize}>For: {wonPrize.prizeName}</p>
                </div>
                <button
                  className={styles.closeBtn}
                  onClick={onClose}
                  aria-label="Close modal"
                >
                  <X size={16} aria-hidden="true" />
                </button>
              </div>

              {/* Body */}
              <form onSubmit={handleSubmit} noValidate>
                <div className={styles.body}>
                  {/* Prize info box */}
                  <div className={styles.prizeInfoBox}>
                    <span className={styles.prizeEmoji} aria-hidden="true">
                      {getEmoji(wonPrize.prizeName)}
                    </span>
                    <div className={styles.prizeInfoText}>
                      <div className={styles.prizeInfoName}>{wonPrize.prizeName}</div>
                      <div className={styles.prizeInfoSub}>
                        Status: Winner ✓ · {wonPrize.giveawayTitle}
                      </div>
                    </div>
                  </div>

                  {errors.global && (
                    <div className="alert alert-danger p-2 mb-3" role="alert" style={{ fontSize: 'var(--text-sm)' }}>
                      {errors.global}
                    </div>
                  )}

                  {/* Physical form */}
                  {isPhysical && (
                    <>
                      <div className={styles.formGroup}>
                        <label className="form-label" htmlFor="claim-fullName">
                          <User size={13} style={{ marginRight: '0.35rem' }} aria-hidden="true" />
                          Full Name
                        </label>
                        <input
                          id="claim-fullName"
                          type="text"
                          className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                          placeholder="As on government ID"
                          value={form.fullName}
                          onChange={handleChange('fullName')}
                          autoComplete="name"
                          required
                        />
                        {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
                      </div>

                      <div className={styles.formGroup}>
                        <label className="form-label" htmlFor="claim-phone">
                          <Phone size={13} style={{ marginRight: '0.35rem' }} aria-hidden="true" />
                          Phone Number
                        </label>
                        <input
                          id="claim-phone"
                          type="tel"
                          className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                          placeholder="10-digit mobile number"
                          value={form.phone}
                          onChange={handleChange('phone')}
                          autoComplete="tel"
                          maxLength={10}
                          required
                        />
                        {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                      </div>

                      <div className={styles.formGroup}>
                        <label className="form-label" htmlFor="claim-address">
                          <MapPin size={13} style={{ marginRight: '0.35rem' }} aria-hidden="true" />
                          Complete Address
                        </label>
                        <textarea
                          id="claim-address"
                          className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                          placeholder="House/Flat No., Street, Locality, Landmark"
                          value={form.address}
                          onChange={handleChange('address')}
                          rows={2}
                          autoComplete="street-address"
                          required
                        />
                        {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                      </div>

                      <div className={`${styles.formGroup} ${styles.row3}`}>
                        <div>
                          <label className="form-label" htmlFor="claim-city">City</label>
                          <input
                            id="claim-city"
                            type="text"
                            className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                            placeholder="City"
                            value={form.city}
                            onChange={handleChange('city')}
                            autoComplete="address-level2"
                            required
                          />
                          {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                        </div>
                        <div>
                          <label className="form-label" htmlFor="claim-state">State</label>
                          <input
                            id="claim-state"
                            type="text"
                            className={`form-control ${errors.state ? 'is-invalid' : ''}`}
                            placeholder="State"
                            value={form.state}
                            onChange={handleChange('state')}
                            autoComplete="address-level1"
                            required
                          />
                          {errors.state && <div className="invalid-feedback">{errors.state}</div>}
                        </div>
                        <div>
                          <label className="form-label" htmlFor="claim-pin">PIN Code</label>
                          <input
                            id="claim-pin"
                            type="text"
                            className={`form-control ${errors.pin ? 'is-invalid' : ''}`}
                            placeholder="6-digit PIN"
                            value={form.pin}
                            onChange={handleChange('pin')}
                            autoComplete="postal-code"
                            maxLength={6}
                            required
                          />
                          {errors.pin && <div className="invalid-feedback">{errors.pin}</div>}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Gift card form */}
                  {!isPhysical && (
                    <div className={styles.formGroup}>
                      <label className="form-label" htmlFor="claim-email">
                        <Mail size={13} style={{ marginRight: '0.35rem' }} aria-hidden="true" />
                        Email Address
                      </label>
                      <input
                        id="claim-email"
                        type="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        placeholder="Enter email where you want to receive your gift card"
                        value={form.email}
                        onChange={handleChange('email')}
                        autoComplete="email"
                        required
                      />
                      {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className={styles.footer}>
                  <button
                    type="submit"
                    className={`btn btn-primary ${styles.submitBtn}`}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="spin" aria-hidden="true" />
                        Submitting Claim...
                      </>
                    ) : (
                      'Submit Claim'
                    )}
                  </button>
                  <p className={styles.disclaimer}>
                    By submitting, you confirm the accuracy of the provided information.
                    Prize delivery is subject to verification.
                  </p>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
