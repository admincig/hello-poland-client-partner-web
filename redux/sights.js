import { createLogic } from 'redux-logic';
import _find from 'lodash/find';

const debounceTime = 500;

export const name = 'sights';
const prefix = `shared/${name}/`;

/*
 * TYPES
 */

const CLEAR_SEARCH_RESULTS = `${prefix}CLEAR_SEARCH_RESULTS`;
const CLEAR_ITEM = `${prefix}CLEAR_ITEM`;
const FETCH_ITEM = `${prefix}FETCH_ITEM`;
const FETCH_ITEM_CANCEL = `${prefix}FETCH_ITEM_CANCEL`;
const FETCH_ITEM_SUCCESS = `${prefix}FETCH_ITEM_SUCCESS`;
const FETCH_LIST = `${prefix}FETCH_LIST`;
const FETCH_LIST_CANCEL = `${prefix}FETCH_LIST_CANCEL`;
const FETCH_LIST_FAILURE = `${prefix}FETCH_LIST_FAILURE`;
const FETCH_LIST_SUCCESS = `${prefix}FETCH_LIST_SUCCESS`;
const FETCH_SEARCH_RESULTS = `${prefix}FETCH_SEARCH_RESULTS`;
const FETCH_SEARCH_RESULTS_CANCEL = `${prefix}FETCH_SEARCH_RESULTS_CANCEL`;
const FETCH_SEARCH_RESULTS_SUCCESS = `${prefix}FETCH_SEARCH_RESULTS_SUCCESS`;

export const types = {
  CLEAR_SEARCH_RESULTS,
  CLEAR_ITEM,
  FETCH_ITEM,
  FETCH_ITEM_CANCEL,
  FETCH_ITEM_SUCCESS,
  FETCH_LIST,
  FETCH_LIST_CANCEL,
  FETCH_LIST_FAILURE,
  FETCH_LIST_SUCCESS,
  FETCH_SEARCH_RESULTS,
  FETCH_SEARCH_RESULTS_CANCEL,
  FETCH_SEARCH_RESULTS_SUCCESS,
};


/*
 * ACTIONS
 */

const clearSearchResults = () => ({
  type: CLEAR_SEARCH_RESULTS,
});

const clearItem = () => ({
  type: CLEAR_ITEM,
});

const fetchItem = id => ({
  type: FETCH_ITEM,
  payload: {
    url: `/sights/${id}`,
    method: 'get',
  },
});

const fetchItemCancel = () => ({
  type: FETCH_ITEM_CANCEL,
});

const fetchItemSuccess = data => ({
  type: FETCH_ITEM_SUCCESS,
  data,
});

const fetchList = options => ({
  type: FETCH_LIST,
  payload: {
    url: '/sights',
    method: 'get',
    ...options,
  },
});

const fetchListCancel = () => ({
  type: FETCH_LIST_CANCEL,
});

const fetchListFailure = error => ({
  type: FETCH_LIST_CANCEL,
  error,
});

const fetchListSuccess = data => ({
  type: FETCH_LIST_SUCCESS,
  data,
});

const fetchSearchResults = options => ({
  type: FETCH_SEARCH_RESULTS,
  payload: {
    url: '/sights/search',
    method: 'post',
    data: {
      ...options,
    },
  },
});

const fetchSearchResultsCancel = () => ({
  type: FETCH_SEARCH_RESULTS_CANCEL,
});

const fetchSearchResultsSuccess = data => ({
  type: FETCH_SEARCH_RESULTS_SUCCESS,
  data,
});

export const actions = {
  clearSearchResults,
  clearItem,
  fetchItem,
  fetchItemCancel,
  fetchItemSuccess,
  fetchList,
  fetchListCancel,
  fetchListFailure,
  fetchListSuccess,
  fetchSearchResults,
  fetchSearchResultsCancel,
  fetchSearchResultsSuccess,
};


/*
 * SELECTORS
 */

/**
 * Returns state
 *
 * @method
 * @param {object} state
 * @return {object}
 */
const getState = state => state[name];

const getSight = state => getState(state).item;

const getSights = state => getState(state).list;

const getSightById = (state, id) => {
  const list = getSights(state);

  return _find(list, { id });
};

export const selectors = {
  getSight,
  getSightById,
  getSights,
  getState,
};


/*
 * LOGIC
 */

const clearSearchResultsLogic = createLogic({
  type: CLEAR_SEARCH_RESULTS,
  latest: true,
  debounce: debounceTime,
  process() {
    return fetchList();
  },
});

const fetchItemLogic = createLogic({
  type: FETCH_ITEM,
  cancelType: [FETCH_ITEM_CANCEL],
  latest: true,
  async process({ action: { payload }, httpClient, cancelled$ }, dispatch, done) {
    try {
      const { data, status } = await httpClient.cancellable(payload, cancelled$);

      if (status === 200 || status === 204) {
        dispatch(fetchItemSuccess(data));
      } else {
        fetchListFailure();
      }
    } catch (e) {
      fetchListFailure();
    }

    done();
  },
});

const fetchListLogic = createLogic({
  type: FETCH_LIST,
  cancelType: [FETCH_LIST_CANCEL],
  latest: true,
  async process({ action: { payload }, httpClient, cancelled$ }, dispatch, done) {
    try {
      const { data, status } = await httpClient.cancellable(payload, cancelled$);

      if (status === 200 || status === 204) {
        dispatch(fetchListSuccess(data));
      } else {
        fetchListFailure();
      }
    } catch (e) {
      fetchListFailure();
    }

    done();
  },
});

const fetchSearchResultsLogic = createLogic({
  type: FETCH_SEARCH_RESULTS,
  cancelType: [FETCH_SEARCH_RESULTS_CANCEL],
  latest: true,
  async process({ action: { payload }, httpClient, cancelled$ }, dispatch, done) {
    try {
      const { data, status } = await httpClient.cancellable(payload, cancelled$);

      if (status === 200 || status === 204) {
        dispatch(fetchSearchResultsSuccess(data));
      } else {
        fetchListFailure();
      }
    } catch (e) {
      fetchListFailure();
    }

    done();
  },
});

export const logic = {
  clearSearchResultsLogic,
  fetchItemLogic,
  fetchListLogic,
  fetchSearchResultsLogic,
};


/*
 * REDUCERS
 */

const initialState = {
  list: [],
  item: {},
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case CLEAR_SEARCH_RESULTS:
      return {
        ...state,
        list: [],
      };
    case CLEAR_ITEM:
      return {
        ...state,
        item: {},
      };
    case FETCH_ITEM_SUCCESS:
      return {
        ...state,
        item: action.data,
      };
    case FETCH_LIST_SUCCESS:
      return {
        ...state,
        list: action.data.items,
      };
    case FETCH_SEARCH_RESULTS_SUCCESS:
      return {
        ...state,
        list: action.data.items,
      };
    default:
      return state;
  }
}

export default reducer;

