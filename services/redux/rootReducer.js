import { combineReducers } from 'redux';
import bookings, { name as bookingsName } from '@hello-poland/commons/redux/bookings';
import categories, { name as categoriesName } from '@hello-poland/commons/redux/categories';
import config, { name as configName } from 'redux/config';
import partners, { name as partnersName } from 'redux/partners';
import profile, { name as profileName } from '@hello-poland/commons/redux/profile';
import sightEvents, { name as sightEventsName } from '@hello-poland/commons/redux/sightEvents';
import sights, { name as sightsName } from '@hello-poland/commons/redux/sights';
import tags, { name as tagsName } from '@hello-poland/commons/redux/tags';
import ticketDefinitions, { name as ticketDefinitionsName } from 'redux/ticketDefinitions';
import ticketPoolDefinitions, { name as ticketPoolDefinitionsName } from '@hello-poland/commons/redux/ticketPoolDefinitions';
import ushers, { name as ushersName } from 'redux/ushers';
import view, { name as viewName } from 'redux/view';

export default combineReducers({
  [bookingsName]: bookings(),
  [categoriesName]: categories(),
  [configName]: config,
  [partnersName]: partners(),
  [profileName]: profile(),
  [sightEventsName]: sightEvents(),
  [sightsName]: sights(),
  [tagsName]: tags(),
  [ticketDefinitionsName]: ticketDefinitions(),
  [ticketPoolDefinitionsName]: ticketPoolDefinitions(),
  [ushersName]: ushers(),
  [viewName]: view,
});
