import sanitizeSchema from '../utils/sanitizeSchema';

/**
 * Logs request details to console.
 *
 * @method
 * @param {Object} request
 * @return {Object} - axios config schema
 */
export default function requestLogInterceptor(request) {
  const { baseURL, url } = request;

  // eslint-disable-next-line no-console
  console.log(`[Request] - ${baseURL + url}`, request);

  return sanitizeSchema(request);
}
