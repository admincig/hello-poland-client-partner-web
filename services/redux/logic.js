import reduxUtils from '@hello-poland/commons/utils/redux';
import { logic as bookingLogic } from '@hello-poland/commons/redux/bookings';
import { logic as categoriesLogic } from '@hello-poland/commons/redux/categories';
import { logic as configLogic } from 'redux/config';
import { logic as filesLogic } from '@hello-poland/commons/redux/files';
import { logic as partnersLogic } from 'redux/partners';
import { logic as partnerUsersLogic } from 'redux/partnerUsers';
import { logic as profileLogic } from 'redux/profile';
import { logic as sightsLogic } from '@hello-poland/commons/redux/sights';
import { logic as sightEventsLogic } from '@hello-poland/commons/redux/sightEvents';
import { logic as tagsLogic } from '@hello-poland/commons/redux/tags';
import { logic as ticketDefinitionsLogic } from 'redux/ticketDefinitions';
import { logic as ticketPoolDefinitionsLogic } from '@hello-poland/commons/redux/ticketPoolDefinitions';
import { logic as ticketTypesLogic } from 'redux/ticketTypes';
import { logic as ushersLogic } from 'redux/ushers';
import { logic as viewLogic } from 'redux/view';

export default reduxUtils.parseReduxLogic({
  bookingLogic,
  categoriesLogic,
  configLogic,
  filesLogic,
  partnersLogic,
  partnerUsersLogic,
  profileLogic,
  sightEventsLogic,
  sightsLogic,
  tagsLogic,
  ticketDefinitionsLogic,
  ticketPoolDefinitionsLogic,
  ticketTypesLogic,
  ushersLogic,
  viewLogic,
});
