import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import GridItem from 'components/GridItem';
import Typography from '@material-ui/core/Typography';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import {
  boolean,
  string,
  object,
  ref,
} from 'yup';

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

    const { userId } = props;

    this.initialValues = {
      id: userId,
      oldPassword: '',
      password: '',
      passwordConfirm: '',
    };

    this.state = {
      showOldPassword: false,
      showPassword: false,
      showPasswordConfirm: false,
    };

    this.validationSchema = object().shape({
      oldPassword: string().when('noOldPassword', {
        is: false,
        then: string().required(),
        otherwise: string(),
      }),
      noOldpassword: boolean().default(() => props.noOldpassword),
      password: string()
        .notOneOf([ref('oldPassword')], `${props.noOldpassword ? 'Field is required.' : 'New password must be different from the current one.'}`)
        .min(8, 'Should be at least 8 characters long.')
        .required('Field is required.'),
      passwordConfirm: string()
        .oneOf([ref('password')], 'Given passwords are different.')
        .required('Field is required.'),
    });
  }

  togglePasswordVisibility = field => () => this.setState(state => ({
    [field]: !state[field],
  }));

  handlePasswordMouseDown = (event) => {
    event.preventDefault();
  };

  getPasswordInputProps = field => ({
    type: this.state[field] ? 'text' : 'password',
    InputProps: {
      endAdornment: (
        <InputAdornment position="end">
          <IconButton
            aria-label={this.state[field] ? 'Ukryj hasło' : 'Pokaż hasło'}
            onClick={this.togglePasswordVisibility(field)}
            onMouseDown={this.handlePasswordMouseDown}
            tabIndex={-1}
          >
            {this.state[field] ? <VisibilityOffIcon /> : <VisibilityIcon />}
          </IconButton>
        </InputAdornment>
      ),
    },
  });

  render() {
    const {
      classes, FormikProps, onSubmit, userId, noOldpassword,
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
              {userId
                && (
                <Hidden xlDown implementation="css">
                  <Field component={TextField} name="id" type="hidden" />
                </Hidden>
                )
              }
              {
                !noOldpassword
                && (
                <GridItem>
                  <Field
                    label="Obecne hasło"
                    name="oldPassword"
                    {...commonProps}
                    {...this.getPasswordInputProps('showOldPassword')}
                  />
                </GridItem>
                )
              }
              <GridItem>
                <Field
                  label="Nowe hasło"
                  name="password"
                  {...commonProps}
                  {...this.getPasswordInputProps('showPassword')}
                />
              </GridItem>
              <GridItem>
                <Field
                  label="Powtórz nowe hasło"
                  name="passwordConfirm"
                  {...commonProps}
                  {...this.getPasswordInputProps('showPasswordConfirm')}
                />
              </GridItem>
              <GridItem>
                <Grid container justify="space-between" alignItems="center">
                  <Button type="submit" disabled={isSubmitting}>Zmień hasło</Button>
                  {status
                    && (
                    <Typography className={classes[status.type]}>
                      {status.message}
                    </Typography>
                    )
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
  noOldpassword: PropTypes.bool,
};

PasswordForm.defaultProps = {
  FormikProps: null,
  userId: null,
  noOldpassword: false,
};

export default withStyles(styles)(PasswordForm);
