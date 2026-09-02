/**
 * Centralized error handler.
 * Converts known error codes into structured, user-friendly API responses.
 * Never exposes raw Mongoose/Node errors to clients.
 */

const ERROR_MESSAGES = {
  GIVEAWAY_NOT_FOUND:         'This giveaway could not be found.',
  GIVEAWAY_NOT_ACTIVE:        'This giveaway is not currently active.',
  GIVEAWAY_ENDED:             'This giveaway has ended. Check out the winners and get ready for the next one.',
  ALREADY_PARTICIPATING:      "You're already participating in this giveaway.",
  INSUFFICIENT_VE_BALANCE:    "You don't have enough VEs to join this giveaway.",
  INSUFFICIENT_SVE_BALANCE:   "You don't have enough SVEs to join this giveaway.",
  INSUFFICIENT_TOKEN_BALANCE: "You don't have enough Tokens to join this giveaway.",
  LOGIN_REQUIRED:             'Please log in to your VELOOP Rewards account to participate.',
  PARTICIPATION_BLOCKED:      "Participation couldn't be completed. Please try again or contact support.",
  SUSPICIOUS_ACTIVITY:        "Participation couldn't be completed. Please contact support if you believe this is an error.",
  RATE_LIMITED:               'Too many requests. Please wait a moment before trying again.',
  CLAIM_NOT_ALLOWED:          "You don't have an active prize to claim.",
  VALIDATION_ERROR:           'Please check the submitted information and try again.',
};

function errorHandler(err, req, res, next) {
  // Known business logic errors
  if (err.code && ERROR_MESSAGES[err.code]) {
    return res.status(400).json({
      success: false,
      error: err.code,
      message: ERROR_MESSAGES[err.code],
      ...(err.required ? { required: err.required, available: err.available, currency: err.currency } : {}),
    });
  }

  // Mongoose duplicate key (race condition on unique index)
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      error: 'ALREADY_PARTICIPATING',
      message: ERROR_MESSAGES.ALREADY_PARTICIPATING,
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(422).json({
      success: false,
      error: 'VALIDATION_ERROR',
      message: ERROR_MESSAGES.VALIDATION_ERROR,
    });
  }

  // Log unexpected errors (in production, use a proper logger)
  console.error('[ERROR]', err.message, err.stack);

  return res.status(500).json({
    success: false,
    error: 'SERVER_ERROR',
    message: 'Something went wrong. Please try again.',
  });
}

module.exports = { errorHandler };
