import { createLogic } from 'redux-logic';
import _find from 'lodash/find';
import { types as profileTypes } from '@hello-poland/commons/redux/profile';

const debounceTime = 500;

export const apiURL = '/ticket-definitions';
export const name = 'ticketDefinitions';
const prefix = `${name}/`;

/*
 * TYPES
 */

const CLEAR = `${prefix}CLEAR`;
const CLEAR_ERROR = `${prefix}CLEAR_ERROR`;
const CLEAR_ITEM = `${prefix}CLEAR_ITEM`;
const CLEAR_SEARCH_RESULTS = `${prefix}CLEAR_SEARCH_RESULTS`;
const CREATE_ITEM = `${prefix}CREATE_ITEM`;
const CREATE_ITEM_FAILURE = `${prefix}CREATE_ITEM_FAILURE`;
const CREATE_ITEM_SUCCESS = `${prefix}CREATE_ITEM_SUCCESS`;
const DELETE_ITEM = `${prefix}DELETE_ITEM`;
const DELETE_ITEM_FAILURE = `${prefix}DELETE_ITEM_FAILURE`;
const DELETE_ITEM_SUCCESS = `${prefix}DELETE_ITEM_SUCCESS`;
const FETCH_ITEM = `${prefix}FETCH_ITEM`;
const FETCH_ITEM_CANCEL = `${prefix}FETCH_ITEM_CANCEL`;
const FETCH_ITEM_FAILURE = `${prefix}FETCH_ITEM_FAILURE`;
const FETCH_ITEM_SUCCESS = `${prefix}FETCH_ITEM_SUCCESS`;
const FETCH_LIST = `${prefix}FETCH_LIST`;
const FETCH_LIST_CANCEL = `${prefix}FETCH_LIST_CANCEL`;
const FETCH_LIST_FAILURE = `${prefix}FETCH_LIST_FAILURE`;
const FETCH_LIST_SUCCESS = `${prefix}FETCH_LIST_SUCCESS`;
const FETCH_SEARCH_RESULTS = `${prefix}FETCH_SEARCH_RESULTS`;
const FETCH_SEARCH_RESULTS_CANCEL = `${prefix}FETCH_SEARCH_RESULTS_CANCEL`;
const FETCH_SEARCH_RESULTS_FAILURE = `${prefix}FETCH_SEARCH_RESULTS_FAILURE`;
const FETCH_SEARCH_RESULTS_SUCCESS = `${prefix}FETCH_SEARCH_RESULTS_SUCCESS`;
const UPDATE_ITEM = `${prefix}UPDATE_ITEM`;
const UPDATE_ITEM_FAILURE = `${prefix}UPDATE_ITEM_FAILURE`;
const UPDATE_ITEM_SUCCESS = `${prefix}UPDATE_ITEM_SUCCESS`;

export const types = {
  CLEAR_ERROR,
  CLEAR_ITEM,
  CLEAR_SEARCH_RESULTS,
  CREATE_ITEM,
  CREATE_ITEM_FAILURE,
  CREATE_ITEM_SUCCESS,
  DELETE_ITEM,
  DELETE_ITEM_FAILURE,
  DELETE_ITEM_SUCCESS,
  FETCH_ITEM,
  FETCH_ITEM_CANCEL,
  FETCH_ITEM_FAILURE,
  FETCH_ITEM_SUCCESS,
  FETCH_LIST,
  FETCH_LIST_CANCEL,
  FETCH_LIST_FAILURE,
  FETCH_LIST_SUCCESS,
  FETCH_SEARCH_RESULTS,
  FETCH_SEARCH_RESULTS_CANCEL,
  FETCH_SEARCH_RESULTS_FAILURE,
  FETCH_SEARCH_RESULTS_SUCCESS,
  UPDATE_ITEM,
  UPDATE_ITEM_FAILURE,
  UPDATE_ITEM_SUCCESS,
};


/*
 * ACTIONS
 */

/**
 * Creates action for clearing reducer data.
 *
 * @method
 * @return {{type: string}}
 */
const clear = () => ({
  type: CLEAR,
});

