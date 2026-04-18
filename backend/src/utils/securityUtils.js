/**
 * Escapes characters in a string that have special meaning in regular expressions.
 * Prevents ReDoS and NoSQL Injection via regex operators.
 * @param {string} string - The string to escape
 * @returns {string} - The escaped string
 */
export const escapeRegExp = (string) => {
  if (typeof string !== 'string') return '';
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
