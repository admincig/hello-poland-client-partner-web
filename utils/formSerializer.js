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
    return {};
  }

  return Object.entries(series).reduce((acc, [key, value], idx) => {
    if (key.indexOf('.') !== -1) {
      const keys = key.split('.');
      const localKey = keys.shift();

      let localValue = {};

      if (keys[0].indexOf('[') !== -1) {
        let serializedKey = keys.shift();
        let nextPath = keys.join('.');
        let localValues = [];
        const isDeeper = !!nextPath.length;

        serializedKey = serializedKey.substring(0, serializedKey.indexOf('['));

        if (!nextPath.length) {
          nextPath = serializedKey;
        }

        if (acc[localKey] && acc[localKey][serializedKey]) {
          localValues = acc[localKey][serializedKey];
        }

        let deserializedData = null;

        if (isDeeper) {
          deserializedData = [deserialize({ [nextPath]: value })];
        } else {
          deserializedData = [...Object.values(deserialize({ [nextPath]: value }))];
        }

        localValue = {
          [serializedKey]: [
            ...localValues,
            ...deserializedData,
          ],
        };
      } else {
        const nextPath = keys.join('.');

        localValue = deserialize({ [nextPath]: value });
      }

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
