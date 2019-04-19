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
  actions as sightsActions,
  selectors as sightsSelectors,
} from '@hello-poland/commons/redux/sights';
import { actions as sightEventsActions } from '@hello-poland/commons/redux/sightEvents';
import {
  CONTENT_LANGUAGES, DEFAULT_LANGUAGE, getLanguageLabel, getTranslatedLanguages,
  getUntranslatedLanguages,
} from 'utils/content-language';
import AlertDialog from 'components/AlertDialog';
import ContentLanguage from 'components/ContentLanguage';
import CreateTranslationDialog from 'components/ContentLanguage/CreateTranslationDialog';
import GridItem from 'components/GridItem';
import SightForm from './Form';
import i18n from './i18n/pl-PL';

const styles = () => ({
  section: {
    marginBottom: 40,
  },
});

class SightFormDialog extends Component {
  constructor(props) {
    super(props);

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
    };
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
    const { itemId } = this.props;
    const { language } = this.state;

    if (this.isItemLoaded(itemId, item)) {
      const { availableLanguageVersions } = item;
      const hasNewTranslation = !availableLanguageVersions.some(lng => lng === language);

      if (hasNewTranslation) {
        return { id: itemId };
      }

      return { ...item };
    }

    return null;
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
      fetchingError: false, isFetching: false, language, translations,
    });
  };

  handleFormReload = (callback, options) => {
    if (this.isFormDirty()) {
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

  handleSubmitSuccess = (sightId, actions) => {
    const { fetchSightsList, fetchSightEventsList, itemId } = this.props;
    const { language } = this.state;
    const { setSubmitting } = actions;

    setSubmitting(false);

    fetchSightsList();
    fetchSightEventsList();

    if (itemId) {
      this.handleFetchItem(itemId, language);
    } else {
      this.handleCancel();
    }
  };

  isFormDirty = () => {
    const { current } = this.formikRef;

    if (current && current.getFormikComputedProps) {
      const { dirty } = current.getFormikComputedProps();

      return dirty;
    }

    return false;
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
      translationDialog, translations,
    } = this.state;
    const {
      classes, clearItem, deleteTranslation, fetchItem, fetchSightsList, fetchSightEventsList, item,
      itemId, onClose, title, changeDefaultTranslation, ...rest
    } = this.props;

    let defaultLanguage;

    if (this.isItemLoaded(itemId, item)) {
      const { defaultLanguage: itemDefaultLanguage } = item;

      defaultLanguage = itemDefaultLanguage;
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
            <Grid container>
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
                buttons={false}
                FormikProps={{ ref: this.formikRef }}
                initialValues={this.getInitialValues(item)}
                language={language}
                onSubmitFailure={this.handleSubmitFailure}
                onSubmitSuccess={this.handleSubmitSuccess}
              />
            </Grid>
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
          onExited={this.handleAlertDialogExited}
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

SightFormDialog.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  changeDefaultTranslation: PropTypes.func.isRequired,
  clearItem: PropTypes.func.isRequired,
  deleteTranslation: PropTypes.func.isRequired,
  fetchItem: PropTypes.func.isRequired,
  fetchSightsList: PropTypes.func.isRequired,
  fetchSightEventsList: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  item: PropTypes.shape({}),
  itemId: PropTypes.number,
  title: PropTypes.string,
};

SightFormDialog.defaultProps = {
  onClose: null,
  item: null,
  itemId: null,
  open: false,
  title: null,
};

const mapStateToProps = state => ({
  item: sightsSelectors.getSight(state),
});

const mapDispatchToProps = {
  clearItem: sightsActions.clearItem,
  changeDefaultTranslation: sightsActions.changeDefaultTranslation,
  deleteTranslation: sightsActions.deleteTranslation,
  fetchItem: sightsActions.fetchItem,
  fetchSightsList: sightsActions.fetchList,
  fetchSightEventsList: sightEventsActions.fetchList,
};

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),
)(SightFormDialog);
