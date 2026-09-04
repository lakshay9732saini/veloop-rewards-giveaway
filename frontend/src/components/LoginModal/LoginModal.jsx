import { useState } from 'react';
import { X, Loader2, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './LoginModal.module.css';
import { login, API_ERROR_MESSAGES as apiErrors } from '../../services/api';

export default function LoginModal({ onClose, onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const normalizedEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(normalizedEmail)) {
      setError('Please enter an email with a valid extension, such as .com or .in');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await login(normalizedEmail, password);
      if (res.success) {
        onSuccess && onSuccess(res.data.user);
        onClose();
      } else {
        setError(apiErrors[res.error] || res.message || 'Login failed. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
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
        transition={{ duration: 0.28 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Welcome Back</h2>
            <p className={styles.subtitle}>Login to your VELOOP Rewards account</p>
          </div>
          <button 
            className={styles.closeBtn} 
            onClick={onClose} 
            type="button"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body with Form */}
        <div className={styles.body}>
          <form onSubmit={handleSubmit}>
            
            {/* ============ EMAIL FIELD ============ */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label 
                htmlFor="loginEmailField" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#f8fafc',
                  marginBottom: '0.5rem'
                }}
              >
                <Mail size={14} style={{ color: 'rgba(124, 58, 237, 0.8)' }} />
                Email Address
              </label>
              <input
                id="loginEmailField"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={loading}
                autoComplete="email"
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '0.75rem 1rem',
                  fontSize: '0.875rem',
                  border: '1px solid rgba(124, 58, 237, 0.3)',
                  borderRadius: '10px',
                  background: 'rgba(17, 14, 41, 0.6)',
                  color: '#f8fafc',
                  boxSizing: 'border-box',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(124, 58, 237, 0.8)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.15), inset 0 0 20px rgba(124, 58, 237, 0.1)';
                  e.target.style.background = 'rgba(17, 14, 41, 0.8)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(124, 58, 237, 0.3)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.background = 'rgba(17, 14, 41, 0.6)';
                }}
              />
            </div>

            {/* ============ PASSWORD FIELD ============ */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label 
                htmlFor="loginPasswordField"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#f8fafc',
                  marginBottom: '0.5rem'
                }}
              >
                <Lock size={14} style={{ color: 'rgba(124, 58, 237, 0.8)' }} />
                Password
              </label>
              <input
                id="loginPasswordField"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                minLength={8}
                disabled={loading}
                autoComplete="current-password"
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '0.75rem 1rem',
                  fontSize: '0.875rem',
                  border: '1px solid rgba(124, 58, 237, 0.3)',
                  borderRadius: '10px',
                  background: 'rgba(17, 14, 41, 0.6)',
                  color: '#f8fafc',
                  boxSizing: 'border-box',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(124, 58, 237, 0.8)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.15), inset 0 0 20px rgba(124, 58, 237, 0.1)';
                  e.target.style.background = 'rgba(17, 14, 41, 0.8)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(124, 58, 237, 0.3)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.background = 'rgba(17, 14, 41, 0.6)';
                }}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div 
                style={{ 
                  padding: '0.75rem 1rem',
                  marginBottom: '1rem',
                  background: 'rgba(244, 63, 94, 0.15)',
                  border: '1px solid rgba(244, 63, 94, 0.4)',
                  borderRadius: '10px',
                  fontSize: '0.875rem',
                  color: '#fca5a5',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <span style={{ fontSize: '1rem' }}>⚠️</span>
                {error}
              </div>
            )}

            {/* Demo Note */}
            <div style={{
              padding: '0.875rem 1rem',
              marginBottom: '1.5rem',
              background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.15) 0%, rgba(99, 102, 241, 0.1) 100%)',
              border: '1px solid rgba(124, 58, 237, 0.3)',
              borderRadius: '10px',
              fontSize: '0.8125rem',
              color: 'rgba(203, 213, 225, 0.9)',
              lineHeight: 1.5,
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '100px',
                height: '100px',
                background: 'radial-gradient(circle, rgba(124, 58, 237, 0.2) 0%, transparent 70%)',
                pointerEvents: 'none'
              }}></div>
              <strong style={{ color: '#c4b5fd', fontWeight: 600 }}>🎭 Demo Mode:</strong> Use a valid email and an 8-character minimum password
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="btn btn-outline-secondary"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ 
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.375rem'
                }}
              >
                {loading ? (
                  <>
                    <Loader2 size={14} className="spinner" />
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
