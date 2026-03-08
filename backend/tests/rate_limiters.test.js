import express from 'express';
import request from 'supertest';
import { loginLimiter, registerLimiter } from '../src/middleware/rateLimiters.js';

describe('Rate Limiters', () => {
  let app;

  beforeEach(() => {
    app = express();
    // Trust proxy to allow IP spoofing for tests (set to 1 to avoid permissive trust proxy warning)
    app.set('trust proxy', 1);
    app.post('/login', loginLimiter, (req, res) => res.status(200).json({ success: true }));
    app.post('/register', registerLimiter, (req, res) => res.status(200).json({ success: true }));
  });

  describe('loginLimiter', () => {
    it('should allow up to 5 requests', async () => {
      for (let i = 0; i < 5; i++) {
        const response = await request(app).post('/login').set('X-Forwarded-For', '192.168.1.1');
        expect(response.status).toBe(200);
      }
    });

    it('should block the 6th request', async () => {
      for (let i = 0; i < 5; i++) {
        await request(app).post('/login').set('X-Forwarded-For', '192.168.1.2');
      }

      const response = await request(app).post('/login').set('X-Forwarded-For', '192.168.1.2');
      expect(response.status).toBe(429);
      expect(response.body).toEqual({
        success: false,
        message: 'Too many login attempts from this IP, please try again after 15 minutes'
      });
    });
  });

  describe('registerLimiter', () => {
    it('should allow up to 5 requests', async () => {
      for (let i = 0; i < 5; i++) {
        const response = await request(app).post('/register').set('X-Forwarded-For', '192.168.1.3');
        expect(response.status).toBe(200);
      }
    });

    it('should block the 6th request', async () => {
      for (let i = 0; i < 5; i++) {
        await request(app).post('/register').set('X-Forwarded-For', '192.168.1.4');
      }

      const response = await request(app).post('/register').set('X-Forwarded-For', '192.168.1.4');
      expect(response.status).toBe(429);
      expect(response.body).toEqual({
        success: false,
        message: 'Too many registration attempts from this IP, please try again after 1 hour'
      });
    });
  });
});
