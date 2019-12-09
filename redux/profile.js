import { createLogic } from 'redux-logic';

/**
 * Defines set of methods for managing user's profile.
 * @module Profile
 */

/**
 * Module name.
 * @type {string}
 */
export const name = 'profile';

/**
 * Reducer prefix.
 * @type {string}
 */
const prefix = `${name}/`;


/*
 * TYPES
 */

/**
 * Type used for handling unauthorized error.
 * @type {string}
 */
const ERROR_UNAUTHORIZED = `${prefix}ERROR_UNAUTHORIZED`;

/**
 * Type used for handling profile fetching.
 * @type {string}
 */
const FETCH_PROFILE = `${prefix}FETCH_PROFILE`;

/**
 * Type used for handling profile fetching cancellation.
 * @type {string}
 */
const FETCH_PROFILE_CANCEL = `${prefix}FETCH_PROFILE_CANCEL`;

/**
 * Type used for handling profile fetching failure.
 * @type {string}
 */
const FETCH_PROFILE_FAILURE = `${prefix}FETCH_PROFILE_FAILURE`;

/**
 * Type used for handling profile fetching success.
 * @type {string}
 */
const FETCH_PROFILE_SUCCESS = `${prefix}FETCH_PROFILE_SUCCESS`;

/**
 * Type used for handling user login.
 * @type {string}
 */
const LOGIN = `${prefix}LOGIN`;

/**
 * Type used for handling user login failure.
 * @type {string}
 */
const LOGIN_FAILURE = `${prefix}LOGIN_FAILURE`;

/**
 * Type used for handling user login success.
 * @type {string}
 */
const LOGIN_SUCCESS = `${prefix}LOGIN_SUCCESS`;

/**
 * Type used for handling user logout.
 * @type {string}
 */
const LOGOUT = `${prefix}LOGOUT`;

/**
 * Type used for handling user logout success.
 * @type {string}
 */
const LOGOUT_SUCCESS = `${prefix}LOGOUT_SUCCESS`;

/**
 * Type used for handling JWT access token refreshing.
 * @type {string}
 */
const REFRESH_ACCESS_TOKEN = `${prefix}REFRESH_ACCESS_TOKEN`;

/**
 * Type used for handling JWT access token refreshing success.
 * @type {string}
 */
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
 * @method
 * @return {{type: string}}
 */
const errorUnauthorized = (payload = {}) => ({
  type: ERROR_UNAUTHORIZED,
  payload,
});

/**
 * Creates action with profile request details.
 * @method
 * @callback failureCallback
 * @callback successCallback
 * @param {Object} [options] - request config
 * @param {failureCallback} [onFailure] - failure callback
 * @param {successCallback} [onSuccess] - success callback
 * @return {{
 *   type: string,
 *   payload: {url: string, method: string, data: *, options: *},
 *   onFailure: failureCallback,
 *   onSuccess: successCallback
 * }}
 */
const fetchProfile = ({
  options, onFailure, onSuccess,
} = {}) => ({
  type: FETCH_PROFILE,
  payload: {
    url: '/users/me',
    method: 'get',
    ...options,
  },
  onFailure,
  onSuccess,
});

/**
 * Creates action for profile request cancelling.
 * @method
 * @return {{type: string}}
 */
const fetchProfileCancel = () => ({
  type: FETCH_PROFILE_CANCEL,
});

/**
 * Creates action for profile request failing.
 * @method
 * @param {Object[]} errors - list of errors returned from response
 * @return {{
 *   type: string,
 *   errors: [{details: string, status: string}]
 * }}
 */
const fetchProfileFailure = ({ errors } = {}) => ({
  type: FETCH_PROFILE_FAILURE,
  errors: errors || [],
});

