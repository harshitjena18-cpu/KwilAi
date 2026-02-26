import request from 'supertest';
import express from 'express';
import { voiceValidation, validate } from '../src/utils/validators.js';

const app = express();
app.use(express.json());

// Helper routes for testing
app.post('/test-tts', voiceValidation.textToSpeech, validate, (req, res) => {
  res.status(200).json({ success: true, message: 'Valid' });
});

app.post('/test-instructions', voiceValidation.recipeInstructions, validate, (req, res) => {
  res.status(200).json({ success: true, message: 'Valid' });
});

app.post('/test-assistance', voiceValidation.assistance, validate, (req, res) => {
  res.status(200).json({ success: true, message: 'Valid' });
});

describe('Voice API Validation Rules', () => {

  describe('Text-to-Speech Validation', () => {
    test('should validate correct request', async () => {
      const res = await request(app)
        .post('/test-tts')
        .send({ text: 'Hello world', languageCode: 'en-US' });
      expect(res.statusCode).toBe(200);
    });

    test('should fail if text is missing', async () => {
      const res = await request(app).post('/test-tts').send({});
      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'text', message: 'Text is required' })
        ])
      );
    });

    test('should fail if text is not a string (Type Confusion)', async () => {
      const res = await request(app)
        .post('/test-tts')
        .send({ text: { foo: 'bar' } });
      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'text', message: 'Text must be a string' })
        ])
      );
    });
  });

  describe('Recipe Instructions Validation', () => {
    test('should validate correct steps', async () => {
      const res = await request(app)
        .post('/test-instructions')
        .send({ steps: [{ instruction: 'Boil water', number: 1 }] });
      expect(res.statusCode).toBe(200);
    });

    test('should fail if steps is not an array', async () => {
      const res = await request(app)
        .post('/test-instructions')
        .send({ steps: 'Boil water' });
      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'steps', message: 'Steps array cannot be empty' })
        ])
      );
    });

    test('should fail if steps is empty', async () => {
        const res = await request(app)
          .post('/test-instructions')
          .send({ steps: [] });
        expect(res.statusCode).toBe(400);
    });
  });

  describe('Assistance Validation', () => {
    test('should validate correct query', async () => {
      const res = await request(app)
        .post('/test-assistance')
        .send({ query: 'How do I cook pasta?' });
      expect(res.statusCode).toBe(200);
    });

    test('should fail if query is not a string', async () => {
      const res = await request(app)
        .post('/test-assistance')
        .send({ query: { foo: 'bar' } });
      expect(res.statusCode).toBe(400);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: 'query', message: 'Query must be a string' })
        ])
      );
    });
  });

});
