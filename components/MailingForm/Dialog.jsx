import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { actions as bookingsActions } from '@hello-poland/commons/redux/bookings';
import MailingForm from './Form';
import { connect } from 'react-redux';

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

  handleMailingFormExit = () => {
    const { clearError } = this.props;
    clearError();
  }

  render() {
    const { clearError, ...rest } = this.props;

    return (
      <Fragment>
        <Dialog onExited={this.handleMailingFormExit} {...rest}>
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
  clearError: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  error: PropTypes.shape({}),
};

MailingFormDialog.defaultProps = {
  clearError: bookingsActions.clearError,
  onClose: null,
  open: false,
  error: null,
};

const mapDispatchToProps = {
  clearError: bookingsActions.clearError,
};

export default connect(undefined, mapDispatchToProps)(MailingFormDialog);
