import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Router from 'next/router';
import { selectors as profileSelectors } from '@hello-poland/commons/lib/redux/profile';
import { withLocalStorageProfile } from '../redux/profileSubscriber';

export default ({ redirectURL }) => (View) => {
  class ViewWithAuth extends React.Component {
    static contextTypes = {
      store: PropTypes.shape({}),
    };

    componentDidMount() {
      this.rehydrateProfile();
      this.handleInitAuthRedirection();
    }

    componentDidUpdate() {
      this.handleAuthRedirection();
    }

    rehydrateProfile = () => {
      const { store } = this.context;

      withLocalStorageProfile(store);
    };

    handleAuthRedirection = () => {
      const { isAuthenticated } = this.props;

      this.redirectView(isAuthenticated);
    };

    handleInitAuthRedirection = () => {
      const { store: { getState } } = this.context;
      const state = getState();
      const isAuthenticated = profileSelectors.isAuthenticated(state);

      this.redirectView(isAuthenticated);
    };

    redirectView = (isAuthenticated) => {
      if (!isAuthenticated) {
        let path = '/logout';

        if (redirectURL) {
          path = redirectURL;
        }

        Router.push(path);
      }
    };

    render() {
      const { isAuthenticated, ...props } = this.props;

      if (!isAuthenticated) {
        return null;
      }

      return <View {...props} />;
    }
  }

  ViewWithAuth.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
  };

  const mapStateToProps = state => ({
    isAuthenticated: profileSelectors.isAuthenticated(state),
  });

  return compose(connect(mapStateToProps))(ViewWithAuth);
};
