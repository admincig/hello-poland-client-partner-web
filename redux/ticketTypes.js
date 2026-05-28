import { createLogic } from 'redux-logic';
import { types as profileTypes } from '@hello-poland/commons/redux/profile';

export const apiURL = '/ticket-types';
export const name = 'ticketTypes';
const prefix = `${name}/`;

const CLEAR = `${prefix}CLEAR`;
const FETCH_LIST = `${prefix}FETCH_LIST`;
const FETCH_LIST_CANCEL = `${prefix}FETCH_LIST_CANCEL`;
const FETCH_LIST_FAILURE = `${prefix}FETCH_LIST_FAILURE`;
const FETCH_LIST_SUCCESS = `${prefix}FETCH_LIST_SUCCESS`;

export const types = {
  FETCH_LIST,
  FETCH_LIST_CANCEL,
  FETCH_LIST_FAILURE,
  FETCH_LIST_SUCCESS,
};

const clear = () => ({
  type: CLEAR,
});

const fetchList = ({ options, onFailure, onSuccess } = {}) => ({
  type: FETCH_LIST,
  payload: {
    url: apiURL,
    method: 'get',
    ...options,
  },
  onFailure,
  onSuccess,
});

const fetchListFailure = ({ data, status } = {}) => ({
  type: FETCH_LIST_FAILURE,
  error: {
    data,
    status,
  },
});

const fetchListSuccess = data => ({
  type: FETCH_LIST_SUCCESS,
  data,
});

export const actions = {
  fetchList,
  fetchListFailure,
  fetchListSuccess,
};

const getState = state => state[name];
const getError = state => getState(state).error;
const getTicketTypes = state => getState(state).list;

export const selectors = {
  getError,
  getState,
  getTicketTypes,
};

const clearReducerLogic = createLogic({
  type: [profileTypes.LOGOUT_SUCCESS],
  latest: true,
  async process(options, dispatch, done) {
    dispatch(clear());
    done();
  },
});

const fetchListLogic = createLogic({
  type: [FETCH_LIST],
  cancelType: [FETCH_LIST_CANCEL],
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
  clearReducerLogic,
  fetchListLogic,
};

export const defaultInitialState = {
  error: null,
  list: [],
};

const reducer = (initialState = defaultInitialState) => (state = initialState, action) => {
  switch (action.type) {
    case CLEAR:
      return {
        ...state,
        ...initialState,
      };
    case FETCH_LIST_FAILURE:
      return {
        ...state,
        error: action.error,
      };
    case FETCH_LIST_SUCCESS:
      return {
        ...state,
        error: initialState.error,
        list: action.data,
      };
    default:
      return state;
  }
};

export default reducer;
