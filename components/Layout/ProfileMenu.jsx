import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Link from 'next/link';
import Router from 'next/router';

const styles = () => ({
  profileIcon: {
    fontSize: 36,
  },
});

class ProfileMenu extends Component {
  state = {
    menuAnchorEl: null,
  };

  handleLogout = () => {
    const { logoutURL, onLogout } = this.props;
    const { menuAnchorEl } = this.state;

    if (menuAnchorEl) {
      this.handleMenuClose();
    }

    onLogout({
      onSuccess: () => {
        Router.push(logoutURL);
      },
    });
  };

  handleMenuOpen = (event) => {
    this.setState({ menuAnchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ menuAnchorEl: null });
  };

  render() {
    const { menuAnchorEl } = this.state;
    const {
      classes, isAuthenticated, loginURL, menuItems, profile,
    } = this.props;

    const { email, name, picture } = profile || {};
    const isMenuOpen = !!menuAnchorEl;

    if (!isAuthenticated) {
      return (
        <Link href={loginURL} passHref prefetch>
          <Button color="inherit" className={classes.loginButton}>Zaloguj</Button>
        </Link>
      );
    }

    return (
      <Fragment>
        <IconButton
          aria-owns={isMenuOpen ? 'menu-appbar' : null}
          aria-haspopup="true"
          color="inherit"
          onClick={this.handleMenuOpen}
        >
          {picture
            ? <Avatar src={picture} />
            : <AccountCircle className={classes.profileIcon} />
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
          {menuItems && menuItems.length && menuItems.map(({ disabled, label, url }) => (
            <li key={label}>
              <Link href={url} passHref>
                <MenuItem component="a" disabled={disabled}>
                  {label}
                </MenuItem>
              </Link>
            </li>
          ))}
          <MenuItem onClick={this.handleLogout}>Wyloguj</MenuItem>
        </Menu>
      </Fragment>
    );
  }
}

ProfileMenu.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  loginURL: PropTypes.string,
  logoutURL: PropTypes.string,
  menuItems: PropTypes.arrayOf(
    PropTypes.shape({
      disabled: PropTypes.bool,
      label: PropTypes.string,
      url: PropTypes.string,
    }),
  ),
  onLogout: PropTypes.func.isRequired,
  profile: PropTypes.shape({
    email: PropTypes.string,
    name: PropTypes.string,
    picture: PropTypes.string,
  }).isRequired,
};

ProfileMenu.defaultProps = {
  loginURL: '/sign-in',
  logoutURL: '/sign-in',
  menuItems: [],
};


export default withStyles(styles)(ProfileMenu);
