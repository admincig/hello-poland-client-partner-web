import axios from 'axios';
// import cancellableRequest from '@fream/axios-commons/cancellableRequest';
// import errorInterceptor from '@fream/axios-commons/interceptors/errorInterceptor';
// import JWTHTTPUnauthorizedInterceptor from '@fream/axios-commons/interceptors/JWTHTTPUnauthorizedInterceptor';
// import JWTInterceptor from '@fream/axios-commons/interceptors/JWTInterceptor';
import cancellableRequest from 'utils/axios-commons/cancellableRequest';
import errorInterceptor from 'utils/axios-commons/interceptors/errorInterceptor';
// import errorLogInterceptor from 'utils/axios-commons/interceptors/errorLogInterceptor';
// import requestLogInterceptor from 'utils/axios-commons/interceptors/requestLogInterceptor';
// import responseLogInterceptor from 'utils/axios-commons/interceptors/responseLogInterceptor';
import JWTHTTPUnauthorizedInterceptor from 'utils/axios-commons/interceptors/JWTHTTPUnauthorizedInterceptor';
import JWTInterceptor from 'utils/axios-commons/interceptors/JWTInterceptor';
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

export default function createHTTPClient(store, axiosConfig) {
  const instance = axios.create();

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
        args => resolve({ ...args, store, redux }),
        args => reject({
          ...args, axiosConfig, store, redux,
        }),
      );
    });
  }

  if (requestInterceptors.length) {
    requestInterceptors.forEach(({ redux, reject, resolve }) => {
      instance.interceptors.request.use(
        args => resolve({ ...args, store, redux }),
        args => reject({ ...args, store, redux }),
      );
    });
  }

  return instance;
}
