import isObject from '../utils/isObject';

export default function deserialize(series) {
  if (!isObject(series)) {
    return {};
  }

  return Object.entries(series).reduce((acc, [key, value]) => {
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
}
