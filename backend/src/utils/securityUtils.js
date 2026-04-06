/**
 * Escapes special characters in a string for use in a regular expression.
 * This prevents Regular Expression Denial of Service (ReDoS) and NoSQL injection
 * when user input is used dynamically in a RegExp or MongoDB $regex query.
 *
 * @param {string} string - The string to escape.
 * @returns {string} The escaped string.
 */
export const escapeRegExp = (string) => {
  if (typeof string !== 'string') {
    return '';
  }
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
};
