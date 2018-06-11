/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';
import { connect, Provider } from 'react-redux';
import createInitializedStore from './store';

const __NEXT_REDUX_STORE__ = '__NEXT_REDUX_STORE__';

/**
 * Checks if code is invoke in node
 *
 * @method
 * @see https://github.com/iliakan/detect-node
 * @return {boolean}
 */
const isNodeProcess = () => Object.prototype.toString.call(global.process) === '[object process]';

/**
 * Checks if store exists
 *
 * @method
 * @param {object} store
 * @return {boolean}
 */
const isStorePresent = store => !!(store && store.dispatch);

/**
 * Returns redux store
 *
 * @method
 * @param {function} storeInitializer
 * @param {object} [initialState]
 * @return {*}
 */
const getOrCreateStore = (storeInitializer, initialState) => {
  // Always initialize new store instance if invoked on server side
  if (isNodeProcess() || typeof window === 'undefined') {
    return storeInitializer(initialState);
  }

  // Persist store in global variables if invoked on client side
  if (!window[__NEXT_REDUX_STORE__]) {
    window[__NEXT_REDUX_STORE__] = storeInitializer(initialState);
  }

  return window[__NEXT_REDUX_STORE__];
};


export default (...connectArgs) => (Component) => {
  const ComponentWithRedux = (props = {}) => {
    const { store, initialProps, initialState } = props;

    // Connect page to redux with connect arguments
    const ConnectedComponent = connect(...connectArgs)(Component);

    const reduxStore = isStorePresent(store)
      ? store
      : getOrCreateStore(createInitializedStore, initialState);

    // Wrap component using redux Provider with store
    // Create connected page with initialProps
    return React.createElement(
      Provider,
      { store: reduxStore },
      React.createElement(ConnectedComponent, initialProps),
    );
  };

  ComponentWithRedux.getInitialProps = async (props = {}) => {
    const isServer = isNodeProcess();
    const store = getOrCreateStore(createInitializedStore);

    // Run page getInitialProps with store and isServer
    const initialProps = Component.getInitialProps
      ? await Component.getInitialProps({ ...props, isServer, store })
      : {};

    const getProps = () => ({
      store,
      initialState: store.getState(),
      initialProps,
    });

    if (isServer) {
      return store.logicMiddleware.whenComplete(getProps);
    }

    return getProps();
  };

  ComponentWithRedux.propTypes = {
    store: PropTypes.shape().isRequired,
    initialProps: PropTypes.shape({}).isRequired,
    initialState: PropTypes.shape({}).isRequired,
  };

  return ComponentWithRedux;
};
