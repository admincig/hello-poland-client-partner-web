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
        .min(15)
        .max(15)
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
    const { onSubmitSuccess } = this.props;

    if (onSubmitSuccess) {
      onSubmitSuccess(actions);

      return;
    }

    const { resetForm, setSubmitting } = actions;

    setSubmitting(false);
    resetForm();
  };

  render() {
    const { error, showErrors } = this.props;
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
          {showErrors
            && (
              <Typography style={{ color: 'red' }}>
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
  error: PropTypes.shape({}),
  sendTicketEmail: PropTypes.func.isRequired,
  showErrors: PropTypes.bool,
  onSubmitFailure: PropTypes.func,
  onSubmit: PropTypes.func,
  onSubmitSuccess: PropTypes.func,
};

MailingForm.defaultProps = {
  error: null,
  onSubmitFailure: null,
  onSubmit: null,
  onSubmitSuccess: null,
  showErrors: false,
};

const mapStateToProps = state => ({
  error: bookingsSelectors.getError(state),
});
const mapDispatchToProps = {
  sendTicketEmail: bookingsActions.sendTicketsEmail,
};

export default connect(mapStateToProps, mapDispatchToProps)(MailingForm);
