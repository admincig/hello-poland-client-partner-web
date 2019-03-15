import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import FormControl from '@material-ui/core/FormControl';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const AddLanguage = ({ list }) => {
  const [anchorEl, handleDropdownOpen] = useState(null);
  return (
    <FormControl>
      <Button
        variant="contained"
        color="primary"
        aria-owns={anchorEl ? 'simple-menu' : undefined}
        aria-haspopup="true"
        onClick={e => handleDropdownOpen(e.currentTarget)}
      >
        Dodaj język
        <ArrowDropDown />
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownOpen(null)}
      >
        {
          list.map(value => (
            <MenuItem
              component="div"
              value={value}
              onClick={() => {}}
            >
              {value}
            </MenuItem>
          ))
        }
      </Menu>
    </FormControl>
  );
};

export default AddLanguage;
