import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import yupObject from 'yup/lib/object';
import yupString from 'yup/lib/string';
import yupNumber from 'yup/lib/number';
import { actions as ticketDefinitionsActions } from 'redux/ticketDefinitions';
import GridItem from 'components/GridItem';

const commonProps = {
  fullWidth: true,
};

const styles = () => ({
  limit: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
});

class TicketDefinitionForm extends Component {
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
    const { onSubmitSuccess } = this.props;

    if (onSubmitSuccess) {
      onSubmitSuccess(ticketDefinitionId, formikActions);

      return;
    }

    const { resetForm, setSubmitting } = formikActions;

    setSubmitting(false);
    resetForm();
  };

  render() {
    const {
      classes, createItem, onReset, onSubmit, onSubmitFailure, onSubmitSuccess, updateItem, ...props
    } = this.props;


    return (
      <Formik
        {...props}
        onSubmit={this.handleSubmit}
        onReset={this.handleReset}
      >
        {({ isSubmitting, ...formikActions }) => (
          <Form autoComplete="off" noValidate>
            <Grid container spacing={16}>
              <Hidden xlDown implementation="css">
                <Field component={TextField} name="id" type="hidden" {...commonProps} />
              </Hidden>
              <GridItem md={12} sm={12}>
                <Field component={TextField} label="Nazwa (np. Normalny)" name="name" required {...commonProps} />
                <Field component={TextField} label="Cena (PLN)" name="price" type="number" required {...commonProps} />
              </GridItem>
            </Grid>
            <Grid container spacing={16}>
              <GridItem md={2} sm={2}>
                <Button variant="contained" color="primary" type="submit" disabled={isSubmitting}>
                  Dodaj
                </Button>
              </GridItem>
              <GridItem md={2} sm={2}>
                {onReset &&
                  <Button variant="contained" color="primary" type="reset" disabled={isSubmitting} onClick={() => this.handleReset(null, formikActions)}>
                    Anuluj
                  </Button>
                }
              </GridItem>
            </Grid>
          </Form>
        )}
      </Formik>
    );
  }
}

TicketDefinitionForm.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  onReset: PropTypes.func,
  onSubmit: PropTypes.func,
  onSubmitFailure: PropTypes.func,
  onSubmitSuccess: PropTypes.func,
  createItem: PropTypes.func.isRequired,
  initialValues: PropTypes.shape({}),
  updateItem: PropTypes.func.isRequired,
  validationSchema: PropTypes.shape({}),
};

TicketDefinitionForm.defaultProps = {
  initialValues: {
    id: '',
    name: '',
    price: '',
  },
  onReset: null,
  onSubmit: null,
  onSubmitFailure: null,
  onSubmitSuccess: null,
  validationSchema: yupObject().shape({
    name: yupString().min(3).max(30).required(),
    price: yupNumber().min(0).required(),
  }),
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  createItem: ticketDefinitionsActions.createItem,
  updateItem: ticketDefinitionsActions.updateItem,
};

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),
)(TicketDefinitionForm);
