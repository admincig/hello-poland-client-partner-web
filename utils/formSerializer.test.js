import {
  deserialize,
  normalizeValue,
  serialize,
} from './formSerializer';

describe('Normalizing value', () => {
  it('should return null if normalization failed', () => {
    expect(normalizeValue()).toBeNull();
  });

  it('should return data value if it\'s present', () => {
    const data = [
      { value: false },
      { value: null },
      { value: undefined },
      { value: 0 },
      { value: Number.NaN },
      { value: '' },
    ];

    expect(normalizeValue('value', data[0])).toEqual(false);
    expect(normalizeValue('value', data[1])).toEqual(null);
    expect(normalizeValue('value', data[2])).toEqual(null);
    expect(normalizeValue('value', data[3])).toEqual(0);
    expect(normalizeValue('value', data[4])).toEqual(null);
    expect(normalizeValue('value', data[5])).toEqual('');
  });

  it('should return default value if it was defined and not found in VO', () => {
    const data = { value: '' };

    expect(normalizeValue('value', data, 1)).toEqual('');
    expect(normalizeValue('value', {}, undefined)).toEqual(null);
    expect(normalizeValue('value', {}, Number.NaN)).toEqual(null);
    expect(normalizeValue('value', {}, 1)).toEqual(1);
  });
});

describe('Primitive serialization', () => {
  it('should return empty object if no schema was provided', () => {
    const expectedValue = {};

    expect(serialize()).toEqual(expectedValue);
  });

  it('should return empty object if schema was not an array', () => {
    const expectedValue = {};

    expect(serialize(null)).toEqual(expectedValue);
    expect(serialize(undefined)).toEqual(expectedValue);
    expect(serialize({})).toEqual(expectedValue);
    expect(serialize(1)).toEqual(expectedValue);
    expect(serialize(Number.NaN)).toEqual(expectedValue);
  });

  it('should return serialized data with null values if they were not defined or present in VO', () => {
    const schema = [
      {
        key: 'foo',
      },
    ];
    const expectedValue = {
      foo: null,
    };

    expect(serialize(schema)).toEqual(expectedValue);
    expect(serialize(schema, {})).toEqual(expectedValue);
  });

  it('should return serialized data with schema values if VO key was not found', () => {
    const schema = [
      {
        key: 'foo',
        value: 'schemaValue',
      },
    ];
    const expectedValue = {
      foo: 'schemaValue',
    };

    expect(serialize(schema, {})).toEqual(expectedValue);
  });

  it('should return serialized data with VO value if it\'s key was found', () => {
    const schema = [
      {
        key: 'foo',
        value: 'schemaValue',
      },
    ];
    const data = {
      foo: 'dataValue',
    };
    const expectedValue = {
      ...data,
    };

    expect(serialize(schema, data)).toEqual(expectedValue);
  });

  it('should properly handle falsy values in schema definition', () => {
    const schema = [
      { key: 'a', value: false },
      { key: 'b', value: null },
      { key: 'c', value: undefined },
      { key: 'd', value: 0 },
      { key: 'e', value: Number.NaN },
      { key: 'f', value: '' },
    ];
    const expectedValue = schema.reduce((acc, { key, value }) => ({
      ...acc,
      [key]: value === undefined || Number.isNaN(value) ? null : value,
    }), {});

    expect(serialize(schema)).toEqual(expectedValue);
  });

  it('should properly handle falsy values in VO', () => {
    const schema = [
      { key: 'a', value: false },
      { key: 'b', value: null },
      { key: 'c', value: undefined },
      { key: 'd', value: 0 },
      { key: 'e', value: Number.NaN },
      { key: 'f', value: '' },
    ];
    const data = [...schema];
    const expectedValue = schema.reduce((acc, { key, value }) => ({
      ...acc,
      [key]: value === undefined || Number.isNaN(value) ? null : value,
    }), {});

    expect(serialize(schema, data)).toEqual(expectedValue);
  });
});

