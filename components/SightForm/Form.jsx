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
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
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

    this.state = {
      initialValues: this.getInitialValues(initialValues),
    };

    // TODO: nested validation seems not working
    // TODO: see https://github.com/jaredpalmer/formik/issues/986
    this.validationSchema = yupObject().shape({
      date: yupString().required(),
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
    const { date, poolId, sightEventId } = initialValues || {};

    return {
      date: date || '',
      poolId: poolId || '',
      sightEventId: sightEventId || '',
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
    const { buttons, FormikProps } = this.props;

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
              <Hidden xsUp>
                <GridItem>
                  <Field name="poolId" hidden component={TextField} {...commonProps} />
                </GridItem>
                <GridItem>
                  <Field name="sightEventId" hidden component={TextField} {...commonProps} />
                </GridItem>
              </Hidden>
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

SightForm.propTypes = {
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

SightForm.defaultProps = {
  buttons: true,
  FormikProps: null,
  initialValues: null,
  onSubmit: null,
  onSubmitFailure: null,
  onSubmitSuccess: null,
};

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  createItem: sightsActions.createItem,
  updateItem: sightsActions.updateItem,
};

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),
)(SightForm);
