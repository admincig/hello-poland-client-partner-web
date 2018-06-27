import { createLogic } from 'redux-logic';
import _find from 'lodash/find';

export const name = 'sightEvents';
const prefix = `${name}/`;

/*
 * TYPES
 */

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
const UPDATE_ITEM = `${prefix}UPDATE_ITEM`;
const UPDATE_ITEM_FAILURE = `${prefix}UPDATE_ITEM_FAILURE`;
const UPDATE_ITEM_SUCCESS = `${prefix}UPDATE_ITEM_SUCCESS`;

export const types = {
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
  UPDATE_ITEM,
  UPDATE_ITEM_FAILURE,
  UPDATE_ITEM_SUCCESS,
};


/*
 * ACTIONS
 */

const createItem = options => ({
  type: CREATE_ITEM,
  payload: {
    url: '/sight-events/add',
    method: 'post',
    ...options,
  },
});

const createItemFailure = error => ({
  type: CREATE_ITEM_FAILURE,
  error,
});

const createItemSuccess = data => ({
  type: CREATE_ITEM_SUCCESS,
  data,
});

const deleteItem = id => ({
  type: DELETE_ITEM,
  payload: {
    url: `/sight-events/${id}`,
    method: 'delete',
  },
});

const deleteItemFailure = error => ({
  type: DELETE_ITEM_FAILURE,
  error,
});

const deleteItemSuccess = () => ({
  type: DELETE_ITEM_SUCCESS,
});

const fetchItem = id => ({
  type: FETCH_ITEM,
  payload: {
    url: `/sight-events/${id}`,
    method: 'get',
  },
});

const fetchItemCancel = () => ({
  type: FETCH_ITEM_CANCEL,
});

const fetchItemFailure = () => ({
  type: FETCH_ITEM_FAILURE,
});

const fetchItemSuccess = data => ({
  type: FETCH_ITEM_SUCCESS,
  data,
});

const fetchList = options => ({
  type: FETCH_LIST,
  payload: {
    url: '/sight-events',
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

const updateItem = (id, options) => ({
  type: UPDATE_ITEM,
  payload: {
    url: `/sight-events/${id}`,
    method: 'put',
    ...options,
  },
});

const updateItemFailure = error => ({
  type: CREATE_ITEM_FAILURE,
  error,
});

const updateItemSuccess = data => ({
  type: CREATE_ITEM_SUCCESS,
  data,
});

export const actions = {
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
  updateItem,
  updateItemFailure,
  updateItemSuccess,
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

const getError = state => getState(state).error;

const getSightEvent = state => getState(state).item;

const getSightEvents = state => getState(state).list;

const getSightEventById = (state, id) => {
  const list = getSightEvents(state);

  return _find(list, { id });
};

export const selectors = {
  getError,
  getSightEvent,
  getSightEventById,
  getSightEvents,
  getState,
};


/*
 * LOGIC
 */

const createItemLogic = createLogic({
  type: [
    CREATE_ITEM,
  ],
  latest: true,
  async process({ action: { payload }, httpClient, cancelled$ }, dispatch, done) {
    try {
      const { data, status } = await httpClient.cancellable(payload, cancelled$);

      if (status === 200 || status === 204) {
        dispatch(createItemSuccess(data));
        dispatch(fetchList());
      } else {
        createItemFailure();
      }
    } catch (e) {
      createItemFailure();
    }

    done();
  },
});

const deleteItemLogic = createLogic({
  type: [
    DELETE_ITEM,
  ],
  latest: true,
  async process({ action: { payload }, httpClient, cancelled$ }, dispatch, done) {
    try {
      const { data, status } = await httpClient.cancellable(payload, cancelled$);

      if (status === 200 || status === 204) {
        dispatch(deleteItemSuccess(data));
        dispatch(fetchList());
      } else {
        deleteItemFailure();
      }
    } catch (e) {
      deleteItemFailure();
    }

    done();
  },
});

const fetchItemLogic = createLogic({
  type: [
    FETCH_ITEM,
  ],
  cancelType: [
    FETCH_ITEM_CANCEL,
  ],
  latest: true,
  async process({ action: { payload }, httpClient, cancelled$ }, dispatch, done) {
    try {
      const { data, status } = await httpClient.cancellable(payload, cancelled$);

      if (status === 200 || status === 204) {
        dispatch(fetchItemSuccess(data));
      } else {
        fetchItemFailure();
      }
    } catch (e) {
      fetchItemFailure();
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
  async process({ action: { payload }, httpClient, cancelled$ }, dispatch, done) {
    try {
      const { data, status } = await httpClient.cancellable(payload, cancelled$);

      if (status === 200) {
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

const updateItemLogic = createLogic({
  type: [
    UPDATE_ITEM,
  ],
  latest: true,
  async process({ action: { payload }, httpClient, cancelled$ }, dispatch, done) {
    try {
      const { data, status } = await httpClient.cancellable(payload, cancelled$);

      if (status === 200 || status === 201) {
        dispatch(updateItemSuccess(data));
        dispatch(fetchList());
      } else {
        updateItemFailure();
      }
    } catch (e) {
      updateItemFailure();
    }

    done();
  },
});

export const logic = {
  createItemLogic,
  deleteItemLogic,
  fetchItemLogic,
  fetchListLogic,
  updateItemLogic,
};


/*
 * REDUCERS
 */

const initialState = {
  error: false,
  item: {},
  list: [],
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_ITEM_FAILURE:
    case UPDATE_ITEM_FAILURE:
      return {
        ...state,
        error: true,
      };
    case CREATE_ITEM_SUCCESS:
    case UPDATE_ITEM_SUCCESS:
      return {
        ...state,
        error: false,
      };
    case FETCH_ITEM_SUCCESS:
      return {
        ...state,
        error: false,
        item: action.data,
      };
    case FETCH_LIST_SUCCESS:
      return {
        ...state,
        error: false,
        list: action.data.items,
      };
    default:
      return state;
  }
}

export default reducer;