describe('Complex serialization', () => {
  describe('Collections (nested objects)', () => {
    it('should properly serialize schemas with no values', () => {
      const schema = [
        {
          key: 'a1',
          type: 'Collection',
          schema: [
            { key: 'b1' },
          ],
        },
      ];
      const expectedValue = {
        'a1.b1': null,
      };

      expect(serialize(schema)).toEqual(expectedValue);

      schema.push({
        key: 'a2',
        type: 'Collection',
        schema: [
          {
            key: 'b2',
            type: 'Collection',
            schema: [
              { key: 'c2' },
            ],
          },
        ],
      });
      expectedValue['a2.b2.c2'] = null;

      expect(serialize(schema)).toEqual(expectedValue);
    });

    it('should properly serialize schemas with default values', () => {
      const schema = [
        {
          key: 'a1',
          type: 'Collection',
          schema: [
            {
              key: 'b1',
              value: true,
            },
          ],
        },
      ];
      const expectedValue = {
        'a1.b1': true,
      };

      expect(serialize(schema)).toEqual(expectedValue);
    });

    it('should properly serialize schemas with VO data', () => {
      const schema = [
        {
          key: 'a1',
          type: 'Collection',
          schema: [
            { key: 'b1' },
          ],
        },
      ];
      const data = {
        a1: {
          b1: true,
        },
      };
      const expectedValue = {
        'a1.b1': true,
      };

      expect(serialize(schema, data)).toEqual(expectedValue);

      schema.push({
        key: 'a2',
        value: 1,
        type: 'Collection',
        schema: [
          {
            key: 'b2',
            type: 'Collection',
            schema: [
              { key: 'c2' },
            ],
          },
        ],
      });
      data.a2 = {
        b2: {
          c2: 3,
        },
      };
      expectedValue['a2.b2.c2'] = 3;

      expect(serialize(schema, data)).toEqual(expectedValue);
    });
  });

  describe('Enums (arrays with primitive values)', () => {
    it('should properly serialize schemas with no values', () => {
      const schema = [
        {
          key: 'a',
          type: 'Enum',
          schema: {},
        },
      ];
      const expectedValue = {};

      expect(serialize(schema)).toEqual(expectedValue);
    });

    it('should properly serialize schemas with default values', () => {
      const schema = [
        {
          key: 'a',
          value: [
            false,
            null,
            undefined,
            0,
            Number.NaN,
            '',
          ],
          type: 'Enum',
          schema: {},
        },
      ];
      const expectedValue = schema[0].value.reduce((acc, value, index) => ({
        ...acc,
        [`${schema[0].key}[${index}]`]: value === undefined || Number.isNaN(value) ? null : value,
      }), {});

      expect(serialize(schema)).toEqual(expectedValue);
    });

    it('should properly serialize schemas with VO data', () => {
      const schema = [
        {
          key: 'a',
          value: [
            1,
            2,
            3,
            4,
            5,
            6,
          ],
          type: 'Enum',
          schema: {},
        },
      ];
      const data = {
        a: [
          'foo',
          'bar',
        ],
      };
      const expectedValue = data.a.reduce((acc, value, index) => ({
        ...acc,
        [`${schema[0].key}[${index}]`]: value === undefined || Number.isNaN(value) ? null : value,
      }), {});

      expect(serialize(schema, data)).toEqual(expectedValue);
    });
  });

  describe('Maps (arrays with objects)', () => {
    it('should properly serialize schemas with no values', () => {
      const schema = [
        {
          key: 'a',
          type: 'Map',
          schema: [
            { key: 'b' },
          ],
        },
      ];
      const expectedValue = {};

      expect(serialize(schema)).toEqual(expectedValue);
    });

    it('should properly serialize schemas with default values', () => {
      const schema = [
        {
          key: 'a',
          type: 'Map',
          value: [
            {
              b: false, c: null, d: undefined, e: 0, f: Number.NaN, g: '',
            },
          ],
          schema: [
            { key: 'b' },
            { key: 'c' },
            { key: 'd' },
            { key: 'e' },
            { key: 'f' },
            { key: 'g' },
          ],
        },
      ];
      const expectedValue = schema[0].value.reduce((acc, item, index) => ({
        ...acc,
        ...Object.entries(item).reduce((itemAcc, [key, value]) => ({
          ...itemAcc,
          [`${schema[0].key}[${index}].${key}`]: value === undefined || Number.isNaN(value) ? null : value,
        }), {}),
      }), {});

      expect(serialize(schema)).toEqual(expectedValue);
    });

    it('should properly serialize schemas with VO data', () => {
      const schema = [
        {
          key: 'a',
          type: 'Map',
          value: [
            {
              b: 1, c: 2, d: 3, e: 4, f: 5, g: 6,
            },
          ],
          schema: [
            { key: 'b' },
            { key: 'c' },
            { key: 'd' },
            { key: 'e' },
            { key: 'f' },
            { key: 'g' },
          ],
        },
      ];
      const data = {
        a: [
          {
            b: false, c: null, d: undefined, e: 0, f: Number.NaN, g: '',
          },
        ],
      };
      const expectedValue = data.a.reduce((acc, item, index) => ({
        ...acc,
        ...Object.entries(item).reduce((itemAcc, [key, value]) => ({
          ...itemAcc,
          [`${schema[0].key}[${index}].${key}`]: value === undefined || Number.isNaN(value) ? null : value,
        }), {}),
      }), {});

      expect(serialize(schema, data)).toEqual(expectedValue);
    });
  });
});

