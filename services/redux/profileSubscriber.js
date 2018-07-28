import {
  actions as profileActions,
  types as profileTypes,
} from '@hello-poland/commons/lib/redux/profile';

const LS_KEY = 'profile';

const isNodeProcess = () => Object.prototype.toString.call(global.process) === '[object process]';

export default store => () => {
  if (!isNodeProcess()) {
    const ls = window.localStorage;
    const state = store.getState();
    const { lastAction } = state.config;
    const {
      FETCH_PROFILE_SUCCESS,
      LOGIN_SUCCESS,
      LOGOUT_SUCCESS,
      REFRESH_ACCESS_TOKEN_SUCCESS,
    } = profileTypes;
    const isProfileDirty = lastAction === FETCH_PROFILE_SUCCESS
      || lastAction === LOGIN_SUCCESS
      || lastAction === LOGOUT_SUCCESS
      || lastAction === REFRESH_ACCESS_TOKEN_SUCCESS;

    if (isProfileDirty) {
      ls.setItem(LS_KEY, JSON.stringify(state.profile));
    }
  }
};

export const withLocalStorageProfile = ({ dispatch }) => {
  if (window) {
    const ls = window.localStorage;
    const lsProfile = ls.getItem(LS_KEY);

    if (lsProfile) {
      const { loginSuccess } = profileActions;
      const { credentials, isAuthenticated } = JSON.parse(lsProfile);

      if (isAuthenticated) {
        dispatch(loginSuccess(credentials));
      }
    }
  }
};
