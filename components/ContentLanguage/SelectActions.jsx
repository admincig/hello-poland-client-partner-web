import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const SelectActions = ({ actions, language }) => {
  const [anchorEl, handleSelectToggle] = useState(null);
  const handleAction = (action) => {
    handleSelectToggle(null);
    action(language);
  };
  return (
    <FormControl>
      <Button
        style={{ width: 160 }}
        onClick={e => handleSelectToggle(e.currentTarget)}
        aria-owns={anchorEl ? 'simple-menu' : undefined}
        aria-haspopup="true"
        variant="contained"
      >
        Zarządzaj
        <ArrowDropDown />
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
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
    </FormControl>
  );
};

SelectActions.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  language: PropTypes.string.isRequired,
};

export default SelectActions;
