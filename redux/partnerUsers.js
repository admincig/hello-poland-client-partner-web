import { createLogic } from 'redux-logic';

export const apiURL = '/users';
export const name = 'partnerUsers';

const prefix = `${name}/`;

const CLEAR_ERROR = `${prefix}CLEAR_ERROR`;
const FETCH_LIST = `${prefix}FETCH_LIST`;
const FETCH_LIST_SUCCESS = `${prefix}FETCH_LIST_SUCCESS`;
const FETCH_FAILURE = `${prefix}FETCH_FAILURE`;
const CREATE_ITEM = `${prefix}CREATE_ITEM`;
const UPDATE_ITEM = `${prefix}UPDATE_ITEM`;
const DELETE_ITEM = `${prefix}DELETE_ITEM`;
const CHANGE_PASSWORD = `${prefix}CHANGE_PASSWORD`;

const clearError = () => ({ type: CLEAR_ERROR });

const fetchList = ({ onFailure, onSuccess } = {}) => ({
  type: FETCH_LIST,
  payload: {
    url: apiURL,
    method: 'get',
  },
  onFailure,
  onSuccess,
});

const fetchListSuccess = data => ({
  type: FETCH_LIST_SUCCESS,
  data,
});

const requestFailure = ({ data, status } = {}) => ({
  type: FETCH_FAILURE,
  error: {
    data,
    status,
  },
});

const createItem = ({
  data, onFailure, onSuccess,
} = {}) => ({
  type: CREATE_ITEM,
  payload: {
    url: apiURL,
    method: 'post',
    data,
  },
  onFailure,
  onSuccess,
});

const updateItem = ({
  id, data, onFailure, onSuccess,
} = {}) => ({
  type: UPDATE_ITEM,
  payload: {
    url: `${apiURL}/${id}`,
    method: 'patch',
    data,
  },
  onFailure,
  onSuccess,
});

const deleteItem = ({
  id, onFailure, onSuccess,
} = {}) => ({
  type: DELETE_ITEM,
  payload: {
    url: `${apiURL}/${id}`,
    method: 'delete',
  },
  onFailure,
  onSuccess,
});

const changePassword = ({
  id, data, onFailure, onSuccess,
} = {}) => ({
  type: CHANGE_PASSWORD,
  payload: {
    url: `${apiURL}/${id}/password`,
    method: 'patch',
    data,
  },
  onFailure,
  onSuccess,
});

export const actions = {
  changePassword,
  clearError,
  createItem,
  deleteItem,
  fetchList,
  fetchListSuccess,
  requestFailure,
  updateItem,
};

const getState = state => state[name];
const getError = state => getState(state).error;
const getUsers = state => getState(state).list;

export const selectors = {
  getError,
  getState,
  getUsers,
};

const requestLogic = createLogic({
  type: [
    CREATE_ITEM,
    UPDATE_ITEM,
    DELETE_ITEM,
    CHANGE_PASSWORD,
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
        dispatch(fetchList());
        if (onSuccess) {
          onSuccess(response.data);
        }
      } else {
        dispatch(requestFailure(response));
        if (onFailure) {
          onFailure(response);
        }
      }
    } catch ({ response }) {
      dispatch(requestFailure(response));
      if (onFailure) {
        onFailure(response);
      }
    }

    done();
  },
});

const fetchListLogic = createLogic({
  type: FETCH_LIST,
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
          onSuccess(data);
        }
      } else {
        dispatch(requestFailure(response));
        if (onFailure) {
          onFailure(response);
        }
      }
    } catch ({ response }) {
      dispatch(requestFailure(response));
      if (onFailure) {
        onFailure(response);
      }
    }

    done();
  },
});

export const logic = {
  fetchListLogic,
  requestLogic,
};

export const defaultInitialState = {
  error: null,
  list: [],
};

const reducer = (initialState = defaultInitialState) => (state = initialState, action) => {
  switch (action.type) {
    case FETCH_FAILURE:
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
    case CLEAR_ERROR:
      return {
        ...state,
        error: initialState.error,
      };
    default:
      return state;
  }
};

export default reducer;
