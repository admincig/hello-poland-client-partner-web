import { combineReducers } from 'redux';
import config, { name as configName } from 'redux/config';
import profile, { name as profileName } from '@hello-poland/commons/lib/redux/profile';
import sightEvents, { name as sightEventsName } from '@hello-poland/commons/lib/redux/sightEvents';
import sights, { name as sightsName } from '@hello-poland/commons/lib/redux/sights';
import view, { name as viewName } from 'redux/view';

export default combineReducers({
  [configName]: config,
  [profileName]: profile(),
  [sightEventsName]: sightEvents(),
  [sightsName]: sights(),
  [viewName]: view,
});
