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

class LogoutView extends Component {
  componentDidMount() {
    this.handleLogout();
  }

  handleLogout = () => {
    const { assetPrefix, credentials, logout } = this.props;
    const { accessToken, refreshToken } = credentials;
    const data = {
      accessToken,
      refreshToken,
    };

    logout({ data });

    Router.push(`${assetPrefix}/`);
  };


  render() {
    return null;
  }
}

LogoutView.propTypes = {
  assetPrefix: PropTypes.string.isRequired,
  credentials: PropTypes.shape({
    accessToken: PropTypes.string.isRequired,
    refreshToken: PropTypes.string.isRequired,
  }),
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
