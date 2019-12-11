import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { actions as profileActions, selectors as profileSelectors } from 'redux/profile';
import withStyles from '@material-ui/core/styles/withStyles';
import AppBar from '@material-ui/core/AppBar';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import NoSsr from '@material-ui/core/NoSsr';
import ProfileMenu from './ProfileMenu';

const styles = theme => ({
  root: {
    zIndex: theme.zIndex.drawer + 1,
  },
  grow: {
    display: 'flex',
    flexGrow: 1,
  },
});

const menuItems = [
  { label: 'Profil', url: '/account' },
];

const Header = ({
  classes, documentTitle, isAuthenticated, logout, profile, ...props
}) => (
  <AppBar className={classes.root} {...props}>
    <Toolbar>
      <Grid container alignItems="center">
        <Typography variant="h6" color="inherit">{documentTitle}</Typography>
      </Grid>
      <Grid container alignItems="center" justify="flex-end">
        <NoSsr fallback={<CircularProgress color="secondary" />}>
          <ProfileMenu
            isAuthenticated={isAuthenticated}
            onLogout={args => logout(args)}
            menuItems={menuItems}
            profile={profile}
          />
        </NoSsr>
      </Grid>
    </Toolbar>
  </AppBar>
);

Header.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  documentTitle: PropTypes.string.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
  profile: PropTypes.shape({}).isRequired,
};

const mapStateToProps = state => ({
  isAuthenticated: profileSelectors.isAuthenticated(state),
  profile: profileSelectors.getProfile(state),
});

const mapDispatchToProps = {
  logout: profileActions.logout,
};

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),
)(Header);