/**
 * Creates action for clearing request error reducer data.
 *
 * @method
 * @return {{type: string}}
 */
const clearError = () => ({
  type: CLEAR_ERROR,
});

/**
 * Creates action for search results removal.
 *
 * @method
 * @return {{type: string}}
 */
const clearSearchResults = () => ({
  type: CLEAR_SEARCH_RESULTS,
});

/**
 * Creates action for item removal.
 *
 * @method
 * @return {{type: string}}
 */
const clearItem = () => ({
  type: CLEAR_ITEM,
});

/**
 * Creates action with item creation request details.
 *
 * @method
 * @callback failureCallback
 * @callback successCallback
 * @param {Object} params
 * @param {Object} params.data - request data
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
const createItem = ({
  data, options, onFailure, onSuccess,
} = {}) => ({
  type: CREATE_ITEM,
  payload: {
    url: apiURL,
    method: 'post',
    ...options,
    data,
  },
  onFailure,
  onSuccess,
});

/**
 * Creates action for item creation request failing.
 *
 * @method
 * @param {Object} params - axios response schema
 * @param params.data - response body
 * @param params.status - response status
 * @return {{
 *   type: string,
 *   error: {data, status: number}
 * }}
 */
const createItemFailure = ({ data, status } = {}) => ({
  type: CREATE_ITEM_FAILURE,
  error: {
    data,
    status,
  },
});

/**
 * Creates action for successful item creation request.
 *
 * @method
 * @param {Object} data - response body
 * @return {{type: string, data: *}}
 */
const createItemSuccess = data => ({
  type: CREATE_ITEM_SUCCESS,
  data,
});

/**
 * Creates action with item deletion request details.
 *
 * @method
 * @callback failureCallback
 * @callback successCallback
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
const deleteItem = ({
  id, options, onFailure, onSuccess,
} = {}) => ({
  type: DELETE_ITEM,
  payload: {
    url: `${apiURL}/${id}`,
    method: 'delete',
    ...options,
  },
  onFailure,
  onSuccess,
});

/**
 * Creates action for item deletion request failing.
 *
 * @method
 * @param {Object} params - axios response schema
 * @param params.data - response body
 * @param params.status - response status
 * @return {{
 *   type: string,
 *   error: {data, status: number}
 * }}
 */
const deleteItemFailure = ({ data, status } = {}) => ({
  type: DELETE_ITEM_FAILURE,
  error: {
    data,
    status,
  },
});

/**
 * Creates action for successful item deletion request.
 *
 * @method
 * @return {{type: string}}
 */
const deleteItemSuccess = () => ({
  type: DELETE_ITEM_SUCCESS,
});

/**
 * Creates action with item request details.
 *
 * @method
 * @callback failureCallback
 * @callback successCallback
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
 *
 * @method
 * @return {{type: string}}
 */
const fetchItemCancel = () => ({
  type: FETCH_ITEM_CANCEL,
});

/**
 * Creates action for item request failing.
 *
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
 *
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
 *
 * @method
 * @callback failureCallback
 * @callback successCallback
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
 *
 * @method
 * @return {{type: string}}
 */
const fetchListCancel = () => ({
  type: FETCH_LIST_CANCEL,
});

/**
 * Creates action for list request failing.
 *
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
 *
 * @method
 * @param {Object} data - response body
 * @return {{type: string, data: *}}
 */
const fetchListSuccess = data => ({
  type: FETCH_LIST_SUCCESS,
  data,
});

/**
 * Creates action with search request details.
 *
 * @method
 * @callback failureCallback
 * @callback successCallback
 * @param {Object} params
 * @param {Object} params.data - request data
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
const fetchSearchResults = ({
  data, options, onFailure, onSuccess,
} = {}) => ({
  type: FETCH_SEARCH_RESULTS,
  payload: {
    url: `${apiURL}/search`,
    method: 'post',
    ...options,
    data,
  },
  onFailure,
  onSuccess,
});

/**
 * Creates action for search request cancelling.
 *
 * @method
 * @return {{type: string}}
 */
