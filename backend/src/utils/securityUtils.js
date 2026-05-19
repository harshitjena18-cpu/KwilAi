/**
 * Escapes special characters in a string to be used in a regular expression.
 * Helps prevent Regular Expression Denial of Service (ReDoS) and NoSQL injection
 * when user input is passed directly to $regex or new RegExp().
 *
 * @param {string} string - The user input string to escape
 * @returns {string} The escaped string safe for regex constructors
 */
export const escapeRegExp = (string) => {
  if (typeof string !== 'string') return '';
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
