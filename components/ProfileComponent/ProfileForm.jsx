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
import { string, object } from 'yup';

const commonProps = {
  component: TextField,
  fullWidth: true,
  required: true,
  type: 'text',
};

const styles = theme => ({
  failure: {
    color: theme.palette.error.main,
  },
  success: {
    color: theme.palette.common.black,
  },
});

class ProfileForm extends Component {
  constructor(props) {
    super(props);

    const { name } = props.profile;

    this.initialValues = {
      name: name || '',
    };

    this.validationSchema = object().shape({
      name: string(),
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
                <Field label="Nazwa" name="name" {...commonProps} />
              </GridItem>
              <GridItem>
                <Field label="email" name="email" {...commonProps} disabled />
              </GridItem>
              <GridItem>
                <Grid container justify="space-between" alignItems="center">
                  <Button type="submit" disabled={isSubmitting}>Zapisz</Button>
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

ProfileForm.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  FormikProps: PropTypes.shape({}),
  onSubmit: PropTypes.func.isRequired,
  userId: PropTypes.number,
  profile: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
};

ProfileForm.defaultProps = {
  FormikProps: null,
  userId: null,
};

export default withStyles(styles)(ProfileForm);
