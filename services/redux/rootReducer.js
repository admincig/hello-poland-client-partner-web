import { combineReducers } from 'redux';
import config, { name as configName } from 'redux/config';
import profile, { name as profileName } from 'redux/profile';
import sights, { name as sightsName } from 'redux/sights';
import view, { name as viewName } from 'redux/view';

export default combineReducers({
  [configName]: config,
  [profileName]: profile,
  [sightsName]: sights,
  [viewName]: view,
});
