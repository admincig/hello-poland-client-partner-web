import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import Typography from '@material-ui/core/Typography/Typography';
import Button from '@material-ui/core/Button/Button';
import Dialog from '@material-ui/core/Dialog/Dialog';
import LinearProgress from '@material-ui/core/LinearProgress';
import MediaDropzone from './MediaDropzone';

class MediaManager extends Component {
  state = {
    fileType: null,
  };

  getErrorByFileType = (fileType) => {
    if (fileType) {
      const type = /image/.test(fileType) ? 'image' : fileType.toLowerCase();

      switch (type) {
        case 'image':
          return 'Obrazek powinien być w formacie JPEG, a jego szerokość musi wynosić minimum 2000px.';
        case 'application/pdf':
          return 'Niepoprawny format dokumentu.';
        default:
          return 'Wystąpił błąd podczas zapisywania pliku.';
      }
    }

    return '';
  };

  handleDrop = (acceptedFiles) => {
    const { onSubmit } = this.props;

    acceptedFiles.forEach((acceptedFile) => {
      const { arrayBuffer, metadata } = acceptedFile;
      const data = new Uint8Array(arrayBuffer);
      const options = {
        headers: {
          'content-type': metadata.type,
        },
        timeout: 0,
      };

      this.setState({
        fileType: metadata.type,
      });

      onSubmit({ data, options });
    });
  };

  render() {
    const {
      error, onClose, title, submitting, ...rest
    } = this.props;
    const { fileType } = this.state;

    return (
      <Dialog onClose={onClose} aria-labelledby="form-dialog-title" {...rest}>
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <MediaDropzone
            disabled={submitting}
            disableClick
            multiple={false}
            onDrop={this.handleDrop}
          />
          {submitting && <LinearProgress />}
        </DialogContent>
        <DialogActions>
          { error
            && (
            <Typography style={{ color: 'red' }}>
              {this.getErrorByFileType(fileType)}
            </Typography>
            )
          }
          <Button onClick={onClose} color="primary">Zamknij</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

MediaManager.propTypes = {
  error: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool,
  title: PropTypes.string,
};

MediaManager.defaultProps = {
  error: false,
  title: null,
  submitting: false,
};

export default MediaManager;
