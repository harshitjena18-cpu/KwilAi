/**
 * Escapes characters that have special meaning in regular expressions.
 * Use this to sanitize user input before passing it to MongoDB $regex.
 * @param {string} string
 * @returns {string}
 */
export function escapeRegExp(string) {
  if (!string || typeof string !== 'string') return '';
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export default {
  escapeRegExp
};
