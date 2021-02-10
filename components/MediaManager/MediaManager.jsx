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
      const formData = new FormData();
      formData.append('file', acceptedFile, acceptedFile.name);

      onSubmit({ data: formData });
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
          <MediaDropzone
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
                ? 'Obrazek powinien być w formacie JPEG, a jego szerokość musi wynosić minimum 2000px.'
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

MediaManager.propTypes = {
  error: PropTypes.bool,
  imageUpload: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  open: PropTypes.bool,
  title: PropTypes.string,
};

MediaManager.defaultProps = {
  error: false,
  imageUpload: false,
  open: false,
  title: null,
};

export default MediaManager;
