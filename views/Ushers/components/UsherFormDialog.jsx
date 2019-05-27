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
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  actions as ushersActions,
  selectors as ushersSelectors,
} from 'redux/ushers';

import UsherForm from './UsherForm';

class UsherFormDialog extends Component {
  constructor(props) {
    super(props);

    this.intervalRef = null;

    this.formikRef = React.createRef();

    this.state = {
      isFetching: false,
      isSubmitting: false,
      submittingError: false,
    };
  }

  componentWillUnmount() {
    if (this.intervalRef) {
      clearInterval(this.intervalRef);
    }
  }

  handleCancelClick = () => {
    this.handleFormReload(this.handleCancel);
  };

  handleCancel = () => {
    const { onClose, clearError } = this.props;

    this.setState({
      isFetching: false,
      isSubmitting: false,
      submittingError: false,
    });

    clearError();
    if (onClose) {
      onClose();
    }
  };

  handleSubmit = () => {
    const { current } = this.formikRef;
    if (current && current.submitForm) {
      this.setState({ isSubmitting: true, submittingError: false });
      current.submitForm();
      this.intervalRef = setInterval(this.handleSubmitChange, 200);
    }
  };

  // hacking missing validation callback in Formik
  handleSubmitChange = () => {
    const { current } = this.formikRef;

    if (current && current.getFormikBag) {
      const { getFormikBag } = current;
      const { isSubmitting } = getFormikBag();

      if (!isSubmitting) {
        this.setState({ isSubmitting });
        clearInterval(this.intervalRef);
      }
    }
  };

  handleSubmitFailure = (actions) => {
    const { setSubmitting } = actions;
    this.setState({ isSubmitting: false, submittingError: true });
    setSubmitting(false);
  };

  handleSubmitSuccess = (actions) => {
    const { fetchUshersList } = this.props;
    const { setSubmitting } = actions;
    setSubmitting(false);
    fetchUshersList();
    this.handleCancel();
  };

  handleDiscardClick = () => this.handleCancel();

  handleCancel = () => {
    const { clearError, onClose } = this.props;

    this.setState({
      isFetching: false,
      isSubmitting: false,
      submittingError: false,
    });

    clearError();

    if (onClose) {
      onClose();
    }
  };

  render() {
    const { isFetching, isSubmitting, submittingError } = this.state;
    const {
      clearError, fetchUshersList, error, ...rest
    } = this.props;
    const { data } = error || {};
    const { message } = data || {};

    return (
      <Fragment>
        <Dialog {...rest}>
          <DialogTitle id="form-dialog-title">
                  Dodaj biletera
            { isFetching || isSubmitting
              ? <CircularProgress size={18} style={{ marginLeft: 20 }} />
              : null }
          </DialogTitle>
          <DialogContent>
            <UsherForm
              FormikProps={{ ref: this.formikRef }}
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
            <Button disabled={isSubmitting} onClick={this.handleDiscardClick} color="primary">Odrzuć</Button>
            <Button disabled={isSubmitting} onClick={this.handleSubmit} color="primary">Zapisz</Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

UsherFormDialog.propTypes = {
  clearError: PropTypes.func.isRequired,
  error: PropTypes.shape({}),
  fetchUshersList: PropTypes.func.isRequired,
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

UsherFormDialog.defaultProps = {
  error: null,
  onClose: null,
  open: false,
};

const mapStateToProps = state => ({
  error: ushersSelectors.getError(state),
});

const mapDispatchToProps = {
  clearError: ushersActions.clearError,
  fetchUshersList: ushersActions.fetchList,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(UsherFormDialog);
