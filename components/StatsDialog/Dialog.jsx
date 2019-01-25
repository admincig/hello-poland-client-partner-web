import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DatePicker from 'material-ui-pickers/DatePicker';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';
import plLocale from 'date-fns/locale/pl';

const locale = {
  pl: plLocale,
};

class StatsDialog extends React.Component {
  state = {
    fromDate: new Date(),
    toDate: new Date(),
  };

  handleDateChange = (key, value) => this.setState({ [key]: value });

  handleSubmit = () => {
    const { onSubmit } = this.props;

    onSubmit({ ...this.state });
  };

  render() {
    const { fromDate, toDate } = this.state;
    const { onClose, onSubmit, ...props } = this.props;

    return (
      <Dialog
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        onClose={onClose}
        {...props}
      >
        <DialogTitle id="alert-dialog-title">Statystyki sprzedaży</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Wybierz okres, z którego ma zostać wygenerowany raport:
          </DialogContentText>
          <MuiPickersUtilsProvider locale={locale.pl} utils={DateFnsUtils}>
            <DatePicker
              format="DD MMM YYYY"
              label="Od"
              margin="normal"
              onChange={date => this.handleDateChange('fromDate', date)}
              value={fromDate}
            />
            <DatePicker
              format="DD MMM YYYY"
              label="Od"
              margin="normal"
              onChange={date => this.handleDateChange('toDate', date)}
              value={toDate}
            />
          </MuiPickersUtilsProvider>
          <Button onClick={this.handleSubmit} color="secondary">
            Pobierz
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Zamknij
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

StatsDialog.propTypes = {
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
};

StatsDialog.defaultProps = {
  onClose: null,
  onSubmit: null,
};

export default StatsDialog;
