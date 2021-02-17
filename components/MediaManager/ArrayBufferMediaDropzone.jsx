import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography/Typography';

const readFileBuffer = file => new Promise((resolve, reject) => {
  const FR = new FileReader();

  FR.onloadend = event => resolve(event.target.result);
  FR.onerror = error => reject(error);

  FR.readAsArrayBuffer(file);
});

const styles = theme => ({
  dropzone: {
    border: `${theme.palette.grey['400']} dashed`,
    height: '100%',
    padding: theme.spacing.unit * 3,
  },
  dropzoneActive: {
    borderColor: theme.palette.grey['600'],
  },
  gridContainer: {
    alignItems: 'center',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'center',
  },
  gridSpacer: {
    padding: `${theme.spacing.unit * 2}px 0`,
  },
});

// TODO This component is kind of old thing. Kill it with fire if you have time,
// and migrate to MediaDropzone.jsx component which uses FormData instead of Uint8Array.
// The last usage of this component --> ArrayBufferMediaManager.jsx
class ArrayBufferMediaDropzone extends Component {
  constructor(props) {
    super(props);

    this.dropzoneRef = React.createRef();
  }

  handleDrop = (acceptedFiles, rejectedFiles) => {
    this.handleDropCallback(acceptedFiles, rejectedFiles);
  };

  async handleDropCallback(acceptedIncomingFiles, rejectedIncomingFiles) {
    const { onDrop } = this.props;

    const acceptedFiles = await Promise.all(acceptedIncomingFiles.map(async file => ({
      arrayBuffer: await readFileBuffer(file),
      metadata: file,
    })));

    const rejectedFiles = await Promise.all(rejectedIncomingFiles.map(async file => ({
      arrayBuffer: await readFileBuffer(file),
      metadata: file,
    })));

    onDrop(acceptedFiles, rejectedFiles);
  }

  render() {
    const {
      classes, disabled, onDrop, ...props
    } = this.props;

    return (
      <Dropzone
        activeClassName={classes.dropzoneActive}
        className={classes.dropzone}
        disabled={disabled}
        ref={this.dropzoneRef}
        {...props}
        onDrop={this.handleDrop}
      >
        <Grid container className={classes.gridContainer}>
          <Typography variant="h6">
            Przeciągnij plik tutaj
          </Typography>
          <Typography color="textSecondary" variant="subtitle1" className={classes.gridSpacer}>
            lub
          </Typography>
          <Button
            color="primary"
            disabled={disabled}
            onClick={() => this.dropzoneRef.current.open()}
            size="small"
            variant="contained"
          >
            Wybierz plik z komputera
          </Button>
        </Grid>
      </Dropzone>
    );
  }
}

ArrayBufferMediaDropzone.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  disabled: PropTypes.bool,
  onDrop: PropTypes.func.isRequired,
};

ArrayBufferMediaDropzone.defaultProps = {
  disabled: false,
};

export default withStyles(styles)(ArrayBufferMediaDropzone);
