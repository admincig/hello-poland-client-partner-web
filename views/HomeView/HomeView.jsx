import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import Router from 'next/router';
import { selectors as configSelectors } from 'redux/config';
import {
  actions as profileActions,
  selectors as profileSelectors,
} from 'redux/profile';
import Layout from 'components/Layout';
import SightsList from 'views/HomeView/components/SightsList';

class HomeView extends Component {
  componentDidMount() {
    this.handleAuthRedirection();
  }

  componentDidUpdate() {
    this.handleAuthRedirection();
  }

  handleAuthRedirection = () => {
    const { assetPrefix, isAuthenticated } = this.props;

    if (!isAuthenticated) {
      Router.push(`${assetPrefix}/login`);
    }
  };

  handleFetch = () => {
    const { fetchProfile } = this.props;

    fetchProfile();
  };

  handleLogout = () => {
    const { logout } = this.props;

    logout();
  };

  render() {
    return (
      <Layout>
        <SightsList />
      </Layout>
    );
  }
}

HomeView.propTypes = {
  assetPrefix: PropTypes.string.isRequired,
  fetchProfile: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  assetPrefix: configSelectors.getAppConfig(state).public.assetPrefix || '',
  isAuthenticated: profileSelectors.isAuthenticated(state),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    fetchProfile: profileActions.fetchProfile,
    logout: profileActions.logout,
  }, dispatch);

export default compose(connect(mapStateToProps, mapDispatchToProps))(HomeView);
