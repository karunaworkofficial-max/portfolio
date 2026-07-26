const rateLimit = require('express-rate-limit');

exports.contactFormLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100,
  message: {
    success: false,
    message: 'Too many messages sent from this IP, please try again after an hour'
  }
});
