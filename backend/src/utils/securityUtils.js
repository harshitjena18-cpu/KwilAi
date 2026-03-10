/**
 * Escapes characters with special meaning in regular expressions to prevent
 * Regular Expression Denial of Service (ReDoS) and NoSQL injection attacks.
 *
 * @param {string} string - The user input string to escape
 * @returns {string} The escaped string safe for use in RegExp
 */
export const escapeRegExp = (string) => {
  if (typeof string !== 'string') return string;
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
};

export default {
  escapeRegExp
};
