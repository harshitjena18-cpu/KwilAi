/**
 * Escapes special characters in a string for use in a regular expression.
 * This prevents ReDoS and NoSQL Injection when user input is passed into MongoDB $regex or new RegExp().
 *
 * @param {string} string - The user input string to escape.
 * @returns {string} The escaped string safe for regex usage.
 */
export const escapeRegExp = (string) => {
  if (typeof string !== 'string') return '';
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
};
