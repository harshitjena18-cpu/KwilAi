import request from 'supertest';
import express from 'express';
import { registerLimiter } from '../src/middleware/rateLimiters.js';

const app = express();
app.use(express.json());
// Trust proxy is required for rate-limit to work with supertest/ephemeral ports often
app.set('trust proxy', 1);

// Helper route for testing
app.post('/test-register', registerLimiter, (req, res) => {
  res.status(200).json({ success: true, message: 'Valid' });
});

describe('Rate Limiters', () => {

  describe('Register Limiter', () => {
    // Reset limiter before tests if possible, or assume fresh start
    // Note: express-rate-limit keeps state in memory by default.
    // Supertest creates a new server instance, but module state might persist if not careful.
    // However, for this simple test, we just check if it blocks after N requests.

    test('should allow 5 requests then block', async () => {
      // Send 5 valid requests
      for (let i = 0; i < 5; i++) {
        const res = await request(app).post('/test-register');
        expect(res.statusCode).toBe(200);
      }

      // 6th request should fail
      const res = await request(app).post('/test-register');
      expect(res.statusCode).toBe(429);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Too many registration attempts/);
    });
  });

});
