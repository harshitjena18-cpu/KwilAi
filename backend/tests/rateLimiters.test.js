import request from 'supertest';
import express from 'express';
import { registerLimiter } from '../src/middleware/rateLimiters.js';

const app = express();
app.set('trust proxy', 1); // Important for rate limiting in tests
app.use(express.json());

// Apply limiter to a test route
app.post('/test-register', registerLimiter, (req, res) => {
  res.status(200).json({ success: true, message: 'Registered' });
});

describe('Rate Limiters', () => {
  describe('Register Limiter', () => {
    test('should allow 5 requests and block the 6th', async () => {
      // Send 5 successful requests
      for (let i = 0; i < 5; i++) {
        const res = await request(app).post('/test-register');
        expect(res.statusCode).toBe(200);
      }

      // Send the 6th request, which should be blocked
      const res = await request(app).post('/test-register');
      expect(res.statusCode).toBe(429); // Too Many Requests
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Too many registration attempts/);
    });
  });
});
