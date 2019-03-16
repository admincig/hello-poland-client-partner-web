import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import FormControl from '@material-ui/core/FormControl';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const AddLanguage = ({ list, handlePick }) => {
  const [anchorEl, handleDropdownOpen] = useState(null);
  console.log(handlePick)
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
              onClick={() => {
                handleDropdownOpen(null);
                handlePick(value);
              }}
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
