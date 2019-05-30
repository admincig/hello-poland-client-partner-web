import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button/Button';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { actions as bookingsActions } from '@hello-poland/commons/redux/bookings';
import MailingForm from './Form';

class MailingFormDialog extends Component {
  handleCancel = () => {
    const { onClose, clearError } = this.props;

    clearError();
    if (onClose) {
      onClose();
    }
  };

  handleSubmitFailure = (actions) => {
    const { setSubmitting } = actions;
    setSubmitting(false);
  };

  handleSubmitSuccess = (actions) => {
    const { setSubmitting } = actions;
    setSubmitting(false);
    this.handleCancel();
  };

  handleDiscardClick = () => this.handleCancel();

  render() {
    const {
      clearError, error, ...rest
    } = this.props;

    return (
      <Fragment>
        <Dialog {...rest}>
          <DialogTitle id="form-dialog-title">
                  Wyślij email z biletami
          </DialogTitle>
          <DialogContent>
            <MailingForm
              onSubmitFailure={this.handleSubmitFailure}
              onSubmitSuccess={this.handleSubmitSuccess}
              showErrors
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
  onClose: null,
  open: false,
  error: null,
};

const mapDispatchToProps = {
  clearError: bookingsActions.clearError,
};

export default compose(
  connect(null, mapDispatchToProps),
)(MailingFormDialog);
