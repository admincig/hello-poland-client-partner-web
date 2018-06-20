import reducer, {
  actions,
  name,
  selectors,
  types,
} from './profile';

/*
 * Initial state
 */

const initialState = {
  credentials: null,
  error: null,
  isAuthenticated: false,
  profile: null,
};

const appState = {
  config: {},
  [name]: initialState,
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
    const expectedAction = {
      type: ERROR_UNAUTHORIZED,
    };

    expect(errorUnauthorized()).toEqual(expectedAction);
  });

  it('should create an action to make profile request', () => {
    const { fetchProfile } = actions;
    const { FETCH_PROFILE } = types;
    const expectedAction = {
      type: FETCH_PROFILE,
      payload: {
        url: '/users/me',
        method: 'get',
      },
    };

    expect(fetchProfile()).toEqual(expectedAction);
  });

  it('should create an action to cancel profile request', () => {
    const { fetchProfileCancel } = actions;
    const { FETCH_PROFILE_CANCEL } = types;
    const expectedAction = {
      type: FETCH_PROFILE_CANCEL,
    };

    expect(fetchProfileCancel()).toEqual(expectedAction);
  });

  it('should create an action to fail profile request', () => {
    const { fetchProfileFailure } = actions;
    const { FETCH_PROFILE_FAILURE } = types;
    const expectedAction = {
      type: FETCH_PROFILE_FAILURE,
    };

    expect(fetchProfileFailure()).toEqual(expectedAction);
  });

  it('should create an action to succeed profile request', () => {
    const { fetchProfileSuccess } = actions;
    const { FETCH_PROFILE_SUCCESS } = types;
    const data = {};
    const expectedAction = {
      type: FETCH_PROFILE_SUCCESS,
      data,
    };

    expect(fetchProfileSuccess(data)).toEqual(expectedAction);
  });

  it('should create an action to make login request', () => {
    const { login } = actions;
    const { LOGIN } = types;
    const data = {
      login: 'email@example.com',
      password: 'password',
    };
    const options = {};
    const expectedAction = {
      type: LOGIN,
      payload: {
        url: '/login',
        method: 'post',
        ...options,
        data,
      },
    };

    expect(login(data, options)).toEqual(expectedAction);
  });

  it('should create an action to fail login request', () => {
    const { loginFailure } = actions;
    const { LOGIN_FAILURE } = types;
    const expectedAction = {
      type: LOGIN_FAILURE,
    };

    expect(loginFailure()).toEqual(expectedAction);
  });

  it('should create an action to succeed login request', () => {
    const { loginSuccess } = actions;
    const { LOGIN_SUCCESS } = types;
    const data = {};
    const expectedAction = {
      type: LOGIN_SUCCESS,
      data,
    };

    expect(loginSuccess(data)).toEqual(expectedAction);
  });

  it('should create an action to make logout request', () => {
    const { logout } = actions;
    const { LOGOUT } = types;
    const options = {};
    const expectedAction = {
      type: LOGOUT,
      payload: {
        url: '/logout',
        method: 'post',
        ...options,
      },
    };

    expect(logout(options)).toEqual(expectedAction);
  });

  it('should create an action to succeed logout request', () => {
    const { logoutSuccess } = actions;
    const { LOGOUT_SUCCESS } = types;
    const expectedAction = {
      type: LOGOUT_SUCCESS,
    };

    expect(logoutSuccess()).toEqual(expectedAction);
  });

  it('should create an action to make refresh access token request', () => {
    const { refreshAccessToken } = actions;
    const { REFRESH_ACCESS_TOKEN } = types;
    const options = {};
    const expectedAction = {
      type: REFRESH_ACCESS_TOKEN,
      payload: {
        url: '/refresh',
        method: 'post',
        ...options,
      },
    };

    expect(refreshAccessToken(options)).toEqual(expectedAction);
  });

  it('should create an action to succeed refresh access token request', () => {
    const { refreshAccessTokenSuccess } = actions;
    const { REFRESH_ACCESS_TOKEN_SUCCESS } = types;
    const data = {
      accessToken: 'abc123',
      refreshToken: '123abc',
    };
    const expectedAction = {
      type: REFRESH_ACCESS_TOKEN_SUCCESS,
      data,
    };

    expect(refreshAccessTokenSuccess(data)).toEqual(expectedAction);
  });
});

