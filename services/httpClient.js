import client, { compose, createCancellableRequest, interceptors, withRedux } from 'services/axiosClient';
import { selectors as configSelectors } from 'redux/config';
import {
  actions as profileActions,
  selectors as profileSelectors,
} from 'redux/profile';

const {
  errorLogInterceptor,
  errorInterceptor,
  JWTHTTPUnauthorizedInterceptor,
  JWTInterceptor,
  responseLogInterceptor,
  requestLogInterceptor,
} = interceptors;


const requestInterceptors = [
  {
    reject: errorLogInterceptor('[Request Error]'),
    resolve: requestLogInterceptor,
  },
  {
    redux: {
      selectors: profileSelectors,
    },
    reject: errorInterceptor,
    resolve: JWTInterceptor,
  },
];

const responseInterceptors = [
  {
    reject: errorLogInterceptor('[Response Error]'),
    resolve: responseLogInterceptor,
  },
  {
    redux: {
      actions: profileActions,
      selectors: profileSelectors,
    },
    reject: JWTHTTPUnauthorizedInterceptor,
    resolve: response => response,
  },
];

/*
 * INITIALIZE
 */

export default function createHttpClient(store) {
  const instance = client.create();
  const state = store.getState();
  const appConfig = configSelectors.getAppConfig(state);
  const { axios: axiosConfig } = appConfig.public;

  // Configure axios
  Object.entries(axiosConfig).forEach((entry) => {
    const [key, value] = entry;

    instance.defaults[key] = value;
  });

  // Add request cancellation capabilities (not part of Axios API)
  instance.cancellable = createCancellableRequest(instance);

  // Initialize interceptors
  if (responseInterceptors.length) {
    responseInterceptors.forEach((interceptor) => {
      const { redux, reject, resolve } = interceptor;

      instance.interceptors.response.use(
        compose(resolve, withRedux(store, redux)),
        compose(reject, withRedux(store, redux)),
      );
    });
  }

  if (requestInterceptors.length) {
    requestInterceptors.forEach((interceptor) => {
      const { redux, reject, resolve } = interceptor;

      instance.interceptors.request.use(
        compose(resolve, withRedux(store, redux)),
        compose(reject, withRedux(store, redux)),
      );
    });
  }

  return instance;
}
