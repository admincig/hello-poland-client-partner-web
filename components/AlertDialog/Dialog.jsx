import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const AlertDialog = ({
  content, onClose, onCloseText, onSubmit, onSubmitText, title, ...props
}) => (
  <Dialog
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
    {...props}
    onClose={onClose}
  >
    <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description">{content}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">
        {onCloseText}
      </Button>
      <Button onClick={onSubmit} color="primary" autoFocus>
        {onSubmitText}
      </Button>
    </DialogActions>
  </Dialog>
);

AlertDialog.propTypes = {
  content: PropTypes.string,
  onClose: PropTypes.func,
  onCloseText: PropTypes.string,
  onSubmit: PropTypes.func,
  onSubmitText: PropTypes.string,
  title: PropTypes.string,
};

AlertDialog.defaultProps = {
  content: null,
  onClose: null,
  onCloseText: 'Anuluj',
  onSubmit: null,
  onSubmitText: 'OK',
  title: '',
};

export default AlertDialog;
