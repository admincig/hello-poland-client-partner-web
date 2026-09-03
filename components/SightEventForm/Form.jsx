import React, { Component, Fragment } from 'react';
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
import yupBoolean from 'yup/lib/boolean';
import { actions as sightEventsActions } from '@hello-poland/commons/redux/sightEvents';
import GridItem from 'components/GridItem';
import VoivodeshipSelect, { POLISH_VOIVODESHIPS } from 'components/VoivodeshipSelect';

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

const normalizeCoord = (v) => {
  if (v === null || v === undefined) return null;

  // formik często trzyma '' dla pustych pól
  if (typeof v === 'string') {
    const s = v.trim();
    if (s === '') return null;
    const n = Number(s.replace(',', '.'));
    return Number.isFinite(n) ? n : null;
  }

  if (typeof v === 'number') return Number.isFinite(v) ? v : null;

  return null;
};


class SightEventForm extends Component {
  constructor(props) {
    super(props);

    const { initialValues } = props;

    this.state = {
      initialValues: this.getInitialValues(initialValues),
      isDefaultTranslation: true,
    };

    // TODO: nested validation seems not working
    // TODO: see https://github.com/jaredpalmer/formik/issues/986
    this.validationSchema = yupObject().shape({
      name: yupString()
        .min(3)
        .max(250)
        .required(),
      published: yupBoolean(),
      // generalAdmission: yupBoolen(),
      lead: yupString()
        .min(10)
        .max(250),
      description: yupString()
        .min(10)
        .max(2500)
        .required(),
      email: yupString().email().trim(),
      phone: yupString()
        .trim()
        .transform(value => value || undefined)
        .min(9),
      location: yupObject().shape({
        voivodeship: yupString()
          .oneOf(POLISH_VOIVODESHIPS, 'Wybierz województwo z listy.')
          .required(),
      }),
      // location: yupObject().shape({
      //   directions: yupString().min(5).max(255),
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
    const {
      location: initialLocation, pdfAttachment, mainImage, images, ...details
    } = initialValues || {};
    const location = initialLocation || {};
    return {
      id: details.id || '',
      sightId: details.sightId || '',
      name: details.name || '',
      published: details.published || false,
      lead: details.lead || '',
      description: details.description || '',
      email: details.email || '',
      phone: details.phone || '',
      location: {
        directions: location.directions || '',
        street: location.street || '',
        zipCode: location.zipCode || '',
        city: location.city || '',
        country: location.country || 'Polska',
        latitude: location.latitude || '',
        longitude: location.longitude || '',
        commune:location.commune || '',
        county: location.county || '',
        voivodeship: location.voivodeship
          ? location.voivodeship.toLocaleLowerCase('pl')
          : '',
      },
      mainImage,
      images,
      pdfAttachment,
      categories: details.categories || [],
      tags: details.tags || [],
    };
  };

  setInitialValues = initialValues => this.setState({
    initialValues: this.getInitialValues(initialValues),
    isDefaultTranslation: this.isDefaultLanguage(initialValues),
  });

  handleSubmit = (values, actions) => {
    const { language, onSubmit, clearFormChanges } = this.props;
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
      clearFormChanges();

      return;
    }

    const { id, ...data } = values;
    const {
      createItem, createTranslation, initialValues, updateItem, uploadedMultimedia,
    } = this.props;
    let action = createItem;
    if (data.location) {
      data.location.latitude = normalizeCoord(data.location.latitude);
      data.location.longitude = normalizeCoord(data.location.longitude);
    }

    const payload = {
      data: {
        ...data,
        mainImage: uploadedMultimedia.mainImage.id
          ? uploadedMultimedia.mainImage : values.mainImage,
        images: uploadedMultimedia.images.length ? uploadedMultimedia.images : values.images,
        pdfAttachment: uploadedMultimedia.pdfAttachment.id
          ? uploadedMultimedia.pdfAttachment : values.pdfAttachment,
      },
      onFailure: this.handleSubmitFailure(actions),
      onSuccess: (response) => {
        this.handleSubmitSuccess(actions)(response);
      },
      options,
      pathParams,
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
    clearFormChanges();
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

  isDefaultLanguage = (initialValues) => {
    const { defaultLanguage } = initialValues || {};
    const { language } = this.props;

    return language === defaultLanguage;
  };

  render() {
    const { initialValues, isDefaultTranslation } = this.state;
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
                <Typography variant="h6">Dane podstawowe</Typography>
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
                <Field name="name" label="Nazwa oferty" required component={TextField} {...commonProps} />
              </GridItem>
              {isDefaultTranslation
                && (
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
                )
              }
              <GridItem>
                <Field name="lead" label="Warunki oferty" required component={TextField} {...commonProps} />
              </GridItem>
              <GridItem>
                <Field name="description" label="Opis oferty" required component={TextField} {...commonProps} multiline rowsMax={20} />
              </GridItem>
              {isDefaultTranslation
                && (
                  <Fragment>
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
                    <GridItem>
                      <VoivodeshipSelect />
                    </GridItem>
                    <GridItem>
                      <Field name="location.county" label="Powiat" component={TextField} {...commonProps} />
                    </GridItem>
                    <GridItem>
                      <Field name="location.commune" label="Gmina" component={TextField} {...commonProps}  />
                    </GridItem>
                      <GridItem md={6} sm={6}>
                        <Field name="location.latitude" label="Szerokość geograficzna (lat)"  component={TextField} type="text" inputProps={{ inputMode: "decimal",  pattern: "[0-9.,\\-]*", }} {...commonProps} />
                      </GridItem>
                      <GridItem md={6} sm={6}>
                        <Field name="location.longitude" label="Długość geograficzna (lon)" component={TextField} type="text" inputProps={{ inputMode: "decimal",  pattern: "[0-9.,\\-]*", }} {...commonProps} />
                      </GridItem>
                    <GridItem>
                      <Field name="location.directions" label="Wskazówki dojazdu" component={TextField} {...commonProps} multiline rowsMax={20} inputProps={{ maxLength: 1000 }} />
                    </GridItem>
                  </Fragment>
                )
              }
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

SightEventForm.propTypes = {
  buttons: PropTypes.bool,
  classes: PropTypes.shape({}).isRequired,
  clearFormChanges: PropTypes.func.isRequired,
  createItem: PropTypes.func.isRequired,
  createTranslation: PropTypes.func.isRequired,
  FormikProps: PropTypes.shape({}),
  initialValues: PropTypes.shape({}),
  language: PropTypes.string.isRequired,
  onSubmit: PropTypes.func,
  onSubmitFailure: PropTypes.func,
  onSubmitSuccess: PropTypes.func,
  updateItem: PropTypes.func.isRequired,
  uploadedMultimedia: PropTypes.shape({}),
};

SightEventForm.defaultProps = {
  buttons: true,
  FormikProps: null,
  initialValues: null,
  onSubmit: null,
  onSubmitFailure: null,
  onSubmitSuccess: null,
  uploadedMultimedia: null,
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  createItem: sightEventsActions.createItem,
  createTranslation: sightEventsActions.createTranslation,
  updateItem: sightEventsActions.updateItem,
};

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),
)(SightEventForm);
