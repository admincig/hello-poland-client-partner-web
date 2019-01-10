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
  actions as sightEventsActions,
  selectors as sightEventsSelectors,
} from '@hello-poland/commons/redux/sightEvents';
import SightForm from './Form';
import MultimediaList from './MultimediaList';

class SightEventFormDialog extends Component {
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
    const { fetchList } = this.props;
    const { resetForm, setSubmitting } = actions;

    setSubmitting(false);
    resetForm();

    fetchList();
    this.setState({ isSubmitting: false, submittingError: false });
    this.handleClose();
  };

  isItemLoaded = (itemId, item) =>
    item
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
      fetchingError, isFetching, isSubmitting, submittingError,
    } = this.state;
    const {
      clearItem, fetchItem, fetchList, item, itemId, onClose, parentId, title, deletePDF, ...rest
    } = this.props;

    const multimedia = this.getMultimedia();

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
          <MultimediaList data={multimedia} onItemDelete={this.handleDeletePDF} />
        </DialogContent>
        <DialogActions>
          {submittingError &&
            <Typography style={{ color: 'red' }}>
              Wystąpił błąd podczas zapisywania.
            </Typography>
          }
          {fetchingError &&
          <Typography style={{ color: 'red' }}>
            Wystąpił błąd podczas pobierania danych.
          </Typography>
          }
          <Button disabled={isSubmitting} onClick={this.handleClose} color="primary">Anuluj</Button>
          <Button disabled={isSubmitting} onClick={this.handleSubmit} color="primary">Zapisz</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

SightEventFormDialog.propTypes = {
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
  fetchItem: sightEventsActions.fetchItem,
  fetchList: sightEventsActions.fetchList,
  deletePDF: sightEventsActions.deletePDF,
};

export default connect(mapStateToProps, mapDispatchToProps)(SightEventFormDialog);
