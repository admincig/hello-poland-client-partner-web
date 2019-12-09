import reducer, {
  actions,
  name,
  selectors,
  types,
  defaultInitialState,
} from './profile';

/*
 * Initial state
 */
const initialState = defaultInitialState;

const appState = {
  config: {},
  [name]: initialState,
};

function onFailure() {}
function onSuccess() {}

const axiosResponseError = {
  errors: [
    {
      detail: 'details',
      status: '500',
    },
  ],
};

/*
 * Helper functions
 */

function generateState(data) {
  return {
    ...initialState,
    ...data,
  };
}

function generateAppState(data) {
  return {
    ...appState,
    [name]: {
      ...generateState(data),
    },
  };
}

/*
 * Tests
 */

describe('actions', () => {
  it('should create an action to handle unauthorized error', () => {
    const { errorUnauthorized } = actions;
    const { ERROR_UNAUTHORIZED } = types;
    const expectedValue = {
      type: ERROR_UNAUTHORIZED,
      payload: {},
    };

    expect(errorUnauthorized()).toEqual(expectedValue);

    const payload = { a: 1 };
    expectedValue.payload = payload;

    expect(errorUnauthorized(payload)).toEqual(expectedValue);
  });

  it('should create an action to make profile request', () => {
    const { fetchProfile } = actions;
    const { FETCH_PROFILE } = types;
    const options = { b: 2 };
    const expectedValue = {
      type: FETCH_PROFILE,
      payload: {
        url: '/users/me',
        method: 'get',
      },
    };

    expect(fetchProfile()).toEqual(expectedValue);

    expectedValue.payload = {
      ...expectedValue.payload,
      ...options,
    };

    expect(fetchProfile({ options })).toEqual(expectedValue);

    expectedValue.onFailure = onFailure;
    expectedValue.onSuccess = onSuccess;

    expect(fetchProfile({
      options, onFailure, onSuccess,
    })).toEqual(expectedValue);
  });

  it('should create an action to cancel profile request', () => {
    const { fetchProfileCancel } = actions;
    const { FETCH_PROFILE_CANCEL } = types;
    const expectedValue = {
      type: FETCH_PROFILE_CANCEL,
    };

    expect(fetchProfileCancel()).toEqual(expectedValue);
  });

  it('should create an action to fail profile request', () => {
    const { fetchProfileFailure } = actions;
    const { FETCH_PROFILE_FAILURE } = types;
    const expectedValue = {
      type: FETCH_PROFILE_FAILURE,
      errors: [],
    };

    expect(fetchProfileFailure()).toEqual(expectedValue);

    expectedValue.errors = axiosResponseError.errors;

    expect(fetchProfileFailure(axiosResponseError)).toEqual(expectedValue);
  });

  it('should create an action to succeed profile request', () => {
    const { fetchProfileSuccess } = actions;
    const { FETCH_PROFILE_SUCCESS } = types;
    const data = {};
    const expectedValue = {
      type: FETCH_PROFILE_SUCCESS,
      data,
    };

    expect(fetchProfileSuccess(data)).toEqual(expectedValue);
  });

  it('should create an action to make login request', () => {
    const { login } = actions;
    const { LOGIN } = types;
    const data = {
      login: 'email@example.com',
      password: 'password',
    };
    const options = {};
    const expectedValue = {
      type: LOGIN,
      payload: {
        url: '/login',
        method: 'post',
        ...options,
        data,
      },
    };

    expect(login({ data, options })).toEqual(expectedValue);

    expectedValue.onFailure = onFailure;
    expectedValue.onSuccess = onSuccess;

    expect(login({
      data, options, onFailure, onSuccess,
    })).toEqual(expectedValue);
  });

  it('should create an action to fail login request', () => {
    const { loginFailure } = actions;
    const { LOGIN_FAILURE } = types;
    const expectedValue = {
      type: LOGIN_FAILURE,
      errors: [],
    };

    expect(loginFailure()).toEqual(expectedValue);

    expectedValue.errors = axiosResponseError.errors;

    expect(loginFailure(axiosResponseError)).toEqual(expectedValue);
  });

  it('should create an action to succeed login request', () => {
    const { loginSuccess } = actions;
    const { LOGIN_SUCCESS } = types;
    const data = {};
    const expectedValue = {
      type: LOGIN_SUCCESS,
      data,
    };

    expect(loginSuccess(data)).toEqual(expectedValue);
  });

  it('should create an action to make logout request', () => {
    const { logout } = actions;
    const { LOGOUT } = types;
    const options = { a: 1, data: 2 };
    const expectedValue = {
      type: LOGOUT,
      payload: {
        url: '/logout',
        method: 'post',
      },
    };

    expect(logout()).toEqual(expectedValue);

    expectedValue.payload = {
      ...expectedValue.payload,
      ...options,
    };

    expect(logout({ options })).toEqual(expectedValue);

    expectedValue.onFailure = onFailure;
    expectedValue.onSuccess = onSuccess;

    expect(logout({
      options, onFailure, onSuccess,
    })).toEqual(expectedValue);
  });

  it('should create an action to succeed logout request', () => {
    const { logoutSuccess } = actions;
    const { LOGOUT_SUCCESS } = types;
    const expectedValue = {
      type: LOGOUT_SUCCESS,
    };

    expect(logoutSuccess()).toEqual(expectedValue);
  });

  it('should create an action to make refresh access token request', () => {
    const { refreshAccessToken } = actions;
    const { REFRESH_ACCESS_TOKEN } = types;
    const data = {};
    const options = { a: 1, data: 2 };
    const expectedValue = {
      type: REFRESH_ACCESS_TOKEN,
      payload: {
        url: '/refresh',
        method: 'post',
        data,
      },
    };

    expect(refreshAccessToken({ data })).toEqual(expectedValue);

    expectedValue.payload = {
      ...expectedValue.payload,
      ...options,
      data,
    };

    expect(refreshAccessToken({ data, options })).toEqual(expectedValue);

    expectedValue.onFailure = onFailure;
    expectedValue.onSuccess = onSuccess;

    expect(refreshAccessToken({
      data, options, onFailure, onSuccess,
    })).toEqual(expectedValue);
  });

  it('should create an action to succeed refresh access token request', () => {
    const { refreshAccessTokenSuccess } = actions;
    const { REFRESH_ACCESS_TOKEN_SUCCESS } = types;
    const data = {
      accessToken: 'abc123',
      refreshToken: '123abc',
    };
    const expectedValue = {
      type: REFRESH_ACCESS_TOKEN_SUCCESS,
      data,
    };

    expect(refreshAccessTokenSuccess(data)).toEqual(expectedValue);
  });
});

