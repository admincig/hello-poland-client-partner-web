import sanitizeSchema from './sanitizeSchema';

describe('sanitizeSchema', () => {
  it('should remove redux-related props from axios schema', () => {
    const expectedValue = {
      response: {},
      request: {},
    };
    const data = {
      ...expectedValue,
      redux: {},
      store: {},
    };

    expect(sanitizeSchema(data)).toEqual(expectedValue);
  });
});
