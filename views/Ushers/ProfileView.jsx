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
      onFailure: () => Router.push('/404'),
    });
  };

  handlePasswordSubmit = (values, actions) => {
    const { password } = values;
    const { setStatus, resetForm } = actions;
    const { changePassword, usherId } = this.props;
    const data = { password };
    const callback = () => resetForm();

    setStatus(null);

    changePassword({
      id: usherId,
      data,
      onFailure: this.handleSubmitCallback('failure')({
        formikActions: actions,
        message: 'Wystąpił błąd przy zmianie hasła',
      }),
      onSuccess: this.handleSubmitCallback('success')({
        formikActions: actions,
        callback,
        message: 'Zapisano pomyślnie',
      }),
    });
  };

  handleProfileSubmit = (values, actions) => {
    const { name } = values;
    const { setStatus } = actions;
    const { changeProfile, usherId } = this.props;
    const data = { name };
    const callback = () => this.fetchProfile(usherId);

    setStatus(null);

    changeProfile({
      id: usherId,
      data,
      onFailure: this.handleSubmitCallback('failure')({
        formikActions: actions,
        message: 'Wystąpił błąd przy zmianie profilu',
      }),
      onSuccess: this.handleSubmitCallback('success')({
        formikActions: actions,
        callback,
        message: 'Zapisano pomyślnie',
      }),
    });
  }

  handleSubmitCallback = type => ({ formikActions, callback, message }) => () => {
    const { setStatus, setSubmitting } = formikActions;
    setSubmitting(false);
    setStatus({ type, message: message || '' });
    if (callback) {
      callback();
    }
  };

  handleTabChange = (activeTab) => {
    Router.replace(`/ushers/${this.props.usherId}/${activeTab}`);
  };

  render() {
    const { profile, activeTab } = this.props;
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
          disableProfile={false}
        >
          {
            activeTab === 'profile' &&
            <ProfileForm profile={profile} onSubmit={this.handleProfileSubmit} />
          }
          {
            activeTab === 'password' &&
            <PasswordForm onSubmit={this.handlePasswordSubmit} noOldpassword />
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
  activeTab: 'profile',
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
