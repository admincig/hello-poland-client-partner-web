import deserialize from './deserialize';

describe('Form Generator', () => {
  describe('Primitive deserialization', () => {
    it('should return empty object if there was nothing to serialize', () => {
      const expectedValue = {};
      const func = function fn() {
      };

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
});
