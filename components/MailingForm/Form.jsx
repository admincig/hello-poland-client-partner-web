import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import yupObject from 'yup/lib/object';
import yupString from 'yup/lib/string';
import GridItem from 'components/GridItem';
import { actions as bookingsActions } from '@hello-poland/commons/redux/bookings';

const commonProps = {
  fullWidth: true,
};

class MailingForm extends Component {
  constructor(props) {
    super(props);

    // TODO: nested validation seems not working
    // TODO: see https://github.com/jaredpalmer/formik/issues/986
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
    const { sendEmail } = this.props;
    const payload = {
      p24Statement,
      onFailure: this.handleSubmitFailure(actions),
      onSuccess: this.handleSubmitSuccess(actions),
    };

    sendEmail(payload);
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
    const { FormikProps } = this.props;
    return (
      <Formik
        {...FormikProps}
        validationSchema={this.validationSchema}
        initialValues={this.initialValues}
        onSubmit={this.handleSubmit}
      >
        <Form autoComplete="off" noValidate>
          <Grid container spacing={16}>
            <GridItem>
              <Field name="p24Statement" label="Numer przelewu" component={TextField} required helperText="Wpisz numer przelewu od P24 w formacie: p24-xxx-xxx-xxx" {...commonProps} />
            </GridItem>
          </Grid>
        </Form>
      </Formik>
    );
  }
}

MailingForm.propTypes = {
  sendEmail: PropTypes.func.isRequired,
  FormikProps: PropTypes.shape({}),
  onSubmitFailure: PropTypes.func,
  onSubmit: PropTypes.func,
  onSubmitSuccess: PropTypes.func,
};

MailingForm.defaultProps = {
  FormikProps: null,
  onSubmitFailure: null,
  onSubmit: null,
  onSubmitSuccess: null,
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  sendEmail: bookingsActions.sendTicketsEmail,
};

export default connect(mapStateToProps, mapDispatchToProps)(MailingForm);
