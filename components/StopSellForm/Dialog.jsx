import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
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

const styles = () => ({
  datePicker: {
    width: 90,
    marginRight: 20,
  },
  error: {
    color: 'red',
  },
});

class SightFormDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSubmitting: false,
      submittingError: false,
      date: Date.now(),
    };
  }

  handleDateChange = (date) => {
    this.setState({ date, submittingError: false });
  };

  handleSubmit = () => {
    const { poolDefinitionId, sightEventId, stopSell } = this.props;
    const { date } = this.state;

    this.setState({ isSubmitting: true });

    stopSell({
      sightEventId,
      ticketPoolId: poolDefinitionId,
      date: format(date, 'YYYY-MM-DDTHH:mm'),
      onFailure: this.handleSubmitFailure,
      onSuccess: this.handleSubmitSuccess,
    });
  };

  handleSubmitFailure = () => {
    const { error: { data: { message } } } = this.props;

    this.setState({ isSubmitting: false, submittingError: message });
  };

  handleSubmitSuccess = () => {
    const { onClose } = this.props;

    this.setState({ isSubmitting: false, date: Date.now(), submittingError: null });

    onClose();
  };

  render() {
    const {
      isSubmitting, submittingError, date,
    } = this.state;
    const {
      classes, poolDefinitionId, sightEventId, title, stopSell, onClose,
      ...rest
    } = this.props;

    return (
      <Dialog onClose={this.handleClose} aria-labelledby="form-dialog-title" {...rest}>
        <DialogTitle id="form-dialog-title">
          {title}
          {isSubmitting
            ? <LinearProgress />
            : null
          }
        </DialogTitle>
        <DialogContent>
          <MuiPickersUtilsProvider locale={locale.pl} utils={DateFnsUtils}>
            <Grid container justify="center">
              <DatePicker
                className={classes.datePicker}
                format="DD MMM YYYY"
                label="Data"
                margin="normal"
                onChange={this.handleDateChange}
                value={date}
              />
            </Grid>
          </MuiPickersUtilsProvider>
          {
            submittingError &&
            <Typography className={classes.error}>{submittingError}</Typography>
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
  classes: PropTypes.shape({}).isRequired,
  error: PropTypes.shape({}),
  onClose: PropTypes.func.isRequired,
  poolDefinitionId: PropTypes.number,
  sightEventId: PropTypes.number,
  stopSell: PropTypes.func,
  title: PropTypes.string,
};

SightFormDialog.defaultProps = {
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


export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),
)(SightFormDialog);