describe('selectors', () => {
  describe('using getState', () => {
    it(`should return ${name} state`, () => {
      const { getState } = selectors;

      expect(getState(appState)).toEqual(initialState);
    });
  });

  describe('using getErrors', () => {
    it('should return empty array if there was no errors', () => {
      const { getErrors } = selectors;
      const expectedValue = [];

      expect(getErrors(appState)).toEqual(expectedValue);
    });

    it('should return some error message if there was an error', () => {
      const { getErrors } = selectors;
      const errors = [
        {
          status: '401',
          detail: 'unauthorized',
        },
      ];
      const state = generateAppState({ errors });

      expect(getErrors(state)).toEqual(errors);
    });
  });

  describe('using getCredentials', () => {
    it('should return empty object if there are no credentials', () => {
      const { getCredentials } = selectors;
      const expectedValue = {};

      expect(getCredentials(appState)).toEqual(expectedValue);
    });

    it('should return user\'s credentials', () => {
      const { getCredentials } = selectors;
      const expectedValue = {
        accessToken: 'abc123',
        refreshToken: '123abc',
      };
      const state = generateAppState({ credentials: expectedValue });

      expect(getCredentials(state)).toEqual(expectedValue);
    });
  });

  describe('using getProfile', () => {
    it('should return empty object if user is not signed in', () => {
      const { getProfile } = selectors;
      const expectedValue = {};

      expect(getProfile(appState)).toEqual(expectedValue);
    });

    it('should return user\'s profile', () => {
      const { getProfile } = selectors;
      const profile = {
        name: 'John Rambo',
        email: 'johnnypro@example.com',
      };
      const state = generateAppState({ profile });

      expect(getProfile(state)).toEqual(profile);
    });
  });

  describe('using isAuthenticated', () => {
    it('should indicate if user has signed in', () => {
      const { isAuthenticated } = selectors;

      expect(isAuthenticated(appState)).toEqual(false);
      expect(isAuthenticated(generateAppState({ isAuthenticated: true }))).toEqual(true);
    });
  });
});

