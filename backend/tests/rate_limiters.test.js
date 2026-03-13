import request from 'supertest';
import express from 'express';
import { loginLimiter, registerLimiter } from '../src/middleware/rateLimiters.js';

describe('Rate Limiters Middleware', () => {
  let app;

  beforeEach(() => {
    app = express();
    // Allow IP spoofing via X-Forwarded-For to simulate different IPs
    app.set('trust proxy', 1);

    app.post('/api/auth/login', loginLimiter, (req, res) => {
      res.status(200).json({ success: true, message: 'Login successful' });
    });

    app.post('/api/auth/register', registerLimiter, (req, res) => {
      res.status(200).json({ success: true, message: 'Registration successful' });
    });
  });

  describe('loginLimiter', () => {
    it('should allow up to 5 requests from the same IP', async () => {
      const ip = '192.168.1.100';

      for (let i = 0; i < 5; i++) {
        const res = await request(app)
          .post('/api/auth/login')
          .set('X-Forwarded-For', ip);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
      }
    });

    it('should block the 6th request from the same IP', async () => {
      const ip = '192.168.1.101';

      for (let i = 0; i < 5; i++) {
        await request(app)
          .post('/api/auth/login')
          .set('X-Forwarded-For', ip);
      }

      const res = await request(app)
        .post('/api/auth/login')
        .set('X-Forwarded-For', ip);

      expect(res.statusCode).toBe(429);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Too many login attempts from this IP, please try again after 15 minutes');
    });

    it('should track requests independently per IP', async () => {
      const ip1 = '192.168.1.102';
      const ip2 = '192.168.1.103';

      for (let i = 0; i < 5; i++) {
        await request(app)
          .post('/api/auth/login')
          .set('X-Forwarded-For', ip1);
      }

      const res1 = await request(app)
        .post('/api/auth/login')
        .set('X-Forwarded-For', ip1);

      expect(res1.statusCode).toBe(429);

      const res2 = await request(app)
        .post('/api/auth/login')
        .set('X-Forwarded-For', ip2);

      expect(res2.statusCode).toBe(200);
    });
  });

  describe('registerLimiter', () => {
    it('should allow up to 5 requests from the same IP', async () => {
      const ip = '10.0.0.100';

      for (let i = 0; i < 5; i++) {
        const res = await request(app)
          .post('/api/auth/register')
          .set('X-Forwarded-For', ip);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
      }
    });

    it('should block the 6th request from the same IP', async () => {
      const ip = '10.0.0.101';

      for (let i = 0; i < 5; i++) {
        await request(app)
          .post('/api/auth/register')
          .set('X-Forwarded-For', ip);
      }

      const res = await request(app)
        .post('/api/auth/register')
        .set('X-Forwarded-For', ip);

      expect(res.statusCode).toBe(429);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Too many registration attempts from this IP, please try again after 1 hour');
    });

    it('should track requests independently per IP', async () => {
      const ip1 = '10.0.0.102';
      const ip2 = '10.0.0.103';

      for (let i = 0; i < 5; i++) {
        await request(app)
          .post('/api/auth/register')
          .set('X-Forwarded-For', ip1);
      }

      const res1 = await request(app)
        .post('/api/auth/register')
        .set('X-Forwarded-For', ip1);

      expect(res1.statusCode).toBe(429);

      const res2 = await request(app)
        .post('/api/auth/register')
        .set('X-Forwarded-For', ip2);

      expect(res2.statusCode).toBe(200);
    });
  });
});
