import { jest } from '@jest/globals';

// Define mocks
const mockFindOrCreate = jest.fn();
// Update mock return value to match modern Mongoose/MongoDB driver structure
const mockBulkWrite = jest.fn().mockResolvedValue({
  upsertedCount: 1,
  modifiedCount: 1,
  insertedCount: 0
});
const mockValidate = jest.fn().mockResolvedValue(true);

class MockRecipe {
  constructor(data) {
    Object.assign(this, data);
    this.validate = mockValidate;
  }
  toObject() {
    const obj = { ...this };
    delete obj.validate;
    return obj;
  }
}
MockRecipe.findOrCreate = mockFindOrCreate;
MockRecipe.bulkWrite = mockBulkWrite;

// Mock dependencies
jest.unstable_mockModule('../../src/models/Recipe.js', () => ({
  default: MockRecipe
}));

// Mock services to avoid side effects
jest.unstable_mockModule('../../src/services/spoonacularService.js', () => ({
  default: {}
}));
jest.unstable_mockModule('../../src/services/edamamService.js', () => ({
  default: {}
}));
jest.unstable_mockModule('../../src/services/geminiService.js', () => ({
  default: {}
}));

// Dynamic import after mocking
const { default: recipeService } = await import('../../src/services/recipeService.js');
const { default: Recipe } = await import('../../src/models/Recipe.js');

describe('RecipeService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveRecipesToDB', () => {
    it('should use bulkWrite instead of findOrCreate', async () => {
      const recipes = [
        {
          source: 'spoonacular',
          externalId: '123',
          title: 'Recipe 1'
        },
        {
          source: 'edamam',
          externalId: '456',
          title: 'Recipe 2'
        }
      ];

      await recipeService.saveRecipesToDB(recipes);

      // Expect bulkWrite to be called
      expect(Recipe.bulkWrite).toHaveBeenCalledTimes(1);

      // Verify the operations passed to bulkWrite
      const calls = Recipe.bulkWrite.mock.calls[0];
      const operations = calls[0];
      const options = calls[1];

      expect(operations).toHaveLength(2);
      expect(options).toEqual({ ordered: false });

      // Check first operation (updateOne)
      expect(operations[0]).toEqual({
        updateOne: {
          filter: { source: 'spoonacular', externalId: '123' },
          update: expect.objectContaining({
            $set: expect.objectContaining({ lastFetched: expect.any(Date) }),
            $setOnInsert: expect.objectContaining({ title: 'Recipe 1' })
          }),
          upsert: true
        }
      });

      // Expect findOrCreate NOT to be called
      expect(Recipe.findOrCreate).not.toHaveBeenCalled();
    });

    it('should handle validation errors gracefully', async () => {
      // Mock validation failure for first recipe
      // We need to spy on the instance method which is tricky with this mock setup
      // But since we use `mockValidate` which is shared, we can mock it
      mockValidate.mockRejectedValueOnce(new Error('Validation failed')).mockResolvedValue(true);

      const recipes = [
        { source: 'invalid', externalId: '1', title: 'Bad Recipe' },
        { source: 'valid', externalId: '2', title: 'Good Recipe' }
      ];

      await recipeService.saveRecipesToDB(recipes);

      // Should still call bulkWrite for the valid recipe
      expect(Recipe.bulkWrite).toHaveBeenCalledTimes(1);
      const operations = Recipe.bulkWrite.mock.calls[0][0];
      expect(operations).toHaveLength(1);
      expect(operations[0].updateOne.filter.externalId).toBe('2');
    });

    it('should use insertOne for recipes without externalId', async () => {
        const recipes = [
            { title: 'Custom Recipe', ingredients: [] }
        ];

        await recipeService.saveRecipesToDB(recipes);

        expect(Recipe.bulkWrite).toHaveBeenCalledTimes(1);
        const operations = Recipe.bulkWrite.mock.calls[0][0];
        expect(operations).toHaveLength(1);
        expect(operations[0]).toEqual({
            insertOne: {
                document: expect.objectContaining({ title: 'Custom Recipe' })
            }
        });
    });
  });
});
