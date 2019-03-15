import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
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
  actions as sightEventsActions,
  selectors as sightEventsSelectors,
} from '@hello-poland/commons/redux/sightEvents';
import { CONTENT_LANGUAGES, DEFAULT_LANGUAGE, getSupportedLanguages } from 'utils/content-language';
import AlertDialog from 'components/AlertDialog';
import ContentLanguage from 'components/ContentLanguage';
import GridItem from 'components/GridItem';
import SightForm from './Form';
import MultimediaList from './MultimediaList';
import i18n from './i18n/pl-PL';

const styles = () => ({
  section: {
    marginBottom: 40,
  },
});

class SightEventFormDialog extends Component {
  constructor(props) {
    super(props);

    this.formikRef = React.createRef();

    this.intervalRef = null;

    this.state = {
      alertDialog: {
        content: null,
        onSubmit: null,
        open: false,
        title: null,
      },
      fetchingError: false,
      isFetching: false,
      isSubmitting: false,
      language: DEFAULT_LANGUAGE,
      submittingError: false,
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
    const { itemId, parentId } = this.props;

    if (this.isItemLoaded(itemId, item)) {
      const sightId = item.sightId || parentId;

      return {
        ...item,
        sightId,
      };
    }

    return { sightId: parentId };
  };

  getMultimedia = () => {
    const { item } = this.props;
    const { pdfAttachment } = item;
    const multimediaList = [];

    if (pdfAttachment) {
      multimediaList.push({ ...pdfAttachment, sightEventId: item.id });
    }

    return multimediaList;
  };

  handleAlertDialogClear = () => this.setState({
    alertDialog: {
      content: null,
      onSubmit: null,
      open: false,
      title: null,
    },
  });

  handleAlertDialogClose = () => this.setState(state => ({
    alertDialog: {
      ...state.alertDialog,
      open: false,
    },
  }));

  handleAlertDialogOpen = (sightEventId, name) => this.setState({
    alertDialog: {
      content: `Plik ${name} zostanie trwale usunięty i nie będzie można go przywrócic.`,
      onSubmit: () => {
        this.handleDeletePDF(sightEventId);
        this.handleAlertDialogClose();
      },
      open: true,
      title: 'Czy na pewno usunąć wybrany plik?',
    },
  });

  handleClose = () => {
    const { clearItem, onClose } = this.props;

    if (onClose) {
      onClose();
      this.setState({
        fetchingError: false,
        isFetching: false,
        isSubmitting: false,
        submittingError: false,
      });
      clearItem();
    }
  };

  handleDeletePDF = (sightEventId) => {
    const { deletePDF } = this.props;
    const payload = {
      id: sightEventId,
      onSuccess: () => this.handleFetchItem(sightEventId),
    };

    deletePDF(payload);
  };

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
    const { item: { defaultLanguage, availableLanguageVersions } } = this.props;
    const { language } = this.state;
    this.setState({ fetchingError: false, isFetching: false });
    if (availableLanguageVersions.indexOf(language) === -1) {
      this.setState({ language: defaultLanguage });
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
    const { fetchList } = this.props;
    const { resetForm, setSubmitting } = actions;

    setSubmitting(false);
    resetForm();

    fetchList();
    this.setState({ isSubmitting: false, submittingError: false });
    this.handleClose();
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

  handleDefaultLanguageChange = (val) => {
    const { changeDefaultLanguage, itemId } = this.props;
    const options = {
      headers: {
        'Content-Language': val,
      },
    };
    if (typeof val === 'string') {
      changeDefaultLanguage({
        id: itemId,
        options,
        onSuccess: () => this.handleFetchItem(itemId, val),
        onFailure: this.handleSubmitFailure,
      });
    }
  }

  render() {
    const {
      alertDialog, fetchingError, isFetching, isSubmitting, language, submittingError,
    } = this.state;
    const {
      classes,
      clearItem,
      fetchItem,
      fetchList,
      item,
      itemId,
      onClose,
      parentId,
      title,
      deletePDF,
      changeDefaultLanguage,
      ...rest
    } = this.props;

    const multimedia = this.getMultimedia();

    let languageVersions = CONTENT_LANGUAGES;
    let defaultLanguage;

    if (this.isItemLoaded(itemId, item)) {
      const { availableLanguageVersions, defaultLanguage: itemDefaultLanguage } = item;

      languageVersions = getSupportedLanguages(availableLanguageVersions);
      defaultLanguage = itemDefaultLanguage;
    }

    const actions = [
      { label: 'Ustaw jako domyślny język oferty', action: this.handleDefaultLanguageChange },
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
                  defaultItem={defaultLanguage}
                  actions={itemId ? actions : null}
                  label={itemId ? i18n.label : i18n.defaultLabel}
                  listItems={languageVersions}
                  onChange={this.handleLanguageChange}
                  value={language}
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
              <MultimediaList data={multimedia} onItemDelete={this.handleAlertDialogOpen} />
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
            <Button disabled={isSubmitting} onClick={this.handleClose} color="primary">Anuluj</Button>
            <Button disabled={isSubmitting} onClick={this.handleSubmit} color="primary">Zapisz</Button>
          </DialogActions>
        </Dialog>
        <AlertDialog
          onClose={this.handleAlertDialogClose}
          onExited={this.handleAlertDialogClear}
          {...alertDialog}
        />
      </Fragment>
    );
  }
}

SightEventFormDialog.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  changeDefaultLanguage: PropTypes.func.isRequired,
  clearItem: PropTypes.func.isRequired,
  deletePDF: PropTypes.func.isRequired,
  fetchItem: PropTypes.func.isRequired,
  fetchList: PropTypes.func.isRequired,
  item: PropTypes.shape({}),
  itemId: PropTypes.number,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  parentId: PropTypes.number,
  title: PropTypes.string,
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
  item: sightEventsSelectors.getSightEvent(state),
});

const mapDispatchToProps = {
  clearItem: sightEventsActions.clearItem,
  changeDefaultLanguage: sightEventsActions.changeDefaultLanguage,
  fetchItem: sightEventsActions.fetchItem,
  fetchList: sightEventsActions.fetchList,
  deletePDF: sightEventsActions.deletePDF,
};

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),
)(SightEventFormDialog);
