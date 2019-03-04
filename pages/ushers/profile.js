import ProfileView from 'views/Ushers/ProfileView';

ProfileView.getInitialProps = ({ query }) => {
  const activeTab = 'profile';
  const usherId = +query.usherId;

  return { activeTab, usherId };
};

export default ProfileView;
