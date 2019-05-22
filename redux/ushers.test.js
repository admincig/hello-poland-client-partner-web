import reducer, {
  actions,
  apiURL,
  name,
  selectors,
  types,
  defaultInitialState,
} from './ushers';


/*
 * Initial state
 */

const initialState = {
  error: null,
  item: null,
  list: null,
  availableTickets: null,
};

const appState = {
  config: {},
  [name]: initialState,
};

function onFailure() {}
function onSuccess() {}

const axiosResponseError = {
  data: {
    a: 1,
  },
  status: 500,
};


/*
 * Helper functions
 */

function generateState(data) {
  return {
    ...initialState,
    ...data,
  };
}

function generateAppState(data) {
  return {
    ...appState,
    [name]: {
      ...generateState(data),
    },
  };
}


/*
 * Tests
 */

describe('actions', () => {
  describe('using change password action', () => {
    it('should create an action to make password change request', () => {
      const { changePassword } = actions;
      const { CHANGE_PASSWORD } = types;
      const id = 1;
      const data = {
        oldPassword: 'password',
        newPassword: 'password123',
      };
      const expectedValue = {
        type: CHANGE_PASSWORD,
        payload: {
          url: `/ushers/${id}/password`,
          method: 'patch',
          data,
        },
      };

      expect(changePassword({ id, data })).toEqual(expectedValue);

      expectedValue.onFailure = onFailure;
      expectedValue.onSuccess = onSuccess;

      expect(changePassword({
        id, data, onFailure, onSuccess,
      })).toEqual(expectedValue);
    });

    it('should create an action to cancel password change request', () => {
      const { changePasswordCancel } = actions;
      const { CHANGE_PASSWORD_CANCEL } = types;
      const expectedValue = {
        type: CHANGE_PASSWORD_CANCEL,
      };

      expect(changePasswordCancel()).toEqual(expectedValue);
    });

    it('should create an action to fail password change request', () => {
      const { changePasswordFailure } = actions;
      const { CHANGE_PASSWORD_FAILURE } = types;
      const expectedValue = {
        type: CHANGE_PASSWORD_FAILURE,
        error: {},
      };

      expect(changePasswordFailure()).toEqual(expectedValue);

      expectedValue.error = axiosResponseError;

      expect(changePasswordFailure(axiosResponseError)).toEqual(expectedValue);
    });

    it('should create an action to succeed password change request', () => {
      const { changePasswordSuccess } = actions;
      const { CHANGE_PASSWORD_SUCCESS } = types;
      const expectedValue = {
        type: CHANGE_PASSWORD_SUCCESS,
      };

      expect(changePasswordSuccess()).toEqual(expectedValue);
    });
  });

  describe('using change password action', () => {
    it('should create an action to make password change request', () => {
      const { changeProfile } = actions;
      const { CHANGE_PROFILE } = types;
      const id = 1;
      const data = {
        name: 'John Doe',
      };
      const expectedValue = {
        type: CHANGE_PROFILE,
        payload: {
          url: `/ushers/${id}`,
          method: 'patch',
          data,
        },
      };

      expect(changeProfile({ id, data })).toEqual(expectedValue);

      expectedValue.onFailure = onFailure;
      expectedValue.onSuccess = onSuccess;

      expect(changeProfile({
        id, data, onFailure, onSuccess,
      })).toEqual(expectedValue);
    });

    it('should create an action to cancel password change request', () => {
      const { changeProfileCancel } = actions;
      const { CHANGE_PROFILE_CANCEL } = types;
      const expectedValue = {
        type: CHANGE_PROFILE_CANCEL,
      };

      expect(changeProfileCancel()).toEqual(expectedValue);
    });

    it('should create an action to fail password change request', () => {
      const { changeProfileFailure } = actions;
      const { CHANGE_PROFILE_FAILURE } = types;
      const expectedValue = {
        type: CHANGE_PROFILE_FAILURE,
        error: {},
      };

      expect(changeProfileFailure()).toEqual(expectedValue);

      expectedValue.error = axiosResponseError;

      expect(changeProfileFailure(axiosResponseError)).toEqual(expectedValue);
    });

    it('should create an action to succeed password change request', () => {
      const { changeProfileSuccess } = actions;
      const { CHANGE_PROFILE_SUCCESS } = types;
      const expectedValue = {
        type: CHANGE_PROFILE_SUCCESS,
      };

      expect(changeProfileSuccess()).toEqual(expectedValue);
    });
  });

  describe('using clear', () => {
    it('should create an action with request payload', () => {
      const { createItem } = actions;
      const { CREATE_ITEM } = types;
      const data = { a: 1 };
      const options = { b: 2 };
      const expectedValue = {
        type: CREATE_ITEM,
        payload: {
          url: apiURL,
          method: 'post',
          data,
        },
      };

      expect(createItem({ data })).toEqual(expectedValue);

      expectedValue.payload = {
        ...expectedValue.payload,
        ...options,
      };

      expect(createItem({ data, options })).toEqual(expectedValue);

      expectedValue.onFailure = onFailure;
      expectedValue.onSuccess = onSuccess;

      expect(createItem({
        data, options, onFailure, onSuccess,
      })).toEqual(expectedValue);
    });

    it('should create an action for failed request', () => {
      const { createItemFailure } = actions;
      const { CREATE_ITEM_FAILURE } = types;
      const expectedValue = {
        type: CREATE_ITEM_FAILURE,
        error: {},
      };

      expect(createItemFailure()).toEqual(expectedValue);

      expectedValue.error = axiosResponseError;

      expect(createItemFailure(axiosResponseError)).toEqual(expectedValue);
    });

    it('should create an action for successful request', () => {
      const { createItemSuccess } = actions;
      const { CREATE_ITEM_SUCCESS } = types;
      const data = { a: 1 };
      const expectedValue = {
        type: CREATE_ITEM_SUCCESS,
        data,
      };

      expect(createItemSuccess(data)).toEqual(expectedValue);
    });
  })

  describe('using item action', () => {
    it('should create an action to make request', () => {
      const { fetchItem } = actions;
      const { FETCH_ITEM } = types;
      const id = 1;
      const options = { a: 1 };
      const expectedValue = {
        type: FETCH_ITEM,
        payload: {
          url: `${apiURL}/${id}`,
          method: 'get',
        },
      };

      expect(fetchItem({ id })).toEqual(expectedValue);

      expectedValue.payload = {
        ...expectedValue.payload,
        ...options,
      };

      expect(fetchItem({ id, options })).toEqual(expectedValue);

      expectedValue.onFailure = onFailure;
      expectedValue.onSuccess = onSuccess;

      expect(fetchItem({
        id, options, onFailure, onSuccess,
      })).toEqual(expectedValue);
    });

    it('should create an action to cancel request', () => {
      const { fetchItemCancel } = actions;
      const { FETCH_ITEM_CANCEL } = types;
      const expectedValue = {
        type: FETCH_ITEM_CANCEL,
      };

      expect(fetchItemCancel()).toEqual(expectedValue);
    });

    it('should create an action to fail request', () => {
      const { fetchItemFailure } = actions;
      const { FETCH_ITEM_FAILURE } = types;
      const expectedValue = {
        type: FETCH_ITEM_FAILURE,
        error: {},
      };

      expect(fetchItemFailure()).toEqual(expectedValue);

      expectedValue.error = axiosResponseError;

      expect(fetchItemFailure(axiosResponseError)).toEqual(expectedValue);
    });

    it('should create an action to succeed request', () => {
      const { fetchItemSuccess } = actions;
      const { FETCH_ITEM_SUCCESS } = types;
      const data = { a: 1 };
      const expectedValue = {
        type: FETCH_ITEM_SUCCESS,
        data,
      };

      expect(fetchItemSuccess(data)).toEqual(expectedValue);
    });
  });

  describe('using list action', () => {
    it('should create an action to make request', () => {
      const { fetchList } = actions;
      const { FETCH_LIST } = types;
      const data = { a: 1 };
      const options = { b: 2 };
      const expectedValue = {
        type: FETCH_LIST,
        payload: {
          url: apiURL,
          method: 'get',
        },
      };

      expect(fetchList()).toEqual(expectedValue);

      expectedValue.payload = {
        ...expectedValue.payload,
        data,
        ...options,
      };

      expect(fetchList({ data, options })).toEqual(expectedValue);

      expectedValue.onFailure = onFailure;
      expectedValue.onSuccess = onSuccess;

      expect(fetchList({
        data, options, onFailure, onSuccess,
      })).toEqual(expectedValue);
    });

    it('should create an action to cancel request', () => {
      const { fetchListCancel } = actions;
      const { FETCH_LIST_CANCEL } = types;
      const expectedValue = {
        type: FETCH_LIST_CANCEL,
      };

      expect(fetchListCancel()).toEqual(expectedValue);
    });

    it('should create an action to fail request', () => {
      const { fetchListFailure } = actions;
      const { FETCH_LIST_FAILURE } = types;
      const expectedValue = {
        type: FETCH_LIST_FAILURE,
        error: {},
      };

      expect(fetchListFailure()).toEqual(expectedValue);

      expectedValue.error = axiosResponseError;

      expect(fetchListFailure(axiosResponseError)).toEqual(expectedValue);
    });

    it('should create an action to succeed request', () => {
      const { fetchListSuccess } = actions;
      const { FETCH_LIST_SUCCESS } = types;
      const data = { a: 1 };
      const expectedValue = {
        type: FETCH_LIST_SUCCESS,
        data,
      };

      expect(fetchListSuccess(data)).toEqual(expectedValue);
    });
  });
});

