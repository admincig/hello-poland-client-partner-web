import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import Router from 'next/router';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { selectors as configSelectors } from 'redux/config';
import {
  actions as profileActions,
  selectors as profileSelectors,
} from '@hello-poland/commons/redux/profile';
import Layout from 'components/Layout';

const styles = theme => ({
  button: {
    marginTop: theme.spacing.unit,
    width: '100%',
  },
  container: {
    position: 'absolute',
    top: '50%',
    bottom: '50%',
  },
  error: {
    color: theme.palette.error.main,
  },
  textField: {
    width: '100%',
  },
});

class LoginView extends Component {
  state = {
    login: '',
    password: '',
  };

  componentDidUpdate() {
    const { assetPrefix, isAuthenticated } = this.props;

    if (isAuthenticated) {
      Router.push(`${assetPrefix}/`);
    }
  }

  handleChange = name => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleFormSubmit = () => {
    const { login } = this.props;

    login(this.state);
  };

  render() {
    const { classes, error } = this.props;

    return (
      <Layout>
        <Grid container className={classes.container} justify="center" alignItems="center">
          <Grid item sm={6} md={5} lg={3}>
            <Card>
              <CardContent>
                <form noValidate autoComplete="off" onSubmit={() => this.handleFormSubmit()}>
                  <TextField
                    id="login"
                    label="Login"
                    className={classes.textField}
                    onChange={this.handleChange('login')}
                    margin="normal"
                  />
                  <TextField
                    id="password"
                    label="Password"
                    className={classes.textField}
                    type="password"
                    autoComplete="current-password"
                    onChange={this.handleChange('password')}
                    margin="normal"
                  />
                  {error && (
                    <Typography className={classes.error} gutterBottom>
                      Wystąpił błąd podczas logowania.
                    </Typography>
                  )}
                  <Button
                    variant="raised"
                    color="primary"
                    className={classes.button}
                    onClick={() => this.handleFormSubmit()}
                  >
                    Zaloguj
                  </Button>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Layout>
    );
  }
}

LoginView.propTypes = {
  assetPrefix: PropTypes.string.isRequired,
  classes: PropTypes.shape({}).isRequired,
  error: PropTypes.shape({}),
  isAuthenticated: PropTypes.bool.isRequired,
  login: PropTypes.func.isRequired,
};

LoginView.defaultProps = {
  error: null,
};

const mapStateToProps = state => ({
  assetPrefix: configSelectors.getAppConfig(state).public.assetPrefix || '',
  isAuthenticated: profileSelectors.isAuthenticated(state),
  error: profileSelectors.getError(state),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    login: profileActions.login,
  }, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(LoginView);
