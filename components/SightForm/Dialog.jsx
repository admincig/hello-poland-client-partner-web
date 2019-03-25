import React, { Component } from 'react';
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
  actions as sightsActions,
  selectors as sightsSelectors,
} from '@hello-poland/commons/redux/sights';
import { actions as sightEventsActions } from '@hello-poland/commons/redux/sightEvents';
import { CONTENT_LANGUAGES, DEFAULT_LANGUAGE, getSupportedLanguages } from 'utils/content-language';
import ContentLanguage from 'components/ContentLanguage';
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
      fetchingError: false,
      isFetching: false,
      isSubmitting: false,
      language: DEFAULT_LANGUAGE,
      submittingError: false,
    };

    this.actions = [
      { label: 'Ustaw tłumaczenie jako domyślne', action: this.handleDefaultLanguageChange },
    ];
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

    if (this.isItemLoaded(itemId, item)) {
      return item;
    }

    return null;
  };

  handleClose = () => {
    const { clearItem, onClose } = this.props;

    this.setState({
      fetchingError: false,
      isFetching: false,
      isSubmitting: false,
      language: DEFAULT_LANGUAGE,
      submittingError: false,
    });

    clearItem();

    if (onClose) {
      onClose();
    }
  };

  handleDefaultLanguageChange = (language) => {
    if (language && language.length) {
      const { changeDefaultTranslation, itemId } = this.props;
      const options = {
        headers: {
          'Content-Language': language,
        },
      };

      changeDefaultTranslation({
        id: itemId,
        options,
        onSuccess: () => this.handleFetchItem(itemId, language),
        onFailure: this.handleSubmitFailure,
      });
    }
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
    const { item } = this.props;
    const { language } = item || {};

    this.setState({ fetchingError: false, isFetching: false, language });
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
    const { fetchSightsList, fetchSightEventsList } = this.props;
    const { resetForm, setSubmitting } = actions;

    setSubmitting(false);
    resetForm();

    fetchSightsList();
    fetchSightEventsList();
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

  render() {
    const {
      fetchingError, isFetching, isSubmitting, language, submittingError,
    } = this.state;
    const {
      classes, clearItem, fetchItem, fetchSightsList, fetchSightEventsList, item, itemId, onClose,
      title, changeDefaultTranslation, ...rest
    } = this.props;

    let languageVersions = CONTENT_LANGUAGES;
    let defaultLanguage;

    if (this.isItemLoaded(itemId, item)) {
      const { availableLanguageVersions, defaultLanguage: itemDefaultLanguage } = item;
      languageVersions = getSupportedLanguages(availableLanguageVersions);
      defaultLanguage = itemDefaultLanguage;
    }

    return (
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
                  actions: itemId ? this.actions : null,
                  language,
                }}
                LanguagePickerProps={{
                  defaultItem: defaultLanguage,
                  label: itemId ? i18n.label : i18n.defaultLabel,
                  listItems: languageVersions,
                  onChange: this.handleLanguageChange,
                  value: language,
                }}
                showActions={!!itemId}
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
          <Button disabled={isSubmitting} onClick={this.handleClose} color="primary">Anuluj</Button>
          <Button disabled={isSubmitting} onClick={this.handleSubmit} color="primary">Zapisz</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

SightFormDialog.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  changeDefaultTranslation: PropTypes.func.isRequired,
  clearItem: PropTypes.func.isRequired,
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
  fetchItem: sightsActions.fetchItem,
  fetchSightsList: sightsActions.fetchList,
  fetchSightEventsList: sightEventsActions.fetchList,
};

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),
)(SightFormDialog);
