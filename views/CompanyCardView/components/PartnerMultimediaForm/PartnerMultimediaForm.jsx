import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton/IconButton';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import {
  actions as partnersActions,
  selectors as partnersSelectors,
} from 'redux/partners';
import { DEFAULT_LANGUAGE } from 'utils/translations';
import AlertDialog from 'components/AlertDialog';
import ArrayBufferMediaManager from 'components/MediaManager/ArrayBufferMediaManager';
import MultimediaSection from './Section';

const styles = theme => ({
  fetchButton: {
    marginTop: theme.spacing.unit * 3,
  },
  image: {
    color: theme.palette.grey[500],
    fontSize: theme.spacing.unit * 10,
  },
  section: {
    '& ~ &': {
      marginTop: theme.spacing.unit * 5,
    },
  },
});

class PartnerMultimediaForm extends React.Component {
  state = {
    alertDialog: {
      content: '',
      open: false,
      title: '',
      onSuccess: null,
    },
    mediaManager: false,
    mediaManagerData: {},
  };

  handleAlertDialogCancel = () => this.setState({
    alertDialog: {
      content: '',
      open: false,
      title: '',
      onSuccess: null,
    },
  });

  handleDelete = (fileId, { name, type }) => {
    const alertDialog = {
      content: `Plik ${name} zostanie trwale usunięty i nie będzie można go przywrócic.`,
      open: true,
      title: 'Czy na pewno usunąć wybrany plik?',
    };

    if (type !== 'image/jpeg') {
      alertDialog.onSuccess = () => {
        this.handleDeletePDF(fileId);
        this.handleAlertDialogCancel();
      };
    }

    this.setState({ alertDialog });
  };

  handleMediaManagerClose = () => {
    const { clearError, createMainImageCancel } = this.props;
    const { mediaManagerData } = this.state;
    const { fileType } = mediaManagerData;
    let action = () => {};

    this.setState({
      mediaManager: false,
      mediaManagerData: {},
    });

    if (fileType === 'image/jpeg') {
      action = createMainImageCancel;
    }

    action();
    clearError();
  };

  handleMediaManagerSubmitFailure = () => {
    const { onFailure } = this.props;

    if (onFailure) {
      onFailure();
    }
  };

  handleMediaManagerSubmitSuccess = () => {
    const { onSuccess } = this.props;

    if (onSuccess) {
      onSuccess();
    }

    this.handleMediaManagerClose();
  };

  handleMediaManagerSubmit = ({ data, options }) => {
    const { createMainImage } = this.props;
    const { mediaManagerData } = this.state;
    const { fileType } = mediaManagerData;
    let action = () => {};

    if (fileType === 'image/jpeg') {
      action = createMainImage;
    }

    action({
      data,
      options,
      onFailure: this.handleMediaManagerSubmitFailure,
      onSuccess: this.handleMediaManagerSubmitSuccess,
    });
  };

  handleUploadModalOpen = fileType => this.setState({
    mediaManager: true,
    mediaManagerData: {
      fileType,
    },
  });

  render() {
    const { alertDialog, mediaManager } = this.state;
    const {
      classes, data, defaultTranslation, requestError, translation,
    } = this.props;
    const isDefaultTranslation = defaultTranslation === translation;
    const images = (data && data.filter(item => item.type === 'image/jpeg')) || [];

    return (
      <React.Fragment>
        <div className={classes.section}>
          <Grid container alignItems="center" justify="space-between">
            <Grid item>
              <Typography variant="h6">Obrazy</Typography>
            </Grid>
            <Grid item>
              <IconButton
                aria-label="Dodaj"
                disabled={!isDefaultTranslation}
                onClick={() => this.handleUploadModalOpen('image/jpeg')}
                title="Dodaj"
              >
                <AddIcon />
              </IconButton>
            </Grid>
          </Grid>
          <MultimediaSection items={images} onDelete={this.handleDelete} />
        </div>
        <ArrayBufferMediaManager
          disableBackdropClick
          error={!!requestError}
          onClose={this.handleMediaManagerClose}
          onSubmit={this.handleMediaManagerSubmit}
          open={mediaManager}
          title="Dodaj multimedia"
        />
        <AlertDialog
          onCancel={this.handleAlertDialogCancel}
          {...alertDialog}
        />
      </React.Fragment>
    );
  }
}

PartnerMultimediaForm.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  clearError: PropTypes.func.isRequired,
  createMainImage: PropTypes.func.isRequired,
  createMainImageCancel: PropTypes.func.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({})),
  defaultTranslation: PropTypes.string,
  onFailure: PropTypes.func,
  onSuccess: PropTypes.func,
  translation: PropTypes.string,
  requestError: PropTypes.shape({
    message: PropTypes.string,
  }),
};

PartnerMultimediaForm.defaultProps = {
  data: [],
  defaultTranslation: DEFAULT_LANGUAGE,
  onFailure: null,
  onSuccess: null,
  translation: DEFAULT_LANGUAGE,
  requestError: null,
};

const mapStateToProps = state => ({
  requestError: partnersSelectors.getError(state),
});

const mapDispatchToProps = {
  clearError: partnersActions.clearError,
  createMainImage: partnersActions.createMainImage,
  createMainImageCancel: partnersActions.createMainImageCancel,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(PartnerMultimediaForm);
