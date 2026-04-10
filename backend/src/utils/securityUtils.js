/**
 * Utility functions for security and input validation.
 */

/**
 * Escapes a string to be safely used within a Regular Expression.
 * Mitigates Regular Expression Denial of Service (ReDoS) and NoSQL Injection.
 *
 * @param {string} string - The string to escape.
 * @returns {string} - The escaped string, or an empty string if input is invalid.
 */
export const escapeRegExp = (string) => {
  if (typeof string !== 'string') {
    return '';
  }
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
};

export default {
  escapeRegExp
};
