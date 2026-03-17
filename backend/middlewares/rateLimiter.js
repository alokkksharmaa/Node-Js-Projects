import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import redisClient from '../redis.js';

export const shortenLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 10,
  message: { success: false, error: 'Too many URL creations from this IP. Please try again after 1 minute.' },
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args)
  })
});

export const redirectLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: 'Too many redirects from this IP. Please wait a minute before clicking again.',
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args)
  })
});
