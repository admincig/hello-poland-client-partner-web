import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _isEqual from 'lodash/isEqual';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

function serializeFormFields(formFields) {
  return Object.entries(formFields).reduce((acc, [key, value]) => {
    if (key.indexOf('.') !== -1) {
      const keys = key.split('.');
      const keyName = keys.shift();
      const nextPath = keys.join('.');

      return {
        ...acc,
        [keyName]: {
          ...acc[keyName],
          ...serializeFormFields({ [nextPath]: value }),
        },
      };
    }

    return {
      ...acc,
      [key]: value,
    };
  }, {});
}

function serializeFormSchema(schema, values, path = '') {
  return Object.entries(schema).reduce((acc, [sKey, sValue]) => {
    const key = path.length ? `${path}.${sKey}` : sKey;
    const value = (values && values[sKey]) || null;

    if (sValue && typeof sValue === 'object' && !Array.isArray(sValue)) {
      return {
        ...acc,
        ...serializeFormSchema(sValue, value, key),
      };
    }

    return {
      ...acc,
      [key]: value,
    };
  }, {});
}


class FormDialog extends Component {
  static getDerivedStateFromProps(props, state) {
    const { schema, values } = props;

    if (!_isEqual({}, schema)) {
      return {
        ...state,
        formFields: serializeFormSchema(schema, values),
      };
    }

    return null;
  }

  state = {
    formFields: {},
  };

  shouldComponentUpdate(nextProps) {
    const { schema } = this.props;
    const { schema: nextSchema } = nextProps;

    return !_isEqual(schema, nextSchema);
  }

  getDynamicFields = (formFields) => {
    if (Object.keys(formFields).length) {
      return Object.entries(formFields).map(([key, value]) => (
        <TextField
          fullWidth
          id={key}
          key={key}
          label={key}
          margin="normal"
          onChange={this.handleChange(key)}
          value={value !== null ? value : ''}
        />
      ));
    }

    return null;
  };

  handleChange = name => (event) => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleClose = () => {
    this.setState({ formFields: {} });
    this.props.onClose();
  };

  handleSubmit = (onSubmit) => {
    const { formFields } = this.state;

    onSubmit(serializeFormFields(formFields));
  };

  render() {
    const {
      onSubmit,
      schema,
      title,
      values,
      ...rest
    } = this.props;
    const { formFields } = this.state;

    return (
      <Dialog onClose={this.handleClose} aria-labelledby="form-dialog-title" {...rest}>
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        <DialogContent>
          {this.getDynamicFields(formFields)}
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            Anuluj
          </Button>
          <Button onClick={() => this.handleSubmit(onSubmit)} color="primary">
            Zapisz
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

FormDialog.propTypes = {
  onClose: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  schema: PropTypes.shape({}).isRequired,
  title: PropTypes.string.isRequired,
  values: PropTypes.shape({}),
};

FormDialog.defaultProps = {
  onClose: () => {},
  values: null,
};

export default FormDialog;
