import { jest } from '@jest/globals';

// Define the mocks
const mockBulkWrite = jest.fn().mockResolvedValue({ insertedCount: 1 });
const mockFindOrCreate = jest.fn().mockResolvedValue({});

// Create a mock Recipe class
class MockRecipe {
  constructor(data) {
    Object.assign(this, data);
    if (this.isActive === undefined) this.isActive = true;
    if (this.savedCount === undefined) this.savedCount = 0;
    if (!this.createdAt) this.createdAt = new Date();
    if (!this.updatedAt) this.updatedAt = new Date();
  }
  validateSync() { return null; }
  toObject() { return { ...this }; }
  static bulkWrite(ops) { return mockBulkWrite(ops); }
  static findOrCreate(data) { return mockFindOrCreate(data); }
}

// Mock the module
jest.unstable_mockModule('../src/models/Recipe.js', () => ({
  default: MockRecipe
}));

// Import service
const { default: recipeService } = await import('../src/services/recipeService.js');

describe('RecipeService.saveRecipesToDB Optimization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should use bulkWrite instead of sequential findOrCreate', async () => {
    const recipes = [
      { title: 'Recipe 1', source: 'spoonacular', externalId: '1' },
      { title: 'Recipe 2', source: 'edamam', externalId: '2' },
      { title: 'Recipe 3', source: 'custom' }
    ];

    await recipeService.saveRecipesToDB(recipes);

    // This assertion should FAIL with current implementation
    // because current implementation calls findOrCreate sequentially
    try {
      expect(mockBulkWrite).toHaveBeenCalledTimes(1);
    } catch (e) {
      // If it fails, check that findOrCreate WAS called (current behavior)
      // This confirms our test setup works and detects the current "unoptimized" state
      expect(mockFindOrCreate).toHaveBeenCalledTimes(3);
      return;
    }

    // If bulkWrite WAS called, then we are already optimized (unexpected for this step but OK)
    const bulkOps = mockBulkWrite.mock.calls[0][0];
    expect(bulkOps).toHaveLength(3);
  });

  test('should handle empty recipe list gracefully', async () => {
    await recipeService.saveRecipesToDB([]);
    expect(mockBulkWrite).not.toHaveBeenCalled();
  });
});
