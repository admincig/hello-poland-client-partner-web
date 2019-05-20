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

const commonProps = {
    fullWidth: true,
  };

class UsherForm extends Component {
    constructor(props) {
        super(props);
    
        // TODO: nested validation seems not working
        // TODO: see https://github.com/jaredpalmer/formik/issues/986
        this.validationSchema = yupObject().shape({
        });
      }

    render() {
        const { FormikProps, buttons } = this.props;
        return (
            <Formik
            enableReinitialize
            {...FormikProps}
            validationSchema={this.validationSchema}
            onSubmit={this.handleSubmit}>
            {({ isSubmitting, values }) => (
                <Form autoComplete="off" noValidate>
                    <Grid container spacing={16}>
                        <GridItem>
                            <Typography variant="h6">Partner jest jednocześnie bileterem</Typography>
                        </GridItem>
                        <GridItem>
                            <Field name="email" label="Email" hidden component={TextField} {...commonProps} />
                        </GridItem>
                        <GridItem>
                            <Field name="name" label="Nazwa" hidden component={TextField} {...commonProps} />
                        </GridItem>
                        <GridItem>
                            <Field name="password" label="Hasło" hidden component={TextField} {...commonProps} />
                        </GridItem>
                    </Grid>
                    {buttons
                    && (
                    <Grid container spacing={16}>
                        <GridItem md={2} sm={2}>
                            <Button variant="password" color="primary" type="submit" disabled={isSubmitting}>
                            Zapisz
                            </Button>
                        </GridItem>
                    </Grid>
                    )
                    }
                </Form>
                )}
            </Formik>
        )
    }
}

UsherForm.propTypes = {
    FormikProps: PropTypes.shape({}),
    initialValues: PropTypes.shape({}),
  };
  
  UsherForm.defaultProps = {
    FormikProps: null,
  };
  
  const mapStateToProps = () => ({});
  
  const mapDispatchToProps = {
    createItem: sightsActions.createItem,
    createTranslation: sightsActions.createTranslation,
    updateItem: sightsActions.updateItem,
  };

export default UsherForm;