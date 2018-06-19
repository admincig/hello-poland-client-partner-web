import { createLogic } from 'redux-logic';
import _find from 'lodash/find';

export const name = 'sightEvents';
const prefix = `${name}/`;

const mock = [
  {
    description: 'ipsum quam feugiat odio, ac rhoncus lectus erat a lectus. Aliquam justo urna, hendrerit in aliquam hendrerit, pharetra nec nunc. Ut volutpat quam sit amet sem dapibus, in blandit justo scelerisque. Quisque dui urna, fringilla non tristique et, molestie ac justo.',
    id: 1,
    lead: 'Maecenas maximus, mi in aliquet finibus.',
    name: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    sightId: 2,
  },
  {
    description: 'Morbi volutpat, ipsum a pulvinar rutrum, augue nibh suscipit quam, et accumsan est enim sed mi. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.',
    id: 2,
    lead: 'Sed et libero quis tellus euismod blandit.',
    name: 'Donec interdum felis odio, nec dictum eros lobortis a',
    sightId: 3,
  },
  {
    description: 'Fusce vitae ornare augue. Pellentesque eleifend massa vel mauris posuere pulvinar nec et nibh. Ut quis ipsum congue, sollicitudin risus ac, fermentum justo. Aliquam pretium augue vitae sodales dictum.',
    id: 3,
    lead: 'Aenean pellentesque pretium mi, ac aliquet velit malesuada sed.',
    name: 'Cras consequat leo quam, at cursus tortor maximus vitae',
    sightId: 2,
  },
];

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


/*
 * LOGIC
 */

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
        fetchItemFailure();
      }
    } catch (e) {
      fetchItemFailure();
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

export const logic = {
  fetchItemLogic,
  fetchListLogic,
};


/*
 * REDUCERS
 */

const initialState = {
  // list: [],
  list: mock,
  item: {},
};

function reducer(state = initialState, action) {
  switch (action.type) {
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
    default:
      return state;
  }
}

export default reducer;
