import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Router from 'next/router';
import { selectors as profileSelectors } from 'redux/profile';

export default ({ redirectURL } = { redirectURL: '/sign-in' }) => (View) => {
  class ViewWithAuth extends React.Component {
    componentDidMount() {
      const { isAuthenticated } = this.props;

      if (!isAuthenticated) {
        this.redirect();
      }
    }

    componentDidUpdate() {
      const { isAuthenticated } = this.props;

      if (!isAuthenticated) {
        this.redirect();
      }
    }

    redirect = () => {
      Router.push(redirectURL);
    };

    render() {
      return <View {...this.props} />;
    }
  }

  ViewWithAuth.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
  };

  const mapStateToProps = state => ({
    isAuthenticated: profileSelectors.isAuthenticated(state),
  });

  return connect(mapStateToProps)(ViewWithAuth);
};
