import { compose } from 'redux';
import AboutView from 'views/AboutView';
import withRoot from 'src/withRoot';
import withRedux from 'services/redux/withRedux';

export default compose(
  withRedux(),
  withRoot,
)(AboutView);
