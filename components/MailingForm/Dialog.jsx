import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import MailingForm from './Form';

class MailingFormDialog extends Component {
  handleCancel = () => {
    const { onClose } = this.props;

    if (onClose) {
      onClose();
    }
  };

  handleSubmitSuccess = (actions) => {
    const { setSubmitting } = actions;
    setSubmitting(false);
    this.handleCancel();
  };

  handleDiscardClick = () => this.handleCancel();

  render() {
    const { ...rest } = this.props;

    return (
      <Fragment>
        <Dialog {...rest}>
          <DialogTitle id="form-dialog-title">
            Wyślij email z biletami
          </DialogTitle>
          <DialogContent>
            <MailingForm
              onSubmitSuccess={this.handleSubmitSuccess}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleDiscardClick} color="primary">Zamknij</Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

MailingFormDialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  error: PropTypes.shape({}),
};

MailingFormDialog.defaultProps = {
  onClose: null,
  open: false,
  error: null,
};

export default MailingFormDialog;
