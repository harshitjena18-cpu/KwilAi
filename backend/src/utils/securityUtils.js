/**
 * Escapes special characters in a string for use in a regular expression.
 * This prevents ReDoS (Regular Expression Denial of Service) and regex injection.
 * @param {string} string - The string to escape
 * @returns {string} The escaped string
 */
export const escapeRegExp = (string) => {
  if (typeof string !== 'string') return '';
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
};