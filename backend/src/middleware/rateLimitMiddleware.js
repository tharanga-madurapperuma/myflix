const rateLimit = require('express-rate-limit');

// Rate limiter for login
const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per `windowMs`
  message: {
    error: 'Too many login attempts from this IP, please try again after 15 minutes',
  },
});

// Rate limiter for signup
const signupRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 signup attempts per `windowMs`
  message: {
    error: 'Too many signup attempts from this IP, please try again after an hour',
  },
});

module.exports = { loginRateLimiter, signupRateLimiter };
