import axios from 'axios';
import _cloneDeep from 'lodash/cloneDeep';

/*
 * HELPER FUNCTIONS
 */

/**
 * Adds support for cancelable requests.
 *
 * @method
 * @param options - axios payload options
 * @param cancelled$ - cancelled$ observable from redux-logic
 * @return { Promise }
 */
export function cancellableRequest(options, cancelled$) {
  if (!cancelled$) {
    // eslint-disable-next-line no-console
    console.error('Missing cancelled$ argument');
  }

  const source = axios.CancelToken.source();

  cancelled$.subscribe(() => {
    source.cancel();
  });

  return this({
    cancelToken: source.token,
    ...options,
  });
}


/**
 * Removes custom keys from axios config schema.
 *
 * @method
 * @param {Object} axiosSchema
 * @return {Object}
 */
const sanitizeSchema = (axiosSchema) => {
  const schema = {
    ...axiosSchema,
  };

  delete schema.redux;
  delete schema.store;

  return schema;
};

/**
 * Exposes redux to axios interceptors.
 *
 * @method
 * @param {Object} store - redux store
 * @param {Object} [redux] - necessary duck API
 * @param {Object} [redux.actions] - duck actions
 * @param {Object} [redux.selectors] - duck selectors
 * @return {function(*): {redux: *, store: *}}
 */
export function withRedux(store, redux) {
  return args => ({
    ...args,
    redux,
    store,
  });
}


/*
 * INTERCEPTORS
 */

/**
 * Standard error interceptor.
 *
 * @method
 * @param {Object} error - axios config schema
 * @return {Promise<Error>}
 */
function errorInterceptor(error) {
  return Promise.reject(sanitizeSchema(error));
}

/**
 * Logs axios error details to console.
 *
 * @method
 * @param label - error label
 * @return {*} - axios error
 */
function errorLogInterceptor(label) {
  return (error) => {
    // eslint-disable-next-line no-console
    console.log(`${label}`, error);

    return errorInterceptor(error);
  };
}

/**
 * Logs request details to console.
 *
 * @method
 * @param {Object} request
 * @return {Object} - axios config schema
 */
const requestLogInterceptor = (request) => {
  const { baseURL, url } = request;

  // eslint-disable-next-line no-console
  console.log(`[Request] - ${baseURL + url}`, request);

  return sanitizeSchema(request);
};

/**
 * Logs response details to console.
 *
 * @method
 * @param response - axios config schema
 * @return {Object} - axios config schema
 */
const responseLogInterceptor = (response) => {
  const { config: { url } } = response;

  // eslint-disable-next-line no-console
  console.log(`[Response] - ${url}`, response);

  return sanitizeSchema(response);
};

/**
 * Handles unauthorized responses.
 *
 * @method
 * @param {Object} axiosResponse - axios config schema
 * @return {Promise<Error> || Object}
 */

let refreshTokenRequestPromise = null;

function clearTokenRequest() {
  refreshTokenRequestPromise = null;
}

async function refreshTokenRequest(axiosConfig, payload) {
  if (refreshTokenRequestPromise) {
    return refreshTokenRequestPromise;
  }

  const ax = axios.create(axiosConfig);
  refreshTokenRequestPromise = ax(payload);

  return refreshTokenRequestPromise;
}

async function JWTHTTPUnauthorizedInterceptor(axiosResponse) {
  console.log('JWTHTTPUnauthorizedInterceptor', axiosResponse);
  const { config, response } = axiosResponse;
  const { status } = response || {};


  if (status !== 401) {
    return errorInterceptor(axiosResponse);
  }

  const { store, redux: { actions, selectors } } = axiosResponse;
  const state = store.getState();
  const credentials = selectors.getCredentials(state);


  if (!credentials) {
    return errorInterceptor(axiosResponse);
  }

  const { accessToken, refreshToken } = credentials;
  const { payload } = actions.refreshAccessToken({
    data: {
      accessToken,
      refreshToken,
    },
    headers: {
      authorization: `Bearer ${refreshToken}`,
    },
  });

  const appConfig = selectors.getAppConfig(state);
  const { axios: axiosConfig } = appConfig.public;
  let nextAccessToken;

  try {
    const { data } = await refreshTokenRequest(axiosConfig, payload);

    store.dispatch(actions.refreshAccessTokenSuccess({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    }));

    nextAccessToken = data.accessToken;
  } catch (error) {
    const { data } = payload;

    store.dispatch(actions.errorUnauthorized({ data }));

    return errorLogInterceptor(`[HTTPClient] - ${status} - Session expired.`)(error);
  } finally {
    clearTokenRequest();
  }

  return axios(sanitizeSchema({
    ...config,
    headers: {
      ...config.headers,
      authorization: `Bearer ${nextAccessToken}`,
    },
  }));
}

/**
 * Adds JWT Authorization header.
 *
 * @method
 * @param axiosRequest - axios config schema
 * @return {Object} - updated axios config schema
 */
function JWTInterceptor(axiosRequest) {
  const { redux, store, url } = axiosRequest;
  const state = store.getState();
  const { selectors } = redux;

  const credentials = selectors.getCredentials(state);


  if (!credentials) {
    return sanitizeSchema(axiosRequest);
  }

  const { accessToken, refreshToken } = credentials;
  const token = url.indexOf('refresh') !== -1 ? refreshToken : accessToken;


  return {
    ..._cloneDeep(sanitizeSchema(axiosRequest)),
    headers: {
      authorization: `Bearer ${token}`,
    },
  };
}


export const interceptors = {
  errorLogInterceptor,
  errorInterceptor,
  JWTHTTPUnauthorizedInterceptor,
  JWTInterceptor,
  responseLogInterceptor,
  requestLogInterceptor,
};
