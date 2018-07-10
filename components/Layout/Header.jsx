import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
import Link from 'next/link';

const styles = theme => ({
  container: {
    marginBottom: theme.spacing.unit,
  },
});

class Header extends Component {
  state = {
    menuAnchorEl: null,
  };

  handleLogout = () => {
    const { onLogout } = this.props;
    const { menuAnchorEl } = this.state;

    if (menuAnchorEl) {
      this.handleMenuClose();
    }

    onLogout();
  };

  handleMenuOpen = (event) => {
    this.setState({ menuAnchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ menuAnchorEl: null });
  };

  render() {
    const {
      classes, documentTitle, isAuthenticated, profile,
    } = this.props;
    const { menuAnchorEl } = this.state;

    const { email, name } = profile || {};
    const isMenuOpen = Boolean(menuAnchorEl);

    return (
      <AppBar position="static" className={classes.container}>
        <Toolbar>
          <Grid container alignItems="center">
            <Link href="/" passHref>
              <IconButton color="inherit" aria-label="Home" component="a">
                <HomeIcon />
              </IconButton>
            </Link>
            <Typography variant="title" color="inherit">
              {documentTitle}
            </Typography>
          </Grid>
          {isAuthenticated &&
            <Grid container alignItems="center" justify="flex-end">
              <Typography variant="subheading" color="inherit">
                {name || email}
              </Typography>
              <IconButton
                aria-owns={isMenuOpen ? 'menu-appbar' : null}
                aria-haspopup="true"
                onClick={this.handleMenuOpen}
                color="inherit"
              >
                <AccountCircle style={{ fontSize: 36 }} />
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
                <MenuItem onClick={this.handleLogout}>Wyloguj</MenuItem>
              </Menu>
            </Grid>
          }
        </Toolbar>
      </AppBar>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  documentTitle: PropTypes.string.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  onLogout: PropTypes.func.isRequired,
  profile: PropTypes.shape({
    email: PropTypes.string.isRequired,
    name: PropTypes.string,
  }),
};

Header.defaultProps = {
  profile: null,
};

export default withStyles(styles)(Header);