describe('selectors', () => {
  describe('using getState', () => {
    it(`should return ${name} state`, () => {
      const { getState } = selectors;

      expect(getState(appState)).toEqual(initialState);
    });
  });

  describe('using getError', () => {
    it('should return null if there was no error', () => {
      const { getError } = selectors;

      expect(getError(appState)).toBeNull();
    });

    it('should return some error message if there was an error', () => {
      const { getError } = selectors;
      const error = 'omg';
      const state = generateAppState({ error });

      expect(getError(state)).toEqual(error);
    });
  });

  describe('using getCredentials', () => {
    it('should return null if there are no credentials', () => {
      const { getCredentials } = selectors;

      expect(getCredentials(appState)).toBeNull();
    });

    it('should return user\'s credentials', () => {
      const { getCredentials } = selectors;
      const credentials = {
        accessToken: 'abc123',
        refreshToken: '123abc',
      };
      const state = generateAppState({ credentials });

      expect(getCredentials(state)).toEqual(credentials);
    });
  });

  describe('using getProfile', () => {
    it('should return null if user is not signed in', () => {
      const { getProfile } = selectors;

      expect(getProfile(appState)).toBeNull();
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
  it('should return initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should return current state if action type was not found', () => {
    expect(reducer(initialState, { type: 'EXAMPLE_TYPE' })).toEqual(initialState);
  });

  it('should handle FETCH_PROFILE_SUCCESS', () => {
    const { FETCH_PROFILE_SUCCESS } = types;
    const profile = {
      name: 'John Rambo',
      email: 'johnnypro@example.com',
    };
    const action = {
      data: profile,
      type: FETCH_PROFILE_SUCCESS,
    };
    const expectedValue = {
      ...initialState,
      isAuthenticated: true,
      profile,
    };

    expect(reducer(initialState, action)).toEqual(expectedValue);
  });

  it('should handle LOGIN', () => {
    const { LOGIN } = types;
    const action = {
      type: LOGIN,
    };
    const expectedValue = {
      ...initialState,
      error: null,
    };

    expect(reducer(initialState, action)).toEqual(expectedValue);
  });

  it('should handle LOGIN_FAILURE', () => {
    const { LOGIN_FAILURE } = types;
    const error = {
      message: 'omgomgomg',
    };
    const action = {
      data: error,
      type: LOGIN_FAILURE,
    };
    const expectedValue = {
      ...initialState,
      error,
    };

    expect(reducer(initialState, action)).toEqual(expectedValue);
  });

  it('should handle LOGIN_SUCCESS', () => {
    const { LOGIN_SUCCESS } = types;
    const credentials = {
      accessToken: 'abc123',
      refreshToken: '123abc',
    };
    const action = {
      data: credentials,
      type: LOGIN_SUCCESS,
    };
    const expectedValue = {
      ...initialState,
      credentials,
      isAuthenticated: true,
    };

    expect(reducer(initialState, action)).toEqual(expectedValue);
  });

  it('should handle LOGOUT_SUCCESS', () => {
    const { LOGOUT_SUCCESS } = types;
    const action = {
      type: LOGOUT_SUCCESS,
    };
    const expectedValue = {
      ...initialState,
    };

    expect(reducer(initialState, action)).toEqual(expectedValue);
  });

  it('should handle REFRESH_ACCESS_TOKEN_SUCCESS', () => {
    const { LOGIN_SUCCESS } = types;
    const credentials = {
      accessToken: 'abc123',
      refreshToken: '123abc',
    };
    const action = {
      data: credentials,
      type: LOGIN_SUCCESS,
    };
    const expectedValue = {
      ...initialState,
      credentials,
      isAuthenticated: true,
    };

    expect(reducer(initialState, action)).toEqual(expectedValue);
  });
});
