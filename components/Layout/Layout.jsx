import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Router from 'next/router';
import { selectors as viewSelectors } from 'redux/view';
import { selectors as profileSelectors } from 'redux/profile';
import Header from './Header';

const Layout = ({
  children, documentTitle, isAuthenticated, profile,
}) => (
  <Fragment>
    <Header
      documentTitle={documentTitle}
      isAuthenticated={isAuthenticated}
      onLogout={() => {
        if (isAuthenticated) {
          Router.push('/logout');
        }
      }}
      profile={profile}
    />
    {children}
  </Fragment>
);

Layout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.object,
  ]).isRequired,
  documentTitle: PropTypes.string.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  profile: PropTypes.shape({}),
};

Layout.defaultProps = {
  profile: null,
};

const mapStateToProps = state => ({
  documentTitle: viewSelectors.getDocumentTitle(state),
  isAuthenticated: profileSelectors.isAuthenticated(state),
  profile: profileSelectors.getProfile(state),
});

export default connect(mapStateToProps)(Layout);
