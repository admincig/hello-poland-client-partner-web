const createPersistedStateGetter = localStorageKey => () => {
  let state;

  try {
    state = JSON.parse(localStorage.getItem(localStorageKey));
  } catch (e) {
    state = null;
  }

  return state;
};

export default createPersistedStateGetter;
