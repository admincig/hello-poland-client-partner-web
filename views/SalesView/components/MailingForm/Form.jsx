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
import Button from '@material-ui/core/Button/Button';
import Typography from '@material-ui/core/Typography/Typography';

const commonProps = {
  fullWidth: true,
};

class MailingForm extends Component {
  constructor(props) {
    super(props);


    this.validationSchema = yupObject().shape({
      orderId: yupString().required(),
    });

    this.initialValues = {
      orderId: '',
    };
  }

  handleSubmit = (values, actions) => {
    const { onSubmit } = this.props;

    if (onSubmit) {
      onSubmit(values, actions);

      return;
    }

    const { orderId } = values;
    const { sendTicketEmail } = this.props;
    const payload = {
      orderId,
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
    const { onSubmitSuccess, clearError } = this.props;

    if (onSubmitSuccess) {
      onSubmitSuccess(actions);

      return;
    }

    const { resetForm, setSubmitting } = actions;
    clearError();
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
          <Grid container spacing={16} wrap="nowrap" alignItems="center">
            <Grid item>
              <Field name="orderId" label="Numer zamówienia" component={TextField} required helperText="Wpisz pierwsze 8 znaków nr transakcji HP" {...commonProps} />
            </Grid>
            <Grid item>
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
  onSubmit: PropTypes.func,
  onSubmitFailure: PropTypes.func,
  onSubmitSuccess: PropTypes.func,
  sendTicketEmail: PropTypes.func.isRequired,
};

MailingForm.defaultProps = {
  error: null,
  hideErrors: false,
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
