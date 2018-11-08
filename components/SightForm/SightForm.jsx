import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography/Typography';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import yupObject from 'yup/lib/object';
import yupString from 'yup/lib/string';
import yupBoolen from 'yup/lib/boolean';

const GridItem = ({ children, ...props }) => (
  <Grid item md={12} sm={12} xs={12} {...props}>
    {children}
  </Grid>
);

GridItem.propTypes = {
  children: PropTypes.node.isRequired,
};


const commonProps = {
  fullWidth: true,
};

// TODO: remove this function and change Switch implementation after it's fixed.
// TODO: see https://github.com/stackworx/formik-material-ui/pull/42
const fieldToSwitch = ({
  field,
  form: { isSubmitting },
  disabled = false,
  ...props
}) => ({
  disabled: isSubmitting || disabled,
  ...props,
  ...field,
  value: field.name,
  checked: field.value,
});

const styles = () => ({
  title: {
    marginTop: 40,
  },
});

class SightForm extends Component {
  constructor(props) {
    super(props);

    const { initialValues } = props;

    this.state = {
      initialValues: this.getInitialValues(initialValues),
    };

    // TODO: nested validation seems not working
    // TODO: see https://github.com/jaredpalmer/formik/issues/986
    this.validationSchema = yupObject().shape({
      name: yupString().min(3).required(),
      published: yupBoolen(),
      generalAdmission: yupBoolen(),
      lead: yupString().min(10),
      description: yupString().min(10).required(),
      email: yupString().email().trim(),
      phone: yupString().min(9).trim(),
      // location: yupObject().shape({
      //   street: yupString().min(5),
      //   zipCode: yupString().min(6).max(6),
      //   city: yupString().min(3),
      //   country: yupString().min(5),
      // }),
    });
  }

  getInitialValues = (initialValues) => {
    const { location: initialLocation, ...details } = initialValues || {};
    const location = initialLocation || {};

    return {
      id: details.id || '',
      name: details.name || '',
      published: details.published || false,
      generalAdmission: details.generalAdmission || false,
      lead: details.lead || '',
      description: details.description || '',
      email: details.email || '',
      phone: details.phone || '',
      location: {
        street: location.street || '',
        zipCode: location.zipCode || '',
        city: location.city || '',
        country: location.country || 'Polska',
      },
    };
  };

  handleSubmit = (values, actions) => {
    const { id, data } = values;
    console.log('handleSubmit', values, actions);
  };

  render() {
    const { initialValues } = this.state;
    const { classes, onSubmit, ...props } = this.props;

    return (
      <Formik
        initialValues={initialValues}
        validationSchema={this.validationSchema}
        onSubmit={this.handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form autoComplete="off" noValidate>
            <Grid container spacing={16}>
              <GridItem>
                <Typography variant="title" className={classes.title}>Dane podstawowe</Typography>
              </GridItem>
              <Hidden xsUp>
                <GridItem>
                  <Field name="id" hidden component={TextField} {...commonProps} />
                </GridItem>
              </Hidden>
              <GridItem>
                <Field name="name" label="Nazwa atrakcji" component={TextField} {...commonProps} />
              </GridItem>
              <GridItem md={4} sm={4}>
                <Field
                  name="published"
                  render={switchProps => (
                    <FormControlLabel
                      control={<Switch {...fieldToSwitch(switchProps)} />}
                      label="Opublikowano"
                    />
                  )}
                />
              </GridItem>
              <GridItem md={4} sm={4}>
                <Field
                  name="generalAdmission"
                  render={switchProps => (
                    <FormControlLabel
                      control={<Switch {...fieldToSwitch(switchProps)} />}
                      label="Dodaj wydarzenie ogólne"
                    />
                  )}
                />
              </GridItem>
              <GridItem>
                <Field name="lead" label="Zajawka" component={TextField} {...commonProps} />
              </GridItem>
              <GridItem>
                <Field name="description" label="Opis atrakcji" component={TextField} {...commonProps} multiline rowsMax={20} />
              </GridItem>
              <GridItem>
                <Typography variant="title" className={classes.title}>Dane kontaktowe</Typography>
              </GridItem>
              <GridItem>
                <Field name="email" label="Adres e-mail" type="email" component={TextField} {...commonProps} />
              </GridItem>
              <GridItem>
                <Field name="phone" label="Numer telefonu" component={TextField} {...commonProps} />
              </GridItem>
              <GridItem>
                <Typography variant="title" className={classes.title}>Lokalizacja</Typography>
              </GridItem>
              <GridItem>
                <Field name="location.street" label="Ulica" component={TextField} {...commonProps} />
              </GridItem>
              <GridItem md={4} sm={4}>
                <Field name="location.zipCode" label="Kod pocztowy" component={TextField} {...commonProps} />
              </GridItem>
              <GridItem md={8} sm={8}>
                <Field name="location.city" label="Miasto" component={TextField} {...commonProps} />
              </GridItem>
              <GridItem>
                <Field name="location.country" label="Kraj" component={TextField} {...commonProps} />
              </GridItem>
            </Grid>
            <Button variant="contained" color="primary" type="submit" disabled={isSubmitting}>ok</Button>
          </Form>
        )}
      </Formik>
    );
  }
}

SightForm.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  initialValues: PropTypes.shape({}),
};

SightForm.defaultProps = {
  initialValues: null,
  // onChange: null,
};

export default withStyles(styles)(SightForm);
