import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { selectors as profileSelectors } from '@hello-poland/commons/redux/profile';
import Layout from 'components/Layout';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import UserProfile from './components/UserProfile';
import ProfileForm from './components/ProfileForm';
import PasswordForm from './components/PasswordForm';

class AccountView extends Component {
  state = {
    value: 0,
  }

  handleChange = (event, value) => this.setState({ value });

  render() {
    const { value } = this.state;
    const { profile } = this.props;
    return (
      <Layout>
        <Grid container justify="center" spacing={32} style={{ padding: 30, height: 500 }}>
          <Grid item md={3} xs={12}>
            <UserProfile profile={profile} style={{ height: '100%' }} />
          </Grid>
          <Grid item md={9} xs={12}>
            <AppBar position="static">
              <Tabs value={value} onChange={this.handleChange}>
                <Tab label="Profil" />
                <Tab label="Ustawienia" />
              </Tabs>
            </AppBar>
            {
              value === 0 &&
              <ProfileForm profile={profile} />
            }
            {
              value === 1 &&
              <PasswordForm />
            }
          </Grid>
        </Grid>
      </Layout>
    );
  }
}

AccountView.propTypes = {
  profile: PropTypes.shape({
    email: PropTypes.string,
  }).isRequired,
};

const mapStateToProps = state => ({
  profile: profileSelectors.getProfile(state),
});

export default connect(mapStateToProps)(AccountView);
