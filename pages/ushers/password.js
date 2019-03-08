import PasswordView from 'views/Ushers/PasswordView';

PasswordView.getInitialProps = ({ query }) => {
  const activeTab = 'password';
  const usherId = +query.usherId;

  return { activeTab, usherId };
};

export default PasswordView;
