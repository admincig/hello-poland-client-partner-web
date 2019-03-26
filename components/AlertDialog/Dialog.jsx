import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const AlertDialog = ({
  content, onCancel, onCancelText, onDiscard, onDiscardText, onSuccess, onSuccessText, title,
  ...props
}) => (
  <Dialog
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
    {...props}
    onClose={(event) => {
      const { onClose } = props;

      if (onClose) {
        onClose(event);
      } else if (onDiscard) {
        onDiscard(event);
      } else if (onCancel) {
        onCancel(event);
      }
    }}
  >
    <DialogTitle id="alert-dialog-title">{title || ''}</DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description">{content}</DialogContentText>
    </DialogContent>
    <DialogActions>
      {onDiscard && <Button onClick={onDiscard} color="primary">{onDiscardText}</Button>}
      {onCancel && <Button onClick={onCancel} color="primary">{onCancelText}</Button>}
      {onSuccess && <Button onClick={onSuccess} color="primary" autoFocus>{onSuccessText}</Button>}
    </DialogActions>
  </Dialog>
);

AlertDialog.propTypes = {
  content: PropTypes.string,
  onCancel: PropTypes.func,
  onCancelText: PropTypes.string,
  onClose: PropTypes.func,
  onDiscard: PropTypes.func,
  onDiscardText: PropTypes.string,
  onSuccess: PropTypes.func,
  onSuccessText: PropTypes.string,
  title: PropTypes.string,
};

AlertDialog.defaultProps = {
  content: null,
  onCancel: null,
  onCancelText: 'Anuluj',
  onClose: null,
  onDiscard: null,
  onDiscardText: 'Odrzuć',
  onSuccess: null,
  onSuccessText: 'OK',
  title: '',
};

export default AlertDialog;
