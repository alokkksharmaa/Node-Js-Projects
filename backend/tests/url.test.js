import request from 'supertest';
import mongoose from 'mongoose';
import app from '../index.js';
import Url from '../models/Url.js';
import Click from '../models/Click.js';
import redisClient from '../redis.js';

describe('URL Shortener API', () => {
  beforeAll(async () => {
    // Wait for DB connections
    await new Promise(resolve => setTimeout(resolve, 500));
  });

  afterAll(async () => {
    await Url.deleteMany({});
    await Click.deleteMany({});
    await redisClient.flushAll();
    await mongoose.connection.close();
    await redisClient.quit();
  });

  let createdShortCode = '';

  describe('POST /api/url/shorten', () => {
    it('should create a new short URL', async () => {
      const res = await request(app)
        .post('/api/url/shorten')
        .send({ originalUrl: 'https://jestjs.io/docs/getting-started' });
      
      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.shortCode).toBeDefined();
      createdShortCode = res.body.data.shortCode;
    });

    it('should reject invalid URLs', async () => {
      const res = await request(app)
        .post('/api/url/shorten')
        .send({ originalUrl: 'javascript:alert(1)' });
      
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /:shortCode (Redirect)', () => {
    it('should redirect to the original URL', async () => {
      const res = await request(app).get(`/${createdShortCode}`);
      expect(res.statusCode).toBe(302);
      expect(res.headers.location).toBe('https://jestjs.io/docs/getting-started');
    });

    it('should return 404 for non-existent shortcode', async () => {
      const res = await request(app).get('/invalidcode123');
      expect(res.statusCode).toBe(404);
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce rate limits on creation', async () => {
      // Assuming limit is 10/min, we fire 11
      const requests = Array(11).fill().map(() => 
        request(app).post('/api/url/shorten').send({ originalUrl: 'https://google.com' })
      );
      
      const responses = await Promise.all(requests);
      const rateLimited = responses.find(r => r.statusCode === 429);
      expect(rateLimited).toBeDefined();
    });
  });
});
