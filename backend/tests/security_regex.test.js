import { jest } from '@jest/globals';
import { escapeRegExp } from '../src/utils/securityUtils.js';

describe('Security Utilities', () => {
  describe('escapeRegExp', () => {
    test('should escape regex special characters', () => {
      const maliciousInput = '^(a+)+$';
      const escapedInput = escapeRegExp(maliciousInput);
      expect(escapedInput).toBe('\\^\\(a\\+\\)\\+\\$');
    });

    test('should handle non-string inputs safely', () => {
      expect(escapeRegExp(null)).toBe('');
      expect(escapeRegExp(undefined)).toBe('');
      expect(escapeRegExp({})).toBe('');
    });
  });
});