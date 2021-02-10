import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton/IconButton';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import { DEFAULT_LANGUAGE } from 'utils/translations';
import AlertDialog from 'components/AlertDialog';
import MediaManager from 'components/MediaManager';
import MultimediaSection from 'components/Multimedia/Section';

const UPLOAD_TYPE = {
  ATTACHMENT: 'ATTACHMENT',
  GALLERY_IMAGE: 'GALLERY_IMAGE',
  MAIN_IMAGE: 'MAIN_IMAGE',
};

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

class MultimediaForm extends React.Component {
  state = {
    alertDialog: {
      content: '',
      open: false,
      title: '',
      onSuccess: null,
    },
    mediaManager: false,
    mediaManagerData: {},
    uploadError: false,
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
      content: `Plik ${name} zostanie trwale usunięty i nie będzie można go przywrócić.`,
      open: true,
      title: 'Czy na pewno usunąć wybrany plik?',
    };

    if (type === UPLOAD_TYPE.ATTACHMENT) {
      alertDialog.onSuccess = () => {
        this.handleAttachmentDelete(fileId);
        this.handleAlertDialogCancel();
      };
    } else if (type === UPLOAD_TYPE.GALLERY_IMAGE) {
      alertDialog.onSuccess = () => {
        this.handleImageDelete(fileId);
        this.handleAlertDialogCancel();
      };
    }

