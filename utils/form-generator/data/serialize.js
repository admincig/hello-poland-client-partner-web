import isArray from '../utils/isArray';
import normalizeValue from '../utils/normalizeValue';

/**
 * Serializes form schema to React's state.
 *
 * @method
 * @param {Object[]} schema - form field's layout
 * @param {Object} [data] - form data
 * @param {String} [path] - object path
 * @return {*}
 */
export default function serialize(schema, data, path = '') {
  if (!isArray(schema)) {
    return {};
  }

  return schema.reduce((acc, item) => {
    const { key, type, value } = item;
    const currentPath = path.length ? `${path}.${key}` : key;
    const currentValue = normalizeValue(key, data, value);

    if (type === 'Collection') {
      const { schema: localSchema } = item;
      const localData = currentValue || {};

      return {
        ...acc,
        ...serialize(localSchema, localData, currentPath),
      };
    }

    if (type === 'List' || type === 'Map') {
      const { schema: localSchema } = item;
      const localData = currentValue || [];

      const kv = localData.reduce((localAcc, localValue, localIndex) => {
        let localKV = {};

        if (type === 'List') {
          localKV[`${currentPath}[${localIndex}]`] = normalizeValue(key, localData, localValue);
        } else {
          localKV = serialize(localSchema, localValue, `${currentPath}[${localIndex}]`);
        }

        return {
          ...localAcc,
          ...localKV,
        };
      }, {});

      return {
        ...acc,
        ...kv,
      };
    }

    return {
      ...acc,
      [currentPath]: currentValue,
    };
  }, {});
}
