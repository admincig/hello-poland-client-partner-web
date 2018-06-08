import { compose } from 'redux';
import HomeView from 'views/HomeView';
import withRoot from 'src/withRoot';
import withRedux from 'services/redux/withRedux';

export default compose(
  withRedux(),
  withRoot,
)(HomeView);
