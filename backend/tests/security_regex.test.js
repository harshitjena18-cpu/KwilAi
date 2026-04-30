import { escapeRegExp } from '../src/utils/securityUtils.js';

describe('Security Regex Utility', () => {
  test('should escape all regex special characters', () => {
    const maliciousInput = '.*+?^${}()|[]\\';
    const escaped = escapeRegExp(maliciousInput);
    expect(escaped).toBe('\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\');
  });

  test('should not alter normal strings', () => {
    const normalInput = 'chicken';
    const escaped = escapeRegExp(normalInput);
    expect(escaped).toBe('chicken');
  });

  test('should prevent ReDoS logic in literal regex matching', () => {
    const redosPattern = '(((.*)*)*)*';
    const escaped = escapeRegExp(redosPattern);

    // Evaluate if evaluating this against a string is treated as literals
    const regex = new RegExp(`^${escaped}$`);
    expect(regex.test('(((.*)*)*)*')).toBe(true);
    expect(regex.test('something else')).toBe(false);
  });
});
