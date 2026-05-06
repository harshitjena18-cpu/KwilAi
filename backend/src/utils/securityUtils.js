/**
 * Escapes special characters in a string to be used in a regular expression.
 * This prevents ReDoS and NoSQL Injection when user input is used in MongoDB regex queries.
 * @param {string} string - The user-supplied string to escape.
 * @returns {string} The escaped string safe for regex.
 */
export const escapeRegExp = (string) => {
  if (typeof string !== 'string') return '';
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
};
