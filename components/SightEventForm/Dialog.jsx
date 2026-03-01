import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import _sortedUniq from 'lodash/sortedUniq';
import { compose } from 'redux';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography/Typography';
import {
  actions as categoriesActions,
  selectors as categoriesSelectors,
} from '@hello-poland/commons/redux/categories';
import {
  actions as tagsActions,
  selectors as tagsSelectors,
} from '@hello-poland/commons/redux/tags';
import {
  actions as sightEventsActions,
  selectors as sightEventsSelectors,
} from '@hello-poland/commons/redux/sightEvents';
import {
  CONTENT_LANGUAGES, DEFAULT_LANGUAGE, getLanguageLabel, getTranslatedLanguages,
  getUntranslatedLanguages,
} from 'utils/translations';
import AlertDialog from 'components/AlertDialog';
import ContentLanguage from 'components/ContentLanguage';
import CreateTranslationDialog from 'components/ContentLanguage/CreateTranslationDialog';
import GridItem from 'components/GridItem';
import CategoriesForm from 'components/CategoriesForm';
import TagsForm from 'components/TagsForm';
import MultimediaForm from 'components/Multimedia/MultimediaForm';
import { actions as filesActions } from '@hello-poland/commons/redux/files';
import SightForm from './Form';
import i18n from './i18n/pl-PL';

const ITEM_DATA_TYPES = {
  CATEGORY: 'CATEGORY',
  TAG: 'TAG',
};

const styles = () => ({
  section: {
    marginBottom: 40,
  },
});

class SightEventFormDialog extends Component {
  constructor(props) {
    super(props);
    this.isEditBeforeSubmit = false;

    this.formikRef = React.createRef();

    this.intervalRef = null;

    this.state = {
      alertDialog: {
        content: null,
        onSuccess: null,
        open: false,
        title: null,
      },
      fetchingError: false,
      isFetching: false,
      isSubmitting: false,
      language: DEFAULT_LANGUAGE,
      submittingError: false,
      translationDialog: {
        open: false,
        translations: [],
      },
      translations: CONTENT_LANGUAGES,
      uploadedMultimedia: { images: [], mainImage: {}, pdfAttachment: {} },
      formChanges: null,
    };
  }


  componentDidMount() {
    this.handleFetchCategoriesList(DEFAULT_LANGUAGE);
    this.handleFetchTagsList(DEFAULT_LANGUAGE);
  }

  componentDidUpdate() {
    if (this.shouldComponentFetch()) {
      const { itemId } = this.props;
      const { language } = this.state;

      this.handleFetchItem(itemId, language);
    }
  }

  componentWillUnmount() {
    if (this.intervalRef) {
      clearInterval(this.intervalRef);
    }
  }

  getInitialValues = (item) => {
    const { itemId, parentId } = this.props;
    const { language, formChanges } = this.state;
    const sightId = item && item.sightId ? item.sightId : parentId;

    if (this.isItemLoaded(itemId, item)) {
      const { availableLanguageVersions } = item;
      const hasNewTranslation = !availableLanguageVersions.some(lng => lng === language);

      if (hasNewTranslation) {
        return { id: itemId, sightId };
      }

      if (formChanges) {
        return { ...item, sightId, ...formChanges };
      }

      return { ...item, sightId };
    }

    if (formChanges) {
      return { sightId, ...formChanges };
    }

    return { sightId, categories: [], tags: [] };
  };

  getMultimediaFromItem = (item) => {
    const { images, mainImage, pdfAttachment } = item;
    const data = {};

    if (mainImage) {
      const { id, ...downloadUrl } = mainImage;

      data.mainImage = {
        id,
        name: 'Zdjęcie promocyjne',
        type: 'image/jpeg',
        downloadUrl,
      };
    }

    if (Array.isArray(images)) {
      data.images = images.map((image) => {
        const { id, ...downloadUrl } = image;
        return {
          id,
          name: `Zdjęcie galerii (id #${id})`,
          type: 'image/jpeg',
          downloadUrl,
        };
      });
    }

    if (pdfAttachment) {
      data.pdfAttachment = {
        ...pdfAttachment,
        type: 'PDF',
      };
    }

    return data;
  };

  handleAlertDialogCancel = () => this.setState(state => ({
    alertDialog: {
      ...state.alertDialog,
      open: false,
    },
  }));

  handleAlertDialogExited = () => this.setState({
    alertDialog: {
      content: null,
      onSuccess: null,
      open: false,
      title: null,
    },
  });

