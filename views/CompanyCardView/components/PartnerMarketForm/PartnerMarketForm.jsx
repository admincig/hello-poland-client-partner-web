import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import _isEqual from 'lodash/isEqual';
import _isNumber from 'lodash/isNumber';
import _merge from 'lodash/merge';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import yupBoolean from 'yup/lib/boolean';
import yupObject from 'yup/lib/object';
import yupString from 'yup/lib/string';
import {
  actions as partnersActions,
  selectors as partnersSelectors,
} from 'redux/partners';
import { DEFAULT_LANGUAGE } from 'utils/translations';
import GridItem from 'components/GridItem';

const commonProps = {
  fullWidth: true,
};

const styles = theme => ({
  errorIcon: {
    fontSize: 48,
  },
  formControl: {
    width: '100%',
  },
  section: {
    marginTop: theme.spacing.unit * 2,
  },
});

class PartnerMarketForm extends React.Component {
  constructor(props) {
    super(props);

    const { initialValues } = this.props;

    this.state = {
      initialValues: this.getInitialValues(initialValues || {}),
    };

    // TODO: nested validation seems not working
    // TODO: see https://github.com/jaredpalmer/formik/issues/986
    this.validationSchema = yupObject().shape({
      published: yupBoolean(),
      description: yupString().min(10).max(1000).required(),
      location: yupObject().shape({
        directions: yupString(),
      }),
    });
  }

  componentDidUpdate() {
    const { initialValues: stateInitialValues } = this.state;
    const { initialValues, requestError } = this.props;

    if (!_isEqual(this.getInitialValues(initialValues), stateInitialValues) && !requestError) {
      this.setInitialValues(initialValues);
    }
  }

  getInitialValues = (initialValues) => {
    const { location: initialLocation, pdfAttachment: files, ...details } = initialValues || {};
    const location = initialLocation || {};

    return {
      id: details.id || '',
      description: details.description || '',
      location: {
        directions: location.directions || '',
      },
    };
  };


  setInitialValues = initialValues => this.setState({
    initialValues: this.getInitialValues(initialValues || {}),
  });

  handleSubmit = (values, actions) => {
    const { initialValues, language, onSubmit } = this.props;

    if (onSubmit) {
      onSubmit(values, actions);

      return;
    }

    const { createItem, createTranslation, updateItem } = this.props;
    const { id, ...data } = values;

    const payload = {
      data: _merge(initialValues, data),
      options: {
        headers: {
          'Content-Language': language,
        },
      },
      onFailure: this.handleSubmitFailure(actions),
      onSuccess: this.handleSubmitSuccess(actions),
    };

    let submitAction = createItem;

    if (_isNumber(id)) {
      payload.data.id = id;

      if (initialValues.language === language) {
        submitAction = updateItem;
        payload.id = id;
        payload.pathParams = {
          languageVersion: language,
        };
      } else {
        submitAction = createTranslation;
      }
    }

    submitAction(payload);
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
    const { onSubmitSuccess, clearError } = this.props;

    if (onSubmitSuccess) {
      onSubmitSuccess(sightId, actions);

      return;
    }

    const { setSubmitting } = actions;

    clearError();
    setSubmitting(false);
  };

  render() {
    const {
      classes, FormikProps, hideButtons, hideErrors, requestError,
    } = this.props;
    const { initialValues } = this.state;
    const { data: errorData } = requestError || {};
    const { message: errorMessage } = errorData || {};

    return (
      <Formik
        enableReinitialize
        {...FormikProps}
        initialValues={initialValues}
        validationSchema={this.validationSchema}
        onSubmit={this.handleSubmit}
      >
        {({ isSubmitting } = {}) => (
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
                <Field name="description" label="Opis działalności" required component={TextField} {...commonProps} multiline rowsMax={20} />
              </GridItem>
              <GridItem>
                <Typography variant="h6" className={classes.section}>Lokalizacja</Typography>
              </GridItem>
              <GridItem>
                <Field name="location.directions" label="Wskazówki dojazdu" component={TextField} {...commonProps} multiline rowsMax={10} />
              </GridItem>
            </Grid>
            {(!hideButtons || (!hideErrors && errorMessage))
            && (
              <Grid container spacing={16} justify="flex-end" className={classes.section}>
                {!hideErrors && errorMessage
                && (
                  <GridItem container md={9} sm={9}>
                    <Typography color="error">{errorMessage}</Typography>
                  </GridItem>
                )
                }
                {!hideButtons
                && (
                  <GridItem container md={3} sm={3} justify="flex-end">
                    <Button variant="contained" color="primary" type="submit" disabled={isSubmitting}>
                      Zapisz
                    </Button>
                  </GridItem>
                )
                }
              </Grid>
            )
            }
          </Form>
        )}
      </Formik>
    );
  }
}

PartnerMarketForm.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  clearError: PropTypes.func.isRequired,
  createItem: PropTypes.func.isRequired,
  createTranslation: PropTypes.func.isRequired,
  FormikProps: PropTypes.shape({}),
  hideButtons: PropTypes.bool,
  hideErrors: PropTypes.bool,
  initialValues: PropTypes.shape({}),
  language: PropTypes.string,
  onSubmit: PropTypes.func,
  onSubmitFailure: PropTypes.func,
  onSubmitSuccess: PropTypes.func,
  requestError: PropTypes.shape({
    message: PropTypes.string,
  }),
  updateItem: PropTypes.func.isRequired,
};

PartnerMarketForm.defaultProps = {
  FormikProps: null,
  hideButtons: false,
  hideErrors: false,
  initialValues: null,
  language: DEFAULT_LANGUAGE,
  onSubmit: null,
  onSubmitFailure: null,
  onSubmitSuccess: null,
  requestError: null,
};

const mapStateToProps = state => ({
  requestError: partnersSelectors.getError(state),
});

const mapDispatchToProps = {
  clearError: partnersActions.clearError,
  createItem: partnersActions.createItem,
  createTranslation: partnersActions.createTranslation,
  updateItem: partnersActions.updateItem,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(PartnerMarketForm);
