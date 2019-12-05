import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Router from 'next/router';
import {
  actions as ushersActions,
  selectors as ushersSelectors,
} from 'redux/ushers';
import Layout from 'components/Layout';
import ProfileComponent from 'components/ProfileComponent/ProfileComponent';
import PasswordForm from 'components/ProfileComponent/PasswordForm';
import withAuth from 'services/auth/withAuth';

class PasswordView extends Component {
  constructor(props) {
    super(props);

    const { activeTab } = this.props;

    this.state = {
      activeTab,
    };
  }

  componentDidMount() {
    const { usherId, profile } = this.props;

    if (!profile || profile.id !== usherId) {
      this.fetchProfile(usherId);
    }

    Router.prefetch('/ushers/profile');
  }

  fetchProfile = (userId) => {
    const { fetchUsher } = this.props;

    fetchUsher({ id: userId });
  };

  handlePasswordSubmit = (values, actions) => {
    const { password } = values;
    const { setStatus, resetForm } = actions;
    const { changePassword, usherId } = this.props;
    const data = { password };

    setStatus(null);

    changePassword({
      id: usherId,
      data,
      onFailure: this.handleSubmitFailure({
        formikActions: actions,
        message: 'Wystąpił błąd podczas zmiany hasła.',
      }),
      onSuccess: this.handleSubmitSuccess({
        callback: () => resetForm(),
        formikActions: actions,
        message: 'Zapisano pomyślnie.',
      }),
    });
  };

  handleSubmitFailure = ({ formikActions, message }) => {
    const { setStatus, setSubmitting } = formikActions;

    setStatus({ type: 'failure', message: message || '' });
    setSubmitting(false);
  };

  handleSubmitSuccess = ({ formikActions, message, callback }) => () => {
    const { setStatus, setSubmitting } = formikActions;

    setStatus({ type: 'success', message: message || '' });
    setSubmitting(false);

    if (callback) {
      callback();
    }
  };

  handleTabChange = (nextTab) => {
    const { usherId } = this.props;

    const href = `/ushers/${nextTab}?usherId=${usherId}`;
    const as = `/ushers/${usherId}/${nextTab}`;

    Router.push(href, as);
  };

  render() {
    const { profile } = this.props;
    const { activeTab } = this.state;

    return (
      <Layout>
        <ProfileComponent
          activeTab={activeTab}
          profile={profile}
          onTabChange={this.handleTabChange}
          disableProfile={false}
        >
          <PasswordForm onSubmit={this.handlePasswordSubmit} noOldpassword />
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
  activeTab: 'profile',
};

const mapStateToProps = state => ({
  profile: ushersSelectors.getUsher(state),
});

const mapDispatchToProps = {
  fetchUsher: ushersActions.fetchItem,
  changePassword: ushersActions.changePassword,
};

export default compose(
  withAuth(),
  connect(mapStateToProps, mapDispatchToProps),
)(PasswordView);
