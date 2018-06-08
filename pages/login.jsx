import { compose } from 'redux';
import LoginView from 'views/LoginView';
import withRoot from 'src/withRoot';
import withRedux from 'services/redux/withRedux';

export default compose(
  withRedux(),
  withRoot,
)(LoginView);