describe('Primitive deserialization', () => {
  it('should return empty object if there was nothing to serialize', () => {
    const expectedValue = {};
    const func = function fn() {};

    expect(deserialize()).toEqual(expectedValue);
    expect(deserialize(undefined)).toEqual(expectedValue);
    expect(deserialize(Number.NaN)).toEqual(expectedValue);
    expect(deserialize(null)).toEqual(expectedValue);
    expect(deserialize(func)).toEqual(expectedValue);
    expect(deserialize(/.*/)).toEqual(expectedValue);
    expect(deserialize(new Date())).toEqual(expectedValue);
    expect(deserialize([])).toEqual(expectedValue);
    expect(deserialize({})).toEqual(expectedValue);
  });

  it('should map serialized data to VO', () => {
    const series = {
      a: null,
      b: 1,
      c: '',
    };
    const expectedValue = {
      ...series,
    };

    expect(deserialize(series)).toEqual(expectedValue);
  });

  it('should convert falsy values to null', () => {
    const series = {
      b: false, c: null, d: undefined, e: 0, f: Number.NaN, g: '',
    };
    const expectedValue = Object.entries(series).reduce((acc, [key, value]) => ({
      ...acc,
      [key]: value === undefined || Number.isNaN(value) ? null : value,
    }), {});

    expect(deserialize(series)).toEqual(expectedValue);
  });
});

describe('Complex deserialization', () => {
  it('should properly deserialize Collections (nested objects)', () => {
    const series = {
      'a.b': 1,
      'c.d.e.f': 2,
    };
    const expectedValue = {
      a: { b: 1 },
      c: { d: { e: { f: 2 } } },
    };

    expect(deserialize(series)).toEqual(expectedValue);
  });

  it('should properly deserialize Enums (arrays with primitive values)', () => {
    const series = {
      'a[0]': 0,
      'a[1]': 1,
      'b[0]': 0,
      'b[1]': 1,
    };
    const expectedValue = {
      a: [0, 1],
      b: [0, 1],
    };

    expect(deserialize(series)).toEqual(expectedValue);

    series['c.d[0]'] = 0;
    series['c.d[1]'] = 1;

    expectedValue.c = {
      d: [0, 1],
    };

    expect(deserialize(series)).toEqual(expectedValue);
  });

  it('should properly deserialize Maps (arrays with objects)', () => {
    const series = {
      'a.b[0].c': 1,
      'a.b[1].c': 2,
    };
    const expectedValue = {
      a: {
        b: [
          { c: 1 },
          { c: 2 },
        ],
      },
    };

    expect(deserialize(series)).toEqual(expectedValue);
  });
});
