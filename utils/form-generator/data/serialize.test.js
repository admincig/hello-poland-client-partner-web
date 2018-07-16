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
});
