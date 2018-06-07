import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createLogicMiddleware } from 'redux-logic';
import config from 'config';
import httpClient from '../httpClient';
import rootReducer from './rootReducer';
import logic from './logic';

export default function createInitializedStore(initialState = { config }) {
  const logicMiddleware = createLogicMiddleware(logic, { httpClient });

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

  store.logicMiddleware = logicMiddleware;

  // Uncomment to debug redux in browser console
  // logicMiddleware.monitor$.subscribe(o$ => console.log(o$));

  return store;
}
