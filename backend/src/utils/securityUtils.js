/**
 * Security utilities
 */

/**
 * Escapes a string to be used safely within a regular expression.
 * This prevents Regular Expression Denial of Service (ReDoS) and NoSQL injection
 * when user-controlled input is passed to new RegExp() or MongoDB $regex operators.
 *
 * @param {string} string - The user input string to escape
 * @returns {string} The escaped string safe for regex
 */
export const escapeRegExp = (string) => {
  if (typeof string !== 'string') return '';
  // $& means the whole matched string
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
