/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';
import initializeStore from './store';

const isServer = typeof window === 'undefined';
const __NEXT_REDUX_STORE__ = '__NEXT_REDUX_STORE__';

function getOrCreateStore(initialState) {
  // Always make a new store if server, otherwise state is shared between requests
  if (isServer) {
    return initializeStore(initialState);
  }

  // Create store if unavailable on the client and set it on the window object
  if (!window[__NEXT_REDUX_STORE__]) {
    window[__NEXT_REDUX_STORE__] = initializeStore(initialState);
  }
  return window[__NEXT_REDUX_STORE__];
}

export default App => (
  class AppWithRedux extends React.Component {
    static async getInitialProps(appContext) {
      // Get or Create the store with `undefined` as initialState
      // This allows you to set a custom default initialState
      const reduxStore = getOrCreateStore();

      // Provide the store to getInitialProps of pages
      const extendedAppContext = {
        ...appContext,
        ctx: {
          ...appContext.ctx,
          store: reduxStore,
        },
      };

      let appProps = {};
      if (typeof App.getInitialProps === 'function') {
        appProps = await App.getInitialProps.call(App, extendedAppContext);
      }

      const getProps = () => ({
        ...appProps,
        initialReduxState: reduxStore.getState(),
      });

      if (isServer) {
        return reduxStore.logicMiddleware.whenComplete(getProps);
      }

      return getProps();
    }

    static propTypes = {
      initialReduxState: PropTypes.shape({}).isRequired,
    };

    constructor(props) {
      super(props);
      this.reduxStore = getOrCreateStore(props.initialReduxState);
    }

    render() {
      return <App {...this.props} reduxStore={this.reduxStore} />;
    }
  }
);
