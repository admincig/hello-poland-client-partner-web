import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { selectors as viewSelectors } from 'redux/view';
import { selectors as profileSelectors, actions as profileActions } from '@hello-poland/commons/redux/profile';
import withStyles from '@material-ui/core/styles/withStyles';
import AppBar from '@material-ui/core/AppBar';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AccountCircle from '@material-ui/icons/AccountCircle';
import HomeIcon from '@material-ui/icons/Home';
import NoSsr from '@material-ui/core/NoSsr';
import Avatar from '@material-ui/core/Avatar';
import CircularProgress from '@material-ui/core/CircularProgress';
import Link from 'next/link';
import Router from 'next/router';
import classNames from 'classnames';

const styles = () => ({
  root: {
    '@media print': {
      position: 'absolute',
    },
  },
  languageSelect: {
    flex: '0 0 auto',
  },
  loginButton: {
    marginLeft: 'auto',
    flex: '0 0 auto',
  },
});

class Header extends Component {
  state = {
    menuAnchorEl: null,
  };

  handleLanguageChange = ({ target: { value } }) => {
    document.cookie = `language=${value};path=/`;
    window.location.reload();
  };

  handleLogout = () => {
    const { logout } = this.props;
    const { menuAnchorEl } = this.state;

    if (menuAnchorEl) {
      this.handleMenuClose();
    }

    logout({ onSuccess: () => Router.push('/') });
  };

  handleMenuOpen = (event) => {
    this.setState({ menuAnchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ menuAnchorEl: null });
  };

  render() {
    const {
      classes, className, documentTitle, isAuthenticated, logout,
      loginButtonUrl, onMenuButtonClick, profile, ...props
    } = this.props;
    const { menuAnchorEl } = this.state;

    const { email, name, picture } = profile || {};
    const isMenuOpen = Boolean(menuAnchorEl);

    return (
      <AppBar className={classNames(classes.root, className)} {...props}>
        <Toolbar>
          <Grid container alignItems="center">
            <Link href="/" passHref prefetch>
              <IconButton aria-label="Home" component="a" color="inherit">
                <HomeIcon />
              </IconButton>
            </Link>
            <Typography variant="title" color="inherit">
              {documentTitle}
            </Typography>
          </Grid>
          <NoSsr
            fallback={(
              <div>
                <CircularProgress />
              </div>
            )}
          >
            {isAuthenticated
              ? (
                <React.Fragment>
                  <IconButton
                    aria-owns={isMenuOpen ? 'menu-appbar' : null}
                    aria-haspopup="true"
                    color="inherit"
                    onClick={this.handleMenuOpen}
                  >
                    {picture
                      ? <Avatar src={picture} />
                      : <AccountCircle style={{ fontSize: 36 }} />
                    }
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={menuAnchorEl}
                    getContentAnchorEl={null}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={isMenuOpen}
                    onClose={this.handleMenuClose}
                  >
                    <MenuItem disabled>{name || email}</MenuItem>
                    <MenuItem onClick={this.handleLogout}>Wyloguj</MenuItem>
                  </Menu>
                </React.Fragment>
              )
              : <div />
            }
          </NoSsr>
        </Toolbar>
      </AppBar>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  className: PropTypes.string,
  documentTitle: PropTypes.string.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  loginButtonUrl: PropTypes.string,
  logout: PropTypes.func.isRequired,
  onMenuButtonClick: PropTypes.func.isRequired,
  profile: PropTypes.shape({
    email: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
};

Header.defaultProps = {
  className: '',
  loginButtonUrl: '/login',
};


const mapStateToProps = state => ({
  documentTitle: viewSelectors.getDocumentTitle(state),
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
