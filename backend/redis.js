import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 3) {
        // Stop retrying after 3 attempts and just log once
        if (retries === 4) console.warn('[Redis] Not available — caching disabled. Start Redis to enable it.');
        return false;
      }
      return Math.min(retries * 200, 2000);
    }
  }
});

redisClient.on('error', () => {}); // Suppress repetitive ECONNREFUSED noise
redisClient.on('connect', () => console.log('[Redis] Connected'));
redisClient.on('ready', () => console.log('[Redis] Ready'));

export const connectRedis = async () => {
  try {
    await redisClient.connect();
  } catch (err) {
    console.warn('[Redis] Could not connect — server continues without caching.');
  }
};

export default redisClient;

