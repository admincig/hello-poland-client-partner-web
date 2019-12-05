import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import {
  actions as profileActions,
  selectors as profileSelectors,
} from '@hello-poland/commons/redux/profile';
import Layout from 'components/Layout';
import ProfileComponent from 'components/ProfileComponent/ProfileComponent';
import PasswordForm from 'components/ProfileComponent/PasswordForm';
import withAuth from 'services/auth/withAuth';

class PasswordView extends Component {
  handleSubmit = (values, actions) => {
    const { oldPassword, password } = values;
    const { setStatus } = actions;
    const { changePassword } = this.props;

    setStatus(null);

    changePassword({
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
    const { profile } = this.props;
    return (
      <Layout>
        <ProfileComponent activeTab="password" profile={profile} onTabChange={() => {}} disableProfile>
          <PasswordForm type="submit" onSubmit={this.handleSubmit} />
        </ProfileComponent>
      </Layout>
    );
  }
}

PasswordView.propTypes = {
  changePassword: PropTypes.func.isRequired,
  profile: PropTypes.shape({
    email: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
};

const mapStateToProps = state => ({
  profile: profileSelectors.getProfile(state),
});

const mapDispatchToProps = {
  changePassword: profileActions.changePassword,
};

export default compose(
  withAuth(),
  connect(mapStateToProps, mapDispatchToProps),
)(PasswordView);
