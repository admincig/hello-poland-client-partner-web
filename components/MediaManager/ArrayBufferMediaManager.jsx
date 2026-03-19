import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import Typography from '@material-ui/core/Typography/Typography';
import Button from '@material-ui/core/Button/Button';
import Dialog from '@material-ui/core/Dialog/Dialog';
import LinearProgress from '@material-ui/core/LinearProgress';
import ArrayBufferMediaDropzone from './ArrayBufferMediaDropzone';

// TODO This component is kind of old thing. Kill it with fire if you have time,
// and migrate to MediaManager.jsx component which uses FormData instead of Uint8Array.
// The last usage of this component --> PartnerMultimediaForm.jsx
class ArrayBufferMediaManager extends Component {
  state = {
    processing: false,
  };

  componentDidUpdate(prevProps) {
    const { error: prevError, open: prevOpen } = prevProps;
    const { error, open } = this.props;

    if ((error && error !== prevError) || (open && open !== prevOpen)) {
      this.setProcessing(false);
    }
  }

  setProcessing = processing => this.setState({ processing });

  handleClose = () => {
    const { processing } = this.state;
    const { onClose } = this.props;

    if (processing) {
      this.setProcessing(false);
    }

    if (onClose) {
      onClose();
    }
  };

  handleDrop = (acceptedFiles) => {
    const { onSubmit } = this.props;

    this.handleDropStart();

    acceptedFiles.forEach((acceptedFile) => {
      const { arrayBuffer, metadata } = acceptedFile;
      const data = new Uint8Array(arrayBuffer);
      const options = {
        headers: {
          'content-type': metadata.type,
        },
        timeout: 0,
      };

      onSubmit({ data, options });
    });
  };

  handleDropStart = () => this.setProcessing(true);

  render() {
    const {
      error, imageUpload, onClose, title, ...rest
    } = this.props;
    const { processing } = this.state;

    return (
      <Dialog onClose={this.handleClose} aria-labelledby="form-dialog-title" {...rest}>
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <ArrayBufferMediaDropzone
            disabled={processing}
            disableClick
            multiple={false}
            onDrop={this.handleDrop}
          />
          {processing && <LinearProgress />}
        </DialogContent>
        <DialogActions>
          { error
            && (
            <Typography style={{ color: 'red' }}>
              {imageUpload
                ? 'Obrazek powinien być w formacie JPEG, a jego szerokość musi wynosić minimum 1000px.'
                : 'Wystąpił błąd podczas zapisywania pliku.'
              }
            </Typography>
            )
          }
          <Button onClick={this.handleClose} color="primary">Zamknij</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

ArrayBufferMediaManager.propTypes = {
  error: PropTypes.bool,
  imageUpload: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  open: PropTypes.bool,
  title: PropTypes.string,
};

ArrayBufferMediaManager.defaultProps = {
  error: false,
  imageUpload: false,
  open: false,
  title: null,
};

export default ArrayBufferMediaManager;
