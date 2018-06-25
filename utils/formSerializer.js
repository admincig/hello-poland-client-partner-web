export function isArray(a) {
  return Array.isArray(a);
}

export function isObject(o) {
  return o !== null && typeof o === 'object' && Array.isArray(o) === false;
}

/**
 * Normalizes form values.
 *
 * @method
 * @param {String} key - schema key
 * @param {Object} data - form data
 * @param {*} value - default schema value
 * @return {*}
 */
export function normalizeValue(key, data, value) {
  if (data && data[key] !== undefined && !Number.isNaN(data[key])) {
    return data[key];
  } else if (value !== undefined && !Number.isNaN(value)) {
    return value;
  }

  return null;
}

/**
 * Serializes form schema to React's state.
 *
 * @method
 * @param {Object[]} schema - form field's layout
 * @param {Object} [data] - form data
 * @param {String} [path] - object path
 * @return {*}
 */
export const serialize = (schema, data, path = '') => {
  if (!isArray(schema)) {
    // console.error('Serialization failed. Schema is not an array. Returning fallback value');

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

    if (type === 'Enum' || type === 'Map') {
      const { schema: localSchema } = item;
      const localData = currentValue || [];

      const kv = localData.reduce((localAcc, localValue, localIndex) => {
        let localKV = {};

        if (type === 'Enum') {
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
};

export const deserialize = (series) => {
  if (!isObject(series)) {
    // console.error(`Deserialization failed. Argument is not an plain object.
    //  Returning fallback value`);

    return {};
  }

  return Object.entries(series).reduce((acc, [key, value], idx) => {
    console.log('>', idx, key, value, acc);
    if (key.indexOf('.') !== -1) {
      const keys = key.split('.');
      const localKey = keys.shift();
      console.log('.>', idx, localKey, value, 'n>', keys.join('.'));

      let localValue = {};

      if (keys[0].indexOf('[') !== -1) {
        let serializedKey = keys.shift();
        let nextPath = keys.join('.');
        let localValues = [];

        serializedKey = serializedKey.substring(0, serializedKey.indexOf('['));

        if (!nextPath.length) {
          nextPath = serializedKey;
        }

        if (acc[localKey] && acc[localKey][serializedKey]) {
          console.log('//>', acc[localKey]);
          localValues = acc[localKey][serializedKey];
        }

        console.log('/>', serializedKey, localValues, nextPath);
        console.log('des', deserialize({ [nextPath]: value }));
        localValue = {
          [serializedKey]: [
            ...localValues,
            ...Object.values(deserialize({ [nextPath]: value })),
          ],
        };
      } else {
        const nextPath = keys.join('.');

        console.log('\\>', localKey, value, 'n>', nextPath);
        localValue = deserialize({ [nextPath]: value });
      }

      console.log(':>', localValue);
      return {
        ...acc,
        [localKey]: {
          ...acc[localKey],
          ...localValue,
        },
      };
    }

    if (key.indexOf('[') !== -1) {
      const localKey = key.substring(0, key.indexOf('['));
      let localValues = [];

      if (acc[localKey]) {
        localValues = acc[localKey];
      }

      // console.log('[>', idx, localKey, value);
      return {
        ...acc,
        [localKey]: [
          ...localValues,
          value === undefined || Number.isNaN(value) ? null : value,
        ],
      };
    }

    return {
      ...acc,
      [key]: value === undefined || Number.isNaN(value) ? null : value,
    };
  }, {});
};
