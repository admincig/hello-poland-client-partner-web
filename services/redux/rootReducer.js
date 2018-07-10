import { combineReducers } from 'redux';
import config, { name as configName } from 'redux/config';
import profile, { name as profileName } from 'redux/profile';
import sights, { name as sightsName } from 'redux/sights';
import sightEvents, { name as sightEventsName } from 'redux/sightEvents';
import view, { name as viewName } from 'redux/view';

export default combineReducers({
  [configName]: config,
  [profileName]: profile,
  [sightEventsName]: sightEvents,
  [sightsName]: sights,
  [viewName]: view,
});
