/**
 * Utility functions for security
 */

/**
 * Escapes special characters in a string to be used in a regular expression.
 * Prevents ReDoS (Regular Expression Denial of Service) and NoSQL injection
 * when user input is used to dynamically construct a regex.
 *
 * @param {string} string - The string to escape
 * @returns {string} The escaped string
 */
export const escapeRegExp = (string) => {
  if (typeof string !== 'string') return '';
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export default {
  escapeRegExp
};
