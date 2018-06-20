import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createLogicMiddleware } from 'redux-logic';
import config from 'config';
import createHTTPClient from 'services/httpClient';
import rootReducer from './rootReducer';
import logic from './logic';
import profileSubscriber from './profileSubscriber';

export default function createInitializedStore(initialState = { config }) {
  const logicMiddleware = createLogicMiddleware(logic);

  const store = createStore(
    rootReducer,
    {
      ...initialState,
      view: {
        title: config.public.name,
      },
    },
    composeWithDevTools((
      applyMiddleware((
        logicMiddleware
      ))
    )),
  );

  logicMiddleware.addDeps({
    httpClient: createHTTPClient(store),
  });

  store.logicMiddleware = logicMiddleware;

  store.subscribe(profileSubscriber(store));

  // Uncomment to debug redux in browser console
  // logicMiddleware.monitor$.subscribe(o$ => console.log(o$));

  return store;
}