const fetchSearchResultsCancel = () => ({
  type: FETCH_SEARCH_RESULTS_CANCEL,
});

/**
 * Creates action for search request failing.
 *
 * @method
 * @param {Object} params - axios response schema
 * @param params.data - response body
 * @param params.status - response status
 * @return {{
 *   type: string,
 *   error: {data, status: number}
 * }}
 */
const fetchSearchResultsFailure = ({ data, status } = {}) => ({
  type: FETCH_SEARCH_RESULTS_FAILURE,
  error: {
    data,
    status,
  },
});

/**
 * Creates action for successful search request.
 *
 * @method
 * @param {Object} data - response body
 * @return {{type: string, data: *}}
 */
const fetchSearchResultsSuccess = data => ({
  type: FETCH_SEARCH_RESULTS_SUCCESS,
  data,
});

/**
 * Creates action with item update request details.
 *
 * @method
 * @callback failureCallback
 * @callback successCallback
 * @param {Object} params
 * @param {Object} params.id - item id
 * @param {Object} params.data - request body
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
const updateItem = ({
  id, data, options, onFailure, onSuccess,
} = {}) => ({
  type: UPDATE_ITEM,
  payload: {
    url: `${apiURL}/${id}`,
    method: 'put',
    ...options,
    data,
  },
  onFailure,
  onSuccess,
});

/**
 * Creates action for item update request failing.
 *
 * @method
 * @param {Object} params - axios response schema
 * @param params.data - response body
 * @param params.status - response status
 * @return {{
 *   type: string,
 *   error: {data, status: number}
 * }}
 */
const updateItemFailure = ({ data, status } = {}) => ({
  type: UPDATE_ITEM_FAILURE,
  error: {
    data,
    status,
  },
});

/**
 * Creates action for successful item creation request.
 *
 * @methoddeleteItemFailure
 * @param {Object} data - response body
 * @return {{type: string, data: *}}
 */
const updateItemSuccess = data => ({
  type: UPDATE_ITEM_SUCCESS,
  data,
});

export const actions = {
  clearError,
  clearItem,
  clearSearchResults,
  createItem,
  createItemFailure,
  createItemSuccess,
  deleteItem,
  deleteItemFailure,
  deleteItemSuccess,
  fetchItem,
  fetchItemCancel,
  fetchItemFailure,
  fetchItemSuccess,
  fetchList,
  fetchListCancel,
  fetchListFailure,
  fetchListSuccess,
  fetchSearchResults,
  fetchSearchResultsCancel,
  fetchSearchResultsFailure,
  fetchSearchResultsSuccess,
  updateItem,
  updateItemFailure,
  updateItemSuccess,
};


/*
 * SELECTORS
 */

/**
 * Returns current state.
 *
 * @method
 * @param {Object} state
 * @return {*}
 */
const getState = state => state[name];

/**
 * Returns request error.
 *
 * @method
 * @param {Object} state
 * @return {*}
 */
const getError = state => getState(state).error;

/**
 * Returns currently loaded Sight.
 *
 * @method
 * @param {Object} state
 * @return {*}
 */
const getTicketDefinition = state => getState(state).item;

/**
 * Returns currently loaded Sights list.
 *
 * @method
 * @param {Object} state
 * @return {*}
 */
const getTicketDefinitions = state => getState(state).list;

/**
 * Returns Sight with specified id from Sights list.
 *
 * @method
 * @param {Object} state
 * @param {number} id - Sight id
 * @return {*}
 */
const getTicketDefinitionById = (state, id) => {
  const list = getTicketDefinitions(state);

  return _find(list, { id }) || null;
};

export const selectors = {
  getError,
  getState,
  getTicketDefinition,
  getTicketDefinitionById,
  getTicketDefinitions,
};


/*
 * LOGIC
 */

const clearReducerLogic = createLogic({
  type: [
    profileTypes.LOGOUT_SUCCESS,
  ],
  latest: true,
  async process(options, dispatch, done) {
    dispatch(clear());
    done();
  },
});