/**
 * Creates action for successful profile request.
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
 * @method
 * @callback failureCallback
 * @callback successCallback
 * @param {Object} data - request data
 * @param {Object} [options] - request options
 * @param {failureCallback} [onFailure] - failure callback
 * @param {successCallback} [onSuccess] - success callback
 * @return {{
 *   type: string,
 *   payload: {url: string, method: string, data: *, options: *},
 *   onFailure: failureCallback,
 *   onSuccess: successCallback
 * }}
 */
const login = ({
  data, options, onFailure, onSuccess,
} = {}) => ({
  type: LOGIN,
  payload: {
    url: '/login',
    method: 'post',
    ...options,
    data,
  },
  onSuccess,
  onFailure,
});

/**
 * Creates action for login request failing.
 * @method
 * @param {Object[]} errors - list of errors returned from response
 * @return {{
 *   type: string,
 *   errors: [{details: string, status: string}]
 * }}
 */
const loginFailure = ({ errors } = {}) => ({
  type: LOGIN_FAILURE,
  errors: errors || [],
});

/**
 * Creates action for users/mesuccessful login request.
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
 * @method
 * @callback failureCallback
 * @callback successCallback
 * @param {Object} [options] - request options
 * @param {failureCallback} [onFailure] - failure callback
 * @param {successCallback} [onSuccess] - success callback
 * @return {{
 *   type: string,
 *   payload: {url: string, method: string, data: *, options: *},
 *   onFailure: failureCallback,
 *   onSuccess: successCallback
 * }}
 */
