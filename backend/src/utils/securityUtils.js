/**
 * Escapes special characters in a string for use in a regular expression.
 * This prevents ReDoS and NoSQL injection when user input is used in $regex or new RegExp().
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
