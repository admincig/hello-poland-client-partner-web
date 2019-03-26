import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import _find from 'lodash/find';
import _isEqual from 'lodash/isEqual';
import _isNumber from 'lodash/isNumber';
import format from 'date-fns/format';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography/Typography';
import TimePicker from 'material-ui-pickers/TimePicker';
import MuiPickersUtilsProvider from 'material-ui-pickers/MuiPickersUtilsProvider';
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import yupObject from 'yup/lib/object';
import yupString from 'yup/lib/string';
import yupBoolen from 'yup/lib/boolean';
import { actions as sightsActions } from '@hello-poland/commons/redux/sights';
import GridItem from 'components/GridItem';

const i18n = {
  days: {
    1: 'Poniedziałek',
    2: 'Wtorek',
    3: 'Środa',
    4: 'Czwartek',
    5: 'Piątek',
    6: 'Sobota',
    7: 'Niedziela',
  },
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
  openingHoursTimepicker: {
    width: 50,
  },
});

class SightForm extends Component {
  constructor(props) {
    super(props);

    const { initialValues } = props;
    const { openingHours } = initialValues || {};

    this.state = {
      initialValues: this.getInitialValues(initialValues),
      viewOpeningHours: this.getInitialOpeningHours(openingHours, true),
    };

    // TODO: nested validation seems not working
    // TODO: see https://github.com/jaredpalmer/formik/issues/986
    this.validationSchema = yupObject().shape({
      name: yupString()
        .min(3)
        .max(250)
        .required(),
      published: yupBoolen(),
      // generalAdmission: yupBoolen(),
      lead: yupString()
        .min(10)
        .max(250),
      description: yupString()
        .min(10)
        .max(2500)
        .required(),
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
      const { openingHours } = initialValues || {};

      this.setInitialValues(initialValues);
      this.setViewOpeningHours(openingHours, true);
    }
  }

  getFormattedTime = (datetime, dateFormat = 'HH:mm') => format(datetime, dateFormat);

  getInitialOpeningHours = (initialValues = [], viewValues = false) => {
    let openingHours = [];

    if (viewValues) {
      for (let i = 1; i < 8; i += 1) {
        const values = _find(initialValues, { day: i }) || {};
        const { closeTime, openTime } = values;
        const checked = !!Object.getOwnPropertyNames(values).length;

        openingHours.push({
          checked,
          day: i,
          openTime: openTime ? `1970-01-01T${openTime}` : '1970-01-01T09:00',
          closeTime: closeTime ? `1970-01-01T${closeTime}` : '1970-01-01T18:00',
        });
      }
    } else {
      openingHours = initialValues;
    }

    return openingHours;
  };

  getInitialValues = (initialValues) => {
    const { location: initialLocation, openingHours, ...details } = initialValues || {};
    const location = initialLocation || {};

    return {
      id: details.id || '',
      name: details.name || '',
      published: details.published || false,
      lead: details.lead || '',
      description: details.description || '',
      email: details.email || '',
      phone: details.phone || '',
      openingHours: this.getInitialOpeningHours(openingHours),
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

  setViewOpeningHours = openingHours => this.setState({
    viewOpeningHours: this.getInitialOpeningHours(openingHours, true),
  });

  handleOpeningHoursChange = (day, keyName, keyValue) => {
    const { initialValues, viewOpeningHours } = this.state;
    const { openingHours } = initialValues;
    const dayIndex = day - 1;
    const entryIndex = openingHours.findIndex(o => o.day === day);

    viewOpeningHours[dayIndex][keyName] = keyValue;
    openingHours[entryIndex][keyName] = this.getFormattedTime(keyValue);

    this.setState({
      initialValues: {
        ...initialValues,
        openingHours,
      },
      viewOpeningHours,
    });
  };

  handleOpeningHoursSelectionChange = (day, values) => (event) => {
    const { viewOpeningHours } = this.state;
    const { target } = event;
    const dayIndex = day - 1;
    let { openingHours } = values;

    viewOpeningHours[dayIndex].checked = target.checked;

    if (target.checked) {
      const { closeTime, openTime } = viewOpeningHours[dayIndex];

      openingHours.push({
        day: viewOpeningHours[dayIndex].day,
        openTime: this.getFormattedTime(openTime),
        closeTime: this.getFormattedTime(closeTime),
      });

      openingHours.sort((a, b) => a.day - b.day);
    } else {
      openingHours = openingHours.filter(o => o.day !== day);
    }

    this.setState({
      initialValues: {
        ...values,
        openingHours,
      },
      viewOpeningHours,
    });
  };

  handleSubmit = (values, actions) => {
    const { language, onSubmit } = this.props;
    const options = {
      headers: {
        'Content-Language': language,
      },
    };
    const pathParams = {
      languageVersion: language,
    };

    if (onSubmit) {
      onSubmit(values, actions, options, pathParams);

      return;
    }

    const { id, ...data } = values;
    const {
      createItem, createTranslation, initialValues, updateItem,
    } = this.props;
    let action = createItem;
    const payload = {
      data,
      onFailure: this.handleSubmitFailure(actions),
      onSuccess: this.handleSubmitSuccess(actions),
      options,
    };

    if (_isNumber(id)) {
      if (!initialValues.language) {
        action = createTranslation;
        payload.data.id = id;
      } else {
        action = updateItem;
        payload.id = id;
        payload.pathParams = pathParams;
      }
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
    const { initialValues, viewOpeningHours } = this.state;
    const { buttons, classes, FormikProps } = this.props;

    return (
      <Formik
        enableReinitialize
        {...FormikProps}
        initialValues={initialValues}
        validationSchema={this.validationSchema}
        onSubmit={this.handleSubmit}
      >
        {({ isSubmitting, values }) => (
          <Form autoComplete="off" noValidate>
            <Grid container spacing={16}>
              <GridItem>
                <Typography variant="h6">Dane podstawowe</Typography>
              </GridItem>
              <Hidden xsUp>
                <GridItem>
                  <Field name="id" hidden component={TextField} {...commonProps} />
                </GridItem>
              </Hidden>
              <GridItem>
                <Field name="name" label="Nazwa atrakcji" required component={TextField} {...commonProps} />
              </GridItem>
              <GridItem md={4} sm={4}>
                <Field
                  name="published"
                  render={switchProps => (
                    <FormControlLabel
                      control={<Switch {...fieldToSwitch(switchProps)} />}
                      label="Publikuj"
                    />
                  )}
                />
              </GridItem>
              <GridItem>
                <Field name="lead" label="Wprowadzenie" component={TextField} {...commonProps} />
              </GridItem>
              <GridItem>
                <Field name="description" label="Opis atrakcji" required component={TextField} {...commonProps} multiline rowsMax={20} />
              </GridItem>
              <GridItem>
                <Typography variant="h6" className={classes.title}>Godziny otwarcia</Typography>
              </GridItem>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                {viewOpeningHours.map(item => (
                  <Fragment key={`openingHours-list-${item.day}`}>
                    <GridItem sm={6} md={6}>
                      <FormControlLabel
                        control={(
                          <Switch
                            checked={item.checked}
                            onChange={this.handleOpeningHoursSelectionChange(item.day, values)}
                            value={`${item.day}`}
                          />
                        )}
                        label={i18n.days[item.day]}
                      />
                    </GridItem>
                    <GridItem sm={3} md={3}>
                      <TimePicker
                        ampm={false}
                        className={classes.openingHoursTimepicker}
                        disabled={!item.checked}
                        onChange={event => this.handleOpeningHoursChange(item.day, 'openTime', event)}
                        value={item.openTime}
                      />
                    </GridItem>
                    <GridItem sm={3} md={3}>
                      <TimePicker
                        ampm={false}
                        className={classes.openingHoursTimepicker}
                        disabled={!item.checked}
                        onChange={event => this.handleOpeningHoursChange(item.day, 'closeTime', event)}
                        value={item.closeTime}
                      />
                    </GridItem>
                  </Fragment>
                ))}
              </MuiPickersUtilsProvider>
              <GridItem>
                <Typography variant="h6" className={classes.title}>Dane kontaktowe</Typography>
              </GridItem>
              <GridItem>
                <Field name="email" label="Adres e-mail" type="email" component={TextField} {...commonProps} />
              </GridItem>
              <GridItem>
                <Field name="phone" label="Numer telefonu" component={TextField} {...commonProps} />
              </GridItem>
              <GridItem>
                <Typography variant="h6" className={classes.title}>Lokalizacja</Typography>
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
            {buttons
            && (
            <Grid container spacing={16}>
              <GridItem md={2} sm={2}>
                <Button variant="contained" color="primary" type="submit" disabled={isSubmitting}>
                  Zapisz
                </Button>
              </GridItem>
            </Grid>
            )
            }
          </Form>
        )}
      </Formik>
    );
  }
}

SightForm.propTypes = {
  buttons: PropTypes.bool,
  classes: PropTypes.shape({}).isRequired,
  createItem: PropTypes.func.isRequired,
  createTranslation: PropTypes.func.isRequired,
  FormikProps: PropTypes.shape({}),
  initialValues: PropTypes.shape({}),
  language: PropTypes.string.isRequired,
  onSubmit: PropTypes.func,
  onSubmitFailure: PropTypes.func,
  onSubmitSuccess: PropTypes.func,
  translation: PropTypes.bool,
  updateItem: PropTypes.func.isRequired,
};

SightForm.defaultProps = {
  buttons: true,
  FormikProps: null,
  initialValues: null,
  onSubmit: null,
  onSubmitFailure: null,
  onSubmitSuccess: null,
  translation: false,
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  createItem: sightsActions.createItem,
  createTranslation: sightsActions.createTranslation,
  updateItem: sightsActions.updateItem,
};

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),
)(SightForm);
