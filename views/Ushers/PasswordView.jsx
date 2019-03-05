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

class PasswordView extends Component {
  componentDidMount() {
    const { usherId } = this.props;

    this.fetchProfile(usherId);
  }

  fetchProfile = (userId) => {
    // const { fetchUsher } = this.props;
    const { fetchUshers } = this.props;

    // fetchUsher({ id: userId });
    fetchUshers({ id: userId });
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
    const { activeTab, usherId, ushers } = this.props;
    const profile = ushers.find(usher => usher.id === usherId) || {};

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
        <Typography variant="h6" gutterBottom>
Bileterzy /
          {profile.email}
        </Typography>
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
  // fetchUsher: PropTypes.func.isRequired,
  fetchUshers: PropTypes.func.isRequired,
  // profile: PropTypes.shape({
  //   email: PropTypes.string,
  //   name: PropTypes.string,
  // }),
  usherId: PropTypes.number.isRequired,
  ushers: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

PasswordView.defaultProps = {
  activeTab: 'password',
  // profile: {},
};

const mapStateToProps = state => ({
// profile: ushersSelectors.getUsher(state),
  ushers: ushersSelectors.getUshers(state),
});

const mapDispatchToProps = {
  fetchUsher: ushersActions.fetchItem,
  fetchUshers: ushersActions.fetchList,
  changePassword: ushersActions.changePassword,
};

export default connect(mapStateToProps, mapDispatchToProps)(PasswordView);
