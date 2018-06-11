import axios from 'axios';
import cloneDeep from 'lodash/cloneDeep';

export default axios;


/*
 * HELPER FUNCTIONS
 */

export function compose(...fns) {
  if (fns.length === 0) {
    return arg => arg;
  }

  if (fns.length === 1) {
    return fns[0];
  }

  return fns.reduce((a, b) => (...args) => a(b(...args)));
}

export const createCancellableRequest = httpClient => (options, cancelled$) => {
  if (!cancelled$) {
    // eslint-disable-next-line no-console
    console.error('Missing cancelled$ argument');
  }

  const source = axios.CancelToken.source(); // axios.CancelToken

  cancelled$.subscribe(() => {
    source.cancel();
  });

  return httpClient({
    cancelToken: source.token,
    ...options,
  });
};

const sanitizeSchema = (axiosSchema) => {
  const schema = {
    ...axiosSchema,
  };

  delete schema.redux;
  delete schema.store;

  return schema;
};

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
 * @param {Object} error - axios config schema
 * @return {Promise<Error>}
 */
function errorInterceptor(error) {
  return Promise.reject(sanitizeSchema(error));
}

/**
 * Logs axios error details to console.
 *
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
 * @param {Object} response - axios config schema
 * @return {Promise<Error> || Object}
 */
async function JWTHTTPUnauthorizedInterceptor(response) {
  const { config, response: { status } } = response;

  if (status !== 401) {
    return errorInterceptor(response);
  }

  const { store, redux: { actions, selectors } } = response;
  const state = store.getState();
  const credentials = selectors.getCredentials(state);

  if (!credentials) {
    return errorInterceptor(response);
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

  try {
    const ax = axios.create();
    const { data } = await ax(payload);
    const { accessToken: nextAccessToken, refreshToken: nextRefreshToken } = data;

    store.dispatch(actions.refreshAccessTokenSuccess({
      accessToken: nextAccessToken,
      refreshToken: nextRefreshToken,
    }));
  } catch (error) {
    store.dispatch(actions.errorUnauthorized());

    return errorLogInterceptor(`[HTTPClient] - ${status} - Session expired.`)(error);
  }

  return axios(sanitizeSchema(config));
}

/**
 * Adds JWT Authorization header
 *
 * @param request - axios config schema
 * @return {Object} - updated axios config schema
 */
function JWTInterceptor(request) {
  const { redux, store, url } = request;
  const state = store.getState();
  const { selectors } = redux;

  const credentials = selectors.getCredentials(state);

  if (!credentials) {
    return sanitizeSchema(request);
  }

  const { accessToken, refreshToken } = credentials;
  const token = url === '/auth/refresh' ? refreshToken : accessToken;

  return {
    ...cloneDeep(sanitizeSchema(request)),
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
