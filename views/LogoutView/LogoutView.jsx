import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import Router from 'next/router';
import { selectors as configSelectors } from 'redux/config';
import {
  actions as profileActions,
  selectors as profileSelectors,
} from '@hello-poland/commons/redux/profile';

class LogoutView extends Component {
  componentDidMount() {
    this.handleLogout();
  }

  handleLogout = () => {
    const {
      assetPrefix, credentials, logout, isAuthenticated,
    } = this.props;

    if (isAuthenticated) {
      const { accessToken, refreshToken } = credentials;
      const data = {
        accessToken,
        refreshToken,
      };

      logout(data);
    }

    const { query: { redirect } } = Router;
    let path = '';

    if (redirect) {
      path = redirect;
    }

    if (path.startsWith('/')) {
      path = path.substring(1, path.length);
    }

    Router.push(`${assetPrefix}/${path}`);
  };

  render() {
    return <div />;
  }
}

LogoutView.propTypes = {
  assetPrefix: PropTypes.string.isRequired,
  credentials: PropTypes.shape({
    accessToken: PropTypes.string,
    refreshToken: PropTypes.string,
  }),
  isAuthenticated: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
};

LogoutView.defaultProps = {
  credentials: {},
};

const mapStateToProps = state => ({
  credentials: profileSelectors.getCredentials(state),
  assetPrefix: configSelectors.getAppConfig(state).public.assetPrefix || '',
  isAuthenticated: profileSelectors.isAuthenticated(state),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    logout: profileActions.logout,
  }, dispatch);

export default compose(connect(mapStateToProps, mapDispatchToProps))(LogoutView);
