import axios from 'axios';
import cancellableRequest from '@fream/axios-commons/cancellableRequest';
import getRequestInterceptors from './requestInterceptors';
import getResponseInterceptors from './responseInterceptors';

/*
 * INITIALIZE
 */

export default function createHTTPClient(axiosConfig, store) {
  const instance = axios.create();
  const requestInterceptors = getRequestInterceptors(store);
  const responseInterceptors = getResponseInterceptors(store);

  // Configure axios
  Object.entries(axiosConfig).forEach(([key, value]) => {
    instance.defaults[key] = value;
  });

  // Add request cancellation capabilities (not part of Axios API)
  instance.cancellable = cancellableRequest;

  // Initialize interceptors
  if (requestInterceptors && requestInterceptors.length) {
    requestInterceptors.forEach(({ onFulfilled, onRejected }) => {
      instance.interceptors.request.use(onFulfilled, onRejected);
    });
  }

  if (responseInterceptors && responseInterceptors.length) {
    responseInterceptors.forEach(({ onFulfilled, onRejected }) => {
      instance.interceptors.response.use(onFulfilled, onRejected);
    });
  }

  return instance;
}
