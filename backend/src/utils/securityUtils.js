/**
 * Escapes characters that have special meaning in regular expressions.
 * Prevents Regular Expression Denial of Service (ReDoS) and NoSQL injection
 * when user input is used in new RegExp() or MongoDB $regex operators.
 *
 * @param {string} string - The user input string to escape
 * @returns {string} - The escaped string, safe for regex use
 */
export const escapeRegExp = (string) => {
  // Validate input type to prevent Type Confusion DoS
  if (typeof string !== 'string') {
    return '';
  }
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