  handleAlertDialogOpen = (sightEventId, name) => this.setState({
    alertDialog: {
      content: `Plik ${name} zostanie trwale usunięty i nie będzie można go przywrócić.`,
      onSuccess: () => {
        this.handleDeletePDF(sightEventId);
        this.handleAlertDialogCancel();
      },
      open: true,
      title: 'Czy na pewno usunąć wybrany plik?',
    },
  });

  handleCancelClick = () => {
    this.handleFormReload(this.handleCancel);
  };

  handleCancel = () => {
    const { clearItem, onClose } = this.props;

    this.setState({
      fetchingError: false,
      isFetching: false,
      isSubmitting: false,
      language: DEFAULT_LANGUAGE,
      submittingError: false,
      translations: CONTENT_LANGUAGES,
      uploadedMultimedia: { images: [], mainImage: {}, pdfAttachment: {} },
      formChanges: null,
    });

    clearItem();

    if (onClose) {
      onClose();
    }
  };

  handleCreateTranslationDialogCancel = () => this.setState({
    translationDialog: {
      open: false,
      translations: [],
    },
  });

  handleCreateTranslationDialogClick = () => {
    this.handleFormReload(this.handleCreateTranslationDialogOpen);
  };

  handleCreateTranslationDialogOpen = () => {
    const { item } = this.props;
    const { availableLanguageVersions } = item || {};

    this.setState({
      translationDialog: {
        open: true,
        translations: getUntranslatedLanguages(availableLanguageVersions),
      },
    });
  };

  handleCreateTranslationDialogSuccess = language => this.setState(state => ({
    language,
    translationDialog: {
      ...state.translationDialog,
      open: false,
    },
    translations: _sortedUniq([
      ...state.translations,
      language,
    ]),
  }));

  handleItemDataTypeDeleteSuccess = () => {
    const { itemId } = this.props;
    const { language } = this.state;

    this.handleFetchItem(itemId, language);
  };

  handleItemDataTypeDelete = dataType => (dataTypeId) => {
    const { itemId, deleteItemCategory, deleteItemTag } = this.props;
    let action = () => {};
    const options = {};

    if (dataType === ITEM_DATA_TYPES.CATEGORY) {
      action = deleteItemCategory;
      options.categoryId = dataTypeId;
    } else if (dataType === ITEM_DATA_TYPES.TAG) {
      action = deleteItemTag;
      options.tagId = dataTypeId;
    }

    action({
      id: itemId,
      ...options,
      onSuccess: this.handleItemDataTypeDeleteSuccess,
    });
  };


  handleItemDataTypeSubmitSuccess = () => {
    const { itemId } = this.props;
    const { language } = this.state;

    this.handleFetchItem(itemId, language);
  };

  handleItemDataTypeSubmit = dataType => (ids) => {
    const { itemId, updateItemCategory, updateItemTag } = this.props;
    const { language } = this.state;

    const idList = Array.isArray(ids) ? ids : [ids];

    const action =
      dataType === ITEM_DATA_TYPES.CATEGORY
        ? updateItemCategory
        : updateItemTag;

    const key =
      dataType === ITEM_DATA_TYPES.CATEGORY
        ? 'categoryId'
        : 'tagId';

    const promises = idList.map(id =>
      new Promise(resolve =>
        action({
          id: itemId,
          [key]: id,
          onSuccess: resolve,
        })
      )
    );

    Promise.all(promises).then(() => {
      this.handleFetchItem(itemId, language);
    });
  };

  handleFetchCategoriesList = (language) => {
    const { fetchCategoriesList } = this.props;

    fetchCategoriesList({
      options: {
        headers: {
          'Content-Language': language,
        },
      },
    });
  };

  handleDefaultLanguageChange = (language) => {
    const { changeDefaultTranslation, itemId } = this.props;
    const options = {
      headers: {
        'Content-Language': language,
      },
    };

    changeDefaultTranslation({
      id: itemId,
      options,
      onSuccess: () => {
        this.setState({ isSubmitting: false, submittingError: false });
        this.handleFetchItem(itemId, language);
      },
      onFailure: this.handleSubmitFailure,
    });

    this.setState({ isSubmitting: true, submittingError: false });
  };

  handleDeletePDF = (sightEventId) => {
    const { deleteFile } = this.props;
    const { language } = this.state;

    const payload = {
      id: sightEventId,
      onSuccess: () => this.handleFetchItem(sightEventId, language),
    };

    deleteFile(payload);
  };

