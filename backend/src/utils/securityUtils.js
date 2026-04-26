/**
 * Security utilities
 */

/**
 * Escapes special characters in a string so it can be safely used in a RegExp
 * or MongoDB $regex query. This prevents ReDoS and NoSQL injection.
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