const logout = ({
  options, onFailure, onSuccess,
} = {}) => ({
  type: LOGOUT,
  payload: {
    url: '/logout',
    method: 'post',
    ...options,
  },
  onSuccess,
  onFailure,
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
 * @method
 * @callback failureCallback
 * @callback successCallback
 * @param {Object} data - request data
 * @param {Object} [options] - request options
 * @param {failureCallback} [onFailure] - failure callback
 * @param {successCallback} [onSuccess] - success callback
 * @return {{
 *   type: string,
 *   payload: {url: string, method: string, data: *, options: *},
 *   onFailure: failureCallback,
 *   onSuccess: successCallback
 * }}
 */
const refreshAccessToken = ({
  data, options, onFailure, onSuccess,
} = {}) => ({
  type: REFRESH_ACCESS_TOKEN,
  payload: {
    url: '/refresh',
    method: 'post',
    ...options,
    data,
  },
  onFailure,
  onSuccess,
});

/**
 * Creates action for successful refreshed token.
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
 * @method
 * @param {Object} state
 * @return {*}
 */
const getState = state => state[name];

/**
 * Returns request errors.
 * @method
 * @param {Object} state
 * @return {Object[]}
 */
const getErrors = state => getState(state).errors;

/**
 * Returns user's sign in credentials.
 * @method
 * @param {Object} state
 * @return {*}
 */
const getCredentials = state => getState(state).credentials;

/**
 * Returns user's profile.
 * @method
 * @param {Object} state
 * @return {*}
 */
const getProfile = state => getState(state).profile;

/**
 * Checks if user is authenticated.
 * @method
 * @param {Object} state
 * @return {boolean}
 */
const isAuthenticated = state => getState(state).isAuthenticated;

export const selectors = {
  getCredentials,
  getErrors,
  getState,
  getProfile,
  isAuthenticated,
};


/*
 * LOGIC
 */

/**
 * Logic used for handling profile fetching.
 * @method
 */
const fetchProfileLogic = createLogic({
  type: [
    FETCH_PROFILE,
  ],
  cancelType: [
    FETCH_PROFILE_CANCEL,
    LOGOUT,
  ],
  async process(
    { action: { payload, onFailure, onSuccess }, httpClient, cancelled$ },
    dispatch,
    done,
  ) {
    try {
      const response = await httpClient.cancellable(payload, cancelled$);
      const { data, status } = response;

      if (status === 200 || status === 204) {
        dispatch(fetchProfileSuccess(data));

        if (onSuccess) {
          onSuccess();
        }
      } else {
        dispatch(fetchProfileFailure(data));

        if (onFailure) {
          onFailure();
        }
      }
    } catch ({ response }) {
      const { data } = response;

      dispatch(fetchProfileFailure(data));

      if (onFailure) {
        onFailure();
      }
    }

    done();
  },
});

/**
 * Logic used for handling profile fetching on successful login attempt.
 * @method
 */
const fetchProfileOnLoginSuccessLogic = createLogic({
  type: [
    LOGIN_SUCCESS,
  ],
  cancelType: [
    FETCH_PROFILE_CANCEL,
  ],
  async process(options, dispatch, done) {
    dispatch(fetchProfile());
    done();
  },
});

/**
 * Logic used for handling user login.
 * @method
 */
const loginLogic = createLogic({
  type: [
    LOGIN,
  ],
  async process(
    { action: { payload, onFailure, onSuccess }, httpClient },
    dispatch,
    done,
  ) {
    try {
      const response = await httpClient(payload);
      const { data, status } = response;

      if (status === 200 || status === 204) {
        dispatch(loginSuccess(data));

        if (onSuccess) {
          onSuccess();
        }
      } else {
        dispatch(loginFailure(data));

        if (onFailure) {
          onFailure();
        }
      }
    } catch ({ response }) {
      const { data } = response;

      dispatch(loginFailure(data));

      if (onFailure) {
        onFailure();
      }
    }

    done();
  },
});

/**
 * Logic used for handling user logout.
 * @method
 */
const logoutLogic = createLogic({
  type: [
    LOGOUT,
  ],
  async process(
    { action: { payload, onSuccess }, httpClient, getState: getReduxState },
    dispatch,
    done,
  ) {
    if (isAuthenticated(getReduxState())) {
      const { accessToken, refreshToken } = getCredentials(getReduxState());
      const data = {
        accessToken,
        refreshToken,
      };

      httpClient({ ...payload, data });

      dispatch(logoutSuccess());

      if (onSuccess) {
        onSuccess();
      }
    }

    done();
  },
});

/**
 * Logic used for handling authorization error.
 * @method
 */
const unauthorizedLogic = createLogic({
  type: [
    ERROR_UNAUTHORIZED,
  ],
  async process({ action: { payload }, getState: getReduxState }, dispatch, done) {
    const state = getReduxState();
    const isUserAuthenticated = isAuthenticated(state);

    if (isUserAuthenticated) {
      dispatch(logout(payload));
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

/**
 * Default state model.
 * @type {object}
 * @property {object} credentials - user authentication credentials
 * @property {object|null} error - submission error
 * @property {boolean} isAuthenticated - determines if user is authenticated
 * @property {object} profile - stores user profile information
 */
export const defaultInitialState = {
  credentials: {},
  errors: [],
  isAuthenticated: false,
  profile: {},
};

/**
 * Module's reducer function.
 * @method
 * @param {object} initialState - allows initializing reducer with custom state
 * @return {object}
 */
const reducer = (initialState = defaultInitialState) => (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PROFILE_SUCCESS:
      return {
        ...state,
        errors: initialState.errors,
        isAuthenticated: true,
        profile: action.data,
      };
    case LOGIN:
      return {
        ...state,
        errors: initialState.errors,
      };
    case FETCH_PROFILE_FAILURE:
    case LOGIN_FAILURE:
      return {
        ...state,
        errors: action.errors,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        credentials: {
          ...action.data,
        },
        errors: initialState.errors,
        isAuthenticated: true,
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        credentials: initialState.credentials,
        errors: initialState.errors,
        isAuthenticated: false,
        profile: initialState.profile,
      };
    case REFRESH_ACCESS_TOKEN_SUCCESS:
      return {
        ...state,
        credentials: {
          ...action.data,
        },
        errors: initialState.errors,
        isAuthenticated: true,
      };
    default:
      return state;
  }
};

export default reducer;