describe('selectors', () => {
  describe('using getState', () => {
    const { getState } = selectors;

    it(`should return ${name} state`, () => {
      expect(getState(appState)).toEqual(initialState);
    });
  });

  describe('using getError', () => {
    const { getError } = selectors;

    it('should return null if there was no error', () => {
      expect(getError(appState)).toBeNull();
    });

    it('should return some error message if there was an error', () => {
      const error = 'omg';
      const state = generateAppState({ error });

      expect(getError(state)).toEqual(error);
    });
  });

  describe('using getUsher', () => {
    it('should return null if there is no item data', () => {
      const { getUsher } = selectors;

      expect(getUsher(appState)).toBeNull();
    });

    it('should return item data', () => {
      const { getUsher } = selectors;
      const expectedValue = { id: 1 };
      const state = generateAppState({ item: expectedValue });

      expect(getUsher(state)).toEqual(expectedValue);
    });
  });


  describe('using getUshers', () => {
    const { getUshers } = selectors;

    it('should return null if there is no list data', () => {
      expect(getUshers(appState)).toBeNull();
    });

    it('should return list data', () => {
      const expectedValue = [
        { id: 1 },
        { id: 2 },
      ];
      const state = generateAppState({ list: expectedValue });

      expect(getUshers(state)).toEqual(expectedValue);
    });
  });
});

