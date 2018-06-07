import { compose } from 'redux';
import HomeView from 'views/HomeView';
import withRoot from 'src/withRoot';
import withRedux from 'services/redux/withRedux';
import { selectors } from 'views/HomeView/redux/counter';

HomeView.getInitialProps = ({ store }) => {
  const state = store.getState();

  return {
    count: selectors.getCount(state),
  };
};

export default compose(
  withRedux(),
  withRoot,
)(HomeView);
