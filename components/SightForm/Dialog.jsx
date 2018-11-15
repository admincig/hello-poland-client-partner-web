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
import SightForm from './Form';

class SightFormDialog extends Component {
  constructor(props) {
    super(props);

    this.formikRef = React.createRef();

    this.state = {
      error: false,
      isSightFetching: false,
      isSubmitting: false,
    };
  }

  componentDidUpdate() {
    const { isSightFetching } = this.state;
    const { sight, sightId } = this.props;

    if (!isSightFetching && !this.isSightLoaded(sightId, sight)) {
      this.handleFetchSight(sightId);
    }
  }

  getInitialValues = (sight) => {
    const { sightId } = this.props;

    if (this.isSightLoaded(sightId, sight)) {
      return sight;
    }

    return null;
  };

  handleClose = () => {
    const { clearSight, onClose } = this.props;

    if (onClose) {
      onClose();
      clearSight();
    }
  };

  handleFetchSight = (id) => {
    const { fetchSight } = this.props;

    if (id) {
      fetchSight({
        id,
        onFailure: this.handleFetchSightFailure,
        onSuccess: this.handleFetchSightSuccess,
      });

      this.setState({ isSightFetching: true });
    }
  };

  handleFetchSightFailure = () => this.setState({ isSightFetching: false });

  handleFetchSightSuccess = () => this.setState({ isSightFetching: false });

  handleSubmit = () => {
    const { current } = this.formikRef;

    if (current && current.submitForm) {
      this.setState({ error: false, isSubmitting: true });
      current.submitForm();
    }
  };

  handleSubmitFailure = (actions) => {
    const { setSubmitting } = actions;

    setSubmitting(false);
    this.setState({ error: true, isSubmitting: false });
  };

  handleSubmitSuccess = (sightId, actions) => {
    const { fetchSightsList } = this.props;
    const { resetForm, setSubmitting } = actions;

    setSubmitting(false);
    resetForm();

    this.setState({ error: false, isSubmitting: false });
    fetchSightsList();
    this.handleClose();
  };

  isSightLoaded = (sightId, sight) =>
    sight
    && Object.getOwnPropertyNames(sight).length
    && sight.id === sightId;

  render() {
    const { error, isSightFetching, isSubmitting } = this.state;
    const {
      clearSight, fetchSight, fetchSightsList, onClose, sight, sightId, title, ...rest
    } = this.props;

    return (
      <Dialog onClose={this.handleClose} aria-labelledby="form-dialog-title" {...rest}>
        <DialogTitle id="form-dialog-title">
          {title}
          {isSightFetching || isSubmitting
            ? <CircularProgress size={18} style={{ marginLeft: 20 }} />
            : null
          }
        </DialogTitle>
        <DialogContent>
          <SightForm
            buttons={false}
            FormikProps={{ enableReinitialize: true, ref: this.formikRef }}
            initialValues={this.getInitialValues(sight)}
            onSubmitFailure={this.handleSubmitFailure}
            onSubmitSuccess={this.handleSubmitSuccess}
          />
        </DialogContent>
        <DialogActions>
          {error &&
            <Typography style={{ color: 'red' }}>
              Wystąpił błąd podczas zapisywania.
            </Typography>
          }
          <Button disabled={isSubmitting} onClick={this.handleClose} color="primary">Anuluj</Button>
          <Button disabled={isSubmitting} onClick={this.handleSubmit} color="primary">Zapisz</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

SightFormDialog.propTypes = {
  clearSight: PropTypes.func.isRequired,
  fetchSight: PropTypes.func.isRequired,
  fetchSightsList: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  sight: PropTypes.shape({}),
  sightId: PropTypes.number,
  title: PropTypes.string,
};

SightFormDialog.defaultProps = {
  onClose: null,
  sight: null,
  sightId: null,
  title: null,
};

const mapStateToProps = state => ({
  sight: sightsSelectors.getSight(state),
});

const mapDispatchToProps = {
  clearSight: sightsActions.clearItem,
  fetchSight: sightsActions.fetchItem,
  fetchSightsList: sightsActions.fetchList,
};

export default connect(mapStateToProps, mapDispatchToProps)(SightFormDialog);
