import express from 'express';
import request from 'supertest';
import { loginLimiter, registerLimiter } from '../src/middleware/rateLimiters.js';

describe('Rate Limiters', () => {
  let app;

  beforeEach(() => {
    app = express();
    // Enable trust proxy for rate limiter to work
    app.set('trust proxy', 1);

    // Setup dummy routes with the limiters
    app.post('/login', loginLimiter, (req, res) => {
      res.status(200).json({ success: true, message: 'Login successful' });
    });

    app.post('/register', registerLimiter, (req, res) => {
      res.status(200).json({ success: true, message: 'Registration successful' });
    });
  });

  describe('loginLimiter', () => {
    it('should allow 5 requests and block the 6th', async () => {
      for (let i = 0; i < 5; i++) {
        const res = await request(app).post('/login');
        expect(res.status).toBe(200);
      }

      // The 6th request should be blocked
      const blockedRes = await request(app).post('/login');
      expect(blockedRes.status).toBe(429);
      expect(blockedRes.body).toEqual({
        success: false,
        message: 'Too many login attempts from this IP, please try again after 15 minutes'
      });
    });
  });

  describe('registerLimiter', () => {
    it('should allow 5 requests and block the 6th', async () => {
      for (let i = 0; i < 5; i++) {
        const res = await request(app).post('/register');
        expect(res.status).toBe(200);
      }

      // The 6th request should be blocked
      const blockedRes = await request(app).post('/register');
      expect(blockedRes.status).toBe(429);
      expect(blockedRes.body).toEqual({
        success: false,
        message: 'Too many registration attempts from this IP, please try again after 1 hour'
      });
    });
  });
});
