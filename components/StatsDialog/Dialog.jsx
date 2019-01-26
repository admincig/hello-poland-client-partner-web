import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import DatePicker from 'material-ui-pickers/DatePicker';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';
import format from 'date-fns/format';
import plLocale from 'date-fns/locale/pl';
import Link from 'next/link';

const locale = {
  pl: plLocale,
};

const styles = theme => ({
  datePicker: {
    width: 90,
    marginRight: 20,
  },
  downloadBtn: {
    alignSelf: 'flex-end',
    marginBottom: theme.spacing.unit / 2,
  },
});

class StatsDialog extends React.Component {
  state = {
    fromDate: (new Date()).setMonth((new Date()).getMonth() - 1),
    toDate: new Date(),
  };

  handleDateChange = (key, value) => this.setState({ [key]: value });

  handleSubmit = () => {
    const { onSubmit } = this.props;

    onSubmit({ ...this.state });
  };

  render() {
    const { fromDate, toDate } = this.state;
    const {
      classes, onClose, onSubmit, ...props
    } = this.props;

    const formattedFromDate = format(fromDate, 'YYYY-MM-DD');
    const formattedToDate = format(toDate, 'YYYY-MM-DD');
    const href = `/api/partner/analytics/orders?fromDate=${formattedFromDate}&toDate=${formattedToDate}`;

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
          <Grid container>
            <MuiPickersUtilsProvider locale={locale.pl} utils={DateFnsUtils}>
              <DatePicker
                className={classes.datePicker}
                format="DD MMM YYYY"
                label="Od"
                margin="normal"
                onChange={date => this.handleDateChange('fromDate', date)}
                value={fromDate}
              />
              <DatePicker
                className={classes.datePicker}
                format="DD MMM YYYY"
                label="Do"
                margin="normal"
                onChange={date => this.handleDateChange('toDate', date)}
                value={toDate}
              />
            </MuiPickersUtilsProvider>
            <Link href={href} passHref prefetch>
              <Button
                className={classes.downloadBtn}
                color="secondary"
                component="a"
                onClick={this.handleSubmit}
              >
                Pobierz
              </Button>
            </Link>
          </Grid>
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
  classes: PropTypes.shape({}).isRequired,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
};

StatsDialog.defaultProps = {
  onClose: null,
  onSubmit: null,
};

export default withStyles(styles)(StatsDialog);