    this.setState({ alertDialog });
  };

  handleImageDelete = (imageId) => {
    const { ImageGalleryProps, itemId } = this.props;
    const { deleteFile } = ImageGalleryProps || {};

    if (deleteFile) {
      deleteFile({
        id: imageId,
        itemId,
        onFailure: this.handleImageDeleteFailure,
        onSuccess: this.handleImageDeleteSuccess,
      });
    }
  };

  handleImageDeleteFailure = () => {
    const { onFailure } = this.props;

    if (onFailure) {
      onFailure();
    }
  };

  handleImageDeleteSuccess = () => {
    const { onSuccess } = this.props;

    if (onSuccess) {
      onSuccess();
    }
  };

  handleAttachmentDelete = () => {
    const { AttachmentProps, itemId } = this.props;
    const { deleteFile } = AttachmentProps || {};

    if (deleteFile) {
      deleteFile({
        id: itemId,
        onFailure: this.handleAttachmentDeleteFailure,
        onSuccess: this.handleAttachmentDeleteSuccess,
      });
    }
  };

  handleAttachmentDeleteFailure = () => {
    const { onFailure } = this.props;

    if (onFailure) {
      onFailure();
    }
  };

  handleAttachmentDeleteSuccess = () => {
    const { onSuccess } = this.props;

    if (onSuccess) {
      onSuccess();
    }
  };

  handleMediaManagerClose = () => {
    const {
      AttachmentProps, ImageGalleryProps, MainImageProps, onFailure, onSuccess,
    } = this.props;
    const { mediaManagerData } = this.state;
    const { uploadType } = mediaManagerData;
    let action = () => {};

    this.setState({
      mediaManager: false,
      mediaManagerData: {},
      uploadError: false,
    });

    if (uploadType === UPLOAD_TYPE.ATTACHMENT) {
      const { createFileCancel } = AttachmentProps;
      action = createFileCancel;
    } else if (uploadType === UPLOAD_TYPE.GALLERY_IMAGE) {
      const { createFileCancel } = ImageGalleryProps;
      action = createFileCancel;
    } else if (uploadType === UPLOAD_TYPE.MAIN_IMAGE) {
      const { createFileCancel } = MainImageProps;
      action = createFileCancel;
    }

    if (action) {
      action({
        onFailure: () => onFailure && onFailure(),
        onSuccess: () => onSuccess && onSuccess(),
      });
    }

    if (onSuccess) {
      onSuccess();
    }
  };

  handleMediaManagerSubmit = ({ data, options }) => {
    const { AttachmentProps, ImageGalleryProps, MainImageProps } = this.props;
    const { mediaManagerData } = this.state;
    const { uploadType, itemId } = mediaManagerData;
    let action = () => {};

    this.setState({ uploadError: false });

    if (uploadType === UPLOAD_TYPE.ATTACHMENT) {
      const { createFile } = AttachmentProps;
      action = createFile;
    } else if (uploadType === UPLOAD_TYPE.GALLERY_IMAGE) {
      const { createFile } = ImageGalleryProps;
      action = createFile;
    } else if (uploadType === UPLOAD_TYPE.MAIN_IMAGE) {
      const { createFile } = MainImageProps;
      action = createFile;
    }

    if (action) {
      action({
        id: itemId,
        data,
        options,
        onFailure: this.handleMediaManagerSubmitFailure,
        onSuccess: this.handleMediaManagerSubmitSuccess,
      });
    }
  };

  handleMediaManagerSubmitFailure = () => {
    this.setState({ uploadError: true });
  };

  handleMediaManagerSubmitSuccess = () => {
    const { onSuccess } = this.props;

    this.setState({ uploadError: false });

    if (onSuccess) {
      onSuccess();
    }

    this.handleMediaManagerClose();
  };

  handleUploadModalOpen = (itemId, uploadType) => this.setState({
    mediaManager: true,
    mediaManagerData: {
      itemId,
      uploadType,
    },
  });

  render() {
    const {
      alertDialog, mediaManager, mediaManagerData, uploadError,
    } = this.state;
    const {
      classes, AttachmentProps, ImageGalleryProps, MainImageProps, defaultTranslation, itemId,
      translation,
    } = this.props;
    const isDefaultTranslation = defaultTranslation === translation;

    return (
      <React.Fragment>
        {MainImageProps && (
          <div className={classes.section}>
            <Grid container alignItems="center" justify="space-between">
              <Grid item>
                <Typography variant="h6">Zdjęcie promocyjne</Typography>
              </Grid>
              {MainImageProps.createFile && (
                <Grid item>
                  <IconButton
                    aria-label="Dodaj"
                    disabled={!isDefaultTranslation}
                    onClick={() => this.handleUploadModalOpen(itemId, UPLOAD_TYPE.MAIN_IMAGE)}
                    title="Dodaj"
                  >
                    <AddIcon />
                  </IconButton>
                </Grid>
              )}
            </Grid>
            <MultimediaSection
              items={MainImageProps.item ? [MainImageProps.item] : []}
              sectionType={UPLOAD_TYPE.MAIN_IMAGE}
            />
          </div>
        )}
        {ImageGalleryProps && (
          <div className={classes.section}>
            <Grid container alignItems="center" justify="space-between">
              <Grid item>
                <Typography variant="h6">Galeria zdjęć</Typography>
              </Grid>
              {ImageGalleryProps.createFile && (
                <Grid item>
                  <IconButton
                    aria-label="Dodaj"
                    disabled={!isDefaultTranslation}
                    onClick={() => this.handleUploadModalOpen(itemId, UPLOAD_TYPE.GALLERY_IMAGE)}
                    title="Dodaj"
                  >
                    <AddIcon />
                  </IconButton>
                </Grid>
              )}
            </Grid>
            <MultimediaSection
              items={ImageGalleryProps.items}
              sectionType={UPLOAD_TYPE.GALLERY_IMAGE}
              onDelete={this.handleDelete}
            />
          </div>
        )}
        {AttachmentProps && (
          <div className={classes.section}>
            <Grid container alignItems="center" justify="space-between">
              <Grid item>
                <Typography variant="h6">Pliki</Typography>
              </Grid>
              {AttachmentProps.createFile && (
                <Grid item>
                  <IconButton
                    aria-label="Dodaj"
                    disabled={!isDefaultTranslation}
                    onClick={() => this.handleUploadModalOpen(itemId, UPLOAD_TYPE.ATTACHMENT)}
                    title="Dodaj"
                  >
                    <AddIcon />
                  </IconButton>
                </Grid>
              )}
            </Grid>
            <MultimediaSection
              items={AttachmentProps.items}
              sectionType={UPLOAD_TYPE.ATTACHMENT}
              onDelete={this.handleDelete}
            />
          </div>
        )}
        <MediaManager
          disableBackdropClick
          error={uploadError}
          imageUpload={mediaManagerData.uploadType !== UPLOAD_TYPE.ATTACHMENT}
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

MultimediaForm.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  AttachmentProps: PropTypes.shape({
    createAttachment: PropTypes.func,
    createAttachmentCancel: PropTypes.func,
    deleteAttachment: PropTypes.func,
    items: PropTypes.arrayOf(PropTypes.shape({})),
  }),
  defaultTranslation: PropTypes.string,
  ImageGalleryProps: PropTypes.shape({
    createImage: PropTypes.func,
    createImageCancel: PropTypes.func,
    deleteFile: PropTypes.func,
    items: PropTypes.arrayOf(PropTypes.shape({})),
  }),
  itemId: PropTypes.number.isRequired,
  MainImageProps: PropTypes.shape({
    createMainImage: PropTypes.func,
    createMainImageCancel: PropTypes.func,
    item: PropTypes.shape({}),
  }),
  onFailure: PropTypes.func,
  onSuccess: PropTypes.func,
  translation: PropTypes.string,
};

MultimediaForm.defaultProps = {
  AttachmentProps: null,
  defaultTranslation: DEFAULT_LANGUAGE,
  ImageGalleryProps: null,
  MainImageProps: null,
  onFailure: null,
  onSuccess: null,
  translation: DEFAULT_LANGUAGE,
};

export default withStyles(styles)(MultimediaForm);