describe('reducer', () => {
  it('should return default initial state', () => {
    expect(reducer()(undefined, {})).toEqual(defaultInitialState);
  });

  it('should return custom initial state', () => {
    expect(reducer(initialState)(undefined, {})).toEqual(initialState);
  });

  it('should return current state if action type was not found', () => {
    expect(reducer()(undefined, { type: 'INVALID_TYPE' })).toEqual(defaultInitialState);
  });

  it('should handle CLEAR_ITEM', () => {
    const action = actions.clearItem();
    const expectedValue = {
      ...defaultInitialState,
    };

    expect(reducer()(defaultInitialState, action)).toEqual(expectedValue);
  });

  it('should handle CREATE_ITEM_SUCCESS', () => {
    const data = { id: 1 };
    const action = actions.createItemSuccess(data);
    const expectedValue = {
      ...defaultInitialState,
    };

    expect(reducer()(defaultInitialState, action)).toEqual(expectedValue);
  });

  describe('using item reducers', () => {
    it('should handle FETCH_ITEM_FAILURE', () => {
      let action = actions.fetchItemFailure();
      const expectedValue = {
        ...defaultInitialState,
        error: {},
      };

      expect(reducer()(defaultInitialState, action)).toEqual(expectedValue);

      action = actions.fetchItemFailure(axiosResponseError);
      expectedValue.error = axiosResponseError;

      expect(reducer()(defaultInitialState, action)).toEqual(expectedValue);
    });

    it('should handle FETCH_ITEM_SUCCESS', () => {
      const data = { id: 1 };
      const action = actions.fetchItemSuccess(data);
      const expectedValue = {
        ...defaultInitialState,
        item: data,
      };

      expect(reducer()(defaultInitialState, action)).toEqual(expectedValue);
    });
  });

  describe('using list reducers', () => {
    it('should handle FETCH_LIST_FAILURE', () => {
      let action = actions.fetchListFailure();
      const expectedValue = {
        ...defaultInitialState,
        error: {},
      };

      expect(reducer()(defaultInitialState, action)).toEqual(expectedValue);

      action = actions.fetchListFailure(axiosResponseError);
      expectedValue.error = axiosResponseError;

      expect(reducer()(defaultInitialState, action)).toEqual(expectedValue);
    });

    it('should handle FETCH_LIST_SUCCESS', () => {
      const data = {
        config: {},
        items: [
          { id: 1 },
          { id: 2 },
        ],
      };
      const action = actions.fetchListSuccess(data);
      const expectedValue = {
        ...defaultInitialState,
        list: data.items,
      };

      expect(reducer()(defaultInitialState, action)).toEqual(expectedValue);
    });
  });
});
