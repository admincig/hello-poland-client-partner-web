import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withRouter } from 'next/router';
import withAuth from 'services/auth/withAuth';
import Grid from '@material-ui/core/Grid';
import NoSsr from '@material-ui/core/NoSsr';
import config from 'config';
import Content from './Content';
import Header from './Header';
import MenuDrawer from './MenuDrawer';
import menuItems from './menuItems';

const title = config.public.name;

function Layout({
  children, ContentProps, HeaderProps, isAuthenticated, router,
}) {
  return (
    <React.Fragment>
      <Header documentTitle={title} {...HeaderProps} />
      <Grid container>
        <NoSsr>
          {isAuthenticated
          && (
            <MenuDrawer
              currentPath={router.pathname}
              menuItems={menuItems}
            />
          )
          }
        </NoSsr>
        <Content {...ContentProps}>
          {children}
        </Content>
      </Grid>
    </React.Fragment>
  );
}

Layout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.object,
  ]).isRequired,
  ContentProps: PropTypes.shape({}),
  HeaderProps: PropTypes.shape({}),
  isAuthenticated: PropTypes.bool.isRequired,
  router: PropTypes.shape({}).isRequired,
};

Layout.defaultProps = {
  ContentProps: {},
  HeaderProps: {},
};

export default compose(
  withAuth(),
  withRouter,
)(Layout);
