import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography/Typography';


const FormDialog = ({
  children, error, onClose, onSubmit, title, ...rest
}) => (
  <Dialog onClose={onClose} aria-labelledby="form-dialog-title" {...rest}>
    <DialogTitle id="form-dialog-title">{title}</DialogTitle>
    <DialogContent>
      {children}
    </DialogContent>
    <DialogActions>
      {error &&
        <Typography style={{ color: 'red' }}>
          Wystąpił błąd podczas zapisywania.
        </Typography>
      }
      <Button onClick={onClose} color="primary">Anuluj</Button>
      <Button onClick={onSubmit} color="primary">Zapisz</Button>
    </DialogActions>
  </Dialog>
);

FormDialog.propTypes = {
  children: PropTypes.element,
  error: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  title: PropTypes.string,
};

FormDialog.defaultProps = {
  children: null,
  error: false,
  onClose: null,
  title: null,
};

export default FormDialog;
