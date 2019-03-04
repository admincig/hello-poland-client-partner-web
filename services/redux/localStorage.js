import { name as profileName } from '@hello-poland/commons/redux/profile';
import profileSubscriber, { getPersistedProfileState } from './profileSubscriber';

const isServer = typeof window === 'undefined';

export const subscribers = [
  profileSubscriber,
];

function getPersistedState(initialState) {
  if (!isServer) {
    return {
      [profileName]: getPersistedProfileState() || initialState[profileName],
    };
  }

  return {};
}

export default getPersistedState;
