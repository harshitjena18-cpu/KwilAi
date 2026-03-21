/**
 * Utility functions for security
 */

/**
 * Escapes a string so it can be safely used in a regular expression.
 * Prevents ReDoS and NoSQL injection attacks via user-controlled regexes.
 * @param {string} string The string to escape.
 * @returns {string} The escaped string.
 */
export const escapeRegExp = (string) => {
  if (typeof string !== 'string') return '';
  // $& means the whole matched string
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
