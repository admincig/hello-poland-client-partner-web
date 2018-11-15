import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography/Typography';
import SightForm from './Form';

class SightFormDialog extends Component {
  handleSubmit = (values, actions) => {
    console.log('SightFormDialog submit', values, actions);
  };

  render() {
    const {
      error, onClose, onSubmit, sightId, title, ...rest
    } = this.props;

    return (
      <Dialog onClose={onClose} aria-labelledby="form-dialog-title" {...rest}>
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <SightForm onSubmit={this.handleSubmit} />
        </DialogContent>
        <DialogActions>
          {error &&
          <Typography style={{ color: 'red' }}>
            Wystąpił błąd podczas zapisywania.
          </Typography>
          }
          <Button onClick={onClose} color="primary">Anuluj</Button>
          <Button onClick={onSubmit} color="primary">Zapisz</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

SightFormDialog.propTypes = {
  error: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  sightId: PropTypes.number,
  title: PropTypes.string,
};

SightFormDialog.defaultProps = {
  error: false,
  onClose: null,
  onSubmit: null,
  sightId: null,
  title: null,
};

export default SightFormDialog;
