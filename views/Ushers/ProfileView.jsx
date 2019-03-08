import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Link from 'next/link';
import Router from 'next/router';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {
  actions as ushersActions,
  selectors as ushersSelectors,
} from 'redux/ushers';
import Layout from 'components/Layout';
import ProfileComponent from 'components/ProfileComponent/ProfileComponent';
import ProfileForm from 'components/ProfileComponent/ProfileForm';
import withAuth from 'services/auth/withAuth';

class ProfileView extends Component {
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

    Router.prefetch('/ushers/password');
  }

  fetchProfile = (userId) => {
    const { fetchUsher } = this.props;

    fetchUsher({ id: userId });
  };

  handleProfileSubmit = (values, actions) => {
    const { email, password, ...data } = values;
    const { setStatus } = actions;
    const { changeProfile, usherId } = this.props;

    setStatus(null);

    changeProfile({
      id: usherId,
      data,
      onFailure: this.handleSubmitFailure({
        formikActions: actions,
        message: 'Wystąpił błąd podczas aktualizacji profilu.',
      }),
      onSuccess: this.handleSubmitSuccess({
        callback: () => this.fetchProfile(usherId),
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
    const { profile, usherId } = this.props;
    const { activeTab } = this.state;

    let breadcrumbName = '';

    if (Object.keys(profile).length) {
      breadcrumbName = profile.name || profile.email;
    }

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
          {`Bileterzy / ${breadcrumbName}`}
        </Typography>
        <ProfileComponent
          activeTab={activeTab}
          profile={profile}
          onTabChange={this.handleTabChange}
          disableProfile={false}
        >
          <ProfileForm profile={profile} key={profile.id} onSubmit={this.handleProfileSubmit} />
        </ProfileComponent>
      </Layout>
    );
  }
}

ProfileView.propTypes = {
  activeTab: PropTypes.string,
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
});

const mapDispatchToProps = {
  fetchUsher: ushersActions.fetchItem,
  changeProfile: ushersActions.changeProfile,
};

export default compose(
  withAuth(),
  connect(mapStateToProps, mapDispatchToProps),
)(ProfileView);
