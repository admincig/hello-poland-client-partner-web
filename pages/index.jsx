import { compose } from 'redux';
import HomeView from 'views/HomeView';
import withRoot from 'src/withRoot';
import withRedux from 'services/redux/withRedux';
import { actions as sightsActions } from 'redux/sights';
import { actions as sightEventsActions } from 'redux/sightEvents';

HomeView.getInitialProps = ({ store }) => {
  store.dispatch(sightsActions.fetchList());
  store.dispatch(sightEventsActions.fetchList());

  return {};
};

export default compose(
  withRedux(),
  withRoot,
)(HomeView);
