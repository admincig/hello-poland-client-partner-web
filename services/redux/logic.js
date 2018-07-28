import { logic as configLogic } from 'redux/config';
import { logic as profileLogic } from '@hello-poland/commons/lib/redux/profile';
import { logic as sightsLogic } from '@hello-poland/commons/lib/redux/sights';
import { logic as sightEventsLogic } from '@hello-poland/commons/lib/redux/sightEvents';
import { logic as viewLogic } from 'redux/view';

export default Object.values({
  configLogic,
  profileLogic,
  sightEventsLogic,
  sightsLogic,
  viewLogic,
}).reduce((acc, obj) => [...acc, ...Object.values(obj)], []);
