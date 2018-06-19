// import { createLogic } from 'redux-logic';
import _find from 'lodash/find';

export const name = 'sightEvents';
const prefix = `${name}/`;


/*
 * TYPES
 */

const FETCH_ITEM = `${prefix}FETCH_ITEM`;
const FETCH_ITEM_CANCEL = `${prefix}FETCH_ITEM_CANCEL`;
const FETCH_ITEM_FAILURE = `${prefix}FETCH_ITEM_FAILURE`;
const FETCH_ITEM_SUCCESS = `${prefix}FETCH_ITEM_SUCCESS`;
const FETCH_LIST = `${prefix}FETCH_LIST`;
const FETCH_LIST_CANCEL = `${prefix}FETCH_LIST_CANCEL`;
const FETCH_LIST_FAILURE = `${prefix}FETCH_LIST_FAILURE`;
const FETCH_LIST_SUCCESS = `${prefix}FETCH_LIST_SUCCESS`;

export const types = {
  FETCH_ITEM,
  FETCH_ITEM_CANCEL,
  FETCH_ITEM_FAILURE,
  FETCH_ITEM_SUCCESS,
  FETCH_LIST,
  FETCH_LIST_CANCEL,
  FETCH_LIST_FAILURE,
  FETCH_LIST_SUCCESS,
};


/*
 * ACTIONS
 */

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

export const actions = {
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
 * Returns state
 *
 * @method
 * @param {object} state
 * @return {object}
 */
const getState = state => state[name];

const getSightEvent = state => getState(state).item;

const getSightEvents = state => getState(state).list;

const getSightEventById = (state, id) => {
  const list = getSightEvents(state);

  return _find(list, { id });
};

export const selectors = {
  getSightEvent,
  getSightEventById,
  getSightEvents,
  getState,
};
