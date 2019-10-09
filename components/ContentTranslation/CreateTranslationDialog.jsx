import React from 'react';
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
import { getLanguageLabel } from 'utils/translations';

const CreateTranslationDialog = ({
  onCancel, onCancelText, onClose, onCloseText, onSuccess, onSuccessText, translations, ...props
}) => {
  const [selected, setSelected] = React.useState(null);

  const handleChange = (event) => {
    const { value } = event.target;

    setSelected(value);
  };

  const resetState = () => setSelected(null);

  const handleCancel = () => {
    onCancel();
    resetState();
  };

  const handleClose = () => {
    onClose();
    resetState();
  };

  const handleSuccess = () => {
    onSuccess(selected);
    resetState();
  };

  return (
    <Dialog {...props}>
      <DialogTitle>
        Dodaj tłumaczenie
      </DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <InputLabel shrink={!!selected} htmlFor="translation-select">Wybierz język</InputLabel>
          <Select
            value={selected || ''}
            onChange={handleChange}
            inputProps={{
              id: 'translation-select',
            }}
          >
            {
              translations.map(item => (
                <MenuItem key={item} value={item}>{getLanguageLabel(item, { locale: 'pl-PL' })}</MenuItem>
              ))
            }
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        {onClose && <Button onClick={handleClose} color="primary">{onCloseText}</Button>}
        {onCancel && <Button onClick={handleCancel} color="primary">{onCancelText}</Button>}
        {onSuccess && <Button onClick={handleSuccess} disabled={!selected} color="primary">{onSuccessText}</Button>}
      </DialogActions>
    </Dialog>
  );
};

CreateTranslationDialog.propTypes = {
  onCancel: PropTypes.func,
  onCancelText: PropTypes.string,
  onClose: PropTypes.func,
  onCloseText: PropTypes.string,
  onSuccess: PropTypes.func,
  onSuccessText: PropTypes.string,
  translations: PropTypes.arrayOf(PropTypes.string).isRequired,
};

CreateTranslationDialog.defaultProps = {
  onCancel: null,
  onCancelText: 'Anuluj',
  onClose: null,
  onCloseText: 'Zamknij',
  onSuccess: null,
  onSuccessText: 'OK',
};

export default CreateTranslationDialog;
