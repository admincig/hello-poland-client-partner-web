import serialize from './serialize';

describe('Form Generator', () => {
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

    describe('Lists (arrays with primitive values)', () => {
      it('should properly serialize schemas with no values', () => {
        const schema = [
          {
            key: 'a',
            type: 'List',
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
            type: 'List',
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
            type: 'List',
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
});
