import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { compose } from 'redux';
import { compose } from 'redux';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import CloseIcon from '@material-ui/icons/Close';
import ErrorIcon from '@material-ui/icons/Error';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import Router from 'next/router';
import yupObject from 'yup/lib/object';
import yupString from 'yup/lib/string';
import {
  actions as profileActions,
  selectors as profileSelectors,
} from 'redux/profile';
import Layout from 'components/Layout';

const styles = theme => ({
  root: {
    height: '100vh',
    marginLeft: 'auto',
  },
  cardActions: {
    justifyContent: 'flex-end',
  },
  close: {
    padding: theme.spacing.unit / 2,
  },
  card: {
    width: 400,
  },
  container: {
    height: '100%',
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  icon: {
    fontSize: 20,
    marginRight: theme.spacing.unit,
    opacity: 0.9,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
});

const commonProps = {
  fullWidth: true,
  margin: 'normal',
  required: true,
};

class SignIn extends Component {
  state = {
    snackbar: {
      open: false,
      message: '',
    },
  };

  initialValues = {
    login: '',
    password: '',
  };

  validationSchema = yupObject().shape({
    login: yupString()
      .min(3)
      .max(250)
      .email()
      .trim()
      .required(),
    password: yupString()
      .min(3)
      .max(250)
      .trim()
      .required(),
  });

  componentDidMount() {
    const { isAuthenticated } = this.props;

    if (isAuthenticated) {
      Router.push('/');
    }
  }

  handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ snackbar: { open: false, message: '' } });
  };

  handleSnackbarOpen = (errors = []) => {
    const credentialError = errors.filter(error => error.status === 401)[0];

    if (credentialError) {
      this.setState({ snackbar: { open: true, message: credentialError.detail } });
    }
  };

  handleSubmit = (data, actions) => {
    const { login } = this.props;

    login({
      data,
      onFailure: this.handleSubmitFailure(actions),
      onSuccess: this.handleSubmitSuccess,
    });
  };

  handleSubmitFailure = actions => () => {
    const { errors } = this.props;
    const { setSubmitting } = actions;

    setSubmitting(false);

    this.handleSnackbarOpen(errors);
  };

  handleSubmitSuccess = () => {
    const { query } = Router.router;
    const url = query.redirect || '/';

    if (url.indexOf('http') === -1) {
      Router.push(url);
    } else {
      Router.push('/');
    }
  };

  render() {
    const { snackbar } = this.state;
    const { classes } = this.props;
    const { open, message } = snackbar;

    return (
      <Layout ContentProps={{ className: classes.root }}>
        <Grid container justify="center" alignItems="center" className={classes.container}>
          <Formik
            initialValues={this.initialValues}
            validationSchema={this.validationSchema}
            onSubmit={this.handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <Card className={classes.card}>
                  <CardContent>
                    <Field name="login" label="Login" component={TextField} {...commonProps} />
                    <Field name="password" label="Hasło" type="password" component={TextField} {...commonProps} />
                  </CardContent>
                  <CardActions className={classes.cardActions}>
                    <Button color="primary" disabled={isSubmitting} type="submit">
                      Zaloguj
                    </Button>
                  </CardActions>
                </Card>
              </Form>
            )}
          </Formik>
        </Grid>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          autoHideDuration={6000}
          open={open}
          onClose={this.handleSnackbarClose}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
        >
          <SnackbarContent
            className={classes.error}
            aria-describedby="client-snackbar"
            message={(
              <span id="client-snackbar" className={classes.message}>
                <ErrorIcon className={classes.icon} />
                {message}
              </span>
            )}
            action={[
              <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                className={classes.close}
                onClick={this.handleSnackbarClose}
              >
                <CloseIcon />
              </IconButton>,
            ]}
          />
        </Snackbar>
      </Layout>
    );
  }
}

SignIn.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  errors: PropTypes.arrayOf(PropTypes.shape({
    status: PropTypes.number,
    detail: PropTypes.string,
  })),
  isAuthenticated: PropTypes.bool.isRequired,
  login: PropTypes.func.isRequired,
};

SignIn.defaultProps = {
  errors: [],
};

const mapStateToProps = state => ({
  errors: profileSelectors.getErrors(state),
  isAuthenticated: profileSelectors.isAuthenticated(state),
});

const mapDispatchToProps = {
  login: profileActions.login,
};

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),
)(SignIn);
