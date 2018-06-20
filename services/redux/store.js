import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createLogicMiddleware } from 'redux-logic';
import { createMigrate, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import config from 'config';
import createHTTPClient from 'services/httpClient';
import storeMigrations from './store-migrations';
import rootReducer from './rootReducer';
import logic from './logic';

export default function createInitializedStore(initialState = { config }) {
  const { persistance } = config.public;
  let persistConfig = {
    debug: true,
    key: 'root', // AsyncStorage key
    migrate: createMigrate(storeMigrations, {
      debug: true,
    }),
    storage,
  };

  if (persistance && Object.keys(persistance).length) {
    persistConfig = {
      ...persistConfig,
      ...persistance,
    };
  }

  const logicMiddleware = createLogicMiddleware(logic);
  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const store = createStore(
    persistedReducer,
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

  // Uncomment to debug redux in browser console
  // logicMiddleware.monitor$.subscribe(o$ => console.log(o$));

  return store;
}
