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

  handleDelete = (fileId, { name }) => {
    const alertDialog = {
      content: `Plik ${name} zostanie trwale usunięty i nie będzie można go przywrócić.`,
      open: true,
      title: 'Czy na pewno usunąć wybrany plik?',
      onSuccess: () => {
        this.handleFileDelete(fileId);
        this.handleAlertDialogCancel();
      },
    };

    this.setState({ alertDialog });
  };

  handleFileDelete = (fileId) => {
    const { deleteFile } = this.props;

    if (deleteFile) {
      deleteFile({
        id: fileId,
        onFailure: this.handleFileDeleteFailure,
        onSuccess: this.handleFileDeleteSuccess,
      });
    }
  }

  handleFileDeleteFailure = () => {
    const { onFailure } = this.props;

    if (onFailure) {
      onFailure();
    }
  };

  handleFileDeleteSuccess = () => {
    const { onSuccess } = this.props;

    if (onSuccess) {
      onSuccess();
    }
  };

  handleMediaManagerClose = ({ shouldNotRunOnSuccessCallback = false }) => {
    const {
      createFileCancel, onFailure, onSuccess,
    } = this.props;

    this.setState({
      mediaManager: false,
      mediaManagerData: {},
      uploadError: false,
    });

    if (createFileCancel) {
      createFileCancel({
        onFailure: () => onFailure && onFailure(),
        onSuccess: () => onSuccess && onSuccess(),
      });
    }

    if (onSuccess && !shouldNotRunOnSuccessCallback) {
      onSuccess();
    }
  };

  handleMediaManagerSubmit = ({ data, options }) => {
    const { createFile } = this.props;
    const { mediaManagerData } = this.state;
    const { itemId } = mediaManagerData;

    this.setState({ uploadError: false });

    if (createFile) {
      createFile({
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

  handleMediaManagerSubmitSuccess = (data) => {
    const {
      onSuccess, ImageGalleryProps, AttachmentProps,
    } = this.props;
    const { mediaManagerData } = this.state;
    const { uploadType } = mediaManagerData || {};
    let multimedia = {};

    if (uploadType === UPLOAD_TYPE.MAIN_IMAGE) {
      const mainImage = data.images[0];
      const { id, ...downloadUrl } = mainImage || {};
      const mainImageMeta = {
        id, name: 'Zdjęcie promocyjne', type: 'image/jpeg', downloadUrl,
      };
      multimedia = { mainImage: { id: mainImage.id, ...mainImageMeta } };
    } else if (uploadType === UPLOAD_TYPE.GALLERY_IMAGE) {
      const images = data.images.map((image) => {
        const { id, ...downloadUrl } = image;
        return ({
          id, name: `Zdjęcie galerii (id #${image.id})`, type: 'image/jpeg', downloadUrl,
        });
      });
      multimedia = { images: [...ImageGalleryProps.items, ...images] };
    } else {
      const files = data.files.map((file) => {
        const { id, ...fileData } = file;
        return ({
          id, type: 'application/pdf', ...fileData,
        });
      });
      multimedia = { files: [...AttachmentProps.items, ...files] };
    }

    this.setState({ uploadError: false });

    if (onSuccess) {
      onSuccess(multimedia);
    }

    this.handleMediaManagerClose({ shouldNotRunOnSuccessCallback: true });
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
      translation, createFile,
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
              {createFile && (
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
              {createFile && (
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
              {createFile && (
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
  createFile: PropTypes.func,
  createFileCancel: PropTypes.func,
  deleteFile: PropTypes.func,
  AttachmentProps: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape({})),
  }),
  defaultTranslation: PropTypes.string,
  ImageGalleryProps: PropTypes.shape({
    items: PropTypes.arrayOf(PropTypes.shape({})),
  }),
  itemId: PropTypes.number,
  MainImageProps: PropTypes.shape({
    item: PropTypes.shape({}),
  }),
  onFailure: PropTypes.func,
  onSuccess: PropTypes.func,
  translation: PropTypes.string,
};

MultimediaForm.defaultProps = {
  createFile: null,
  createFileCancel: null,
  AttachmentProps: null,
  defaultTranslation: DEFAULT_LANGUAGE,
  deleteFile: null,
  ImageGalleryProps: null,
  itemId: null,
  MainImageProps: null,
  onFailure: null,
  onSuccess: null,
  translation: DEFAULT_LANGUAGE,
};

export default withStyles(styles)(MultimediaForm);
