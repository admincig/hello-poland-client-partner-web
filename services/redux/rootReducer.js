import { combineReducers } from 'redux';
import config, { name as configName } from 'redux/config';
import profile, { name as profileName } from 'shared/redux/profile';
import view, { name as viewName } from 'redux/view';

export default combineReducers({
  [configName]: config,
  [profileName]: profile,
  [viewName]: view,
});
