import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import GridItem from 'components/GridItem';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { actions as profileActions } from '@hello-poland/commons/redux/profile';

import { string, object, ref } from 'yup';

const commonProps = {
  fullWidth: true,
};

const schemaRegExp = {
  digit: /^(?=.*\d)/,
  special: /^(?=.*[$@$!%*?&])/,
  empty: /[^-\s]/,
  lower: /^(?=.*[a-z])/,
  upper: /^(?=.*[A-Z])/,
};

class PasswordForm extends Component {
  constructor(props) {
    super(props);

    const intitialState = {
      oldPassword: '',
      newPassword: '',
      newPasswordConfirm: '',
      failure: false,
      success: false,
    };

    this.state = intitialState;

    const {
      digit, special, lower, upper, empty,
    } = schemaRegExp;
    this.validationSchema = object().shape({
      oldPassword: string()
        .required(),
      newPassword: string()
        .notOneOf([ref('oldPassword')], 'Nowe hasło musi się różnić od poprzedniego')
        .test('no-whitespace', 'Hasło nie powinno zawierać spacji', value => empty.test(value))
        .min(8, 'Hasło powinno mieć conajmniej 8 znaków')
        .test('digit-count', 'Hasło powinno zawierać conajmniej jedną cyfrę', value => digit.test(value))
        .test('special-count', 'Hasło powinno zawierać conajmniej jeden znak specialny', value => special.test(value))
        .test('lowercase-count', 'Hasło powinno zawierać conajmniej jedną małą literę', value => lower.test(value))
        .test('uppercase-count', 'Hasło powinno zawierać conajmniej jedną wielką literę', value => upper.test(value)),
      newPasswordConfirm: string()
        .oneOf([ref('newPassword')], 'Podane hasła się różnią!'),
    });
  }

  onFailure = () => {
    this.setState({ failure: true });
  }

  onSuccess = () => {
    this.setState({ success: true }, this.props.logout);
  }

  handleSubmit = (values) => {
    const { oldPassword, newPassword } = values;
    this.props.changePassword({
      data: {
        password: newPassword,
        oldPassword,
      },
      onFailure: this.onFailure,
    });
  }

  render() {
    const { failure, success } = this.state;
    const { FormikProps, ...rest } = this.props;
    return (
      <Paper style={{ padding: 20, minHeight: 360 }}>
        <Formik
          enableReinitialize
          {...FormikProps}
          initialValues={this.state}
          validationSchema={this.validationSchema}
          onSubmit={this.handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <Grid container spacing={16} {...rest}>
                {
                  failure &&
                  <GridItem>
                    <Typography variant="body1">Coś poszło nie tak. Odśwież stronę i spróbuj ponownie</Typography>
                  </GridItem>
                }
                {
                  success &&
                  <GridItem>
                    <Typography variant="body1">Hasło zostało zmienione</Typography>
                  </GridItem>
                }
                <GridItem>
                  <Typography variant="title">Zmiana hasła</Typography>
                </GridItem>
                <GridItem>
                  <Field type="password" required label="Stare hasło" name="oldPassword" component={TextField} {...commonProps} />
                </GridItem>
                <GridItem>
                  <Field type="password" required label="Nowe hasło" name="newPassword" component={TextField} {...commonProps} />
                </GridItem>
                <GridItem>
                  <Field type="password" required label="Powtórz" name="newPasswordConfirm" component={TextField} {...commonProps} />
                </GridItem>
                <GridItem>
                  <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>Zmień hasło</Button>
                </GridItem>
              </Grid>
            </Form>
          )}
        </Formik>
      </Paper>
    );
  }
}

PasswordForm.propTypes = {
  FormikProps: PropTypes.shape({}),
  changePassword: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
};

PasswordForm.defaultProps = {
  FormikProps: null,
};

const mapDispatchToProps = {
  changePassword: profileActions.changePassword,
  logout: profileActions.logout,
};

export default connect(null, mapDispatchToProps)(PasswordForm);
