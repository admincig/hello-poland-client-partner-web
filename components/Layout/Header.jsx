import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import HomeIcon from '@material-ui/icons/Home';
import Link from 'next/link';

const Header = ({ documentTitle }) => (
  <AppBar position="static">
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
  documentTitle: PropTypes.string.isRequired,
};

export default Header;
