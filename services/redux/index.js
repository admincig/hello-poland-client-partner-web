import createInitializedStore from './store';
import reduxLogic from './logic';
import reduxRootReducer from './rootReducer';
import reduxWithRedux from './withRedux';

export default createInitializedStore;

export const logic = reduxLogic;
export const rootReducer = reduxRootReducer;
export const withRedux = reduxWithRedux;
