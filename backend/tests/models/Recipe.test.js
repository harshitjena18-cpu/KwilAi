import { jest } from '@jest/globals';
import Recipe from '../../src/models/Recipe.js';

describe('Recipe Model', () => {
  describe('indexes', () => {
    it('should have an index on ingredients.name', () => {
      const indexes = Recipe.schema.indexes();
      // indexes is an array of [fields, options]
      // e.g. [[{ title: 'text', summary: 'text' }, { background: true }]]

      const ingredientIndex = indexes.find(idx => {
        const fields = idx[0];
        return fields['ingredients.name'] === 1;
      });

      expect(ingredientIndex).toBeDefined();
    });
  });
});
