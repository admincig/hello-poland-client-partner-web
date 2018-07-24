import isObject from '../utils/isObject';

export default function populate(data, values, depth = 0) {
  if (!isObject(data)) {
    throw new TypeError('Serialized data is not an object');
  }

  return Object.entries(data).reduce((acc, [key, value]) => {
    let nextValue = value;

    if (values != null) {
      if (key.indexOf('.') !== -1) {
        const keys = key.split('.');
        const currentKey = keys.shift();

        if (isObject(values[currentKey])) {
          const d = {
            [keys.join('.')]: value,
          };

          const currentValue = Object.values(populate(d, values[currentKey], depth + 1))[0];

          if (currentValue !== undefined) {
            nextValue = currentValue;
          }
        }
      } else if (values[key] !== undefined) {
        nextValue = values[key];
      }
    }

    return {
      ...acc,
      [key]: nextValue,
    };
  }, {});
}
