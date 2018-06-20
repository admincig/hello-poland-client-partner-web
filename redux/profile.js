import { createLogic } from 'redux-logic';

export const name = 'profile';
const prefix = `${name}/`;


/*
 * TYPES
 */

const ERROR_UNAUTHORIZED = `${prefix}ERROR_UNAUTHORIZED`;
const FETCH_PROFILE = `${prefix}FETCH_PROFILE`;
const FETCH_PROFILE_CANCEL = `${prefix}FETCH_PROFILE_CANCEL`;
const FETCH_PROFILE_FAILURE = `${prefix}FETCH_PROFILE_FAILURE`;
const FETCH_PROFILE_SUCCESS = `${prefix}FETCH_PROFILE_SUCCESS`;
const LOGIN = `${prefix}LOGIN`;
const LOGIN_FAILURE = `${prefix}LOGIN_FAILURE`;
const LOGIN_SUCCESS = `${prefix}LOGIN_SUCCESS`;
const LOGOUT = `${prefix}LOGOUT`;
const LOGOUT_SUCCESS = `${prefix}LOGOUT_SUCCESS`;
const REFRESH_ACCESS_TOKEN = `${prefix}REFRESH_ACCESS_TOKEN`;
const REFRESH_ACCESS_TOKEN_SUCCESS = `${prefix}REFRESH_ACCESS_TOKEN_SUCCESS`;

export const types = {
  ERROR_UNAUTHORIZED,
  FETCH_PROFILE,
  FETCH_PROFILE_CANCEL,
  FETCH_PROFILE_FAILURE,
  FETCH_PROFILE_SUCCESS,
  LOGIN,
  LOGIN_FAILURE,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  LOGOUT,
  REFRESH_ACCESS_TOKEN,
  REFRESH_ACCESS_TOKEN_SUCCESS,
};


/*
 * ACTIONS
 */

/**
 * Informs application that user is not authenticated with the server (401 HTTP code).
 *
 * @method
 * @return {{type: string}}
 */
const errorUnauthorized = () => ({
  type: ERROR_UNAUTHORIZED,
});

/**
 * Creates action with profile request details.
 *
 * @method
 * @return {{type: string, payload: { url: string, method: string}}}
 */
const fetchProfile = () => ({
  type: FETCH_PROFILE,
  payload: {
    url: '/users/me',
    method: 'get',
  },
});

/**
 * Creates action for profile request cancelling.
 *
 * @method
 * @return {{type: string}}
 */
const fetchProfileCancel = () => ({
  type: FETCH_PROFILE_CANCEL,
});

/**
 * Creates action for profile request failing.
 *
 * @method
 * @param {Object} [error] - Response error.
 * @return {{ type: string, error: * }}
 */
const fetchProfileFailure = error => ({
  type: FETCH_PROFILE_FAILURE,
  error,
});

/**
 * Creates action for successful profile request.
 *
 * @method
 * @param {Object} data - response body
 * @return {{type: string, data: *}}
 */
const fetchProfileSuccess = data => ({
  type: FETCH_PROFILE_SUCCESS,
  data,
});

/**
 * Creates action with login request details.
 *
 * @method
 * @param {Object} data - request data
 * @param {string} data.login
 * @param {string} data.password
 * @param {Object} [options] - request options
 * @return {{type: string, payload: { url: string, method: string, data: *}}}
 */
const login = (data, options) => ({
  type: LOGIN,
  payload: {
    url: '/login',
    method: 'post',
    ...options,
    data,
  },
});

/**
 * Creates action for login request failing.
 *
 * @method
 * @param {Object} [error] - Response error.
 * @return {{ type: string, error: * }}
 */
const loginFailure = error => ({
  type: LOGIN_FAILURE,
  error,
});

/**
 * Creates action for users/mesuccessful login request.
 *
 * @method
 * @param {Object} data - response body
 * @return {{type: string, data: *}}
 */
const loginSuccess = data => ({
  type: LOGIN_SUCCESS,
  data,
});

/**
 * Creates action with login request details.
 *
 * @method
 * @param {Object} [options] - request options
 * @return {{type: string, payload: { url: string, method: string, data: *}}}
 */
const logout = options => ({
  type: LOGOUT,
  payload: {
    url: '/logout',
    method: 'post',
    ...options,
  },
});

/**
 * Creates action for successful logout request.
 *
 * @method
 * @return {{type: string, data: *}}
 */
const logoutSuccess = () => ({
  type: LOGOUT_SUCCESS,
});

/**
 * Creates action for JWT token refreshing.
 *
 * @method
 * @param {Object} options - request options
 * @return {{type: string, payload: { url: string, method: string, data: *}}}
 */
