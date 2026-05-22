/**
 * Escapes string for safe use in RegExp to prevent ReDoS and NoSQL Injection
 * @param {string} string
 * @returns {string}
 */
export function escapeRegExp(string) {
  if (typeof string !== 'string') return '';
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export default { escapeRegExp };