import sanitizeSchema from '../utils/sanitizeSchema';

/**
 * Standard error interceptor.
 *
 * @method
 * @param {Object} error - axios config schema
 * @return {Promise<Error>}
 */
export default function errorInterceptor(error) {
  return Promise.reject(sanitizeSchema(error));
}
