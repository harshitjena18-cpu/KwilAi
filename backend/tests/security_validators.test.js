import request from 'supertest';
import express from 'express';
import { recipeSearchValidation, suggestionValidation, validate } from '../src/utils/validators.js';

const app = express();
app.use(express.json());

// Helper routes for testing
app.get('/test-search', recipeSearchValidation, validate, (req, res) => {
  res.status(200).json({ success: true, message: 'Valid' });
});

app.get('/test-suggestions', suggestionValidation, validate, (req, res) => {
  res.status(200).json({ success: true, message: 'Valid' });
});

describe('Security Validation Rules', () => {

  describe('Recipe Search Validation', () => {
    test('should validate correct search query', async () => {
      const res = await request(app).get('/test-search?q=pasta');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    test('should fail if q is missing', async () => {
      const res = await request(app).get('/test-search');
      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'q', message: 'Search query is required' })
        ])
      );
    });

    test('should fail if q is an object (Type Confusion)', async () => {
      // q[foo]=bar -> { q: { foo: 'bar' } }
      const res = await request(app).get('/test-search').query({ q: { foo: 'bar' } });
      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'q', message: 'Search query must be a string' })
        ])
      );
    });

    test('should fail if limit is invalid', async () => {
      const res = await request(app).get('/test-search?q=pasta&limit=101');
      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'limit', message: 'Limit must be between 1 and 100' })
        ])
      );
    });
  });

  describe('Suggestion Validation', () => {
    test('should validate correct ingredients string', async () => {
      const res = await request(app).get('/test-suggestions?ingredients=tomato,basil');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    test('should validate correct ingredients array', async () => {
      // ?ingredients=tomato&ingredients=basil
      const res = await request(app).get('/test-suggestions?ingredients=tomato&ingredients=basil');
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    test('should fail if ingredients is an object (Type Confusion)', async () => {
      // ingredients[foo]=bar -> { ingredients: { foo: 'bar' } }
      const res = await request(app).get('/test-suggestions?ingredients[foo]=bar');
      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'ingredients', message: 'Ingredients must be a string or an array of strings' })
        ])
      );
    });

    test('should fail if ingredients array contains non-string', async () => {
       // ?ingredients=tomato&ingredients[foo]=bar
       // ingredients = ['tomato', { foo: 'bar' }]
      const res = await request(app).get('/test-suggestions?ingredients=tomato&ingredients[foo]=bar');
      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'ingredients', message: 'Ingredients must be a string or an array of strings' })
        ])
      );
    });
  });

});
