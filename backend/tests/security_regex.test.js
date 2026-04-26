import { jest } from '@jest/globals';
import { escapeRegExp } from '../src/utils/securityUtils.js';

describe('Security Utils - escapeRegExp', () => {
  it('should escape special regex characters', () => {
    const specialChars = '.*+?^${}()|[]\\';
    const escaped = escapeRegExp(specialChars);

    // Each character should be preceded by a backslash
    expect(escaped).toBe('\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\');

    // The escaped string should be safe to use in a RegExp
    const regex = new RegExp(escaped);
    expect(regex.test(specialChars)).toBe(true);
  });

  it('should not modify alphanumeric strings', () => {
    const alphanumeric = 'HelloWorld123';
    expect(escapeRegExp(alphanumeric)).toBe(alphanumeric);
  });

  it('should return an empty string for non-string inputs', () => {
    expect(escapeRegExp(null)).toBe('');
    expect(escapeRegExp(undefined)).toBe('');
    expect(escapeRegExp(123)).toBe('');
    expect(escapeRegExp({})).toBe('');
    expect(escapeRegExp([])).toBe('');
  });

  it('should prevent ReDoS payloads from being interpreted as regex operators', () => {
    // A typical ReDoS payload like a huge sequence of optional characters
    const payload = '(a+)+$';
    const escaped = escapeRegExp(payload);

    expect(escaped).toBe('\\(a\\+\\)\\+\\$');

    // When used in a RegExp, it should match the literal string, not act as a regex
    const regex = new RegExp(escaped);
    expect(regex.test('(a+)+$')).toBe(true);
    expect(regex.test('aaaaa')).toBe(false);
  });
});
