import { compose } from 'redux';
import LogoutView from 'views/LogoutView';
import withRoot from 'src/withRoot';
import withRedux from 'services/redux/withRedux';

export default compose(
  withRedux(),
  withRoot,
)(LogoutView);
