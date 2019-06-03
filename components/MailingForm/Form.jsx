import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import yupObject from 'yup/lib/object';
import yupString from 'yup/lib/string';
import {
  actions as bookingsActions,
  selectors as bookingsSelectors,
} from '@hello-poland/commons/redux/bookings';
import { Button } from '@material-ui/core';
import Typography from '@material-ui/core/Typography/Typography';

class MailingForm extends Component {
  constructor(props) {
    super(props);

    this.validationSchema = yupObject().shape({
      p24Statement: yupString()
        .length(15)
        .required(),
    });

    this.initialValues = {
      p24Statement: '',
    };
  }

  handleSubmit = (values, actions) => {
    const { onSubmit } = this.props;

    if (onSubmit) {
      onSubmit(values, actions);

      return;
    }
    const { p24Statement } = values;
    const { sendTicketEmail } = this.props;
    const payload = {
      p24Statement,
      onFailure: this.handleSubmitFailure(actions),
      onSuccess: this.handleSubmitSuccess(actions),
    };

    sendTicketEmail(payload);
  };

  handleSubmitFailure = actions => () => {
    const { onSubmitFailure } = this.props;

    if (onSubmitFailure) {
      onSubmitFailure(actions);
    }

    const { setSubmitting } = actions;
    setSubmitting(false);
  };

  handleSubmitSuccess = actions => () => {
    const { onSubmitSuccess, onClearError, clearError } = this.props;

    if (onSubmitSuccess) {
      onSubmitSuccess(actions);
      if (onClearError) {
        onClearError();
      } else {
        clearError();
      }
      return;
    }

    const { resetForm, setSubmitting } = actions;

    if (onClearError) {
      onClearError();
    } else {
      clearError();
    }

    setSubmitting(false);
    resetForm();
  };

  render() {
    const { error, hideErrors } = this.props;
    const { data } = error || {};
    const { message } = data || {};
    return (
      <Formik
        validationSchema={this.validationSchema}
        initialValues={this.initialValues}
        onSubmit={this.handleSubmit}
      >
        <Form autoComplete="off" noValidate>
          <Grid container wrap="nowrap" alignItems="center" spacing={16}>
            <Grid item xs={8}>
              <Field name="p24Statement" label="Tytuł przelewu" component={TextField} required helperText="Wpisz tytuł przelewu od P24 w formacie: p24-xxx-xxx-xxx" />
            </Grid>
            <Grid item xs={2}>
              <Button type="submit" color="secondary">Wyślij</Button>
            </Grid>
          </Grid>
          {!hideErrors
            && (
              <Typography color="error">
                {message}
              </Typography>
            )
          }
        </Form>
      </Formik>
    );
  }
}

MailingForm.propTypes = {
  clearError: PropTypes.func.isRequired,
  error: PropTypes.shape({}),
  hideErrors: PropTypes.bool,
  onClearError: PropTypes.func,
  onSubmit: PropTypes.func,
  onSubmitFailure: PropTypes.func,
  onSubmitSuccess: PropTypes.func,
  sendTicketEmail: PropTypes.func.isRequired,
};

MailingForm.defaultProps = {
  error: null,
  hideErrors: false,
  onClearError: null,
  onSubmit: null,
  onSubmitFailure: null,
  onSubmitSuccess: null,
};

const mapStateToProps = state => ({
  error: bookingsSelectors.getError(state),
});
const mapDispatchToProps = {
  clearError: bookingsActions.clearError,
  sendTicketEmail: bookingsActions.sendTicketsEmail,
};

export default connect(mapStateToProps, mapDispatchToProps)(MailingForm);
