import { name as profileName } from '@hello-poland/commons/redux/profile';
import profileSubscriber, { getPersistedProfileState } from './profileSubscriber';

const isServer = typeof window === 'undefined';

export const subscribers = [
  profileSubscriber,
];

function getPersistedState(initialState) {
  if (isServer) {
    return {};
  }

  return {
    [profileName]: getPersistedProfileState() || initialState[profileName],
  };
}

export default getPersistedState;
