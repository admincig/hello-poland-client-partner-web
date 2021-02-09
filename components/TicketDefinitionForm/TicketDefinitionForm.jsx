import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import _isEqual from 'lodash/isEqual';
import _isNumber from 'lodash/isNumber';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import Typography from '@material-ui/core/Typography';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import yupObject from 'yup/lib/object';
import yupString from 'yup/lib/string';
import yupNumber from 'yup/lib/number';
import {
  actions as ticketDefinitionsActions,
  selectors as ticketDefinitionsSelectors,
} from 'redux/ticketDefinitions';
import GridItem from 'components/GridItem';

const commonProps = {
  fullWidth: true,
};

class TicketDefinitionForm extends Component {
  constructor(props) {
    super(props);

    const { initialValues } = this.props;

    this.state = {
      initialValues: this.getInitialValues(initialValues || {}),
    };

    this.validationSchema = yupObject().shape({
      name: yupString().min(3).max(30).required(),
      price: yupNumber().min(0).required(),
    });
  }

  componentDidUpdate(prevProps) {
    const { initialValues: prevInitialValues } = prevProps;
    const { initialValues } = this.props;

    if (!_isEqual(prevInitialValues, initialValues)) {
      this.setInitialValues(initialValues);
    }
  }

  getInitialValues = initialValues => ({
    id: initialValues.id || undefined,
    name: initialValues.name || '',
    price: _isNumber(initialValues.price) ? parseFloat(initialValues.price / 100).toFixed(2) : '',
  });

  setInitialValues = initialValues => this.setState({
    initialValues: this.getInitialValues(initialValues),
  });

  handleReset = (values, formikActions) => {
    const { onReset } = this.props;

    if (onReset) {
      onReset(values, formikActions);
    }
  };

  handleSubmit = (values, formikActions) => {
    const { onSubmit } = this.props;

    if (onSubmit) {
      onSubmit(values, formikActions);

      return;
    }

    const { createItem, updateItem } = this.props;
    let action = createItem;
    const { id, ...data } = values;
    const payload = {
      data: {
        ...data,
        price: Math.round(`${data.price}e2`),
      },
      onFailure: this.handleSubmitFailure(formikActions),
      onSuccess: this.handleSubmitSuccess(formikActions),
    };

    if (id) {
      action = updateItem;
      payload.id = id;
    }

    action(payload);
  };

  handleSubmitFailure = formikActions => () => {
    const { onSubmitFailure } = this.props;

    if (onSubmitFailure) {
      onSubmitFailure(formikActions);
    }

    const { setSubmitting } = formikActions;

    setSubmitting(false);
  };

  handleSubmitSuccess = formikActions => (ticketDefinitionId) => {
    const { clearError, onSubmitSuccess } = this.props;

    if (onSubmitSuccess) {
      onSubmitSuccess(ticketDefinitionId, formikActions);

      return;
    }

    const { resetForm, setSubmitting } = formikActions;

    clearError();
    setSubmitting(false);
    resetForm();
  };

  render() {
    const { initialValues } = this.state;
    const {
      FormikProps, hideButtons, hideErrors, requestError,
    } = this.props;
    const { data: errorData } = requestError || {};
    const { message: errorMessage } = errorData || {};
    const priceWarningMessage = 'Uwaga: edycja ceny produktu wpłynie na wszystkie pule, do których produkt jest przypisany.';

    return (
      <Formik
        enableReinitialize
        {...FormikProps}
        initialValues={initialValues}
        validationSchema={this.validationSchema}
        onSubmit={this.handleSubmit}
        onReset={this.handleReset}
      >
        {({ isSubmitting }) => (
          <Form autoComplete="off" noValidate>
            <Grid container spacing={16}>
              <Hidden xsUp>
                <Field name="id" hidden component={TextField} {...commonProps} />
              </Hidden>
              <GridItem md={12} sm={12}>
                <Field component={TextField} label="Nazwa (np. Normalny)" name="name" required {...commonProps} />
              </GridItem>
              <GridItem md={12} sm={12}>
                <Field component={TextField} label="Cena (PLN)" name="price" type="number" helperText={initialValues.id ? priceWarningMessage : ''} required {...commonProps} />
              </GridItem>
            </Grid>
            {(!hideButtons || (!hideErrors && requestError)) && (
              <Grid container spacing={16} justify="flex-end">
                {!hideErrors && requestError
                  && (
                    <GridItem container md={9} sm={9}>
                      <Typography color="error">
                        {errorMessage || 'Wystąpił błąd podczas zapisywania'}
                      </Typography>
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
            )}
          </Form>
        )}
      </Formik>
    );
  }
}

TicketDefinitionForm.propTypes = {
  clearError: PropTypes.func.isRequired,
  createItem: PropTypes.func.isRequired,
  FormikProps: PropTypes.shape({}),
  hideButtons: PropTypes.bool,
  hideErrors: PropTypes.bool,
  initialValues: PropTypes.shape({}),
  onReset: PropTypes.func,
  onSubmit: PropTypes.func,
  onSubmitFailure: PropTypes.func,
  onSubmitSuccess: PropTypes.func,
  requestError: PropTypes.shape({
    message: PropTypes.string,
  }),
  updateItem: PropTypes.func.isRequired,
};

TicketDefinitionForm.defaultProps = {
  FormikProps: null,
  hideButtons: false,
  hideErrors: false,
  initialValues: null,
  onReset: null,
  onSubmit: null,
  onSubmitFailure: null,
  onSubmitSuccess: null,
  requestError: null,
};

const mapStateToProps = state => ({
  requestError: ticketDefinitionsSelectors.getError(state),
});

const mapDispatchToProps = {
  clearError: ticketDefinitionsActions.clearError,
  createItem: ticketDefinitionsActions.createItem,
  updateItem: ticketDefinitionsActions.updateItem,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(TicketDefinitionForm);
