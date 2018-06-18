import { compose } from 'redux';
import HomeView from 'views/HomeView';
import withRoot from 'src/withRoot';
import withRedux from 'services/redux/withRedux';
import { actions as sightsActions } from 'redux/sights';

HomeView.getInitialProps = ({ store }) => {
  store.dispatch(sightsActions.fetchList());

  return {};
};

export default compose(
  withRedux(),
  withRoot,
)(HomeView);
