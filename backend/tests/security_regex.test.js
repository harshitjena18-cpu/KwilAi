import { jest } from '@jest/globals';
import { escapeRegExp } from '../src/utils/securityUtils.js';
import Recipe from '../src/models/Recipe.js';
import Pantry from '../src/models/Pantry.js';

describe('escapeRegExp utility', () => {
  it('should escape special regex characters', () => {
    const maliciousInput = 'hello.*+?^${}()|[]\\\\world';
    const escaped = escapeRegExp(maliciousInput);

    // Attempting to compile the unescaped string might throw or match incorrectly.
    // The escaped string should match the literal input.
    const regex = new RegExp('^' + escaped + '$');
    expect(regex.test(maliciousInput)).toBe(true);
  });
});

describe('Model integration with escapeRegExp', () => {
  it('should correctly escape ingredients in Recipe.searchByIngredients query', () => {
    const ingredientNames = ['salt.*', 'pepper+'];
    // Spy on find
    const findSpy = jest.spyOn(Recipe, 'find').mockImplementation(() => ({
      sort: () => ({ limit: () => [] })
    }));

    Recipe.searchByIngredients(ingredientNames);

    // Extract the executed query
    expect(findSpy).toHaveBeenCalled();
    const queryArg = findSpy.mock.calls[0][0];
    const regexes = queryArg['ingredients.name'].$in;

    expect(regexes[0].source).toBe('salt\\.\\*');
    expect(regexes[1].source).toBe('pepper\\+');

    findSpy.mockRestore();
  });

  it('should correctly escape searchTerm in Pantry.searchByName query', () => {
    const searchTerm = 'tomato(red)';
    const findSpy = jest.spyOn(Pantry, 'find').mockImplementation(() => ({
      sort: () => []
    }));

    Pantry.searchByName('some_user_id', searchTerm);

    expect(findSpy).toHaveBeenCalled();
    const queryArg = findSpy.mock.calls[0][0];

    expect(queryArg.ingredientName.$regex).toBe('tomato\\(red\\)');

    findSpy.mockRestore();
  });
});
