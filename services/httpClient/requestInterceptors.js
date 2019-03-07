import errorInterceptor from '@fream/axios-commons/interceptors/errorInterceptor';
import requestJWTInterceptor from '@fream/axios-commons/interceptors/requestJWTInterceptor';
import { selectors as profileSelectors } from '@hello-poland/commons/redux/profile';

function getRequestInterceptors(reduxStore) {
  return [
    { // JWT request interceptor
      onFulfilled: requestJWTInterceptor({
        getCredentials: () => {
          const state = reduxStore.getState();

          return profileSelectors.getCredentials(state);
        },
      }),
      onRejected: errorInterceptor,
    },
  ];
}

export default getRequestInterceptors;
