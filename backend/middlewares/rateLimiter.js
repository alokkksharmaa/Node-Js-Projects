import rateLimit from 'express-rate-limit';

export const createShortenLimiter = () => rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many URL creations from this IP. Please try again after 1 minute.' }
});

export const createRedirectLimiter = () => rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many redirects from this IP. Please wait a minute.'
});
