/**
 * Security utility functions
 */

/**
 * Escapes a string for use in a regular expression.
 * Includes type validation to prevent Type Confusion DoS.
 * @param {string} string - The string to escape
 * @returns {string} - Escaped string safe for Regex use
 */
export const escapeRegExp = (string) => {
  if (typeof string !== 'string') return '';
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
