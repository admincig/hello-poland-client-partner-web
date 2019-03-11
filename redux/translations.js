import { createLogic } from 'redux-logic';

/**
 * Defines set of methods for managing translations.
 * @module Translations
 */

/**
 * Base API URL.
 * @type {string}
 */
export const apiURL = '/partner';


/**
 * Module name.
 * @type {string}
 */
export const name = 'translations';

/**
 * Reducer prefix.
 * @type {string}
 */
const prefix = `${name}/`;


/*
 * TYPES
 */

/**
 * Type used for handling change default language request.
 * @type {string}
 */
const CHANGE_DEFAULT = `${prefix}CHANGE_DEFAULT`;

/**
 * Type used for handling change default language request cancellation.
 * @type {string}
 */
const CHANGE_DEFAULT_CANCEL = `${prefix}CHANGE_DEFAULT_CANCEL`;

/**
 * Type used for handling change default language request failure.
 * @type {string}
 */
const CHANGE_DEFAULT_FAILURE = `${prefix}CHANGE_DEFAULT_FAILURE`;

/**
 * Type used for handling change default language request success.
 * @type {string}
 */
const CHANGE_DEFAULT_SUCCESS = `${prefix}CHANGE_DEFAULT_SUCCESS`;


export const types = {
  CHANGE_DEFAULT,
  CHANGE_DEFAULT_CANCEL,
  CHANGE_DEFAULT_FAILURE,
  CHANGE_DEFAULT_SUCCESS,
};


/*
 * ACTIONS
 */

/**
 * Creates action for password change request.
 * @method
 * @callback failureCallback
 * @callback successCallback
 * @param {Object} params
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
const changeDefault = ({
  id, options, data, onFailure, onSuccess,
} = {}) => ({
  type: CHANGE_DEFAULT,
  payload: {
    url: `${apiURL}/${id}/password`,
    method: 'patch',
    ...options,
    data,
  },
  onFailure,
  onSuccess,
});

/**
 * Creates action for password change request cancelling.
 * @method
 * @return {{type: string}}
 */
const changePasswordCancel = () => ({
  type: CHANGE_PASSWORD_CANCEL,
});

/**
 * Creates action for password change request failing.
 * @method
 * @param {Object} params - axios response schema
 * @param params.data - response body
 * @param params.status - response status
 * @return {{
 *   type: string,
 *   error: {data, status: number}
 * }}
 */
const changePasswordFailure = ({ data, status } = {}) => ({
  type: CHANGE_PASSWORD_FAILURE,
  error: {
    data,
    status,
  },
});

/**
 * Creates action for successful password change request.
 * @method
 * @return {{type: string}}
 */
const changePasswordSuccess = () => ({
  type: CHANGE_PASSWORD_SUCCESS,
});

/**
 * Creates action for profile change request.
 * @method
 * @callback failureCallback
 * @callback successCallback
 * @param {Object} params
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
const changeProfile = ({
  id, options, data, onFailure, onSuccess,
} = {}) => ({
  type: CHANGE_PROFILE,
  payload: {
    url: `${apiURL}/${id}`,
    method: 'patch',
    ...options,
    data,
  },
  onFailure,
  onSuccess,
});

/**
 * Creates action for password change request cancelling.
 * @method
 * @return {{type: string}}
 */
const changeProfileCancel = () => ({
  type: CHANGE_PROFILE_CANCEL,
});

/**
 * Creates action for password change request failing.
 * @method
 * @param {Object} params - axios response schema
 * @param params.data - response body
 * @param params.status - response status
 * @return {{
 *   type: string,
 *   error: {data, status: number}
 * }}
 */
const changeProfileFailure = ({ data, status } = {}) => ({
  type: CHANGE_PROFILE_FAILURE,
  error: {
    data,
    status,
  },
});

/**
 * Creates action for successful password change request.
 * @method
 * @return {{type: string}}
 */
const changeProfileSuccess = () => ({
  type: CHANGE_PROFILE_SUCCESS,
});

/**
 * Creates action with item request details.
 * @method
 * @param {Object} params
 * @param {number} params.id - item id
 * @param {Object} [params.options] - request config
 * @param {failureCallback} [params.onFailure] - failure callback
 * @param {successCallback} [params.onSuccess] - success callback
 * @return {{
 *   type: string,
 *   payload: {url: string, method: string, options: *},
 *   onFailure: failureCallback,
 *   onSuccess: successCallback
 * }}
 */
