/**
 * Checks if argument is an Plain Object
 *
 * @method
 * @param o
 * @return {Boolean}
 */
export default function isObject(o) {
  return o !== null && typeof o === 'object' && Array.isArray(o) === false;
}
