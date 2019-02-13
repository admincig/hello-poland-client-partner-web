import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { selectors as profileSelectors } from '@hello-poland/commons/redux/profile';
import Layout from 'components/Layout';
import Grid from '@material-ui/core/Grid';

import UserProfile from './components/UserProfile';
import PasswordForm from './components/PasswordForm';

const AccountView = ({ profile }) => (
  <Layout>
    <Grid container justify="flex-start" spacing={32} style={{ padding: 30 }}>
      <Grid item md={3} xs={12}>
        <UserProfile profile={profile} />
      </Grid>
      <Grid item md={4} xs={12}>
        <PasswordForm />
      </Grid>
    </Grid>
  </Layout>
);

AccountView.propTypes = {
  profile: PropTypes.shape({
    email: PropTypes.string,
  }).isRequired,
};

const mapStateToProps = state => ({
  profile: profileSelectors.getProfile(state),
});

export default connect(mapStateToProps)(AccountView);
