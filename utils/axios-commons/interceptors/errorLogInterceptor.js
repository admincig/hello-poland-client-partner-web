import errorInterceptor from './errorInterceptor';

/**
 * Logs axios error details to console.
 *
 * @method
 * @param label - error label
 * @return {*} - axios error
 */
export default function errorLogInterceptor(label) {
  return (error) => {
    // eslint-disable-next-line no-console
    console.log(`${label}`, error);

    return errorInterceptor(error);
  };
}
