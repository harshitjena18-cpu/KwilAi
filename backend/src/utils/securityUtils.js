/**
 * Escapes a string for use in a regular expression to prevent ReDoS attacks.
 * @param {string} string - The string to escape.
 * @returns {string} The escaped string.
 */
export const escapeRegExp = (string) => {
  if (typeof string !== 'string') return '';
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
