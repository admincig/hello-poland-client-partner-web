import reducer, {
  actions,
  apiURL,
  name,
  selectors,
  types,
  defaultInitialState,
} from './ticketDefinitions';


/*
 * Initial state
 */

const initialState = {
  error: null,
  item: null,
  list: null,
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
  it('should create an action to make item create request', () => {
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

  it('should create an action to fail item create request', () => {
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

  it('should create an action to succeed item create request', () => {
    const { createItemSuccess } = actions;
    const { CREATE_ITEM_SUCCESS } = types;
    const data = { a: 1 };
    const expectedValue = {
      type: CREATE_ITEM_SUCCESS,
      data,
    };

    expect(createItemSuccess(data)).toEqual(expectedValue);
  });

  it('should create an action to make item delete request', () => {
    const { deleteItem } = actions;
    const { DELETE_ITEM } = types;
    const id = 1;
    const options = { b: 2 };
    const expectedValue = {
      type: DELETE_ITEM,
      payload: {
        url: `${apiURL}/${id}`,
        method: 'delete',
      },
    };

    expect(deleteItem({ id })).toEqual(expectedValue);

    expectedValue.payload = {
      ...expectedValue.payload,
      ...options,
    };

    expect(deleteItem({ id, options })).toEqual(expectedValue);

    expectedValue.onFailure = onFailure;
    expectedValue.onSuccess = onSuccess;

    expect(deleteItem({
      id, options, onFailure, onSuccess,
    })).toEqual(expectedValue);
  });

  it('should create an action to fail item delete request', () => {
    const { deleteItemFailure } = actions;
    const { DELETE_ITEM_FAILURE } = types;
    const expectedValue = {
      type: DELETE_ITEM_FAILURE,
      error: {},
    };

    expect(deleteItemFailure()).toEqual(expectedValue);

    expectedValue.error = axiosResponseError;

    expect(deleteItemFailure(axiosResponseError)).toEqual(expectedValue);
  });

  it('should create an action to succeed item delete request', () => {
    const { deleteItemSuccess } = actions;
    const { DELETE_ITEM_SUCCESS } = types;
    const expectedValue = {
      type: DELETE_ITEM_SUCCESS,
    };

    expect(deleteItemSuccess()).toEqual(expectedValue);
  });

  it('should create an action to clear item from state', () => {
    const { clearItem } = actions;
    const { CLEAR_ITEM } = types;
    const expectedValue = {
      type: CLEAR_ITEM,
    };

    expect(clearItem()).toEqual(expectedValue);
  });

  it('should create an action to make item request', () => {
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

  it('should create an action to cancel item request', () => {
    const { fetchItemCancel } = actions;
    const { FETCH_ITEM_CANCEL } = types;
    const expectedValue = {
      type: FETCH_ITEM_CANCEL,
    };

    expect(fetchItemCancel()).toEqual(expectedValue);
  });

  it('should create an action to fail item request', () => {
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

  it('should create an action to succeed item request', () => {
    const { fetchItemSuccess } = actions;
    const { FETCH_ITEM_SUCCESS } = types;
    const data = { a: 1 };
    const expectedValue = {
      type: FETCH_ITEM_SUCCESS,
      data,
    };

    expect(fetchItemSuccess(data)).toEqual(expectedValue);
  });

  it('should create an action to make list request', () => {
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

  it('should create an action to cancel list request', () => {
    const { fetchListCancel } = actions;
    const { FETCH_LIST_CANCEL } = types;
    const expectedValue = {
      type: FETCH_LIST_CANCEL,
    };

    expect(fetchListCancel()).toEqual(expectedValue);
  });

  it('should create an action to fail list request', () => {
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

  it('should create an action to succeed list request', () => {
    const { fetchListSuccess } = actions;
    const { FETCH_LIST_SUCCESS } = types;
    const data = { a: 1 };
    const expectedValue = {
      type: FETCH_LIST_SUCCESS,
      data,
    };

    expect(fetchListSuccess(data)).toEqual(expectedValue);
  });

  it('should create an action to clear search results from state', () => {
    const { clearSearchResults } = actions;
    const { CLEAR_SEARCH_RESULTS } = types;
    const expectedValue = {
      type: CLEAR_SEARCH_RESULTS,
    };

    expect(clearSearchResults()).toEqual(expectedValue);
  });

  it('should create an action to make search request', () => {
    const { fetchSearchResults } = actions;
    const { FETCH_SEARCH_RESULTS } = types;
    const data = { a: 1 };
    const options = { b: 2 };
    const expectedValue = {
      type: FETCH_SEARCH_RESULTS,
      payload: {
        url: `${apiURL}/search`,
        method: 'post',
        data,
      },
    };

    expect(fetchSearchResults({ data })).toEqual(expectedValue);

    expectedValue.payload = {
      ...expectedValue.payload,
      ...options,
    };

    expect(fetchSearchResults({ data, options })).toEqual(expectedValue);

    expectedValue.onFailure = onFailure;
    expectedValue.onSuccess = onSuccess;

    expect(fetchSearchResults({
      data, options, onFailure, onSuccess,
    })).toEqual(expectedValue);
  });

  it('should create an action to cancel search request', () => {
    const { fetchSearchResultsCancel } = actions;
    const { FETCH_SEARCH_RESULTS_CANCEL } = types;
    const expectedValue = {
      type: FETCH_SEARCH_RESULTS_CANCEL,
    };

    expect(fetchSearchResultsCancel()).toEqual(expectedValue);
  });

  it('should create an action to fail search request', () => {
    const { fetchSearchResultsFailure } = actions;
    const { FETCH_SEARCH_RESULTS_FAILURE } = types;
    const expectedValue = {
      type: FETCH_SEARCH_RESULTS_FAILURE,
      error: {},
    };

    expect(fetchSearchResultsFailure()).toEqual(expectedValue);

    expectedValue.error = axiosResponseError;

    expect(fetchSearchResultsFailure(axiosResponseError)).toEqual(expectedValue);
  });

  it('should create an action to succeed search request', () => {
    const { fetchSearchResultsSuccess } = actions;
    const { FETCH_SEARCH_RESULTS_SUCCESS } = types;
    const data = { a: 1 };
    const expectedValue = {
      type: FETCH_SEARCH_RESULTS_SUCCESS,
      data,
    };

    expect(fetchSearchResultsSuccess(data)).toEqual(expectedValue);
  });

  it('should create an action to make item update request', () => {
    const { updateItem } = actions;
    const { UPDATE_ITEM } = types;
    const id = 1;
    const data = { a: 1 };
    const options = { b: 2 };
    const expectedValue = {
      type: UPDATE_ITEM,
      payload: {
        url: `${apiURL}/${id}`,
        method: 'put',
        data,
      },
    };

    expect(updateItem({ id, data })).toEqual(expectedValue);

    expectedValue.payload = {
      ...expectedValue.payload,
      ...options,
    };

    expect(updateItem({ id, data, options })).toEqual(expectedValue);

    expectedValue.onFailure = onFailure;
    expectedValue.onSuccess = onSuccess;

    expect(updateItem({
      id, data, options, onFailure, onSuccess,
    })).toEqual(expectedValue);
  });

  it('should create an action to fail item update request', () => {
    const { updateItemFailure } = actions;
    const { UPDATE_ITEM_FAILURE } = types;
    const expectedValue = {
      type: UPDATE_ITEM_FAILURE,
      error: {},
    };

    expect(updateItemFailure()).toEqual(expectedValue);

    expectedValue.error = axiosResponseError;

    expect(updateItemFailure(axiosResponseError)).toEqual(expectedValue);
  });

  it('should create an action to succeed item update request', () => {
    const { updateItemSuccess } = actions;
    const { UPDATE_ITEM_SUCCESS } = types;
    const data = { a: 1 };
    const expectedValue = {
      type: UPDATE_ITEM_SUCCESS,
      data,
    };

    expect(updateItemSuccess(data)).toEqual(expectedValue);
  });
});

describe('selectors', () => {
  describe('using getState', () => {
    it(`should return ${name} state`, () => {
      const { getState } = selectors;

      expect(getState(appState)).toEqual(initialState);
    });
  });

  describe('using getError', () => {
    it('should return null if there was no error', () => {
      const { getError } = selectors;

      expect(getError(appState)).toBeNull();
    });

    it('should return some error message if there was an error', () => {
      const { getError } = selectors;
      const error = 'omg';
      const state = generateAppState({ error });

      expect(getError(state)).toEqual(error);
    });
  });

  describe('using getTicketDefinition', () => {
    const { getTicketDefinition } = selectors;

    it('should return null if there is no item data', () => {
      expect(getTicketDefinition(appState)).toBeNull();
    });

    it('should return item data', () => {
      const expectedValue = { id: 1 };
      const state = generateAppState({ item: expectedValue });

      expect(getTicketDefinition(state)).toEqual(expectedValue);
    });
  });

  describe('using getTicketDefinitions', () => {
    const { getTicketDefinitions } = selectors;

    it('should return null if there is no list data', () => {
      expect(getTicketDefinitions(appState)).toBeNull();
    });

    it('should return list data', () => {
      const expectedValue = [
        { id: 1 },
        { id: 2 },
      ];
      const state = generateAppState({ list: expectedValue });

      expect(getTicketDefinitions(state)).toEqual(expectedValue);
    });
  });

  describe('using getTicketDefinitionById', () => {
    const { getTicketDefinitionById } = selectors;

    it('should return null if there is no item data', () => {
      expect(getTicketDefinitionById(appState)).toBeNull();
      expect(getTicketDefinitionById(appState, 1)).toBeNull();
    });

    it('should return list data', () => {
      const id = 1;
      const expectedValue = [
        { id: 1 },
        { id: 2 },
      ];
      const state = generateAppState({ list: expectedValue });

      expect(getTicketDefinitionById(state, id)).toEqual(expectedValue[0]);
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
    expect(reducer()(initialState, { type: 'INVALID_TYPE' })).toEqual(initialState);
  });

  it('should handle CLEAR_SEARCH_RESULTS', () => {
    const action = actions.clearSearchResults();
    const expectedValue = {
      ...defaultInitialState,
    };

    expect(reducer()(defaultInitialState, action)).toEqual(expectedValue);
  });

  it('should handle CLEAR_ITEM', () => {
    const action = actions.clearItem();
    const expectedValue = {
      ...defaultInitialState,
    };

    expect(reducer()(defaultInitialState, action)).toEqual(expectedValue);
  });

  it('should handle CREATE_ITEM_FAILURE', () => {
    let action = actions.createItemFailure();
    const expectedValue = {
      ...defaultInitialState,
      error: {},
    };

    expect(reducer()(defaultInitialState, action)).toEqual(expectedValue);

    action = actions.createItemFailure(axiosResponseError);
    expectedValue.error = axiosResponseError;

    expect(reducer()(defaultInitialState, action)).toEqual(expectedValue);
  });

  it('should handle DELETE_ITEM_FAILURE', () => {
    let action = actions.deleteItemFailure();
    const expectedValue = {
      ...defaultInitialState,
      error: {},
    };

    expect(reducer()(defaultInitialState, action)).toEqual(expectedValue);

    action = actions.deleteItemFailure(axiosResponseError);
    expectedValue.error = axiosResponseError;

    expect(reducer()(defaultInitialState, action)).toEqual(expectedValue);
  });

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

  it('should handle FETCH_SEARCH_RESULTS_FAILURE', () => {
    let action = actions.fetchSearchResultsFailure();
    const expectedValue = {
      ...defaultInitialState,
      error: {},
    };

    expect(reducer()(defaultInitialState, action)).toEqual(expectedValue);

    action = actions.fetchSearchResultsFailure(axiosResponseError);
    expectedValue.error = axiosResponseError;

    expect(reducer()(defaultInitialState, action)).toEqual(expectedValue);
  });

  it('should handle UPDATE_ITEM_FAILURE', () => {
    let action = actions.updateItemFailure();
    const expectedValue = {
      ...defaultInitialState,
      error: {},
    };

    expect(reducer()(defaultInitialState, action)).toEqual(expectedValue);

    action = actions.updateItemFailure(axiosResponseError);
    expectedValue.error = axiosResponseError;

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

  it('should handle UPDATE_ITEM_SUCCESS', () => {
    const data = { id: 1 };
    const action = actions.updateItemSuccess(data);
    const expectedValue = {
      ...defaultInitialState,
    };

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

  it('should handle FETCH_ITEM_SUCCESS', () => {
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

  it('should handle FETCH_SEARCH_RESULTS_SUCCESS', () => {
    const data = {
      config: {},
      items: [
        { id: 1 },
        { id: 2 },
      ],
    };
    const action = actions.fetchSearchResultsSuccess(data);
    const expectedValue = {
      ...defaultInitialState,
      list: data.items,
    };

    expect(reducer()(defaultInitialState, action)).toEqual(expectedValue);
  });
});
