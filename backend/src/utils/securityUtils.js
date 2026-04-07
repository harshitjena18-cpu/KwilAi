/**
 * Escapes special characters in a string to be used safely in a RegExp.
 * Also validates type to prevent DoS via Type Confusion.
 * @param {string} string - The string to escape
 * @returns {string} The escaped string
 */
export const escapeRegExp = (string) => {
  if (typeof string !== 'string') {
    return '';
  }
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
