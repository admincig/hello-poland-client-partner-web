import axios from 'axios';
import errorInterceptor from './errorInterceptor';
import errorLogInterceptor from './errorLogInterceptor';
import sanitizeSchema from '../utils/sanitizeSchema';

let refreshTokenRequestPromise = null;

/**
 * Clears refreshTokenRequestPromise to prevent side effects.
 *
 * @method
 */
function clearTokenRequest() {
  refreshTokenRequestPromise = null;
}

/**
 * Creates promise from refresh token request.
 *
 * @method
 * @param {Object} axiosConfig - axios config schema
 * @param {Object} payload - request payload
 * @return {Promise<*>}
 */
async function refreshTokenRequest(axiosConfig, payload) {
  if (refreshTokenRequestPromise) {
    return refreshTokenRequestPromise;
  }

  const config = {
    ...axiosConfig,
    ...payload,
  };

  refreshTokenRequestPromise = axios(config);

  return refreshTokenRequestPromise;
}

/**
 * Handles unauthorized responses.
 *
 * @method
 * @param {Object} axiosResponse - axios config schema
 * @return {Promise<Error> || Object}
 */
export default async function JWTHTTPUnauthorizedInterceptor(axiosResponse) {
  const { config, response } = axiosResponse;
  const { status } = response || {};


  if (status !== 401) {
    return errorInterceptor(axiosResponse);
  }

  const { axiosConfig, store, redux: { actions, selectors } } = axiosResponse;
  const state = store.getState();
  const credentials = selectors.getCredentials(state);


  if (!credentials) {
    return errorInterceptor(axiosResponse);
  }

  const { refreshToken } = credentials;

  const reqOptions = {
    headers: {
      authorization: `Bearer ${refreshToken}`,
    },
  };

  const { payload } = actions.refreshAccessToken({ options: reqOptions });

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
