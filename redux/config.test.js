import {
  name,
  selectors,
} from './config';

const initialState = {};

const appState = {
  random: {},
  [name]: initialState,
};

/*
 * Helper functions
 */

function generateState(data) {
  return {
    ...appState,
    [name]: {
      ...initialState,
      ...data,
    },
  };
}

/*
 * Tests
 */

describe('selectors', () => {
  describe('using getState', () => {
    it(`should return ${name}'s state`, () => {
      const { getState } = selectors;

      expect(getState(appState)).toEqual(initialState);
    });
  });

  describe('using getAppConfig', () => {
    it('should return initial application configuration', () => {
      const { getAppConfig } = selectors;

      expect(getAppConfig(appState)).toEqual({});
    });

    it('should return current application configuration', () => {
      const { getAppConfig } = selectors;
      const config = {
        key: 'value',
      };

      const state = generateState(config);

      expect(getAppConfig(state)).toEqual(config);
    });
  });
});
