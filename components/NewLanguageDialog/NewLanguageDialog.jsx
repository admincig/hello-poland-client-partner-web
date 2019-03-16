import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';


const NewLanguageDialog = ({
  handleClose, handleSubmit, list, ...props
}) => {
  const [selected, handleSelect] = useState(null);

  const handleCloseClick = () => {
    handleSelect(null);
    handleClose();
  };

  const handleSubmitClick = (value) => {
    handleSelect(null);
    handleSubmit(value);
  };

  return (
    <Dialog {...props}>
      <DialogTitle>
        Dodawanie wersji językowej
      </DialogTitle>
      <DialogContent>
        <FormControl style={{ width: '100%' }}>
          <InputLabel shrink={Boolean(selected)} htmlFor="new-language-select">Wybierz język</InputLabel>
          <Select
            value={selected || ''}
            onChange={e => handleSelect(e.target.value)}
            inputProps={{
              id: 'new-language-select',
            }}
          >
            {
              list.map(item => (
                <MenuItem key={item} value={item}>{item}</MenuItem>
              ))
            }
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseClick} color="primary">Anuluj</Button>
        <Button onClick={() => handleSubmitClick(selected)} disabled={!selected} color="primary">Utwórz</Button>
      </DialogActions>
    </Dialog>
  );
};

NewLanguageDialog.propTypes = {
  handleClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  list: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default NewLanguageDialog;
