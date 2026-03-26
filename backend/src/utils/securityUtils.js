/**
 * Security utilities
 */

/**
 * Escapes a string so it can be safely used within a regular expression.
 * This prevents Regular Expression Denial of Service (ReDoS) and NoSQL injection attacks.
 *
 * @param {string} string - The string to escape.
 * @returns {string} The escaped string.
 */
export const escapeRegExp = (string) => {
  if (typeof string !== 'string') {
    return '';
  }
  // Escape all special regex characters: - [ ] / { } ( ) * + ? . \ ^ $ |
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export default {
  escapeRegExp
};
