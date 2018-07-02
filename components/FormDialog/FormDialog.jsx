import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import _isEqual from 'lodash/isEqual';

class FormDialog extends Component {
  state = {
    formFields: {},
  };

  componentDidMount() {
    this.setFormFields(this.props.formFields);
  }

  componentDidUpdate(prevProps) {
    const { formFields: prevFormFields } = prevProps;
    const { formFields } = this.props;

    if (!_isEqual(formFields, prevFormFields)) {
      this.setFormFields(this.props.formFields);
    }
  }

  getDynamicFields = (formFields) => {
    // console.log('getDynamicFields', formFields);
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

  setFormFields = formFields => this.setState({ formFields });

  handleChange = name => (event) => {
    const { formFields } = this.state;

    this.setState({
      formFields: {
        ...formFields,
        [name]: event.target.value,
      },
    });
  };

  handleClose = () => this.props.onClose();

  handleSubmit = formFields => this.props.onSubmit(formFields);

  render() {
    const {
      formFields,
      onSubmit,
      title,
      ...rest
    } = this.props;
    const { formFields: fields } = this.state;

    // console.log('render', formFields, fields);
    return (
      <Dialog onClose={this.handleClose} aria-labelledby="form-dialog-title" {...rest}>
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        <DialogContent>
          {this.getDynamicFields(fields)}
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            Anuluj
          </Button>
          <Button onClick={() => this.handleSubmit(fields)} color="primary">
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
  formFields: PropTypes.shape({}).isRequired,
  title: PropTypes.string.isRequired,
};

FormDialog.defaultProps = {
  onClose: () => {},
};

export default FormDialog;
