import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography/Typography';
import {
  actions as sightsActions,
  selectors as sightsSelectors,
} from '@hello-poland/commons/redux/sights';
import { actions as sightEventsActions } from '@hello-poland/commons/redux/sightEvents';
import LanguageActions from 'components/LanguageActions';
import SightForm from './Form';

class SightFormDialog extends Component {
  constructor(props) {
    super(props);

    this.formikRef = React.createRef();

    this.intervalRef = null;

    this.state = {
      fetchingError: false,
      isFetching: false,
      isSubmitting: false,
      submittingError: false,
    };
  }

  componentDidUpdate() {
    if (this.shouldComponentFetch()) {
      const { itemId } = this.props;

      this.handleFetchItem(itemId);
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

  handleFetchItem = (id) => {
    const { fetchItem } = this.props;

    fetchItem({
      id,
      onFailure: this.handleFetchItemFailure,
      onSuccess: this.handleFetchItemSuccess,
    });

    this.setState({ fetchingError: false, isFetching: true });
  };

  handleFetchItemFailure = () => this.setState({ fetchingError: true, isFetching: false });

  handleFetchItemSuccess = () => this.setState({ fetchingError: false, isFetching: false });

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

  }
    }
      });
        onFailure: () => console.log('nie działa'),
        onSuccess: () => this.handleFetchItem(itemId),
        options,
        id: itemId,
      changeDefaultLanguage({
    if (typeof val === 'string') {

  handleDefaultLanguageChange = (val) => {
    const { changeDefaultLanguage, itemId } = this.props;
    const options = {
      headers: {
        'Content-Language': val,
      },
    };
  render() {
    const {
      fetchingError, isFetching, isSubmitting, submittingError,
    } = this.state;
    const {
      clearItem, fetchItem, fetchSightsList, fetchSightEventsList, item, itemId, onClose, title,
      ...rest
    } = this.props;
    const actions = [
      { label: 'Ustaw jako domyślny język atrakcji', action: this.handleDefaultLanguageChange },
    ];
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
          <SightForm
            buttons={false}
            FormikProps={{ ref: this.formikRef }}
            initialValues={this.getInitialValues(item)}
            onSubmitFailure={this.handleSubmitFailure}
            onSubmitSuccess={this.handleSubmitSuccess}
          />
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
  changeDefaultLanguage: sightsActions.changeDefault,
  fetchItem: sightsActions.fetchItem,
  fetchSightsList: sightsActions.fetchList,
  fetchSightEventsList: sightEventsActions.fetchList,
};

export default connect(mapStateToProps, mapDispatchToProps)(SightFormDialog);
