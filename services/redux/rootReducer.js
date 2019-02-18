import { combineReducers } from 'redux';
import config, { name as configName } from 'redux/config';
import profile, { name as profileName } from '@hello-poland/commons/redux/profile';
import sightEvents, { name as sightEventsName } from '@hello-poland/commons/redux/sightEvents';
import sights, { name as sightsName } from '@hello-poland/commons/redux/sights';
import ticketDefinitions, { name as ticketDefinitionsName } from 'redux/ticketDefinitions';
import ticketPoolDefinitions, { name as ticketPoolDefinitionsName } from '@hello-poland/commons/redux/ticketPoolDefinitions';
import ushers, { name as ushersName } from 'redux/ushers';
import view, { name as viewName } from 'redux/view';

export default combineReducers({
  [configName]: config,
  [profileName]: profile(),
  [sightEventsName]: sightEvents(),
  [sightsName]: sights(),
  [ticketDefinitionsName]: ticketDefinitions(),
  [ticketPoolDefinitionsName]: ticketPoolDefinitions(),
  [ushersName]: ushers(),
  [viewName]: view,
});
