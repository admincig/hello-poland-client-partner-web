import { logic as configLogic } from 'redux/config';
import { logic as profileLogic } from 'redux/profile';
import { logic as viewLogic } from 'redux/view';

export default Object.values({
  configLogic,
  profileLogic,
  viewLogic,
}).reduce((acc, obj) => [...acc, ...Object.values(obj)], []);
