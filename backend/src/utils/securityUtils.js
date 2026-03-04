/**
 * Escapes characters in a string so it can be safely used in a regular expression.
 * @param {string} string - The string to escape
 * @returns {string} - The escaped string
 */
export const escapeRegExp = (string) => {
  if (typeof string !== 'string') return '';
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
