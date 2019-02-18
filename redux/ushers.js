import { createLogic } from 'redux-logic';

/**
 * Defines set of methods for managing ushers.
 * @module Ushers
 */

/**
 * Base API URL.
 * @type {string}
 */
export const apiURL = '/ushers';


/**
 * Module name.
 * @type {string}
 */
export const name = 'ushers';

/**
 * Reducer prefix.
 * @type {string}
 */
const prefix = `${name}/`;


/*
 * TYPES
 */

/**
 * Type used for handling entity list fetching.
 * @type {string}
 */
const FETCH_LIST = `${prefix}FETCH_LIST`;

/**
 * Type used for handling entity list fetching cancellation.
 * @type {string}
 */
const FETCH_LIST_CANCEL = `${prefix}FETCH_LIST_CANCEL`;

/**
 * Type used for handling entity list fetching failure.
 * @type {string}
 */
const FETCH_LIST_FAILURE = `${prefix}FETCH_LIST_FAILURE`;

/**
 * Type used for handling entity list fetching success.
 * @type {string}
 */
const FETCH_LIST_SUCCESS = `${prefix}FETCH_LIST_SUCCESS`;


export const types = {
  FETCH_LIST,
  FETCH_LIST_CANCEL,
  FETCH_LIST_FAILURE,
  FETCH_LIST_SUCCESS,
};


/*
 * ACTIONS
 */

/**
 * Creates action with list request details.
 * @method
 * @param {Object} params
 * @param {Object} [params.data] - request data
 * @param {Object} [params.options] - request config
 * @param {failureCallback} [params.onFailure] - failure callback
 * @param {successCallback} [params.onSuccess] - success callback
 * @return {{
 *   type: string,
 *   payload: {url: string, method: string, data: *, options: *},
 *   onFailure: failureCallback,
 *   onSuccess: successCallback
 * }}
 */
const fetchList = ({
  data, options, onFailure, onSuccess,
} = {}) => ({
  type: FETCH_LIST,
  payload: {
    url: apiURL,
    method: 'get',
    ...options,
    data,
  },
  onFailure,
  onSuccess,
});

/**
 * Creates action for list request cancelling.
 * @method
 * @return {{type: string}}
 */
const fetchListCancel = () => ({
  type: FETCH_LIST_CANCEL,
});

/**
 * Creates action for list request failing.
 * @method
 * @param {Object} params - axios response schema
 * @param params.data - response body
 * @param params.status - response status
 * @return {{
 *   type: string,
 *   error: {data, status: number}
 * }}
 */
const fetchListFailure = ({ data, status } = {}) => ({
  type: FETCH_LIST_FAILURE,
  error: {
    data,
    status,
  },
});

/**
 * Creates action for successful list request.
 * @method
 * @param {Object} data - response body
 * @return {{type: string, data: *}}
 */
const fetchListSuccess = data => ({
  type: FETCH_LIST_SUCCESS,
  data,
});


export const actions = {
  fetchList,
  fetchListCancel,
  fetchListFailure,
  fetchListSuccess,
};


/*
 * SELECTORS
 */

/**
 * Returns current state.
 * @method
 * @param {Object} state - redux state
 * @return {*}
 */
const getState = state => state[name];

/**
 * Returns request error.
 * @method
 * @param {Object} state - redux state
 * @return {*}
 */
const getError = state => getState(state).error;

/**
 * Returns currently loaded SightEvents list.
 * @method
 * @param {Object} state - redux state
 * @return {*}
 */
const getUshers = state => getState(state).list;

export const selectors = {
  getError,
  getState,
  getUshers,
};


/*
 * LOGIC
 */

/**
 * Logic used for handling entity list fetching.
 * @method
 */
const fetchListLogic = createLogic({
  type: [
    FETCH_LIST,
  ],
  cancelType: [
    FETCH_LIST_CANCEL,
  ],
  latest: true,
  async process(
    { action: { payload, onFailure, onSuccess }, httpClient, cancelled$ },
    dispatch,
    done,
  ) {
    try {
      const response = await httpClient.cancellable(payload, cancelled$);
      const { data, status } = response;

      if (status === 200) {
        dispatch(fetchListSuccess(data));

        if (onSuccess) {
          onSuccess();
        }
      } else {
        dispatch(fetchListFailure(response));

        if (onFailure) {
          onFailure();
        }
      }
    } catch ({ response }) {
      dispatch(fetchListFailure(response));

      if (onFailure) {
        onFailure();
      }
    }

    done();
  },
});


export const logic = {
  fetchListLogic,
};


/*
 * REDUCERS
 */

/**
 * Default state model.
 * @type {object}
 * @property {object|null} error - submission error
 * @property {object} item - current entity data
 * @property {object[]} list - entity list data
 */
export const defaultInitialState = {
  error: null,
  item: {},
  list: [],
};

/**
 * Module's reducer function.
 * @method
 * @param {object} initialState - allows initializing reducer with custom state
 * @return {object}
 */
const reducer = (initialState = defaultInitialState) => (state = initialState, action) => {
  switch (action.type) {
    case FETCH_LIST_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    case FETCH_LIST_SUCCESS:
      return {
        ...state,
        error: initialState.error,
        list: action.data.items,
      };
    default:
      return state;
  }
};

export default reducer;
