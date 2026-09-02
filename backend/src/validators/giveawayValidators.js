const { body, param, validationResult } = require('express-validator');

/**
 * Validates the join giveaway request.
 * Only accepts giveawayId and prizeId — backend determines ALL financial values.
 */
const validateJoin = [
  body('giveawayId')
    .isString().trim().notEmpty()
    .withMessage('giveawayId is required.'),
  body('prizeId')
    .isString().trim().notEmpty()
    .withMessage('prizeId is required.'),
  // Explicitly reject any amount/currency from the frontend
  body('amount').not().exists().withMessage('amount is not accepted from the client.'),
  body('currency').not().exists().withMessage('currency is not accepted from the client.'),
  body('entryFee').not().exists().withMessage('entryFee is not accepted from the client.'),
  handleValidation,
];

const validateClaim = [
  param('giveawayId').isString().trim().notEmpty(),
  body('type')
    .isIn(['physical', 'gift_card'])
    .withMessage('Invalid claim type.'),
  handleValidation,
];

const validatePhysicalClaim = [
  body('fullName').isString().trim().notEmpty().isLength({ max: 100 }),
  body('phone').isMobilePhone('en-IN').withMessage('Enter a valid Indian mobile number.'),
  body('address').isString().trim().notEmpty().isLength({ max: 500 }),
  body('city').isString().trim().notEmpty().isLength({ max: 100 }),
  body('state').isString().trim().notEmpty().isLength({ max: 100 }),
  body('pin').matches(/^\d{6}$/).withMessage('Enter a valid 6-digit PIN code.'),
  handleValidation,
];

const validateGiftCardClaim = [
  body('email').isEmail().normalizeEmail().withMessage('Enter a valid email address.'),
  handleValidation,
];

function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      error: 'VALIDATION_ERROR',
      message: 'Please check the submitted information.',
      details: errors.array().map(e => ({ field: e.path, message: e.msg })),
    });
  }
  next();
}

module.exports = { validateJoin, validateClaim, validatePhysicalClaim, validateGiftCardClaim };
