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
} from '../../../redux/ushers';


import UsherForm from './UsherForm';

class UsherFormDialog extends Component {
    constructor(props) {
        super(props)

        this.intervalRef = null;

        this.formikRef = React.createRef();

        this.state = {
            usherData: {},
            isFetching: false,
            isSubmitting: false,
            submittingError: false,
            fetchingError: false,
        }
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
      const { clearItem, onClose } = this.props;
  
      this.setState({
        fetchingError: false,
        isFetching: false,
        isSubmitting: false,
        submittingError: false,
      });

      clearItem();

      if (onClose) {
        onClose();
      }
    }

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
  
      this.setState({ isSubmitting: false, submittingError: false });
      setSubmitting(false);
    };
  
    handleSubmitSuccess = (sightId, actions) => {
      const { fetchSightsList, fetchSightEventsList, itemId } = this.props;
      const { language } = this.state;
      const { setSubmitting } = actions;
  
      setSubmitting(false);
  
      fetchSightsList();
      fetchSightEventsList();
  
      if (itemId) {
        this.handleFetchItem(itemId, language);
      } else {
        this.handleCancel();
      }
    };

    handleDiscardClick = () => this.handleCancel();

    handleCancel = () => {
      const { clearItem, onClose } = this.props;
  
      this.setState({
        fetchingError: false,
        isFetching: false,
        isSubmitting: false,
        submittingError: false,
      });
  
      clearItem();
  
      if (onClose) {
        onClose();
      }
    };
    
    render() {
        const { isFetching, isSubmitting, submittingError, fetchingError} = this.state;
        const { clearItem, ...rest } = this.props;

        return (
            <Fragment>
                <Dialog {...rest}>
                    <DialogTitle id="form-dialog-title">
                    Dodaj biletera
                { isFetching || isSubmitting ? <CircularProgress size={18} style={{ marginLeft: 20 }} /> : null }
                    </DialogTitle>
                    <DialogContent>
                        <UsherForm FormikProps={{ ref: this.formikRef }}
                                   onSubmitFailure={this.handleSubmitFailure}
                                   onSubmitSuccess={this.handleSubmitSuccess}/>
                    </DialogContent>
                    <DialogActions>
                        {submittingError
                          && (
                            <Typography style={{ color: 'red' }}>
                              Wystąpił błąd podczas zapisywania.
                            </Typography>
                          )
                        }
                        {fetchingError
                          && (
                            <Typography style={{ color: 'red' }}>
                              Wystąpił błąd podczas pobierania danych.
                            </Typography>
                          )
                        }
                        <Button disabled={isSubmitting} onClick={this.handleDiscardClick} color="primary">Odrzuć</Button>
                        <Button disabled={isSubmitting} onClick={this.handleSubmit} color="primary">Zapisz</Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        )
    }
}

UsherFormDialog.propTypes = {
  clearItem: PropTypes.func.isRequired,
};
  
UsherFormDialog.defaultProps = {
};

const mapStateToProps = state => ({
});

const mapDispatchToProps = {
  clearItem: ushersActions.clearItem,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
)(UsherFormDialog);