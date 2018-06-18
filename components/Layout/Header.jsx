import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import HomeIcon from '@material-ui/icons/Home';
import Link from 'next/link';

const styles = theme => ({
  container: {
    marginBottom: theme.spacing.unit,
  },
});

const Header = ({ classes, documentTitle }) => (
  <AppBar position="static" className={classes.container}>
    <Toolbar>
      <Link href="/" passHref>
        <IconButton color="inherit" aria-label="Home" component="a">
          <HomeIcon />
        </IconButton>
      </Link>
      <Typography variant="title" color="inherit" style={{ flex: 1 }}>
        {documentTitle}
      </Typography>
    </Toolbar>
  </AppBar>
);

Header.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  documentTitle: PropTypes.string.isRequired,
};

export default withStyles(styles)(Header);
