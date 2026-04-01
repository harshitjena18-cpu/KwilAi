/**
 * Escapes a string to be used safely within a regular expression.
 * Validates input type to prevent Type Confusion Denial of Service.
 * @param {string} string The input string to escape
 * @returns {string} The escaped string, or empty string if input is invalid
 */
export const escapeRegExp = (string) => {
  if (typeof string !== 'string') {
    return '';
  }
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
};
