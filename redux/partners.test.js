import reducer, {
  actions,
  apiURL,
  name,
  types,
  selectors,
  defaultInitialState,
} from './partners';

/*
 * Initial state
 */
const initialState = defaultInitialState;

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
  describe('using changeDefaultTranslation', () => {
    it('should create an action with request payload', () => {
      const { changeDefaultTranslation } = actions;
      const { CHANGE_DEFAULT_TRANSLATION } = types;
      const options = {
        headers: {
          'Content-Language': 'pl-PL',
        },
      };
      const expectedValue = {
        type: CHANGE_DEFAULT_TRANSLATION,
        payload: {
          url: `${apiURL}/card/defaultLanguage`,
          method: 'patch',
          ...options,
        },
      };
      expect(changeDefaultTranslation({ options })).toEqual(expectedValue);

      expectedValue.onFailure = onFailure;
      expectedValue.onSuccess = onSuccess;

      expect(changeDefaultTranslation({
        options, onFailure, onSuccess,
      })).toEqual(expectedValue);
    });

    it('should create an action for failed request', () => {
      const { changeDefaultTranslationFailure } = actions;
      const { CHANGE_DEFAULT_TRANSLATION_FAILURE } = types;

      const expectedValue = {
        type: CHANGE_DEFAULT_TRANSLATION_FAILURE,
        error: defaultInitialState.error,
      };

      expect(changeDefaultTranslationFailure()).toEqual(expectedValue);

      expectedValue.error = axiosResponseError.data;

      expect(changeDefaultTranslationFailure(axiosResponseError)).toEqual(expectedValue);
    });

    it('should create an action for successful request', () => {
      const { changeDefaultTranslationSuccess } = actions;
      const { CHANGE_DEFAULT_TRANSLATION_SUCCESS } = types;
      const expectedValue = {
        type: CHANGE_DEFAULT_TRANSLATION_SUCCESS,
      };

      expect(changeDefaultTranslationSuccess()).toEqual(expectedValue);
    });
  });

  describe('using clearError', () => {
    it('should create an action to clear error from state', () => {
      const { clearError } = actions;
      const { CLEAR_ERROR } = types;
      const expectedValue = {
        type: CLEAR_ERROR,
      };

      expect(clearError()).toEqual(expectedValue);
    });
  });

  describe('using clearItem', () => {
    it('should create an action to clear item from state', () => {
      const { clearItem } = actions;
      const { CLEAR_ITEM } = types;
      const expectedValue = {
        type: CLEAR_ITEM,
      };

      expect(clearItem()).toEqual(expectedValue);
    });
  });

  describe('using createItem', () => {
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
  });

  describe('using createMainImage', () => {
    it('should create an action with request payload', () => {
      const { createMainImage } = actions;
      const { CREATE_MAIN_IMAGE } = types;
      const data = 'omfrefiywuyuwef';
      const options = {
        a: 1,
        headers: {
          b: 2,
        },
      };
      const expectedValue = {
        type: CREATE_MAIN_IMAGE,
        payload: {
          url: `${apiURL}/mainImage`,
          method: 'put',
          headers: {
            'content-type': 'image/jpeg',
          },
          data,
        },
      };

      expect(createMainImage({ data })).toEqual(expectedValue);

      expectedValue.payload = {
        ...expectedValue.payload,
        ...options,
        headers: {
          ...expectedValue.payload.headers,
          ...options.headers,
        },
      };

      expect(createMainImage({ data, options })).toEqual(expectedValue);

      expectedValue.onFailure = onFailure;
      expectedValue.onSuccess = onSuccess;

      expect(createMainImage({
        data, options, onFailure, onSuccess,
      })).toEqual(expectedValue);
    });

    it('should create an action for cancelled create main image request', () => {
      const { createMainImageCancel } = actions;
      const { CREATE_MAIN_IMAGE_CANCEL } = types;
      const expectedValue = {
        type: CREATE_MAIN_IMAGE_CANCEL,
      };

      expect(createMainImageCancel()).toEqual(expectedValue);
    });

    it('should create an action for failed request', () => {
      const { createMainImageFailure } = actions;
      const { CREATE_MAIN_IMAGE_FAILURE } = types;
      const expectedValue = {
        type: CREATE_MAIN_IMAGE_FAILURE,
        error: defaultInitialState.error,
      };

      expect(createMainImageFailure()).toEqual(expectedValue);

      expectedValue.error = axiosResponseError.data;

      expect(createMainImageFailure(axiosResponseError)).toEqual(expectedValue);
    });

    it('should create an action for successful request', () => {
      const { createMainImageSuccess } = actions;
      const { CREATE_MAIN_IMAGE_SUCCESS } = types;
      const expectedValue = {
        type: CREATE_MAIN_IMAGE_SUCCESS,
        data: defaultInitialState.item,
      };

      expect(createMainImageSuccess()).toEqual(expectedValue);
    });
  });

  describe('using createTranslation', () => {
    it('should create an action with request payload', () => {
      const { createTranslation } = actions;
      const { CREATE_TRANSLATION } = types;
      const data = { a: 1 };
      const options = { b: 2 };
      const expectedValue = {
        type: CREATE_TRANSLATION,
        payload: {
          url: apiURL,
          method: 'post',
          data,
        },
      };

      expect(createTranslation({ data })).toEqual(expectedValue);

      expectedValue.payload = {
        ...expectedValue.payload,
        ...options,
      };

      expect(createTranslation({ data, options })).toEqual(expectedValue);

      expectedValue.onFailure = onFailure;
      expectedValue.onSuccess = onSuccess;

      expect(createTranslation({
        data, options, onFailure, onSuccess,
      })).toEqual(expectedValue);
    });

    it('should create an action for failed request', () => {
      const { createTranslationFailure } = actions;
      const { CREATE_TRANSLATION_FAILURE } = types;
      let expectedValue = {
        type: CREATE_TRANSLATION_FAILURE,
        error: defaultInitialState.error,
      };

      expect(createTranslationFailure()).toEqual(expectedValue);

      expectedValue = {
        type: CREATE_TRANSLATION_FAILURE,
        error: axiosResponseError.data,
      };

      expect(createTranslationFailure(axiosResponseError)).toEqual(expectedValue);
    });

    it('should create an action for successful request', () => {
      const { createTranslationSuccess } = actions;
      const { CREATE_TRANSLATION_SUCCESS } = types;
      const data = [{ a: 1 }];
      let expectedValue = {
        type: CREATE_TRANSLATION_SUCCESS,
        data: defaultInitialState.item,
      };

      expect(createTranslationSuccess()).toEqual(expectedValue);

      expectedValue = {
        type: CREATE_TRANSLATION_SUCCESS,
        data,
      };

      expect(createTranslationSuccess({ data })).toEqual(expectedValue);
    });
  });

  describe('using deleteTranslation', () => {
    it('should create an action with request payload', () => {
      const { deleteTranslation } = actions;
      const { DELETE_TRANSLATION } = types;
      const pathParams = { languageVersion: 'pl-PL' };
      const options = { b: 2 };
      const expectedValue = {
        type: DELETE_TRANSLATION,
        payload: {
          url: `${apiURL}/card/languageVersion/${pathParams.languageVersion}`,
          method: 'delete',
        },
      };

      expect(deleteTranslation({ pathParams })).toEqual(expectedValue);

      expectedValue.payload = {
        ...expectedValue.payload,
        ...options,
      };

      expect(deleteTranslation({ pathParams, options })).toEqual(expectedValue);

      expectedValue.onFailure = onFailure;
      expectedValue.onSuccess = onSuccess;

      expect(deleteTranslation({
        pathParams, options, onFailure, onSuccess,
      })).toEqual(expectedValue);
    });


    it('should create an action for failed request', () => {
      const { deleteTranslationFailure } = actions;
      const { DELETE_TRANSLATION_FAILURE } = types;
      const expectedValue = {
        type: DELETE_TRANSLATION_FAILURE,
        error: defaultInitialState.error,
      };

      expect(deleteTranslationFailure()).toEqual(expectedValue);

      expectedValue.error = axiosResponseError.data;

      expect(deleteTranslationFailure(axiosResponseError)).toEqual(expectedValue);
    });

    it('should create an action for successful request', () => {
      const { deleteTranslationSuccess } = actions;
      const { DELETE_TRANSLATION_SUCCESS } = types;
      const expectedValue = {
        type: DELETE_TRANSLATION_SUCCESS,
      };

      expect(deleteTranslationSuccess()).toEqual(expectedValue);
    });
  });

  describe('using fetchItem', () => {
    it('should create an action with request payload', () => {
      const { fetchItem } = actions;
      const { FETCH_ITEM } = types;
      const options = { a: 1 };
      const expectedValue = {
        type: FETCH_ITEM,
        payload: {
          url: `${apiURL}/card`,
          method: 'get',
        },
      };

      expect(fetchItem()).toEqual(expectedValue);

      expectedValue.payload = {
        ...expectedValue.payload,
        ...options,
      };

      expect(fetchItem({ options })).toEqual(expectedValue);

      expectedValue.onFailure = onFailure;
      expectedValue.onSuccess = onSuccess;

      expect(fetchItem({
        options, onFailure, onSuccess,
      })).toEqual(expectedValue);
    });

    it('should create an action for cancelled request', () => {
      const { fetchItemCancel } = actions;
      const { FETCH_ITEM_CANCEL } = types;
      const expectedValue = {
        type: FETCH_ITEM_CANCEL,
      };

      expect(fetchItemCancel()).toEqual(expectedValue);
    });

    it('should create an action for failed request', () => {
      const { fetchItemFailure } = actions;
      const { FETCH_ITEM_FAILURE } = types;
      let expectedValue = {
        type: FETCH_ITEM_FAILURE,
        error: defaultInitialState.error,
      };

      expect(fetchItemFailure()).toEqual(expectedValue);

      expectedValue = {
        type: FETCH_ITEM_FAILURE,
        error: axiosResponseError.data,
      };

      expect(fetchItemFailure(axiosResponseError)).toEqual(expectedValue);
    });

    it('should create an action for successful request', () => {
      const { fetchItemSuccess } = actions;
      const { FETCH_ITEM_SUCCESS } = types;
      const data = [{ a: 1 }];
      let expectedValue = {
        type: FETCH_ITEM_SUCCESS,
        data: defaultInitialState.item,
      };

      expect(fetchItemSuccess()).toEqual(expectedValue);

      expectedValue = {
        type: FETCH_ITEM_SUCCESS,
        data,
      };

      expect(fetchItemSuccess({ data })).toEqual(expectedValue);
    });
  });

  describe('using fetchList', () => {
    it('should create an action with request payload', () => {
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

    it('should create an action for cancelled request', () => {
      const { fetchListCancel } = actions;
      const { FETCH_LIST_CANCEL } = types;
      const expectedValue = {
        type: FETCH_LIST_CANCEL,
      };

      expect(fetchListCancel()).toEqual(expectedValue);
    });

    it('should create an action for failed request', () => {
      const { fetchListFailure } = actions;
      const { FETCH_LIST_FAILURE } = types;
      const expectedValue = {
        type: FETCH_LIST_FAILURE,
        error: defaultInitialState.error,
      };

      expect(fetchListFailure()).toEqual(expectedValue);

      expectedValue.error = axiosResponseError.data;

      expect(fetchListFailure(axiosResponseError)).toEqual(expectedValue);
    });

    it('should create an action for successful request', () => {
      const { fetchListSuccess } = actions;
      const { FETCH_LIST_SUCCESS } = types;
      const data = {
        items: [{ a: 1 }],
      };
      const expectedValue = {
        type: FETCH_LIST_SUCCESS,
        data: {
          items: defaultInitialState.list,
        },
      };

      expect(fetchListSuccess()).toEqual(expectedValue);

      expectedValue.data = data;

      expect(fetchListSuccess({ data })).toEqual(expectedValue);
    });
  });

  describe('using updateItem', () => {
    it('should create an action with request payload', () => {
      const { updateItem } = actions;
      const { UPDATE_ITEM } = types;
      const data = { a: 1 };
      const pathParams = { languageVersion: 'pl-PL' };
      const options = { b: 2 };
      const expectedValue = {
        type: UPDATE_ITEM,
        payload: {
          url: `${apiURL}/card/languageVersion/${pathParams.languageVersion}`,
          method: 'put',
          data,
        },
      };

      expect(updateItem({ data, pathParams })).toEqual(expectedValue);

      expectedValue.payload = {
        ...expectedValue.payload,
        ...options,
      };

      expect(updateItem({
        data, pathParams, options,
      })).toEqual(expectedValue);

      expectedValue.onFailure = onFailure;
      expectedValue.onSuccess = onSuccess;

      expect(updateItem({
        data, pathParams, options, onFailure, onSuccess,
      })).toEqual(expectedValue);
    });

    it('should create an action for failed request', () => {
      const { updateItemFailure } = actions;
      const { UPDATE_ITEM_FAILURE } = types;
      let expectedValue = {
        type: UPDATE_ITEM_FAILURE,
        error: defaultInitialState.error,
      };

      expect(updateItemFailure()).toEqual(expectedValue);

      expectedValue = {
        type: UPDATE_ITEM_FAILURE,
        error: axiosResponseError.data,
      };

      expect(updateItemFailure(axiosResponseError)).toEqual(expectedValue);
    });

    it('should create an action for successful request', () => {
      const { updateItemSuccess } = actions;
      const { UPDATE_ITEM_SUCCESS } = types;
      const data = [{ a: 1 }];
      let expectedValue = {
        type: UPDATE_ITEM_SUCCESS,
        data: defaultInitialState.item,
      };

      expect(updateItemSuccess()).toEqual(expectedValue);

      expectedValue = {
        type: UPDATE_ITEM_SUCCESS,
        data,
      };

      expect(updateItemSuccess({ data })).toEqual(expectedValue);
    });
  });
});

