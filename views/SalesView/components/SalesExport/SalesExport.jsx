import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect, ReactReduxContext } from 'react-redux';
import format from 'date-fns/format';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';

const REPORT_TYPES = {
  INSTANCE: 'INSTANCE',
  PERIOD: 'PERIOD',
};

const styles = theme => ({
  datePicker: {
    marginRight: 20,
    width: 150,
  },
  downloadBtn: {
    alignSelf: 'flex-end',
    marginBottom: theme.spacing.unit / 2,
  },
  spacer: {
    height: theme.spacing.unit * 4,
  },
});

class SalesExport extends React.Component {
  state = {
    fromDate: (new Date()).setMonth((new Date()).getMonth() - 1),
    toDate: new Date(),
    instanceFromDate: new Date(),
  };

  csvPeriodRef = React.createRef();

  csvInstanceRef = React.createRef();

  handleDateChange = (key, event) => {
    const value = event.target.value;

    this.setState({
      [key]: value ? new Date(`${value}T00:00`) : null,
    });
  };

  handleSubmit = (type, csvRef, store) => {
    const { logicMiddleware } = store;
    const { httpClient } = logicMiddleware || {};

    let href = '/analytics/orders';
    let downloadSuffix = '';

    if (type === REPORT_TYPES.INSTANCE) {
      const { instanceFromDate } = this.state;
      const formattedFromDate = format(instanceFromDate, 'yyyy-MM-dd');

      href = `${href}?fromDate=${formattedFromDate}`;
      downloadSuffix = formattedFromDate.replace(/-/g, '');
    } else {
      const { fromDate, toDate } = this.state;
      const formattedFromDate = format(fromDate, 'yyyy-MM-dd');
      const formattedToDate = format(toDate, 'yyyy-MM-dd');

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
    const { classes } = this.props;

    return (
      <ReactReduxContext.Consumer>
        {({ store }) => (
          <React.Fragment>
            <Typography>
              Pobierz raport sprzedaży w okresie:
            </Typography>

            <Grid container>
              <TextField
                className={classes.datePicker}
                type="date"
                label="Od"
                margin="normal"
                value={fromDate ? format(fromDate, 'yyyy-MM-dd') : ''}
                onChange={event => this.handleDateChange('fromDate', event)}
                inputProps={{
                  max: toDate ? format(toDate, 'yyyy-MM-dd') : undefined,
                }}
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                className={classes.datePicker}
                type="date"
                label="Do"
                margin="normal"
                value={toDate ? format(toDate, 'yyyy-MM-dd') : ''}
                onChange={event => this.handleDateChange('toDate', event)}
                inputProps={{
                  min: fromDate ? format(fromDate, 'yyyy-MM-dd') : undefined,
                }}
                InputLabelProps={{ shrink: true }}
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

            <Typography>
              Sprawdź oferty sprzedane na dany dzień:
            </Typography>

            <Grid container>
              <TextField
                className={classes.datePicker}
                type="date"
                margin="normal"
                value={instanceFromDate ? format(instanceFromDate, 'yyyy-MM-dd') : ''}
                onChange={event => this.handleDateChange('instanceFromDate', event)}
                InputLabelProps={{ shrink: true }}
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
          </React.Fragment>
        )}
      </ReactReduxContext.Consumer>
    );
  }
}

SalesExport.propTypes = {
  classes: PropTypes.shape({}).isRequired,
};

export default compose(
  connect(() => ({})),
  withStyles(styles),
)(SalesExport);
