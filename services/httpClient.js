import axios from 'axios';
import { compose } from 'redux';
import cancellableRequest from '@fream/axios-commons/cancellableRequest';
import withRedux from '@fream/axios-commons/utils/withRedux';
import errorInterceptor from '@fream/axios-commons/interceptors/errorInterceptor';
import JWTHTTPUnauthorizedInterceptor from '@fream/axios-commons/interceptors/JWTHTTPUnauthorizedInterceptor';
import JWTInterceptor from '@fream/axios-commons/interceptors/JWTInterceptor';
import { selectors as configSelectors } from 'redux/config';
import {
  actions as profileActions,
  selectors as profileSelectors,
} from '@hello-poland/commons/redux/profile';

const requestInterceptors = [
  {
    redux: {
      selectors: profileSelectors,
    },
    reject: errorInterceptor,
    resolve: JWTInterceptor,
  },
  // {
  //   reject: errorLogInterceptor('[Request Error]'),
  //   resolve: requestLogInterceptor,
  // },
];

const responseInterceptors = [
  {
    redux: {
      actions: profileActions,
      selectors: {
        ...profileSelectors,
        getAppConfig: configSelectors.getAppConfig,
      },
    },
    reject: JWTHTTPUnauthorizedInterceptor,
    resolve: response => response,
  },
  // {
  //   reject: errorLogInterceptor('[Response Error]'),
  //   resolve: responseLogInterceptor,
  // },
];

/*
 * INITIALIZE
 */

export default function createHTTPClient(store) {
  const instance = axios.create();
  const state = store.getState();
  const appConfig = configSelectors.getAppConfig(state);
  const { axios: axiosConfig } = appConfig.public;

  // Configure axios
  Object.entries(axiosConfig).forEach(([key, value]) => {
    instance.defaults[key] = value;
  });

  // Add request cancellation capabilities (not part of Axios API)
  instance.cancellable = cancellableRequest;

  // Initialize interceptors
  if (responseInterceptors.length) {
    responseInterceptors.forEach(({ redux, reject, resolve }) => {
      instance.interceptors.response.use(
        compose(resolve, withRedux(store, redux)),
        compose(reject, withRedux(store, redux)),
      );
    });
  }

  if (requestInterceptors.length) {
    requestInterceptors.forEach(({ redux, reject, resolve }) => {
      instance.interceptors.request.use(
        compose(resolve, withRedux(store, redux)),
        compose(reject, withRedux(store, redux)),
      );
    });
  }

  return instance;
}
