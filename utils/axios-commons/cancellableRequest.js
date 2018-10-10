import axios from 'axios';

/**
 * Adds support for cancelable requests.
 *
 * @method
 * @param options - axios payload options
 * @param cancelled$ - cancelled$ observable from redux-logic
 * @return { Promise }
 */
export default function cancellableRequest(options, cancelled$) {
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
