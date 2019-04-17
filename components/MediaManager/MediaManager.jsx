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
    processing: false,
  };

  componentDidUpdate(prevProps) {
    const { error: prevError, open: prevOpen } = prevProps;
    const { error, open } = this.props;

    if ((error && error !== prevError) || (open && open !== prevOpen)) {
      this.setProcessing(false);
    }
  }

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

  handleDropStart = () => this.setProcessing(true);

  render() {
    const {
      error, onClose, title, ...rest
    } = this.props;
    const { fileType, processing } = this.state;

    return (
      <Dialog onClose={this.handleClose} aria-labelledby="form-dialog-title" {...rest}>
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <MediaDropzone
            disabled={processing}
            disableClick
            multiple={false}
            onDrop={this.handleDrop}
            onDropStart={this.handleDropStart}
          />
          {processing && <LinearProgress />}
        </DialogContent>
        <DialogActions>
          { error
            && (
            <Typography style={{ color: 'red' }}>
              {this.getErrorByFileType(fileType)}
            </Typography>
            )
          }
          <Button onClick={this.handleClose} color="primary">Zamknij</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

MediaManager.propTypes = {
  error: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  open: PropTypes.bool,
  title: PropTypes.string,
};

MediaManager.defaultProps = {
  error: false,
  open: false,
  title: null,
};

export default MediaManager;