  handleDeleteTranslation = (language) => {
    const { deleteTranslation, item, itemId } = this.props;
    const { defaultLanguage } = item || {};

    deleteTranslation({
      id: itemId,
      pathParams: {
        languageVersion: language,
      },
      onSuccess: () => {
        this.setState({ isSubmitting: false, submittingError: false });
        this.handleFetchItem(itemId, defaultLanguage);
      },
      onFailure: () => this.setState({ isSubmitting: false, submittingError: true }),
    });

    this.setState({ isSubmitting: true, submittingError: false });
  };

  handleDeleteTranslationDialogOpen = (language) => {
    const label = getLanguageLabel(language, { locale: 'pl-PL', withCode: false });

    this.setState({
      alertDialog: {
        content: 'Wybrane tłumaczenie zostanie trwale usunięte. Czy chcesz kontynuować?',
        title: `Usuwanie tłumaczenia - ${label}`,
        open: true,
        onSuccess: () => {
          this.handleAlertDialogCancel();
          this.handleDeleteTranslation(language);
        },
      },
    });
  };

  handleDiscardClick = () => this.handleCancel();

  fileActionSuccess = (itemId, language, data) => {
    const { updateItem, item } = this.props;
    this.setState(state => ({ uploadedMultimedia: { ...state.uploadedMultimedia, ...data } }));
    if (itemId && data) {
      updateItem({
        id: itemId,
        data: {
          ...item,
          ...data,
        },
        onSuccess: () => {
          this.saveFormChanges();
          this.handleFetchItem(itemId, language);
        },
        pathParams: {
          languageVersion: language,
        },
        options: {
          headers: {
            'Content-Language': language,
          },
        },
      });
    } else if (itemId && !data) {
      this.handleFetchItem(itemId, language);
    }
  }

  handleFetchItem = (id, language) => {
    const { fetchItem } = this.props;

    fetchItem({
      id,
      options: {
        headers: {
          'Content-Language': language,
        },
      },
      onFailure: this.handleFetchItemFailure,
      onSuccess: this.handleFetchItemSuccess,
    });

    this.setState({ fetchingError: false, isFetching: true });
  };

  handleFetchItemFailure = () => this.setState({ fetchingError: true, isFetching: false });

  handleFetchItemSuccess = () => {
    const { item } = this.props;
    const { availableLanguageVersions, language } = item || {};
    const translations = getTranslatedLanguages(availableLanguageVersions);

    this.setState({
      fetchingError: false,
      isFetching: false,
      language,
      translations,
      uploadedMultimedia: { images: [], mainImage: {}, pdfAttachment: {} },
    });
  };

  handleFetchTagsList = (language) => {
    const { fetchTagsList } = this.props;

    fetchTagsList({
      options: {
        headers: {
          'Content-Language': language,
        },
      },
    });
  };

  handleFormReload = (callback, options) => {
    const { formChanges } = this.state;
    if (this.isFormDirty() || formChanges) {
      this.setState({
        alertDialog: {
          content: 'W formularzu są niezapisane zmiany. Wykonać operację mimo to?',
          onSuccess: () => {
            if (callback) {
              callback(options);
            }

            this.handleAlertDialogCancel();
          },
          open: true,
          title: 'Uwaga',
        },
      });
    } else if (callback) {
      callback(options);
    }
  };

  handleLanguageChange = (event) => {
    const { itemId } = this.props;
    const language = event.target.value;

    this.setState({ language });

    if (itemId) {
      this.handleFetchItem(itemId, language);
    }
  };

  handleLanguageChangeClick = (event) => {
    this.handleFormReload(this.handleLanguageChange, event);
  };

  handleSubmit = () => {
    const { current } = this.formikRef;
    this.isEditBeforeSubmit = !!this.props.itemId;

    if (current && current.submitForm) {
      this.setState({ isSubmitting: true, submittingError: false });
      current.submitForm();

      this.intervalRef = setInterval(this.handleSubmitChange, 200);
    }
  };

  // hacking missing validation callback in Formik
  handleSubmitChange = () => {
    const { current } = this.formikRef;

    if (current && current.getFormikBag) {
      const { getFormikBag } = current;
      const { isSubmitting } = getFormikBag();

      if (!isSubmitting) {
        this.setState({ isSubmitting });
        clearInterval(this.intervalRef);
      }
    }
  };

