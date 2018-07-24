/**
 * Normalizes form values.
 *
 * @method
 * @param {String} key - schema key
 * @param {Object} data - form data
 * @param {*} value - default schema value
 * @return {*}
 */
export default function normalizeValue(key, data, value) {
  if (data && data[key] !== undefined && !Number.isNaN(data[key])) {
    return data[key];
  } else if (value !== undefined && !Number.isNaN(value)) {
    return value;
  }

  return null;
}
