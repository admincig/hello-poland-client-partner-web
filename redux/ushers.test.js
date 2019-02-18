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
});