  handleSubmitFailure = (actions) => {
    const { setSubmitting } = actions;

    this.setState({ isSubmitting: false, submittingError: false });
    setSubmitting(false);
  };

handleSubmitSuccess = (response, actions) => {
  const { fetchList } = this.props;
  const { language } = this.state;
  const { setSubmitting } = actions;

  setSubmitting(false);

  if (this.isEditBeforeSubmit) {
    this.handleFetchItem(response.id, language);
    return;
  }

  const newItemId = response && response.id;

  const bag = this.getFormikBagSafe();
  const values = bag ? bag.values : null;

  if (!newItemId || !values) {
    this.handleCancel();
    return;
  }

  const { categories = [], tags = [] } = values;

  const promises = [];

  categories.forEach(cat => {
    promises.push(
      new Promise(resolve =>
        this.props.updateItemCategory({
          id: newItemId,
          categoryId: cat.id,
          onSuccess: resolve,
        })
      )
    );
  });

  tags.forEach(tag => {
    promises.push(
      new Promise(resolve =>
        this.props.updateItemTag({
          id: newItemId,
          tagId: tag.id,
          onSuccess: resolve,
        })
      )
    );
  });

  Promise.all(promises).then(() => {
    this.props.fetchItem({
      id: newItemId,
      options: { headers: { 'Content-Language': language } },
      onSuccess: () => {
        fetchList();
        this.handleCancel();
      },
    });
  });
};

  isFormDirty = () => {
    const { current } = this.formikRef;

    if (current && current.getFormikComputedProps) {
      const { dirty } = current.getFormikComputedProps();

      return dirty;
    }

    return false;
  };

  saveFormChanges = () => {
    const dirty = this.isFormDirty();
    if (dirty) {
      const { current } = this.formikRef;

      if (current && current.getFormikBag) {
        const { values } = current.getFormikBag();
        const {
          images, mainImage, pdfAttachment, ...rest
        } = values || {};
        this.setState({ formChanges: { ...rest } });
      }
    }
  }

  clearFormChanges = () => {
    this.setState({ formChanges: null });
  }

  getFormikBagSafe = () => {
    const { current } = this.formikRef;
    if (current && current.getFormikBag) {
      return current.getFormikBag();
    }
    return null;
  };


handleLocalItemDataTypeSubmit = dataType => (ids) => {
  const bag = this.getFormikBagSafe();
  if (!bag) return;

  const field = dataType === ITEM_DATA_TYPES.CATEGORY ? 'categories' : 'tags';
  const sourceList =
    dataType === ITEM_DATA_TYPES.CATEGORY ? this.props.categoriesList : this.props.tagsList;

  const idList = Array.isArray(ids) ? ids : [ids];
  const current = Array.isArray(bag.values[field]) ? bag.values[field] : [];

  const next = [...current];

  idList.forEach(id => {
    const fullItem = sourceList.find(x => x.id === id);
    if (fullItem && !next.some(x => x.id === id)) {
      next.push(fullItem);
    }
  });

  bag.setFieldValue(field, next, false);
  setTimeout(() => {
    this.forceUpdate();
  }, 0);
};

handleLocalItemDataTypeDelete = dataType => (id) => {
  const bag = this.getFormikBagSafe();
  if (!bag) return;

  const field = dataType === ITEM_DATA_TYPES.CATEGORY ? 'categories' : 'tags';
  const current = Array.isArray(bag.values[field]) ? bag.values[field] : [];
  const next = current.filter(x => x && x.id !== id);

  bag.setFieldValue(field, next, false);
  setTimeout(() => {
    this.forceUpdate();
  }, 0);
};

  isItemLoaded = (itemId, item) => item
    && Object.getOwnPropertyNames(item).length
    && item.id === itemId;

  shouldComponentFetch = () => {
    const { fetchingError, isFetching } = this.state;
    const { item, itemId, open } = this.props;

    return open
      && !fetchingError
      && !isFetching
      && itemId !== null
      && !this.isItemLoaded(itemId, item);
  };