const refreshAccessToken = options => ({
  type: REFRESH_ACCESS_TOKEN,
  payload: {
    url: '/refresh',
    method: 'post',
    ...options,
  },
});

/**
 * Creates action for successful refreshed token.
 *
 * @method
 * @param {*} data - response body
 * @return {{type: string, data: *}}
 */
const refreshAccessTokenSuccess = data => ({
  type: REFRESH_ACCESS_TOKEN_SUCCESS,
  data,
});

export const actions = {
  errorUnauthorized,
  fetchProfile,
  fetchProfileCancel,
  fetchProfileFailure,
  fetchProfileSuccess,
  login,
  loginFailure,
  loginSuccess,
  logout,
  logoutSuccess,
  refreshAccessToken,
  refreshAccessTokenSuccess,
};


/*
 * SELECTORS
 */

/**
 * Returns current state.
 *
 * @method
 * @param {Object} state
 * @return {*}
 */

const getState = state => state[name];

/**
 * Returns user's sign in credentials.
 *
 * @method
 * @param {Object} state
 * @return {*}
 */
const getCredentials = state => getState(state).credentials;

/**
 * Returns request error.
 *
 * @method
 * @param {Object} state
 * @return {null}
 */

const getError = state => getState(state).error;

/**
 * Returns user's profile.
 *
 * @method
 * @param {Object} state
 * @return {*}
 */
const getProfile = state => getState(state).profile;

/**
 * Checks if user is authenticated.
 *
 * @method
 * @param {Object} state
 * @return {boolean}
 */
const isAuthenticated = state => getState(state).isAuthenticated;

export const selectors = {
  getCredentials,
  getError,
  getState,
  getProfile,
  isAuthenticated,
};


/*
 * LOGIC
 */

const fetchProfileLogic = createLogic({
  type: [
    FETCH_PROFILE,
  ],
  cancelType: [
    FETCH_PROFILE_CANCEL,
    LOGOUT,
  ],
  async process({ action: { payload }, httpClient, cancelled$ }, dispatch, done) {
    try {
      const { data, status } = await httpClient.cancellable(payload, cancelled$);

      if (status === 200 || status === 204) {
        dispatch(fetchProfileSuccess(data));
      } else {
        dispatch(fetchProfileFailure());
      }
    } catch (error) {
      // const responseError = createResponseErrorFactory(response);
      const responseError = 'error';

      dispatch(fetchProfileFailure(responseError));
    }

    done();
  },
});

const fetchProfileOnLoginSuccessLogic = createLogic({
  type: [
    LOGIN_SUCCESS,
  ],
  cancelType: [
    FETCH_PROFILE_CANCEL,
  ],
  process() {
    return fetchProfile();
  },
});

const loginLogic = createLogic({
  type: [
    LOGIN,
  ],
  async process({ action: { payload }, httpClient }, dispatch, done) {
    try {
      const { data, status } = await httpClient(payload);

      if (status === 200 || status === 204) {
        dispatch(loginSuccess(data));
      } else {
        dispatch(loginFailure());
      }
    } catch ({ response }) {
      // const responseError = createResponseErrorFactory(response);
      const responseError = 'error';

      dispatch(loginFailure(responseError));
    }

    done();
  },
});

const logoutLogic = createLogic({
  type: [
    LOGOUT,
  ],
  process({ action: { payload }, httpClient }) {
    httpClient(payload);

    return logoutSuccess();
  },
});

const unauthorizedLogic = createLogic({
  type: [
    ERROR_UNAUTHORIZED,
  ],
  process({ getState: getReduxState }, dispatch, done) {
    const state = getReduxState();
    const isUserAuthenticated = isAuthenticated(state);

    if (isUserAuthenticated) {
      dispatch(logout());
    }

    done();
  },
});

export const logic = {
  fetchProfileLogic,
  fetchProfileOnLoginSuccessLogic,
  loginLogic,
  logoutLogic,
  unauthorizedLogic,
};


/*
 * REDUCERS
 */

const initialState = {
  credentials: null,
  error: null,
  isAuthenticated: false,
  profile: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PROFILE_SUCCESS:
      return {
        ...state,
        error: null,
        isAuthenticated: true,
        profile: action.data,
      };
    case LOGIN:
      return {
        ...state,
        error: null,
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        error: {
          ...action.data,
        },
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        credentials: {
          ...action.data,
        },
        error: null,
        isAuthenticated: true,
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        credentials: null,
        error: null,
        isAuthenticated: false,
        profile: null,
      };
    case REFRESH_ACCESS_TOKEN_SUCCESS:
      return {
        ...state,
        credentials: {
          ...action.data,
        },
        error: null,
      };
    default:
      return state;
  }
};

export default reducer;
