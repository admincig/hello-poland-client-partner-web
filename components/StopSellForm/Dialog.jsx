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
import TextField from '@material-ui/core/TextField';
import {
  actions as sightEventsActions,
  selectors as sightEventsSelectors,
} from '@hello-poland/commons/redux/sightEvents';
import format from 'date-fns/format';
import getHours from 'date-fns/getHours';
import getMinutes from 'date-fns/getMinutes';
import setHours from 'date-fns/setHours';
import setMinutes from 'date-fns/setMinutes';
import AlertDialog from 'components/AlertDialog';

const styles = theme => ({
  datePicker: {
    width: 150,
    marginTop: theme.spacing.unit * 2,
  },
  error: {
    color: 'red',
  },
});

class SightFormDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alertDialog: {
        content: null,
        onSubmit: null,
        open: false,
        title: null,
      },
      isSubmitting: false,
      submittingError: false,
      date: new Date(),
    };
  }

  handleAlertDialogClear = () => this.setState({
    alertDialog: {
      content: null,
      onSuccess: null,
      open: false,
      title: null,
    },
  });

  handleAlertDialogCancel = () => this.setState(state => ({
    alertDialog: {
      ...state.alertDialog,
      open: false,
    },
  }));

  handleAlertDialogOpen = ({ date, poolDefinitionId, sightEventId }, name) => this.setState({
    alertDialog: {
      content: `Sprzedaż produktów na pulę "${name}" w dniu ${format(date, 'dd.MM.yyyy')} zostanie zatrzymana.`,
      onSuccess: () => {
        this.handleSubmit({ date, poolDefinitionId, sightEventId });
        this.handleAlertDialogCancel();
      },
      open: true,
      title: 'Czy na pewno zablokować sprzedaż?',
    },
  });

  handleDateChange = (event) => {
    const value = event.target.value;

    this.setState({
      date: value ? new Date(`${value}T00:00`) : null,
      submittingError: false,
    });
  };

  handleSubmit = ({ date, poolDefinitionId, sightEventId }) => {
    const { stopSell, startDate } = this.props;

    const hours = getHours(startDate);
    const minutes = getMinutes(startDate);

    this.setState({ isSubmitting: true });

    const poolStartDate = setMinutes(setHours(date, hours), minutes);

    stopSell({
      sightEventId,
      ticketPoolId: poolDefinitionId,
      date: format(poolStartDate, 'yyyy-MM-dd'),
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

    this.setState({ isSubmitting: false, date: new Date(), submittingError: null });

    onClose();
  };

  render() {
    const {
      alertDialog, isSubmitting, submittingError, date,
    } = this.state;
    const {
      classes, poolDefinitionId, poolDefinitionName, sightEventId, title,
      onClose, ...rest
    } = this.props;

    return (
      <Dialog onClose={onClose} aria-labelledby="form-dialog-title" {...rest}>
        <DialogTitle id="form-dialog-title">
          {title}
          {isSubmitting ? <LinearProgress /> : null}
        </DialogTitle>

        <DialogContent>
          <Grid container justify="center">
            <TextField
              className={classes.datePicker}
              label="Data"
              type="date"
              margin="normal"
              value={date ? format(date, 'yyyy-MM-dd') : ''}
              onChange={this.handleDateChange}
              inputProps={{
                min: format(new Date(), 'yyyy-MM-dd'),
              }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {submittingError && (
            <Typography className={classes.error}>{submittingError}</Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button disabled={isSubmitting} onClick={onClose} color="primary">
            Anuluj
          </Button>

          <Button
            color="primary"
            disabled={isSubmitting || !date}
            onClick={() => {
              this.handleAlertDialogOpen(
                { date, poolDefinitionId, sightEventId },
                poolDefinitionName,
              );
            }}
          >
            Zatrzymaj sprzedaż
          </Button>
        </DialogActions>

        <AlertDialog
          onCancel={this.handleAlertDialogCancel}
          onExited={this.handleAlertDialogClear}
          {...alertDialog}
        />
      </Dialog>
    );
  }
}

SightFormDialog.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  error: PropTypes.shape({}),
  onClose: PropTypes.func.isRequired,
  poolDefinitionId: PropTypes.number,
  poolDefinitionName: PropTypes.string,
  sightEventId: PropTypes.number,
  startDate: PropTypes.string,
  stopSell: PropTypes.func,
  title: PropTypes.string,
};

SightFormDialog.defaultProps = {
  title: null,
  poolDefinitionId: null,
  poolDefinitionName: null,
  sightEventId: null,
  startDate: null,
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
