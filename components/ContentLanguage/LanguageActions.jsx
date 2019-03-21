import React, { useState } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';

const styles = () => ({
  button: {
    boxShadow: 'none',
  },
});

const LanguageActions = ({ actions, classes, language }) => {
  const [anchorEl, handleSelectToggle] = useState(null);
  const handleAction = (action) => {
    handleSelectToggle(null);
    action(language);
  };
  return (
    <Grid>
      <Button
        className={classes.button}
        onClick={e => handleSelectToggle(e.currentTarget)}
        aria-owns={anchorEl ? 'actions-menu' : undefined}
        aria-haspopup="true"
        variant="contained"
      >
        Zarządzaj
        <ArrowDropDown />
      </Button>
      <Menu
        id="actions-menu"
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => handleSelectToggle(null)}
      >
        {
          actions.map(({ label, action }) => (
            <MenuItem
              key={label}
              action={action}
              component="div"
              onClick={() => handleAction(action)}
            >
              {label}
            </MenuItem>
          ))
        }
      </Menu>
    </Grid>
  );
};

LanguageActions.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  classes: PropTypes.shape({}).isRequired,
  language: PropTypes.string.isRequired,
};

export default withStyles(styles)(LanguageActions);
