import { jest } from '@jest/globals';
import { escapeRegExp } from '../src/utils/securityUtils.js';

describe('Security Regex Utilities', () => {
  describe('escapeRegExp', () => {
    it('should escape special regex characters', () => {
      const input = '.*+?^${}()|[]\\';
      const expected = '\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\';
      expect(escapeRegExp(input)).toBe(expected);
    });

    it('should handle normal strings correctly', () => {
      expect(escapeRegExp('tomato')).toBe('tomato');
      expect(escapeRegExp('chicken breast')).toBe('chicken breast');
    });

    it('should handle non-string inputs safely', () => {
      expect(escapeRegExp(null)).toBe('');
      expect(escapeRegExp(undefined)).toBe('');
      expect(escapeRegExp(123)).toBe('');
      expect(escapeRegExp({})).toBe('');
    });
  });
});
