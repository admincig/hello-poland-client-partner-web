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
import {
    actions as ushersActions,
    selectors as ushersSelectors,
  } from '../../../redux/ushers';
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
            name: yupString()
                .min(3)
                .max(250),
            email: yupString().email().trim().required(),
            //password: skopiuj z biletera
        });

        this.initialValues = {
            email: '',
            name: '',
            password: '',
        }
      }

      handleSubmit = (values, actions) => {
        const { onSubmit } = this.props;
    
        if (onSubmit) {
          onSubmit(values, actions);
    
          return;
        }
        
        const { ...data } = values;
        const { createItem } = this.props;
        let action = createItem;
        const payload = {
          data,
          onFailure: this.handleSubmitFailure(actions),
          onSuccess: this.handleSubmitSuccess(actions),
        };
        
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
    
      handleSubmitSuccess = actions => (usherId) => {
        const { onSubmitSuccess } = this.props;
    
        if (onSubmitSuccess) {
          onSubmitSuccess(usherId, actions);
    
          return;
        }
    
        const { resetForm, setSubmitting } = actions;
    
        setSubmitting(false);
        resetForm();
      };

    render() {
        const { FormikProps } = this.props;
        return (
            <Formik
            enableReinitialize
            {...FormikProps}
            validationSchema={this.validationSchema}
            initialValues={this.initialValues}
            onSubmit={this.handleSubmit}>
                <Form autoComplete="off" noValidate>
                    <Grid container spacing={16}>
                        <GridItem>
                            <Typography variant="h6">Partner jest jednocześnie bileterem</Typography>
                        </GridItem>
                        <GridItem>
                            <Field name="email" label="Email" component={TextField} {...commonProps} />
                        </GridItem>
                        <GridItem>
                            <Field name="name" label="Nazwa" component={TextField} {...commonProps} />
                        </GridItem>
                        <GridItem>
                            <Field name="password" type="password" label="Hasło" component={TextField} {...commonProps} />
                        </GridItem>
                    </Grid>
                </Form>
            </Formik>
        )
    }
}

UsherForm.propTypes = {
    createItem: PropTypes.func.isRequired,
    FormikProps: PropTypes.shape({}),
    onSubmitFailure: PropTypes.func,
    onSubmitSuccess: PropTypes.func,
    onSubmit: PropTypes.func,
  };
  
  UsherForm.defaultProps = {
    FormikProps: null,
    onSubmitFailure: null,
    onSubmitSuccess: null,
    onSubmit: null,
  };
  
  const mapStateToProps = () => ({});
  
  const mapDispatchToProps = {
    createItem: ushersActions.createItem,
  };

export default connect(mapStateToProps, mapDispatchToProps)(UsherForm);