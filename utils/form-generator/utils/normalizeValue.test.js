import normalizeValue from './normalizeValue';

describe('Form Generator', () => {
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
});
