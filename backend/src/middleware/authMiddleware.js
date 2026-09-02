const jwt = require('jsonwebtoken');

/**
 * Verify JWT and attach user identity to req.user.
 * CRITICAL: userId always comes from the verified token — NEVER from req.body.
 */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'LOGIN_REQUIRED', message: 'Authentication required.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret_change_in_production');
    // decoded.sub or decoded.userId — use whatever your JWT structure is
    req.user = { id: decoded.sub || decoded.userId || decoded.id, email: decoded.email };
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'LOGIN_REQUIRED', message: 'Invalid or expired session. Please log in again.' });
  }
}

/**
 * Optional auth — attaches user if token present, doesn't block if not.
 */
function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret_change_in_production');
      req.user = { id: decoded.sub || decoded.userId || decoded.id };
    } catch {}
  }
  next();
}

module.exports = { authenticate, optionalAuth };
