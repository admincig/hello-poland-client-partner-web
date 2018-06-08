import { logic as configLogic } from 'redux/config';
import { logic as viewLogic } from 'redux/view';
import { logic as profileLogic } from 'shared/redux/profile';

export default Object.values({
  configLogic,
  profileLogic,
  viewLogic,
}).reduce((acc, obj) => [...acc, ...Object.values(obj)], []);
