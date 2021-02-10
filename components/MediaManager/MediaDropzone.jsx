import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography/Typography';

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

class MediaDropzone extends Component {
  constructor(props) {
    super(props);

    this.dropzoneRef = React.createRef();
  }

  handleDrop = (acceptedFiles, rejectedFiles) => {
    this.handleDropCallback(acceptedFiles, rejectedFiles);
  };

  async handleDropCallback(acceptedIncomingFiles, rejectedIncomingFiles) {
    const { onDrop } = this.props;

    onDrop(acceptedIncomingFiles, rejectedIncomingFiles);
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

MediaDropzone.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  disabled: PropTypes.bool,
  onDrop: PropTypes.func.isRequired,
};

MediaDropzone.defaultProps = {
  disabled: false,
};

export default withStyles(styles)(MediaDropzone);