  render() {
    const {
      alertDialog, fetchingError, isFetching, isSubmitting, language, submittingError,
      translationDialog, translations, uploadedMultimedia,formChanges,
    } = this.state;
    const {
      categoriesList, classes, clearItem, createFile, createFileCancel, deleteFile,
      deleteItemCategory, deleteItemTag, deleteTranslation, fetchCategoriesList, fetchItem,
      fetchList, fetchTagsList, item, itemId, onClose, parentId, tagsList, title,
      changeDefaultTranslation, updateItemCategory, updateItemTag, updateItem, ...rest
    } = this.props;

    let defaultLanguage;
    let isDefaultLanguage = true;
    let multimedia = {};

    if (this.isItemLoaded(itemId, item)) {
      const { defaultLanguage: itemDefaultLanguage } = item;

      defaultLanguage = itemDefaultLanguage;
      isDefaultLanguage = language === defaultLanguage;

      multimedia = this.getMultimediaFromItem(item);
    }

    const translationActions = [
      {
        action: this.handleCreateTranslationDialogClick,
        disabled: CONTENT_LANGUAGES.length === translations.length,
        label: 'Dodaj tłumaczenie',
      },
      {
        action: this.handleDeleteTranslationDialogOpen,
        disabled: language === defaultLanguage,
        label: 'Usuń tłumaczenie',
      },
      {
        action: this.handleDefaultLanguageChange,
        disabled: language === defaultLanguage,
        label: 'Ustaw tłumaczenie jako domyślne',
      },
    ];

    const bag = this.getFormikBagSafe();
    const formikValues = bag ? bag.values : null;

    /*const selectedCategories = itemId
      ? (item && item.categories) || []
      : (formikValues && formikValues.categories) || (formChanges && formChanges.categories) || [];

    const selectedTags = itemId
      ? (item && item.tags) || []
      : (formikValues && formikValues.tags) || (formChanges && formChanges.tags) || [];
    */

    const selectedCategories =
      (formikValues && formikValues.categories)
      || (item && item.categories)
      || [];

    const selectedTags =
      (formikValues && formikValues.tags)
      || (item && item.tags)
      || [];

    return (
      <Fragment>
        <Dialog onClose={this.handleClose} aria-labelledby="form-dialog-title" {...rest}>
          <DialogTitle id="form-dialog-title">
            {title}
            {isFetching || isSubmitting
              ? <CircularProgress size={18} style={{ marginLeft: 20 }} />
              : null
            }
          </DialogTitle>
          <DialogContent>
            <Grid container className={classes.section}>
              <GridItem>
                <Typography variant="h6">Wersja językowa</Typography>
              </GridItem>
              <GridItem className={classes.section}>
                <ContentLanguage
                  LanguageActionsProps={{
                    actions: itemId ? translationActions : null,
                    language,
                  }}
                  LanguagePickerProps={{
                    defaultItem: defaultLanguage,
                    label: itemId ? i18n.label : i18n.defaultLabel,
                    listItems: translations,
                    onChange: this.handleLanguageChangeClick,
                    value: language,
                  }}
                  showActions={!!itemId && !!translationActions.length}
                />
              </GridItem>
              <SightForm
                uploadedMultimedia={uploadedMultimedia}
                buttons={false}
                FormikProps={{ ref: this.formikRef }}
                initialValues={this.getInitialValues(item)}
                language={language}
                onSubmitFailure={this.handleSubmitFailure}
                onSubmitSuccess={this.handleSubmitSuccess}
                clearFormChanges={this.clearFormChanges}
              />
            </Grid>
                {isDefaultLanguage && (
                  <>
                    <div className={classes.section}>
                      <CategoriesForm
                        categories={categoriesList}
                        items={selectedCategories}
                        managePublic
                        manageRestricted={false}
                        showRestrictedSection={!!itemId}
                        onSubmit={
                          itemId
                            ? this.handleItemDataTypeSubmit(ITEM_DATA_TYPES.CATEGORY)
                            : this.handleLocalItemDataTypeSubmit(ITEM_DATA_TYPES.CATEGORY)
                        }
                        onDelete={
                          itemId
                            ? this.handleItemDataTypeDelete(ITEM_DATA_TYPES.CATEGORY)
                            : this.handleLocalItemDataTypeDelete(ITEM_DATA_TYPES.CATEGORY)
                        }
                      />
                    </div>

                    <div className={classes.section}>
                      <TagsForm
                        tags={tagsList}
                        items={selectedTags}
                        managePublic
                        manageRestricted={false}
                        showRestrictedSection={!!itemId}
                        onSubmit={
                          itemId
                            ? this.handleItemDataTypeSubmit(ITEM_DATA_TYPES.TAG)
                            : this.handleLocalItemDataTypeSubmit(ITEM_DATA_TYPES.TAG)
                        }
                        onDelete={
                          itemId
                            ? this.handleItemDataTypeDelete(ITEM_DATA_TYPES.TAG)
                            : this.handleLocalItemDataTypeDelete(ITEM_DATA_TYPES.TAG)
                        }
                      />
                    </div>
                  </>
                )}
            <div>
              <MultimediaForm
                AttachmentProps={{
                  item: uploadedMultimedia.pdfAttachment.id
                    ? uploadedMultimedia.pdfAttachment : multimedia.pdfAttachment,
                }}
                defaultTranslation={defaultLanguage}
                createFile={createFile}
                createFileCancel={createFileCancel}
                deleteFile={deleteFile}
                ImageGalleryProps={{
                  items: uploadedMultimedia.images.length
                    ? uploadedMultimedia.images : multimedia.images || [],
                }}
                itemId={itemId}
                MainImageProps={{
                  item: uploadedMultimedia.mainImage.id
                    ? uploadedMultimedia.mainImage : multimedia.mainImage,
                }}
                onSuccess={data => this.fileActionSuccess(itemId, language, data)}
                translation={language}
                saveFormChanges={this.saveFormChanges}
              />
            </div>
          </DialogContent>
          <DialogActions>
            {submittingError
              && (
                <Typography style={{ color: 'red' }}>
                  Wystąpił błąd podczas zapisywania.
                </Typography>
              )
            }
            {fetchingError
              && (
                <Typography style={{ color: 'red' }}>
                  Wystąpił błąd podczas pobierania danych.
                </Typography>
              )
            }
            <Button disabled={isSubmitting} onClick={this.handleDiscardClick} color="primary">Odrzuć</Button>
            <Button disabled={isSubmitting} onClick={this.handleSubmit} color="primary">Zapisz</Button>
            <Button disabled={isSubmitting} onClick={this.handleCancelClick} color="primary">Zamknij</Button>
          </DialogActions>
        </Dialog>
        <AlertDialog
          onCancel={this.handleAlertDialogCancel}
          {...alertDialog}
        />
        <CreateTranslationDialog
          onCancel={this.handleCreateTranslationDialogCancel}
          onSuccess={this.handleCreateTranslationDialogSuccess}
          {...translationDialog}
        />
      </Fragment>
    );
  }
}

