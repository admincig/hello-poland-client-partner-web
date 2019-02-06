import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { selectors as profileSelectors } from '@hello-poland/commons/redux/profile';
import Layout from 'components/Layout';
import Grid from '@material-ui/core/Grid';

import UserProfile from './components/UserProfile';
import PasswordForm from './components/PasswordForm';

const SettingsView = ({ profile }) => (
  <Layout>
    <Grid container justify="center" spacing={30} style={{ padding: 30 }}>
      <Grid item md={5} xs={12}>
        <UserProfile profile={profile} />
      </Grid>
      <Grid item md={5} xs={12}>
        <PasswordForm />
      </Grid>
    </Grid>
  </Layout>
);

SettingsView.propTypes = {
  profile: PropTypes.shape({
    email: PropTypes.string,
  }).isRequired,
};

const mapStateToProps = state => ({
  profile: profileSelectors.getProfile(state),
});

export default connect(mapStateToProps)(SettingsView);
