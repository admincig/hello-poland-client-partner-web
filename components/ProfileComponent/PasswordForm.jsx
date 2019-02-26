import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import GridItem from 'components/GridItem';
import Typography from '@material-ui/core/Typography';
import { string, object, ref } from 'yup';

const commonProps = {
  component: TextField,
  fullWidth: true,
  required: true,
  type: 'password',
};

const styles = theme => ({
  failure: {
    color: theme.palette.error.main,
  },
  success: {
    color: theme.palette.common.black,
  },
});

class PasswordForm extends Component {
  constructor(props) {
    super(props);

    this.initialValues = {
      id: props.userId ? props.userId : undefined,
      oldPassword: '',
      password: '',
      passwordConfirm: '',
    };

    this.validationSchema = object().shape({
      oldPassword: string()
        .required('Field is required.'),
      password: string()
        .notOneOf([ref('oldPassword')], 'New password must be different from the current one.')
        .min(8, 'Should be at least 8 characters long.')
        .required('Field is required.'),
      passwordConfirm: string()
        .oneOf([ref('password')], 'Given passwords are different.')
        .required('Field is required.'),
    });
  }

  render() {
    const {
      classes, FormikProps, onSubmit, userId,
    } = this.props;

    return (
      <Formik
        {...FormikProps}
        initialValues={this.initialValues}
        validationSchema={this.validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting, status }) => (
          <Form>
            <Grid container spacing={16}>
              {userId &&
                <Hidden xlDown implementation="css">
                  <Field component={TextField} name="id" type="hidden" />
                </Hidden>
              }
              <GridItem>
                <Field label="Obecne hasło" name="oldPassword" {...commonProps} />
              </GridItem>
              <GridItem>
                <Field label="Nowe hasło" name="password" {...commonProps} />
              </GridItem>
              <GridItem>
                <Field label="Powtórz nowe hasło" name="passwordConfirm" {...commonProps} />
              </GridItem>
              <GridItem>
                <Grid container justify="space-between" alignItems="center">
                  <Button type="submit" disabled={isSubmitting}>Zmień hasło</Button>
                  {status &&
                    <Typography className={classes[status.type]}>
                      {status.message}
                    </Typography>
                  }
                </Grid>
              </GridItem>
            </Grid>
          </Form>
        )}
      </Formik>
    );
  }
}

PasswordForm.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  FormikProps: PropTypes.shape({}),
  onSubmit: PropTypes.func.isRequired,
  userId: PropTypes.number,
};

PasswordForm.defaultProps = {
  FormikProps: null,
  userId: null,
};

export default withStyles(styles)(PasswordForm);
