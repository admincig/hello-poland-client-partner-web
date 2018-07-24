import populate from './populate';

describe('Form Generator', () => {
  describe('Primitive population', () => {
    it('should throw if serialized data is not an object', () => {
      expect(() => populate()).toThrow();
    });

    it('should skip values not present in serialized data', () => {
      const data = {};
      const values = {};
      const expectedValue = {};

      expect(populate(data)).toEqual(expectedValue);
      expect(populate(data, values)).toEqual(expectedValue);

      values.a = 1;

      expect(populate(data, values)).toEqual(expectedValue);

      data.b = 1;
      expectedValue.b = 1;

      expect(populate(data, values)).toEqual(expectedValue);
    });

    it('should add values to immediate keys with primitive', () => {
      const data = {
        a: 1,
        b: 2,
      };
      const values = {
        a: 2,
        b: 3,
        c: 4,
      };
      const expectedValue = {
        a: 2,
        b: 3,
      };

      expect(populate(data, values)).toEqual(expectedValue);
    });
  });

  describe('Complex population', () => {
    it('should traverse nested object and add values to them', () => {
      const data = {
        'a.b': 1,
        'c.d.e': 2,
      };
      const values = {
        a: {
          b: 2,
        },
        c: {
          d: {
            e: 3,
            f: 4,
          },
        },
      };
      const expectedValue = {
        'a.b': 2,
        'c.d.e': 3,
      };

      expect(populate(data, values)).toEqual(expectedValue);
    });

    // it('should find values of an array with primitive elements', () => {
    //   const data = {
    //     'a[0]': 1,
    //     'b.c[0]': 2,
    //   };
    //   const values = {
    //     a: [2],
    //     b: {
    //       c: [3],
    //       d: [4],
    //     },
    //   };
    //   const expectedValue = {
    //     'a[0]': 2,
    //     'b.c[0]': 3,
    //   };
    //
    //   expect(populate(data, values)).toEqual(expectedValue);
    // });
  });
});
