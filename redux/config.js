export const name = 'config';
// const prefix = `${name}/`;


/*
 * TYPES
 */

export const types = {};


/*
 * ACTIONS
 */

export const actions = {};


/*
 * LOGIC
 */

export const logic = [];


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

/**
 * Returns application config
 *
 * @method
 * @param {object} state
 * @returns {object}
 */
const getAppConfig = state => getState(state) || {};

export const selectors = {
  getAppConfig,
  getState,
};


/*
 * REDUCERS
 */

const initialState = {};

/**
 * View reducer
 *
 * @method
 * @param {object} state
 * @param {object} action
 * @return {object}
 */
export default function reducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
