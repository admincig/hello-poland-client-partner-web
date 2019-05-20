import React, { Component, Fragment } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button/Button';
import Grid from '@material-ui/core/Grid';
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

        this.formikRef = React.createRef();

        this.state = {
            usherData: {},
            isFetching: false,
            isSubmitting: false,
            submittingError: false,
            fetchingError: false,
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

    handleFormReload = (callback, options) => {
      if (this.isFormDirty()) {
        this.setState({
          alertDialog: {
            content: 'W formularzu są niezapisane zmiany. Wykonać operację mimo to?',
            onSuccess: () => {
              if (callback) {
                callback(options);
              }
  
              this.handleAlertDialogCancel();
            },
            open: true,
            title: 'Uwaga',
          },
        });
      } else if (callback) {
        callback(options);
      }
    };

    isFormDirty = () => {
      const { current } = this.formikRef;
  
      if (current && current.getFormikComputedProps) {
        const { dirty } = current.getFormikComputedProps();
  
        return dirty;
      }
  
      return false;
    };
    
    render() {
        const { isFetching, isSubmitting, submittingError, fetchingError} = this.state;
        const { title, ...rest } = this.props;

        return (
            <Fragment>
                <Dialog {...rest}>
                    <DialogTitle id="form-dialog-title">
                    {title}
                { isFetching || isSubmitting ? <CircularProgress size={18} style={{ marginLeft: 20 }} /> : null }
                    </DialogTitle>
                    <DialogContent>
                        <UsherForm FormikProps={{ ref: this.formikRef }} buttons={false}/>
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
                        <Button disabled={isSubmitting} onClick={this.handleCancelClick} color="primary">Zamknij</Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        )
    }
}

UsherFormDialog.propTypes = {
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