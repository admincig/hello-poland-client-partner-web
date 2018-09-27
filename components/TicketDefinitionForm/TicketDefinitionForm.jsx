import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import _isNumber from 'lodash/isNumber';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import yupObject from 'yup/lib/object';
import yupString from 'yup/lib/string';
import yupNumber from 'yup/lib/number';
import SwitchLabel from 'components/SwitchLabel';
import { actions as ticketDefinitionsActions } from 'redux/ticketDefinitions';

const GridItem = ({ children, ...props }) => (
  <Grid item md={6} sm={6} xs={12} {...props}>
    {children}
  </Grid>
);

GridItem.propTypes = {
  children: PropTypes.node.isRequired,
};

const commonProps = {
  fullWidth: true,
  margin: 'normal',
};

const styles = () => ({
  limit: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
});

class TicketDefinitionForm extends Component {
  constructor(props) {
    super(props);

    const { initialValues: { availableTicketsNumber } } = props;

    this.state = {
      hasTicketLimit: _isNumber(availableTicketsNumber) && availableTicketsNumber > 0,
    };
  }

  handleLimitChange = hasTicketLimit => this.setState({ hasTicketLimit });

  handleReset = (values, formikActions) => {
    const { onReset } = this.props;

    this.handleLimitChange(false);

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
    const { availableTicketsNumber } = data;
    const hasTicketLimit = _isNumber(availableTicketsNumber) && availableTicketsNumber > 0;
    const payload = {
      data: {
        ...data,
        availableTicketsNumber: hasTicketLimit ? availableTicketsNumber : -1,
        price: parseInt(data.price * 100, 10),
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

  handleSubmitSuccess = formikActions => () => {
    const { onSubmitSuccess } = this.props;

    if (onSubmitSuccess) {
      onSubmitSuccess(formikActions);

      return;
    }

    const { resetForm, setSubmitting } = formikActions;

    setSubmitting(false);
    resetForm();
    this.handleLimitChange(false);
  };

  render() {
    const { hasTicketLimit } = this.state;
    const {
      classes, createItem, onReset, onSubmit, onSubmitFailure, onSubmitSuccess, updateItem, ...props
    } = this.props;


    return (
      <Formik
        {...props}
        onSubmit={this.handleSubmit}
        onReset={this.handleReset}
      >
        {({ isSubmitting }) => (
          <Form autoComplete="off" noValidate>
            <Grid container spacing={16}>
              <Hidden xlDown implementation="css">
                <Field component={TextField} name="id" type="hidden" {...commonProps} />
              </Hidden>
              <GridItem md={12} sm={12}>
                <Field component={TextField} label="Nazwa (np. Normalny)" name="name" required {...commonProps} />
              </GridItem>
              <GridItem md={5} sm={5}>
                <Field component={TextField} label="Cena (PLN)" name="price" type="number" required {...commonProps} />
              </GridItem>
              <GridItem md={2} sm={2} className={classes.limit}>
                <SwitchLabel
                  disabled={isSubmitting}
                  label="Limit biletów"
                  name="hasTicketLimit"
                  onChange={(event, checked) => this.handleLimitChange(checked)}
                  value={hasTicketLimit}
                />
              </GridItem>
              <GridItem md={5} sm={5}>
                {hasTicketLimit &&
                  <Field
                    {...commonProps}
                    component={TextField}
                    label="Liczba biletów"
                    name="availableTicketsNumber"
                    type="number"
                  />
                }
              </GridItem>
            </Grid>
            <Button variant="contained" color="primary" type="submit" disabled={isSubmitting}>
              Dodaj
            </Button>
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
    availableTicketsNumber: '',
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
    availableTicketsNumber: yupNumber().min(1),
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