describe('selectors', () => {
  describe('using getState', () => {
    const { getState } = selectors;

    it('should throw if state namespace is not found', () => {
      expect(() => getState({})).toThrow();
    });

    it(`should return ${name} state`, () => {
      expect(getState(appState)).toEqual(initialState);
    });
  });

  describe('using getError', () => {
    const { getError } = selectors;
    const { error: defaultState } = defaultInitialState;

    it('should return default error state if there was no error', () => {
      expect(getError(appState)).toEqual(defaultState);
    });

    it('should return some error messages if there was an error', () => {
      const error = [
        { title: 'abc' },
      ];
      const state = generateAppState({ error });

      expect(getError(state)).toEqual(error);
    });
  });

  describe('using getItem', () => {
    const { getItem } = selectors;
    const { item: defaultState } = defaultInitialState;

    it('should return default item state if there is no item data', () => {
      expect(getItem(appState)).toEqual(defaultState);
    });

    it('should return item data', () => {
      const expectedValue = { id: 1 };
      const state = generateAppState({ item: expectedValue });

      expect(getItem(state)).toEqual(expectedValue);
    });
  });

  describe('using getList', () => {
    const { getList } = selectors;
    const { list: defaultState } = defaultInitialState;

    it('should return default list state if there is no list data', () => {
      expect(getList(appState)).toEqual(defaultState);
    });

    it('should return list data', () => {
      const expectedValue = [
        { id: 1 },
        { id: 2 },
      ];
      const state = generateAppState({ list: expectedValue });

      expect(getList(state)).toEqual(expectedValue);
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

  it('should handle CHANGE_DEFAULT_TRANSLATION_FAILURE', () => {
    let action = actions.changeDefaultTranslationFailure();
    const expectedValue = {
      ...defaultInitialState,
    };

    expect(reducer()(defaultInitialState, action)).toEqual(expectedValue);

    action = actions.changeDefaultTranslationFailure(axiosResponseError);
    expectedValue.error = axiosResponseError.data;

    expect(reducer()(defaultInitialState, action)).toEqual(expectedValue);
  });

  it('should handle CHANGE_DEFAULT_TRANSLATION_SUCCESS', () => {
    const action = actions.changeDefaultTranslationSuccess();
    const expectedValue = {
      ...defaultInitialState,
    };

    expect(reducer()(defaultInitialState, action)).toEqual(expectedValue);
  });

  it('should handle CLEAR_ERROR', () => {
    const action = actions.clearError();
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

    expect(reducer()({ ...defaultInitialState, item: {} }, action)).toEqual(expectedValue);
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

  it('should handle CREATE_ITEM_SUCCESS', () => {
    const action = actions.createItemSuccess();
    const expectedValue = {
      ...defaultInitialState,
    };

    expect(reducer()(defaultInitialState, action)).toEqual(expectedValue);
  });

  it('should handle CREATE_MAIN_IMAGE_FAILURE', () => {
    let action = actions.createMainImageFailure();
    const expectedValue = {
      ...defaultInitialState,
      error: defaultInitialState.error,
    };

    expect(reducer()(defaultInitialState, action)).toEqual(expectedValue);

    action = actions.createMainImageFailure(axiosResponseError);
    expectedValue.error = axiosResponseError.data;

    expect(reducer()(defaultInitialState, action)).toEqual(expectedValue);
  });

  it('should handle CREATE_MAIN_IMAGE_SUCCESS', () => {
    const action = actions.createMainImageSuccess();
    const expectedValue = {
      ...defaultInitialState,
    };

    expect(reducer()(defaultInitialState, action)).toEqual(expectedValue);
  });

  it('should handle CREATE_TRANSLATION_FAILURE', () => {
    let action = actions.createTranslationFailure();
    const expectedValue = {
      ...defaultInitialState,
    };

    expect(reducer()(defaultInitialState, action)).toEqual(expectedValue);

    action = actions.createTranslationFailure(axiosResponseError);
    expectedValue.error = axiosResponseError.data;

    expect(reducer()(defaultInitialState, action)).toEqual(expectedValue);
  });

  it('should handle CREATE_TRANSLATION_SUCCESS', () => {
    const action = actions.createTranslationSuccess();
    const expectedValue = {
      ...defaultInitialState,
    };

    expect(reducer()(defaultInitialState, action)).toEqual(expectedValue);
  });

  it('should handle DELETE_TRANSLATION_SUCCESS', () => {
    const action = actions.deleteTranslationSuccess();
    const expectedValue = {
      ...defaultInitialState,
    };

    expect(reducer()(defaultInitialState, action)).toEqual(expectedValue);
  });

  it('should handle DELETE_TRANSLATION_FAILURE', () => {
    let action = actions.deleteTranslationFailure();
    const expectedValue = {
      ...defaultInitialState,
    };

    expect(reducer()(defaultInitialState, action)).toEqual(expectedValue);

    action = actions.deleteTranslationFailure(axiosResponseError);
    expectedValue.error = axiosResponseError.data;

    expect(reducer()(defaultInitialState, action)).toEqual(expectedValue);
  });

  it('should handle FETCH_ITEM_FAILURE', () => {
    let action = actions.fetchItemFailure();
    const expectedValue = {
      ...defaultInitialState,
    };

    expect(reducer()(defaultInitialState, action)).toEqual(expectedValue);

    action = actions.fetchItemFailure(axiosResponseError);
    expectedValue.error = axiosResponseError.data;

    expect(reducer()(defaultInitialState, action)).toEqual(expectedValue);
  });

  it('should handle FETCH_ITEM_SUCCESS', () => {
    let action = actions.fetchItemSuccess();
    const data = { id: 1 };
    const expectedValue = {
      ...defaultInitialState,
    };

    expect(reducer()(defaultInitialState, action)).toEqual(expectedValue);

    action = actions.fetchItemSuccess({ data });
    expectedValue.item = data;

    expect(reducer()(defaultInitialState, action)).toEqual(expectedValue);
  });

  it('should handle FETCH_LIST_FAILURE', () => {
    let action = actions.fetchListFailure();
    const expectedValue = {
      ...defaultInitialState,
    };

    expect(reducer()(defaultInitialState, action)).toEqual(expectedValue);

    action = actions.fetchListFailure(axiosResponseError);
    expectedValue.error = axiosResponseError.data;

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
    const action = actions.fetchListSuccess({ data });
    const expectedValue = {
      ...defaultInitialState,
      list: data.items,
    };

    expect(reducer()(defaultInitialState, action)).toEqual(expectedValue);
  });

  it('should handle UPDATE_ITEM_FAILURE', () => {
    let action = actions.updateItemFailure();
    const expectedValue = {
      ...defaultInitialState,
    };

    expect(reducer()(defaultInitialState, action)).toEqual(expectedValue);

    action = actions.updateItemFailure(axiosResponseError);
    expectedValue.error = axiosResponseError.data;

    expect(reducer()(defaultInitialState, action)).toEqual(expectedValue);
  });

  it('should handle UPDATE_ITEM_SUCCESS', () => {
    const data = { id: 1 };
    const action = actions.updateItemSuccess({ data });
    const expectedValue = {
      ...defaultInitialState,
    };

    expect(reducer()(defaultInitialState, action)).toEqual(expectedValue);
  });
});
