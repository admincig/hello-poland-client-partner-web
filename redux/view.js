export const name = 'view';
const prefix = `${name}/`;

/*
 * TYPES
 */

const DOCUMENT_DESCRIPTION_SET = `${prefix}DOCUMENT_DESCRIPTION_SET`;
const DOCUMENT_KEYWORDS_SET = `${prefix}DOCUMENT_KEYWORDS_SET`;
const DOCUMENT_TITLE_SET = `${prefix}DOCUMENT_TITLE_SET`;

export const types = {
  DOCUMENT_DESCRIPTION_SET,
  DOCUMENT_KEYWORDS_SET,
  DOCUMENT_TITLE_SET,
};


/*
 * ACTIONS
 */

/**
 * Sets document description
 *
 * @method
 * @param {string} data
 * @return {{type: string, description: string}}
 */
const setDocumentDescription = data => ({
  type: DOCUMENT_DESCRIPTION_SET,
  data,
});

/**
 * Sets document keywords
 *
 * @method
 * @param data
 * @return {{type: string, data: *}}
 */

const setDocumentKeywords = data => ({
  type: DOCUMENT_KEYWORDS_SET,
  data,
});

/**
 * Sets document title
 *
 * @method
 * @param data
 * @return {{type: string, data: string}}
 */
const setDocumentTitle = data => ({
  type: DOCUMENT_TITLE_SET,
  data,
});

export const actions = {
  setDocumentDescription,
  setDocumentKeywords,
  setDocumentTitle,
};


/*
 * LOGIC
 */

export const logic = [];


/*
 * SELECTORS
 */

const getState = state => state[name];

const getDocumentDescription = state => getState(state).description;

const getDocumentKeywords = state => getState(state).keywords;

const getDocumentTitle = state => getState(state).title;

export const selectors = {
  getDocumentDescription,
  getDocumentKeywords,
  getDocumentTitle,
  getState,
};


/*
 * REDUCERS
 */

const initialState = {
  description: '',
  keywords: '',
  title: '',
};

/**
 * View reducer
 *
 * @method
 * @param {object} state
 * @param {object} action
 * @return {object}
 */
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case DOCUMENT_DESCRIPTION_SET:
      return {
        ...state,
        description: action.data,
      };
    case DOCUMENT_KEYWORDS_SET:
      return {
        ...state,
        keywords: action.data,
      };
    case DOCUMENT_TITLE_SET:
      return {
        ...state,
        title: action.data,
      };
    default:
      return state;
  }
};

export default reducer;
