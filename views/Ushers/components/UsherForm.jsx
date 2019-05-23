import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import yupObject from 'yup/lib/object';
import yupString from 'yup/lib/string';
import GridItem from 'components/GridItem';
import { ref } from 'yup';
import { actions as ushersActions } from 'redux/ushers';

const commonProps = {
  fullWidth: true,
};

class UsherForm extends Component {
  constructor(props) {
    super(props);

    // TODO: nested validation seems not working
    // TODO: see https://github.com/jaredpalmer/formik/issues/986
    this.validationSchema = yupObject().shape({
      name: yupString()
        .min(3)
        .max(250)
        .required(),
      email: yupString()
        .email()
        .trim()
        .required(),
      password: yupString()
        .min(8, 'Should be at least 8 characters long.')
        .required('Field is required.'),
      confirmPassword: yupString()
        .oneOf([ref('password')], 'Given passwords are different.')
        .required('Field is required.'),
    });

    this.initialValues = {
      email: '',
      name: '',
      password: '',
      confirmPassword: '',
    };
  }

  handleSubmit = (values, actions) => {
    const { onSubmit } = this.props;

    if (onSubmit) {
      onSubmit(values, actions);

      return;
    }

    const { confirmPassword, ...data } = values;
    const { createItem } = this.props;
    const payload = {
      data,
      onFailure: this.handleSubmitFailure(actions),
      onSuccess: this.handleSubmitSuccess(actions),
    };

    createItem(payload);
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
              <Field name="email" label="Email" component={TextField} required helperText="Partner jest jednocześnie bileterem" {...commonProps} />
            </GridItem>
            <GridItem>
              <Field name="name" label="Nazwa" component={TextField} required {...commonProps} />
            </GridItem>
            <GridItem>
              <Field name="password" type="password" label="Hasło" component={TextField} required {...commonProps} />
            </GridItem>
            <GridItem>
              <Field name="confirmPassword" type="password" label="Powtórz Hasło" required component={TextField} {...commonProps} />
            </GridItem>
          </Grid>
        </Form>
      </Formik>
    );
  }
}

UsherForm.propTypes = {
  createItem: PropTypes.func.isRequired,
  FormikProps: PropTypes.shape({}),
  onSubmitFailure: PropTypes.func,
  onSubmitSuccess: PropTypes.func,
  onSubmit: PropTypes.func,
};

UsherForm.defaultProps = {
  FormikProps: null,
  onSubmitFailure: null,
  onSubmitSuccess: null,
  onSubmit: null,
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  createItem: ushersActions.createItem,
};

export default connect(mapStateToProps, mapDispatchToProps)(UsherForm);
