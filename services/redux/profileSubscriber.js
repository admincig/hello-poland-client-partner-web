import { name } from '@hello-poland/commons/redux/profile';
import createSubscriber from './createSubscriber';
import createPersistedStateGetter from './createPersistedStateGetter';

const LS_KEY = name;

export const getPersistedProfileState = createPersistedStateGetter(LS_KEY);

const profileSubscriber = createSubscriber(name, LS_KEY);

export default profileSubscriber;
