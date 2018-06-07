import reducer, {
  actions,
  name,
  selectors,
  types,
} from './view';

/*
 * Initial state
 */

const initialState = {
  description: '',
  keywords: '',
  title: '',
};

const appState = {
  config: {},
  [name]: initialState,
};

/*
 * Helper functions
 */

function generateState(data) {
  return {
    ...appState,
    [name]: {
      ...initialState,
      ...data,
    },
  };
}

/*
 * Tests
 */

describe('actions', () => {
  describe('using setDocumentDescription', () => {
    it('should create an action to change document description', () => {
      const { setDocumentDescription } = actions;
      const { DOCUMENT_DESCRIPTION_SET } = types;
      const description = 'Lorem ipsum dolor';

      const expectedResult = {
        type: DOCUMENT_DESCRIPTION_SET,
        data: description,
      };

      expect(setDocumentDescription(description)).toEqual(expectedResult);
    });
  });

  describe('using setDocumentKeywords', () => {
    it('should create an action to change document keywords', () => {
      const { setDocumentKeywords } = actions;
      const { DOCUMENT_KEYWORDS_SET } = types;
      const keywords = 'lorem, ipsum, dolor';

      const expectedResult = {
        type: DOCUMENT_KEYWORDS_SET,
        data: keywords,
      };

      expect(setDocumentKeywords(keywords)).toEqual(expectedResult);
    });
  });

  describe('using setDocumentTitle', () => {
    it('should create an action to change document title', () => {
      const { setDocumentTitle } = actions;
      const { DOCUMENT_TITLE_SET } = types;
      const title = 'Lorem ipsum dolor';

      const expectedResult = {
        type: DOCUMENT_TITLE_SET,
        data: title,
      };

      expect(setDocumentTitle(title)).toEqual(expectedResult);
    });
  });
});

describe('selectors', () => {
  describe('using getState', () => {
    it(`should return ${name}'s state`, () => {
      const { getState } = selectors;

      expect(getState(appState)).toEqual(initialState);
    });
  });

  describe('using getDocumentDescription', () => {
    it('should return initial document description', () => {
      const { getDocumentDescription } = selectors;

      expect(getDocumentDescription(appState)).toEqual('');
    });

    it('should return document description', () => {
      const { getDocumentDescription } = selectors;
      const description = 'Lorem ipsum dolor';

      const state = generateState({ description });

      expect(getDocumentDescription(state)).toEqual(description);
    });
  });

  describe('using getDocumentKeywords', () => {
    it('should return initial document keywords', () => {
      const { getDocumentKeywords } = selectors;

      expect(getDocumentKeywords(appState)).toEqual('');
    });

    it('should return document keywords', () => {
      const { getDocumentKeywords } = selectors;
      const keywords = 'lorem, ipsum, dolor';

      const state = generateState({ keywords });

      expect(getDocumentKeywords(state)).toEqual(keywords);
    });
  });

  describe('using getDocumentTitle', () => {
    it('should return initial document title', () => {
      const { getDocumentTitle } = selectors;

      expect(getDocumentTitle(appState)).toEqual('');
    });

    it('should return document title', () => {
      const { getDocumentTitle } = selectors;
      const title = 'Lorem ipsum dolor';

      const state = generateState({ title });

      expect(getDocumentTitle(state)).toEqual(title);
    });
  });
});

describe('reducer', () => {
  it('should return initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should handle DOCUMENT_DESCRIPTION_SET', () => {
    const { setDocumentDescription } = actions;
    const description = 'Lorem ipsum dolor';

    const action = setDocumentDescription(description);
    const expectedResult = generateState({ description });

    expect(reducer(initialState, action)).toEqual(expectedResult[name]);
  });

  it('should handle DOCUMENT_KEYWORDS_SET', () => {
    const { setDocumentKeywords } = actions;
    const keywords = 'lorem, ipsum, dolor';

    const action = setDocumentKeywords(keywords);
    const expectedResult = generateState({ keywords });

    expect(reducer(initialState, action)).toEqual(expectedResult[name]);
  });

  it('should handle DOCUMENT_TITLE_SET', () => {
    const { setDocumentTitle } = actions;
    const title = 'Lorem ipsum dolor';

    const action = setDocumentTitle(title);
    const expectedResult = generateState({ title });

    expect(reducer(initialState, action)).toEqual(expectedResult[name]);
  });
});