SightEventFormDialog.propTypes = {
  categoriesList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  classes: PropTypes.shape({}).isRequired,
  changeDefaultTranslation: PropTypes.func.isRequired,
  clearItem: PropTypes.func.isRequired,
  createFile: PropTypes.func.isRequired,
  createFileCancel: PropTypes.func.isRequired,
  deleteFile: PropTypes.func.isRequired,
  deleteItemCategory: PropTypes.func.isRequired,
  deleteItemTag: PropTypes.func.isRequired,
  deleteTranslation: PropTypes.func.isRequired,
  fetchCategoriesList: PropTypes.func.isRequired,
  fetchItem: PropTypes.func.isRequired,
  fetchList: PropTypes.func.isRequired,
  fetchTagsList: PropTypes.func.isRequired,
  item: PropTypes.shape({}),
  itemId: PropTypes.number,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  parentId: PropTypes.number,
  tagsList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  title: PropTypes.string,
  updateItem: PropTypes.func.isRequired,
  updateItemCategory: PropTypes.func.isRequired,
  updateItemTag: PropTypes.func.isRequired,
};

SightEventFormDialog.defaultProps = {
  onClose: null,
  item: null,
  itemId: null,
  open: false,
  parentId: null,
  title: null,
};

const mapStateToProps = state => ({
  categoriesList: categoriesSelectors.getList(state),
  item: sightEventsSelectors.getSightEvent(state),
  tagsList: tagsSelectors.getList(state),
});

const mapDispatchToProps = {
  clearItem: sightEventsActions.clearItem,
  changeDefaultTranslation: sightEventsActions.changeDefaultTranslation,
  createFile: filesActions.createFile,
  createFileCancel: filesActions.createFileCancel,
  deleteFile: filesActions.deleteFile,
  deleteItemCategory: sightEventsActions.deleteItemCategory,
  deleteItemTag: sightEventsActions.deleteItemTag,
  deleteTranslation: sightEventsActions.deleteTranslation,
  fetchCategoriesList: categoriesActions.fetchList,
  fetchItem: sightEventsActions.fetchItem,
  fetchList: sightEventsActions.fetchList,
  fetchTagsList: tagsActions.fetchList,
  updateItem: sightEventsActions.updateItem,
  updateItemCategory: sightEventsActions.updateItemCategory,
  updateItemTag: sightEventsActions.updateItemTag,
};

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),
)(SightEventFormDialog);
