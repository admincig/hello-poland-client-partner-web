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
  state = { fileType: null, fileName: null }
  handleDrop = (acceptedFiles) => {
    const { onSubmit } = this.props;

    acceptedFiles.forEach((acceptedFile) => {
      const { arrayBuffer, metadata } = acceptedFile;
      const data = new Uint8Array(arrayBuffer);
      const options = {
        headers: {
          'content-type': metadata.type,
        },
      };
      this.setState({ fileType: acceptedFile.metadata.type, fileName: acceptedFile.metadata.name });
      onSubmit({ data, options });
    });
  };

  render() {
    const {
      error, onClose, title, submitting, ...rest
    } = this.props;
    const { fileType, fileName } = this.state;
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
          { error &&
            <Typography style={{ color: 'red' }}>
              {fileType !== 'image/jpeg'
                ? `Niepoprawny format pliku ${fileName}`
                : 'Wystąpił błąd podczas zapisywania.'
              }
            </Typography>
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
