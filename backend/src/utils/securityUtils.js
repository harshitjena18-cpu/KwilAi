/**
 * Utility functions for security
 */

/**
 * Escapes a string to be safely used within a regular expression.
 * This prevents Regular Expression Denial of Service (ReDoS) and NoSQL injection vulnerabilities
 * when user-controlled inputs are passed into MongoDB $regex operators or new RegExp().
 *
 * @param {string} string The string to escape
 * @returns {string} The escaped string safely formatted for regex use
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
