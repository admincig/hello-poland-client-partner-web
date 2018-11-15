import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import _isEqual from 'lodash/isEqual';
import _isNumber from 'lodash/isNumber';
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
import { actions as sightEventsActions } from '@hello-poland/commons/redux/sightEvents';
import GridItem from 'components/GridItem';

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

class SightEventForm extends Component {
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

  componentDidUpdate(prevProps) {
    const { initialValues: prevInitialValues } = prevProps;
    const { initialValues } = this.props;

    if (!_isEqual(prevInitialValues, initialValues)) {
      this.setInitialValues(initialValues);
    }
  }

  getInitialValues = (initialValues) => {
    const { location: initialLocation, ...details } = initialValues || {};
    const location = initialLocation || {};

    return {
      id: details.id || '',
      sightId: details.sightId || '',
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

  setInitialValues = initialValues => this.setState({
    initialValues: this.getInitialValues(initialValues),
  });

  handleSubmit = (values, actions) => {
    const { onSubmit } = this.props;

    if (onSubmit) {
      onSubmit(values, actions);

      return;
    }

    const { id, ...data } = values;
    const { createItem, updateItem } = this.props;
    let action = createItem;
    const payload = {
      data,
      onFailure: this.handleSubmitFailure(actions),
      onSuccess: this.handleSubmitSuccess(actions),
    };

    debugger;
    if (_isNumber(id)) {
      action = updateItem;
      payload.id = id;
    }

    action(payload);
  };

  handleSubmitFailure = actions => () => {
    const { onSubmitFailure } = this.props;

    if (onSubmitFailure) {
      onSubmitFailure(actions);
    }

    const { setSubmitting } = actions;

    setSubmitting(false);
  };

  handleSubmitSuccess = actions => (sightId) => {
    const { onSubmitSuccess } = this.props;

    if (onSubmitSuccess) {
      onSubmitSuccess(sightId, actions);

      return;
    }

    const { resetForm, setSubmitting } = actions;

    setSubmitting(false);
    resetForm();
  };

  render() {
    const { initialValues } = this.state;
    const { buttons, classes, FormikProps } = this.props;

    return (
      <Formik
        enableReinitialize
        {...FormikProps}
        initialValues={initialValues}
        validationSchema={this.validationSchema}
        onSubmit={this.handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form autoComplete="off" noValidate>
            <Grid container spacing={16}>
              <GridItem>
                <Typography variant="title">Dane podstawowe</Typography>
              </GridItem>
              <Hidden xsUp>
                <GridItem>
                  <Field name="id" hidden component={TextField} {...commonProps} />
                </GridItem>
              </Hidden>
              <Hidden xsUp>
                <GridItem>
                  <Field name="sightId" hidden component={TextField} {...commonProps} />
                </GridItem>
              </Hidden>
              <GridItem>
                <Field name="name" label="Nazwa wydarzenia" component={TextField} {...commonProps} />
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
              <GridItem md={8} sm={8}>
                <Field
                  name="generalAdmission"
                  render={switchProps => (
                    <FormControlLabel
                      control={<Switch {...fieldToSwitch(switchProps)} />}
                      label="Wydarzenie ogólne"
                    />
                  )}
                />
              </GridItem>
              <GridItem>
                <Field name="lead" label="Wprowadzenie" component={TextField} {...commonProps} />
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
            {buttons &&
              <Grid container spacing={16}>
                <GridItem md={2} sm={2}>
                  <Button variant="contained" color="primary" type="submit" disabled={isSubmitting}>
                    Zapisz
                  </Button>
                </GridItem>
              </Grid>
            }
          </Form>
        )}
      </Formik>
    );
  }
}

SightEventForm.propTypes = {
  buttons: PropTypes.bool,
  classes: PropTypes.shape({}).isRequired,
  createItem: PropTypes.func.isRequired,
  FormikProps: PropTypes.shape({}),
  initialValues: PropTypes.shape({}),
  onSubmit: PropTypes.func,
  onSubmitFailure: PropTypes.func,
  onSubmitSuccess: PropTypes.func,
  updateItem: PropTypes.func.isRequired,
};

SightEventForm.defaultProps = {
  buttons: true,
  FormikProps: null,
  initialValues: null,
  onSubmit: null,
  onSubmitFailure: null,
  onSubmitSuccess: null,
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  createItem: sightEventsActions.createItem,
  updateItem: sightEventsActions.updateItem,
};

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),
)(SightEventForm);
