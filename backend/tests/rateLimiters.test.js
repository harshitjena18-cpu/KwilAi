import request from 'supertest';
import express from 'express';
import { loginLimiter, registerLimiter } from '../src/middleware/rateLimiters.js';

const app = express();
// Trust proxy is needed for rate limiter to see the IP correctly in some environments,
// though for supertest it usually defaults to a local IP.
app.set('trust proxy', 1);
app.use(express.json());

// Apply limiters to test routes
app.post('/test-login', loginLimiter, (req, res) => {
  res.status(200).json({ success: true, message: 'Login allowed' });
});

app.post('/test-register', registerLimiter, (req, res) => {
  res.status(200).json({ success: true, message: 'Register allowed' });
});

describe('Rate Limiters', () => {

  // Note: These tests rely on the in-memory store of express-rate-limit.
  // Each test run starts fresh, but within a test, state is preserved.

  describe('Login Limiter', () => {
    test('should allow 5 requests and block the 6th', async () => {
      // 5 allowed requests
      for (let i = 0; i < 5; i++) {
        const res = await request(app).post('/test-login');
        expect(res.statusCode).toBe(200);
      }

      // 6th request should fail
      const res = await request(app).post('/test-login');
      expect(res.statusCode).toBe(429);
      // The message is an object { success: false, message: ... }
      expect(res.body.message).toMatch(/Too many login attempts/);
    });
  });

  describe('Register Limiter', () => {
    test('should allow 5 requests and block the 6th', async () => {
      // 5 allowed requests
      for (let i = 0; i < 5; i++) {
        const res = await request(app).post('/test-register');
        expect(res.statusCode).toBe(200);
      }

      // 6th request should fail
      const res = await request(app).post('/test-register');
      expect(res.statusCode).toBe(429);
      expect(res.body.message).toMatch(/Too many registration attempts/);
    });
  });
});
