/**
 * Escapes a string for use in a regular expression.
 * Prevents ReDoS (Regular Expression Denial of Service) and NoSQL Injection
 * when using user input in a database regex query.
 *
 * @param {string} string - The string to escape
 * @returns {string} The escaped string
 */
export const escapeRegExp = (string) => {
  if (typeof string !== 'string') return '';
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
