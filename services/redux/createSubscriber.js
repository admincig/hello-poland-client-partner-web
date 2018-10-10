const isServer = typeof window === 'undefined';

const createSubscriber = (storeKeyToSubscribe, localStorageKey) => {
  let currentState;

  return store => () => {
    const prevState = currentState;
    currentState = store.getState()[storeKeyToSubscribe];

    if (!isServer && currentState !== prevState) {
      localStorage.setItem(localStorageKey, JSON.stringify(currentState));
    }
  };
};

export default createSubscriber;
