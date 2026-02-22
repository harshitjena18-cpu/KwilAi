import request from 'supertest';
import express from 'express';
import { registerValidation, validate } from '../src/utils/validators.js';

const app = express();
app.use(express.json());

// Helper route for testing
app.post('/test-register', registerValidation, validate, (req, res) => {
  res.status(200).json({ success: true, message: 'Valid' });
});

describe('Registration Validation Rules', () => {

  test('should validate a correct registration payload', async () => {
    const res = await request(app)
      .post('/test-register')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  describe('Name Validation', () => {
    test('should fail if name is missing', async () => {
      const res = await request(app)
        .post('/test-register')
        .send({
          email: 'john@example.com',
          password: 'Password123'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'name', message: 'Name is required' })
        ])
      );
    });

    test('should fail if name is empty', async () => {
      const res = await request(app)
        .post('/test-register')
        .send({
          name: '',
          email: 'john@example.com',
          password: 'Password123'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'name', message: 'Name is required' })
        ])
      );
    });

    test('should fail if name is too short', async () => {
      const res = await request(app)
        .post('/test-register')
        .send({
          name: 'J',
          email: 'john@example.com',
          password: 'Password123'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'name', message: 'Name must be between 2 and 50 characters' })
        ])
      );
    });

    test('should fail if name is too long', async () => {
      const longName = 'a'.repeat(51);
      const res = await request(app)
        .post('/test-register')
        .send({
          name: longName,
          email: 'john@example.com',
          password: 'Password123'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'name', message: 'Name must be between 2 and 50 characters' })
        ])
      );
    });
  });

  describe('Email Validation', () => {
    test('should fail if email is missing', async () => {
      const res = await request(app)
        .post('/test-register')
        .send({
          name: 'John Doe',
          password: 'Password123'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'email', message: 'Email is required' })
        ])
      );
    });

    test('should fail if email is invalid', async () => {
      const res = await request(app)
        .post('/test-register')
        .send({
          name: 'John Doe',
          email: 'invalid-email',
          password: 'Password123'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'email', message: 'Please provide a valid email address' })
        ])
      );
    });
  });

  describe('Password Validation', () => {
    test('should fail if password is missing', async () => {
      const res = await request(app)
        .post('/test-register')
        .send({
          name: 'John Doe',
          email: 'john@example.com'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'password', message: 'Password is required' })
        ])
      );
    });

    test('should fail if password is too short', async () => {
      const res = await request(app)
        .post('/test-register')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'Pass1'
        });

      expect(res.statusCode).toBe(400);
      // Wait, isLength({ min: 6 })
      // Matches regex checks for uppercase, lowercase, digit.
      // 'Pass1' is 5 chars. It will trigger both length and maybe regex if it matches?
      // It has Upper, Lower, Digit. So regex is fine. Length is issue.

      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'password', message: 'Password must be at least 6 characters long' })
        ])
      );
    });

    test('should fail if password lacks uppercase', async () => {
      const res = await request(app)
        .post('/test-register')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'password',
            message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
          })
        ])
      );
    });

    test('should fail if password lacks lowercase', async () => {
      const res = await request(app)
        .post('/test-register')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'PASSWORD123'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'password',
            message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
          })
        ])
      );
    });

    test('should fail if password lacks number', async () => {
      const res = await request(app)
        .post('/test-register')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'Password'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            field: 'password',
            message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
          })
        ])
      );
    });
  });
});
