import { logic as configLogic } from 'redux/config';
import { logic as profileLogic } from 'redux/profile';
import { logic as sightsLogic } from 'redux/sights';
import { logic as sightEventsLogic } from 'redux/sightEvents';
import { logic as viewLogic } from 'redux/view';

export default Object.values({
  configLogic,
  profileLogic,
  sightEventsLogic,
  sightsLogic,
  viewLogic,
}).reduce((acc, obj) => [...acc, ...Object.values(obj)], []);
