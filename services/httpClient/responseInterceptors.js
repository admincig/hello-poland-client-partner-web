import responseJWTInterceptor from '@fream/axios-commons/interceptors/responseJWTInterceptor';
import {
  actions as profileActions,
  selectors as profileSelectors,
} from 'redux/profile';

function getResponseInterceptors(reduxStore) {
  return [
    { // JWT response interceptor
      onFulfilled: axiosResponse => axiosResponse,
      onRejected: responseJWTInterceptor({
        getCredentials: () => {
          const state = reduxStore.getState();

          return profileSelectors.getCredentials(state);
        },
        getRefreshConfig: () => {
          const state = reduxStore.getState();
          const data = profileSelectors.getCredentials(state);
          const options = {
            headers: {
              authorization: `Bearer ${data.refreshToken}`,
            },
          };

          const { payload } = profileActions.refreshAccessToken({ data, options });

          return payload;
        },
        onRefreshFailure: (axiosRefreshError) => {
          reduxStore.dispatch(profileActions.errorUnauthorized(axiosRefreshError));
        },
        onRefreshSuccess: (axiosRefreshResponse) => {
          const { data } = axiosRefreshResponse;

          reduxStore.dispatch(profileActions.refreshAccessTokenSuccess(data));
        },
      }),
    },
  ];
}

export default getResponseInterceptors;
