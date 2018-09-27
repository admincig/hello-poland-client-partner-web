import { logic as configLogic } from 'redux/config';
import { logic as profileLogic } from '@hello-poland/commons/redux/profile';
import { logic as sightsLogic } from '@hello-poland/commons/redux/sights';
import { logic as sightEventsLogic } from '@hello-poland/commons/redux/sightEvents';
import { logic as ticketDefinitionsLogic } from 'redux/ticketDefinitions';
import { logic as ticketPoolDefinitionsLogic } from '@hello-poland/commons/redux/ticketPoolDefinitions';
import { logic as viewLogic } from 'redux/view';

export default Object.values({
  configLogic,
  profileLogic,
  sightEventsLogic,
  sightsLogic,
  ticketDefinitionsLogic,
  ticketPoolDefinitionsLogic,
  viewLogic,
}).reduce((acc, obj) => [...acc, ...Object.values(obj)], []);
