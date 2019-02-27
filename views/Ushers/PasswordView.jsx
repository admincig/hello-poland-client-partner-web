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
import PasswordForm from 'components/ProfileComponent/PasswordForm';
import Router from 'next/router';

class PasswordView extends Component {
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

  handleSubmit = (values, actions) => {
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
      onFailure: this.handleSubmitFailure(actions),
      onSuccess: this.handleSubmitSuccess(actions),
    });
  };

  handleSubmitFailure = formikActions => () => {
    const { setStatus, setSubmitting } = formikActions;

    setSubmitting(false);
    setStatus({ type: 'failure', message: 'Wystąpił błąd podczas próby zmiany hasła.' });
  };

  handleSubmitSuccess = formikActions => () => {
    const { resetForm, setStatus, setSubmitting } = formikActions;

    resetForm();
    setSubmitting(false);
    setStatus({ type: 'success', message: 'Hasło zostało zmienione.' });
  };

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
        <Typography variant="title" gutterBottom>Bileterzy / {profile.email}</Typography>
        <ProfileComponent activeTab={activeTab} profile={profile}>
          <PasswordForm onSubmit={this.handleSubmit} />
        </ProfileComponent>
      </Layout>
    );
  }
}

PasswordView.propTypes = {
  activeTab: PropTypes.string,
  changePassword: PropTypes.func.isRequired,
  fetchUsher: PropTypes.func.isRequired,
  profile: PropTypes.shape({
    email: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
  usherId: PropTypes.number.isRequired,
};

PasswordView.defaultProps = {
  activeTab: 'password',
};

const mapStateToProps = state => ({
  profile: ushersSelectors.getUsher(state),
  ushers: ushersSelectors.getUshers(state),
});

const mapDispatchToProps = {
  fetchUsher: ushersActions.fetchItem,
  changePassword: ushersActions.changePassword,
};

export default connect(mapStateToProps, mapDispatchToProps)(PasswordView);
