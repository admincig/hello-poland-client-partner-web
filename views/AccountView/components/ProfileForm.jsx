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

import { string, object } from 'yup';

const commonProps = {
  fullWidth: true,
};

class PasswordForm extends Component {
  constructor(props) {
    super(props);

    const intitialState = {
      name: '' || props.profile.name,
      email: '' || props.profile.email,
      picture: '' || props.profile.picture,
    };

    this.state = intitialState;
    this.validationSchema = object().shape({
      name: string(),
      email: string(),
    });
  }

  onFailure = () => {
    this.setState({ failure: true });
  }

  onSuccess = () => {
    this.setState({ success: true });
  }

  handleSubmit = values => values;

  render() {
    const { failure, success } = this.state;
    const { FormikProps } = this.props;
    return (
      <Paper style={{ padding: 20, minHeight: 360 }}>
        <Formik
          enableReinitialize
          {...FormikProps}
          initialValues={this.state}
          validationSchema={this.validationSchema}
          onSubmit={this.handleSubmit}
        >
          {() => (
            <Form>
              <Grid container spacing={16}>
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
                  <Typography variant="title">Dane profilowe</Typography>
                </GridItem>
                <GridItem>
                  <Field type="text" required label="Nazwa" name="name" disabled component={TextField} {...commonProps} />
                </GridItem>
                <GridItem>
                  <Field type="text" required label="E-mail" name="email" disabled component={TextField} {...commonProps} />
                </GridItem>
                <GridItem>
                  <Button type="submit" variant="contained" color="primary" disabled>Zapisz</Button>
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
  profile: PropTypes.shape({
    name: PropTypes.string,
    picture: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
};

PasswordForm.defaultProps = {
  FormikProps: null,
};

const mapDispatchToProps = {
  changePassword: profileActions.changePassword,
  logout: profileActions.logout,
};

export default connect(null, mapDispatchToProps)(PasswordForm);
