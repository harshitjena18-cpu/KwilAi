import { jest } from '@jest/globals';

// Mock Recipe model
const mockBulkWrite = jest.fn().mockResolvedValue({ insertedCount: 1, matchedCount: 1 });
const mockFindOrCreate = jest.fn();

// Mock Mongoose model methods
const mockRecipeModel = {
  bulkWrite: mockBulkWrite,
  findOrCreate: mockFindOrCreate
};

// Use unstable_mockModule to mock the Recipe model import BEFORE importing the service
jest.unstable_mockModule('../../src/models/Recipe.js', () => ({
  default: mockRecipeModel
}));

// Dynamic import of the service to apply the mock
const { default: recipeService } = await import('../../src/services/recipeService.js');

describe('RecipeService.saveRecipesToDB Optimization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should use bulkWrite for saving recipes', async () => {
    const recipes = [
      {
        title: 'Recipe 1',
        source: 'spoonacular',
        externalId: '123',
        image: 'img1.jpg'
      },
      {
        title: 'Recipe 2',
        source: 'edamam',
        externalId: '456',
        image: 'img2.jpg'
      }
    ];

    await recipeService.saveRecipesToDB(recipes);

    expect(mockBulkWrite).toHaveBeenCalledTimes(1);

    const ops = mockBulkWrite.mock.calls[0][0];
    expect(ops).toHaveLength(2);

    // Verify first operation (upsert)
    expect(ops[0]).toHaveProperty('updateOne');
    const op1 = ops[0].updateOne;
    expect(op1.filter).toEqual({ source: 'spoonacular', externalId: '123' });
    expect(op1.update.$set).toHaveProperty('lastFetched');
    expect(op1.update.$setOnInsert).toHaveProperty('title', 'Recipe 1');
    expect(op1.update.$setOnInsert).toHaveProperty('createdAt');
    expect(op1.update.$setOnInsert).toHaveProperty('updatedAt');
    // Check defaults
    expect(op1.update.$setOnInsert).toHaveProperty('savedCount', 0);
    expect(op1.update.$setOnInsert).toHaveProperty('isActive', true);
    expect(op1.upsert).toBe(true);

    // Verify second operation (upsert)
    expect(ops[1]).toHaveProperty('updateOne');
    const op2 = ops[1].updateOne;
    expect(op2.filter).toEqual({ source: 'edamam', externalId: '456' });
  });

  test('should use insertOne for recipes without external ID', async () => {
    const recipes = [
      {
        title: 'Custom Recipe',
        ingredients: []
      }
    ];

    await recipeService.saveRecipesToDB(recipes);

    expect(mockBulkWrite).toHaveBeenCalledTimes(1);
    const ops = mockBulkWrite.mock.calls[0][0];
    expect(ops).toHaveLength(1);
    expect(ops[0]).toHaveProperty('insertOne');
    expect(ops[0].insertOne.document).toHaveProperty('title', 'Custom Recipe');
    expect(ops[0].insertOne.document).toHaveProperty('createdAt');
    expect(ops[0].insertOne.document).toHaveProperty('updatedAt');
    expect(ops[0].insertOne.document).toHaveProperty('savedCount', 0);
    expect(ops[0].insertOne.document).toHaveProperty('isActive', true);
  });
});
