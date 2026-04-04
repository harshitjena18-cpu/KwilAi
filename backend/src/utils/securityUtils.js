/**
 * Escapes special characters in a string for use in a Regular Expression.
 * Validates input to prevent ReDoS via Express Parameter Type Confusion.
 *
 * @param {string} string The string to escape.
 * @returns {string} The escaped string.
 */
export function escapeRegExp(string) {
  if (typeof string !== 'string') return '';
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
