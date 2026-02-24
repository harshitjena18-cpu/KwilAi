import { jest } from '@jest/globals';

// Define mocks
const mockValidateSync = jest.fn();
const mockToObject = jest.fn();
const mockFindOrCreate = jest.fn();
const mockBulkWrite = jest.fn();

// Create a mock class for Recipe
const MockRecipe = jest.fn().mockImplementation((data) => ({
  validateSync: mockValidateSync,
  toObject: mockToObject.mockReturnValue(data),
  ...data
}));

// Attach static methods
MockRecipe.findOrCreate = mockFindOrCreate;
MockRecipe.bulkWrite = mockBulkWrite;

// Mock the module
await jest.unstable_mockModule('../../src/models/Recipe.js', () => ({
  default: MockRecipe
}));

// Import the service under test
const { default: recipeService } = await import('../../src/services/recipeService.js');

describe('RecipeService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('saveRecipesToDB', () => {
    it('should use bulkWrite instead of findOrCreate for multiple recipes', async () => {
      const recipes = [
        { title: 'Recipe 1', source: 'spoonacular', externalId: '123' },
        { title: 'Recipe 2', source: 'spoonacular', externalId: '456' },
        { title: 'Recipe 3', source: 'custom' } // No external ID -> insertOne
      ];

      mockValidateSync.mockReturnValue(null); // Valid

      // Mock toObject to return data without virtuals but we need to simulate
      // what happens inside the loop.
      // The implementation will call new Recipe(r).toObject({ virtuals: false })
      // We need our mockToObject to return a clean object.
      mockToObject.mockImplementation(function() {
        return { ...this }; // Return the data passed to constructor
      });

      await recipeService.saveRecipesToDB(recipes);

      // Verify bulkWrite is called ONCE
      expect(mockBulkWrite).toHaveBeenCalledTimes(1);

      const bulkOps = mockBulkWrite.mock.calls[0][0];
      expect(bulkOps).toHaveLength(3);

      // Check first recipe (update with upsert)
      expect(bulkOps[0]).toHaveProperty('updateOne');
      expect(bulkOps[0].updateOne.filter).toEqual({ source: 'spoonacular', externalId: '123' });
      expect(bulkOps[0].updateOne.upsert).toBe(true);
      expect(bulkOps[0].updateOne.update.$set).toHaveProperty('lastFetched');
      expect(bulkOps[0].updateOne.update.$set).toHaveProperty('updatedAt');
      // Should NOT have lastFetched or updatedAt in $setOnInsert
      expect(bulkOps[0].updateOne.update.$setOnInsert).not.toHaveProperty('lastFetched');
      expect(bulkOps[0].updateOne.update.$setOnInsert).not.toHaveProperty('updatedAt');
      // Should have createdAt in $setOnInsert
      expect(bulkOps[0].updateOne.update.$setOnInsert).toHaveProperty('createdAt');

      // Check third recipe (insert)
      expect(bulkOps[2]).toHaveProperty('insertOne');
      expect(bulkOps[2].insertOne.document).toEqual(expect.objectContaining({ title: 'Recipe 3' }));
      // Should have timestamps
      expect(bulkOps[2].insertOne.document).toHaveProperty('createdAt');
      expect(bulkOps[2].insertOne.document).toHaveProperty('updatedAt');
    });
  });
});
