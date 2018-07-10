import { types as profileTypes } from 'redux/profile';

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

export const withLocalStorageProfile = (initialState) => {
  if (window) {
    const ls = window.localStorage;
    const profile = ls.getItem(LS_KEY);

    if (profile) {
      return {
        ...initialState,
        profile: JSON.parse(profile),
      };
    }
  }

  return initialState;
};
