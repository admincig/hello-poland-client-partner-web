import { combineReducers } from 'redux';
import bookings, { name as bookingsName } from '@hello-poland/commons/redux/bookings';
import categories, { name as categoriesName } from '@hello-poland/commons/redux/categories';
import config, { name as configName } from 'redux/config';
import files, { name as filesName } from '@hello-poland/commons/redux/files';
import partners, { name as partnersName } from 'redux/partners';
import profile, { name as profileName } from 'redux/profile';
import sightEvents, { name as sightEventsName } from '@hello-poland/commons/redux/sightEvents';
import sights, { name as sightsName } from '@hello-poland/commons/redux/sights';
import tags, { name as tagsName } from '@hello-poland/commons/redux/tags';
import ticketDefinitions, { name as ticketDefinitionsName } from 'redux/ticketDefinitions';
import ticketPoolDefinitions, { name as ticketPoolDefinitionsName } from '@hello-poland/commons/redux/ticketPoolDefinitions';
import ticketTypes, { name as ticketTypesName } from 'redux/ticketTypes';
import ushers, { name as ushersName } from 'redux/ushers';
import view, { name as viewName } from 'redux/view';

export default combineReducers({
  [bookingsName]: bookings(),
  [categoriesName]: categories(),
  [configName]: config,
  [filesName]: files(),
  [partnersName]: partners(),
  [profileName]: profile(),
  [sightEventsName]: sightEvents(),
  [sightsName]: sights(),
  [tagsName]: tags(),
  [ticketDefinitionsName]: ticketDefinitions(),
  [ticketPoolDefinitionsName]: ticketPoolDefinitions(),
  [ticketTypesName]: ticketTypes(),
  [ushersName]: ushers(),
  [viewName]: view,
});
