import { jest } from '@jest/globals';
import { escapeRegExp } from '../src/utils/securityUtils.js';

describe('securityUtils', () => {
  describe('escapeRegExp', () => {
    it('should escape regex special characters', () => {
      expect(escapeRegExp('test.*')).toBe('test\\.\\*');
      expect(escapeRegExp('^test$')).toBe('\\^test\\$');
      expect(escapeRegExp('test[a-z]')).toBe('test\\[a-z\\]');
    });

    it('should handle non-string inputs safely', () => {
      expect(escapeRegExp(123)).toBe('');
      expect(escapeRegExp(null)).toBe('');
      expect(escapeRegExp(undefined)).toBe('');
      expect(escapeRegExp({})).toBe('');
      expect(escapeRegExp([])).toBe('');
    });
  });
});
