import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect, ReactReduxContext } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import DatePicker from 'material-ui-pickers/DatePicker';
import MuiPickersUtilsProvider from 'material-ui-pickers/MuiPickersUtilsProvider';
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';
import format from 'date-fns/format';
import plLocale from 'date-fns/locale/pl';

const REPORT_TYPES = {
  INSTANCE: 'INSTANCE',
  PERIOD: 'PERIOD',
};

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
  spacer: {
    height: theme.spacing.unit * 4,
  },
});

class StatsDialog extends React.Component {
  state = {
    fromDate: (new Date()).setMonth((new Date()).getMonth() - 1),
    toDate: new Date(),
    instanceFromDate: new Date(),
  };

  csvPeriodRef = React.createRef();

  csvInstanceRef = React.createRef();

  handleDateChange = (key, value) => this.setState({ [key]: value });

  handleSubmit = (type, csvRef, store) => {
    const { logicMiddleware } = store;
    const { httpClient } = logicMiddleware || {};

    let href = '/analytics/orders';
    let downloadSuffix = '';

    if (type === REPORT_TYPES.INSTANCE) {
      const { instanceFromDate } = this.state;
      const formattedFromDate = format(instanceFromDate, 'YYYY-MM-DD');

      href = `${href}?fromDate=${formattedFromDate}`;
      downloadSuffix = formattedFromDate.replace(/-/g, '');
    } else {
      const { fromDate, toDate } = this.state;
      const formattedFromDate = format(fromDate, 'YYYY-MM-DD');
      const formattedToDate = format(toDate, 'YYYY-MM-DD');

      href = `${href}?fromDate=${formattedFromDate}&toDate=${formattedToDate}`;
      downloadSuffix = `${formattedFromDate.replace(/-/g, '')}-${formattedToDate.replace(/-/g, '')}`;
    }

    httpClient
      .get(href, { responseType: 'blob' })
      .then((response) => {
        const hiddenAnchor = csvRef.current;
        const blob = new Blob([response.data], { type: 'application/octet-stream' });

        hiddenAnchor.href = URL.createObjectURL(blob);
        hiddenAnchor.download = `hp-sales_${downloadSuffix}.csv`;
        hiddenAnchor.click();
      });
  };

  render() {
    const { fromDate, instanceFromDate, toDate } = this.state;
    const {
      classes, dispatch, onClose, ...props
    } = this.props;

    return (
      <ReactReduxContext.Consumer>
        {({ store }) => (
          <Dialog
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            onClose={onClose}
            {...props}
          >
            <DialogTitle id="alert-dialog-title">Statystyki sprzedaży</DialogTitle>
            <DialogContent>
              <MuiPickersUtilsProvider locale={locale.pl} utils={DateFnsUtils}>
                <DialogContentText>
                  Pobierz raport sprzedaży w okresie:
                </DialogContentText>
                <Grid container>
                  <DatePicker
                    className={classes.datePicker}
                    format="DD MMM YYYY"
                    label="Od"
                    margin="normal"
                    maxDate={toDate}
                    onChange={date => this.handleDateChange('fromDate', date)}
                    value={fromDate}
                  />
                  <DatePicker
                    className={classes.datePicker}
                    format="DD MMM YYYY"
                    label="Do"
                    margin="normal"
                    minDate={fromDate}
                    onChange={date => this.handleDateChange('toDate', date)}
                    value={toDate}
                  />
                  <Button
                    className={classes.downloadBtn}
                    color="secondary"
                    onClick={() => {
                      this.handleSubmit(REPORT_TYPES.PERIOD, this.csvPeriodRef, store);
                    }}
                  >
                    Pobierz
                  </Button>
                  <a style={{ display: 'none' }} href="/" ref={this.csvPeriodRef}>ref</a>
                </Grid>
                <div className={classes.spacer} />
                <DialogContentText>
                  Sprawdź oferty sprzedane na dany dzień:
                </DialogContentText>
                <Grid container>
                  <DatePicker
                    className={classes.datePicker}
                    format="DD MMM YYYY"
                    margin="normal"
                    onChange={date => this.handleDateChange('instanceFromDate', date)}
                    value={instanceFromDate}
                  />
                  <Button
                    className={classes.downloadBtn}
                    color="secondary"
                    onClick={() => {
                      this.handleSubmit(REPORT_TYPES.INSTANCE, this.csvInstanceRef, store);
                    }}
                  >
                    Pobierz
                  </Button>
                  <a style={{ display: 'none' }} href="/" ref={this.csvInstanceRef}>ref</a>
                </Grid>
              </MuiPickersUtilsProvider>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose} color="primary">
                Zamknij
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </ReactReduxContext.Consumer>
    );
  }
}

StatsDialog.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  dispatch: PropTypes.func.isRequired,
  onClose: PropTypes.func,
};

StatsDialog.defaultProps = {
  onClose: null,
};

export default compose(
  connect(() => ({})),
  withStyles(styles),
)(StatsDialog);
