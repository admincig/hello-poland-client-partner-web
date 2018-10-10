import sanitizeSchema from '../utils/sanitizeSchema';

/**
 * Logs response details to console.
 *
 * @method
 * @param response - axios config schema
 * @return {Object} - axios config schema
 */
export default function responseLogInterceptor(response) {
  const { config: { url } } = response;

  // eslint-disable-next-line no-console
  console.log(`[Response] - ${url}`, response);

  return sanitizeSchema(response);
}
