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
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import DatePicker from 'material-ui-pickers/DatePicker';
import plLocale from 'date-fns/locale/pl';
import {
  actions as sightEventsActions,
  selectors as sightEventsSelectors,
} from '@hello-poland/commons/redux/sightEvents';
import { format } from 'date-fns';

const locale = {
  pl: plLocale,
};

class SightFormDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSubmitting: false,
      submittingError: false,
      date: Date.now(),
    };
  }
  handleDateChange = (e) => {
    this.setState({ date: e, submittingError: false });
  }

  handleSubmit = () => {
    const { poolDefinitionId, sightEventId, stopSell } = this.props;
    const { date } = this.state;
    this.setState({ isSubmitting: true });
    const onSuccess = () => {
      const { onClose } = this.props;
      this.setState({ isSubmitting: false, date: Date.now() });
      onClose();
    };
    const onFailure = () => {
      const { error: { data: { message } } } = this.props;
      this.setState({ isSubmitting: false, submittingError: message });
    };
    stopSell({
      sightEventId, ticketPoolId: poolDefinitionId, date: format(date, 'YYYY-MM-DDTHH:mm'), onSuccess, onFailure,
    });
  }

  render() {
    const {
      isSubmitting, submittingError, date,
    } = this.state;
    const {
      poolDefinitionId, sightEventId, title, stopSell, onClose,
      ...rest
    } = this.props;
    return (
      <Dialog onClose={this.handleClose} aria-labelledby="form-dialog-title" {...rest}>
        <DialogTitle id="form-dialog-title">
          {title}
          {isSubmitting
            ? <CircularProgress size={18} style={{ marginLeft: 20 }} />
            : null
          }
        </DialogTitle>
        <DialogContent>
          <MuiPickersUtilsProvider locale={locale.pl} utils={DateFnsUtils}>
            <DatePicker
              format="DD MMM YYYY"
              label="Wybierz date"
              margin="normal"
              onChange={this.handleDateChange}
              value={date}
            />
          </MuiPickersUtilsProvider>
          {
            submittingError &&
            <Typography style={{ color: 'red' }}>
              {submittingError}
            </Typography>
          }
        </DialogContent>
        <DialogActions>
          <Button disabled={isSubmitting} onClick={onClose} color="primary">Anuluj</Button>
          <Button disabled={isSubmitting} onClick={this.handleSubmit} color="primary">Zatrzymaj sprzedaż</Button>
        </DialogActions>
      </Dialog>
    );
  }
}

SightFormDialog.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
  title: PropTypes.string,
  poolDefinitionId: PropTypes.number,
  sightEventId: PropTypes.number,
  stopSell: PropTypes.func,
  error: PropTypes.shape({}),
};

SightFormDialog.defaultProps = {
  onClose: null,
  open: false,
  title: null,
  poolDefinitionId: null,
  sightEventId: null,
  stopSell: null,
  error: null,
};

const mapStateToProps = state => ({
  error: sightEventsSelectors.getError(state),
});


const mapDispatchToProps = {
  stopSell: sightEventsActions.stopSell,
};


export default connect(mapStateToProps, mapDispatchToProps)(SightFormDialog);
