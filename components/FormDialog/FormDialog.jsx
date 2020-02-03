import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography/Typography';


const FormDialog = ({
  children, error, errorData, onCancel, onSubmit, title, readOnly, ...rest
}) => {
  const buttonClose = readOnly ? 'Zamknij' : 'Anuluj';
  const { message: errorMessage } = errorData || {};

  return (
    <Dialog onClose={onCancel} aria-labelledby="form-dialog-title" {...rest}>
      <DialogTitle id="form-dialog-title">{title}</DialogTitle>
      <DialogContent>
        {children}
      </DialogContent>
      <DialogActions>
        {error
          && (
            <Typography style={{ color: 'red' }}>
              {errorMessage || 'Wystąpił błąd podczas zapisywania.'}
            </Typography>
          )
        }
        <Button onClick={onCancel} color="primary">{buttonClose}</Button>
        {!readOnly
          && <Button onClick={onSubmit} color="primary">Zapisz</Button>
        }
      </DialogActions>
    </Dialog>
  );
};

FormDialog.propTypes = {
  children: PropTypes.element,
  error: PropTypes.bool,
  errorData: PropTypes.shape({}),
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  title: PropTypes.string,
  readOnly: PropTypes.bool,
};

FormDialog.defaultProps = {
  children: null,
  error: false,
  errorData: null,
  onCancel: null,
  title: null,
  readOnly: false,
};

export default FormDialog;
