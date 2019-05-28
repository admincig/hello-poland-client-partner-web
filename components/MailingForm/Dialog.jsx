import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button/Button';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import {
  actions as bookingsActions,
  selectors as bookingsSelectors,
} from '@hello-poland/commons/redux/bookings';
import MailingForm from './Form';

class MailingFormDialog extends Component {
  constructor(props) {
    super(props);


    this.formikRef = React.createRef();

    this.state = {
      submittingError: false,
    };
  }

  handleCancelClick = () => {
    this.handleFormReload(this.handleCancel);
  };

  handleCancel = () => {
    const { onClose, clearError } = this.props;

    this.setState({
      submittingError: false,
    });

    clearError();
    if (onClose) {
      onClose();
    }
  };

  handleSubmitFailure = (actions) => {
    const { setSubmitting } = actions;
    this.setState({ submittingError: true });
    setSubmitting(false);
  };

  handleSubmitSuccess = (actions) => {
    const { setSubmitting } = actions;
    setSubmitting(false);
    this.handleCancel();
  };

  handleDiscardClick = () => this.handleCancel();

  render() {
    const { submittingError } = this.state;
    const {
      clearError, error, ...rest
    } = this.props;
    const { data } = error || {};
    const { message } = data || {};

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
            />
          </DialogContent>
          <DialogActions>
            {submittingError
                        && (
                          <Typography style={{ color: 'red' }}>
                            {message}
                          </Typography>
                        )
                      }
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

const mapStateToProps = state => ({
  error: bookingsSelectors.getError(state),
});

const mapDispatchToProps = {
  clearError: bookingsActions.clearError,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(MailingFormDialog);
