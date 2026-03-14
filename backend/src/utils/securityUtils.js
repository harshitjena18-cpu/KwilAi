/**
 * Utility functions for security
 */

/**
 * Escapes a string to be used in a regular expression, preventing ReDoS and logic errors.
 *
 * @param {string} string The string to escape
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
