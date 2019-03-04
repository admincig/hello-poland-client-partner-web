import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Link from 'next/link';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {
  actions as ushersActions,
  selectors as ushersSelectors,
} from 'redux/ushers';
import Layout from 'components/Layout';
import ProfileComponent from 'components/ProfileComponent/ProfileComponent';
import ProfileForm from 'components/ProfileComponent/ProfileForm';
import PasswordForm from 'components/ProfileComponent/PasswordForm';
import Router from 'next/router';


class ProfileView extends Component {
  componentDidMount() {
    const { usherId } = this.props;
    this.fetchProfile(usherId);
  }

  fetchProfile = (userId) => {
    const { fetchUsher } = this.props;
    fetchUsher({
      id: userId,
      onFailure: () => console.log('elo'),
    });
  };

  handlePasswordSubmit = (values, actions) => {
    const { oldPassword, password } = values;
    const { setStatus } = actions;
    const { changePassword, usherId } = this.props;

    setStatus(null);

    changePassword({
      id: usherId,
      data: {
        oldPassword,
        password,
      },
      onFailure: this.handleSubmitCallback('failure')(actions)('Wystąpił błąd podczas próby zmiany hasła.')(null),
      onSuccess: this.handleSubmitCallback('success')(actions)('Zmieniono hasło')(() => actions.resetForm()),
    });
  };

  handleProfileSubmit = (values, actions) => {
    const { name } = values;
    const { setStatus } = actions;
    const { changeProfile, usherId } = this.props;

    setStatus(null);

    changeProfile({
      id: usherId,
      data: {
        name,
      },
      onFailure: this.handleSubmitCallback('failure')(actions)('Wystąpił błąd przy zmianie profilu')(null),
      onSuccess: this.handleSubmitCallback('success')(actions)('Zmieniono profil')(() => this.fetchProfile(usherId)),
    });
  }

  handleSubmitCallback = type => formikActions => message => callback => () => {
    const { setStatus, setSubmitting } = formikActions;
    setSubmitting(false);
    if (callback) callback();
    setStatus({ type, message });
  };

  handleTabChange = (activeTab) => {
    const { usherId } = this.props;
    Router.replace(`/ushers/${usherId}/${activeTab}`);
  }

  render() {
    const { activeTab, profile } = this.props;
    return (
      <Layout>
        <Link href="/" passHref prefetch>
          <Button component="a">Strona główna</Button>
        </Link>
        <Link href="/ushers" passHref prefetch>
          <Button component="a">
            Bileterzy
          </Button>
        </Link>
        <Typography variant="title" gutterBottom>Bileterzy / {profile.name || profile.email}</Typography>
        <ProfileComponent
          activeTab={activeTab}
          profile={profile}
          handleTabChange={this.handleTabChange}
        >
          {
            activeTab === 'profile' &&
            <ProfileForm profile={profile} onSubmit={this.handleProfileSubmit} />
          }
          {
            activeTab === 'password' &&
            <PasswordForm onSubmit={this.handlePasswordSubmit} />
          }
        </ProfileComponent>
      </Layout>
    );
  }
}

ProfileView.propTypes = {
  activeTab: PropTypes.string,
  changePassword: PropTypes.func.isRequired,
  changeProfile: PropTypes.func.isRequired,
  fetchUsher: PropTypes.func.isRequired,
  profile: PropTypes.shape({
    email: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  usherId: PropTypes.number.isRequired,
};

ProfileView.defaultProps = {
  activeTab: 0,
};

const mapStateToProps = state => ({
  profile: ushersSelectors.getUsher(state),
  ushers: ushersSelectors.getUshers(state),
});

const mapDispatchToProps = {
  fetchUsher: ushersActions.fetchItem,
  changePassword: ushersActions.changePassword,
  changeProfile: ushersActions.changeProfile,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileView);