describe('reducer', () => {
  it('should return default initial state', () => {
    expect(reducer()(undefined, {})).toEqual(defaultInitialState);
  });

  it('should return custom initial state', () => {
    expect(reducer(initialState)(undefined, {})).toEqual(initialState);
  });

  it('should return current state if action type was not found', () => {
    expect(reducer()(undefined, { type: 'INVALID_TYPE' })).toEqual(defaultInitialState);
  });

  it('should handle FETCH_PROFILE_SUCCESS', () => {
    const profile = {
      name: 'John Rambo',
      email: 'johnnypro@example.com',
    };
    const action = actions.fetchProfileSuccess(profile);
    const expectedValue = {
      ...defaultInitialState,
      isAuthenticated: true,
      profile,
    };

    expect(reducer()(defaultInitialState, action)).toEqual(expectedValue);
  });

  it('should handle LOGIN', () => {
    const data = {
      login: '',
      password: '',
    };
    const action = actions.login(data);
    const expectedValue = {
      ...defaultInitialState,
    };

    expect(reducer()(defaultInitialState, action)).toEqual(expectedValue);
  });

  it('should handle FETCH_PROFILE_FAILURE', () => {
    let action = actions.fetchProfileFailure();
    const expectedValue = {
      ...defaultInitialState,
      errors: [],
    };

    expect(reducer()(defaultInitialState, action)).toEqual(expectedValue);

    action = actions.fetchProfileFailure(axiosResponseError);
    expectedValue.errors = axiosResponseError.errors;

    expect(reducer()(defaultInitialState, action)).toEqual(expectedValue);
  });

  it('should handle LOGIN_FAILURE', () => {
    let action = actions.loginFailure();
    const expectedValue = {
      ...defaultInitialState,
      errors: [],
    };

    expect(reducer()(defaultInitialState, action)).toEqual(expectedValue);

    action = actions.loginFailure(axiosResponseError);
    expectedValue.errors = axiosResponseError.errors;

    expect(reducer()(defaultInitialState, action)).toEqual(expectedValue);
  });

  it('should handle LOGIN_SUCCESS', () => {
    const credentials = {
      accessToken: 'abc123',
      refreshToken: '123abc',
    };
    const action = actions.loginSuccess(credentials);
    const expectedValue = {
      ...defaultInitialState,
      credentials,
      isAuthenticated: true,
    };

    expect(reducer()(defaultInitialState, action)).toEqual(expectedValue);
  });

  it('should handle LOGOUT_SUCCESS', () => {
    const action = actions.logoutSuccess();
    const expectedValue = {
      ...defaultInitialState,
    };

    expect(reducer()(defaultInitialState, action)).toEqual(expectedValue);
  });

  it('should handle REFRESH_ACCESS_TOKEN_SUCCESS', () => {
    const credentials = {
      accessToken: 'abc123',
      refreshToken: '123abc',
    };
    const action = actions.refreshAccessTokenSuccess(credentials);
    const expectedValue = {
      ...defaultInitialState,
      credentials,
      isAuthenticated: true,
    };

    expect(reducer()(defaultInitialState, action)).toEqual(expectedValue);
  });
});
