/**
 * Utility functions for security
 */

/**
 * Escapes a string to be safely used in a regular expression.
 * This prevents Regular Expression Denial of Service (ReDoS) and NoSQL injection
 * when user input is used to construct a regular expression.
 *
 * @param {string} string - The string to escape
 * @returns {string} The escaped string
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