const clearSearchResultsLogic = createLogic({
  type: [
    CLEAR_SEARCH_RESULTS,
  ],
  latest: true,
  debounce: debounceTime,
  async process(options, dispatch, done) {
    dispatch(fetchList());
    done();
  },
});

const createItemLogic = createLogic({
  type: [
    CREATE_ITEM,
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
        dispatch(createItemSuccess(data));

        if (onSuccess) {
          onSuccess(data.id);
        }
      } else {
        dispatch(createItemFailure(response));

        if (onFailure) {
          onFailure();
        }
      }
    } catch ({ response }) {
      dispatch(createItemFailure(response));

      if (onFailure) {
        onFailure();
      }
    }

    done();
  },
});

const deleteItemLogic = createLogic({
  type: [
    DELETE_ITEM,
  ],
  latest: true,
  async process(
    { action: { payload, onFailure, onSuccess }, httpClient, cancelled$ },
    dispatch,
    done,
  ) {
    try {
      const response = await httpClient.cancellable(payload, cancelled$);
      const { status } = response;

      if (status === 200 || status === 204) {
        dispatch(deleteItemSuccess());

        if (onSuccess) {
          onSuccess();
        }
      } else {
        dispatch(deleteItemFailure(response));

        if (onFailure) {
          onFailure();
        }
      }
    } catch ({ response }) {
      dispatch(deleteItemFailure(response));

      if (onFailure) {
        onFailure();
      }
    }

    done();
  },
});

const fetchItemLogic = createLogic({
  type: [
    FETCH_ITEM,
  ],
  cancelType: [
    FETCH_ITEM_CANCEL, CLEAR_ITEM,
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

const fetchSearchResultsLogic = createLogic({
  type: [
    FETCH_SEARCH_RESULTS,
  ],
  cancelType: [
    FETCH_SEARCH_RESULTS_CANCEL,
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
        dispatch(fetchSearchResultsSuccess(data));

        if (onSuccess) {
          onSuccess();
        }
      } else {
        dispatch(fetchSearchResultsFailure(response));

        if (onFailure) {
          onFailure();
        }
      }
    } catch ({ response }) {
      dispatch(fetchSearchResultsFailure(response));

      if (onFailure) {
        onFailure();
      }
    }

    done();
  },
});

const updateItemLogic = createLogic({
  type: [
    UPDATE_ITEM,
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

      if (status === 200 || status === 201) {
        dispatch(updateItemSuccess(data));

        if (onSuccess) {
          onSuccess();
        }
      } else {
        dispatch(updateItemFailure(response));

        if (onFailure) {
          onFailure();
        }
      }
    } catch ({ response }) {
      dispatch(updateItemFailure(response));

      if (onFailure) {
        onFailure();
      }
    }

    done();
  },
});

export const logic = {
  clearReducerLogic,
  clearSearchResultsLogic,
  createItemLogic,
  deleteItemLogic,
  fetchItemLogic,
  fetchListLogic,
  fetchSearchResultsLogic,
  updateItemLogic,
};


/*
 * REDUCERS
 */
// export for test purposes
export const defaultInitialState = {
  error: null,
  item: {},
  list: [],
};

const reducer = (initialState = defaultInitialState) => (state = initialState, action) => {
  switch (action.type) {
    case CLEAR:
      return {
        ...state,
        ...initialState,
      };
    case CLEAR_ERROR:
      return {
        ...state,
        error: initialState.error,
      };
    case CLEAR_ITEM:
      return {
        ...state,
        error: initialState.error,
        item: initialState.item,
      };
    case CLEAR_SEARCH_RESULTS:
      return {
        ...state,
        error: initialState.error,
        list: initialState.list,
      };
    case CREATE_ITEM_FAILURE:
    case DELETE_ITEM_FAILURE:
    case FETCH_ITEM_FAILURE:
    case FETCH_LIST_FAILURE:
    case FETCH_SEARCH_RESULTS_FAILURE:
    case UPDATE_ITEM_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    case CREATE_ITEM_SUCCESS:
    case UPDATE_ITEM_SUCCESS:
      return {
        ...state,
        error: initialState.error,
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
    case FETCH_SEARCH_RESULTS_SUCCESS:
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
