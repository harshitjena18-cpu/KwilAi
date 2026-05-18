/**
 * Security utilities
 */

/**
 * Escapes a string so it can be safely used in a regular expression.
 * Mitigates Regular Expression Denial of Service (ReDoS) and
 * unintended matching patterns.
 *
 * @param {string} string - The string to escape
 * @returns {string} - The escaped string
 */
export const escapeRegExp = (string) => {
  if (typeof string !== 'string') {
    return '';
  }
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
};

export default {
  escapeRegExp
};