const fetchItem = ({
  id, options, onFailure, onSuccess,
} = {}) => ({
  type: FETCH_ITEM,
  payload: {
    url: `${apiURL}/${id}`,
    method: 'get',
    ...options,
  },
  onFailure,
  onSuccess,
});

/**
 * Creates action for item request cancelling.
 * @method
 * @return {{type: string}}
 */
const fetchItemCancel = () => ({
  type: FETCH_ITEM_CANCEL,
});

/**
 * Creates action for item request failing.
 * @method
 * @param {Object} params - axios response schema
 * @param params.data - response body
 * @param params.status - response status
 * @return {{
 *   type: string,
 *   error: {data, status: number}
 * }}
 */
const fetchItemFailure = ({ data, status } = {}) => ({
  type: FETCH_ITEM_FAILURE,
  error: {
    data,
    status,
  },
});

/**
 * Creates action for successful item request.
 * @method
 * @param {Object} data - response body
 * @return {{type: string, data: *}}
 */
const fetchItemSuccess = data => ({
  type: FETCH_ITEM_SUCCESS,
  data,
});


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
  changePassword,
  changePasswordCancel,
  changePasswordFailure,
  changePasswordSuccess,
  changeProfile,
  changeProfileCancel,
  changeProfileFailure,
  changeProfileSuccess,
  fetchItem,
  fetchItemCancel,
  fetchItemFailure,
  fetchItemSuccess,
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
 * Returns currently loaded Sight.
 * @method
 * @param {Object} state - redux state
 * @return {*}
 */
const getUsher = state => getState(state).item;


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
  getUsher,
  getUshers,
};


/*
 * LOGIC
 */

/**
 * Logic used for handling password change request.
 * @method
 */
const changePasswordLogic = createLogic({
  type: [
    CHANGE_PASSWORD,
  ],
  async process(
    { action: { payload, onFailure, onSuccess }, httpClient, cancelled$ },
    dispatch,
    done,
  ) {
    try {
      const response = await httpClient.cancellable(payload, cancelled$);
      const { status } = response;

      if (status === 200 || status === 204) {
        dispatch(changePasswordSuccess());

        if (onSuccess) {
          onSuccess();
        }
      } else {
        dispatch(changePasswordFailure(response));

        if (onFailure) {
          onFailure();
        }
      }
    } catch ({ response }) {
      dispatch(changePasswordFailure(response));

      if (onFailure) {
        onFailure();
      }
    }

    done();
  },
});

/**
 * Logic used for handling profile change request.
 * @method
 */
const changeProfileLogic = createLogic({
  type: [
    CHANGE_PROFILE,
  ],
  async process(
    { action: { payload, onFailure, onSuccess }, httpClient, cancelled$ },
    dispatch,
    done,
  ) {
    try {
      const response = await httpClient.cancellable(payload, cancelled$);
      const { status } = response;

      if (status === 200 || status === 204) {
        dispatch(changeProfileSuccess());

        if (onSuccess) {
          onSuccess();
        }
      } else {
        dispatch(changeProfileFailure(response));

        if (onFailure) {
          onFailure();
        }
      }
    } catch ({ response }) {
      dispatch(changeProfileFailure(response));

      if (onFailure) {
        onFailure();
      }
    }

    done();
  },
});


/**
 * Logic used for handling entity fetching.
 * @method
 */
const fetchItemLogic = createLogic({
  type: [
    FETCH_ITEM,
  ],
  cancelType: [
    FETCH_ITEM_CANCEL,
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

      if (status === 200 || status === 204) {
        dispatch(fetchItemSuccess(data));

        if (onSuccess) {
          onSuccess();
        }
      } else {
        dispatch(fetchItemFailure(response));

        if (onFailure) {
          onFailure();
        }
      }
    } catch ({ response }) {
      dispatch(fetchItemFailure(response));

      if (onFailure) {
        onFailure();
      }
    }

    done();
  },
});


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
  changePasswordLogic,
  changeProfileLogic,
  fetchItemLogic,
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
    case FETCH_ITEM_FAILURE:
    case FETCH_LIST_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    case FETCH_ITEM_SUCCESS:
      return {
        ...state,
        error: initialState.error,
        item: action.data,
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
