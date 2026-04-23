import { jest } from '@jest/globals';
import { escapeRegExp } from '../src/utils/securityUtils.js';

describe('Security Regex Utility', () => {
  test('should escape special regex characters', () => {
    const input = 'test.*+?^${}()|[]\\';
    const expected = 'test\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\';
    expect(escapeRegExp(input)).toBe(expected);
  });

  test('should return empty string for non-string input', () => {
    expect(escapeRegExp(null)).toBe('');
    expect(escapeRegExp(undefined)).toBe('');
    expect(escapeRegExp(123)).toBe('');
    expect(escapeRegExp({})).toBe('');
  });

  test('should return original string if no special characters exist', () => {
    expect(escapeRegExp('test123abc')).toBe('test123abc');
  });
});
