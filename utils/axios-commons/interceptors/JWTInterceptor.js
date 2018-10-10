import _cloneDeep from 'lodash/cloneDeep';
import sanitizeSchema from '../utils/sanitizeSchema';

/**
 * Adds JWT Authorization header.
 *
 * @method
 * @param axiosRequest - axios config schema
 * @return {Object} - updated axios config schema
 */
export default function JWTInterceptor(axiosRequest) {
  const { redux, store, url } = axiosRequest;
  const state = store.getState();
  const { selectors } = redux;

  const credentials = selectors.getCredentials(state);

  if (!credentials || !Object.keys(credentials).length) {
    return sanitizeSchema(axiosRequest);
  }

  const { accessToken, refreshToken } = credentials;
  const token = url.indexOf('refresh') !== -1 ? refreshToken : accessToken;


  return {
    ..._cloneDeep(sanitizeSchema(axiosRequest)),
    headers: {
      ...axiosRequest.headers,
      authorization: `Bearer ${token}`,
    },
  };
}
