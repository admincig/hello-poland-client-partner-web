import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import SwitchLabel from 'components/SwitchLabel';

import plLocale from 'date-fns/locale/pl';

import CalendarEventController from './CalendarEventController';
import DateTimePicker from './DateTimePicker';

const locale = {
  pl: plLocale,
};

const frequencyTypes = {
  DAILY: 'DAILY',
  MONTHLY: 'MONTHLY',
  WEEKLY: 'WEEKLY',
};
const basicFrequencies = [
  {
    value: 'null',
    label: 'Nie powtarza się'
  },
  {
    value: 'DAILY',
    label: 'Codziennie',
  },
  {
    value: 'WEEKDAYS',
    label: 'Dni robocze',
  },
  {
    value: 'WEEKENDS',
    label: 'Weekendy',
  },
  {
    value: 'CUSTOM',
    label: 'Niestandardowe...',
  },
];

// const basicFrequencyTypes = [null, ...Object.values(frequencyTypes)].map(type => {
//   return {
//     value: type,
//     label:
//   }
// });

const styles = () => ({
  columns: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
});

const CalendarEventForm = ({ classes }) => (
  <div style={{ margin: 40 }}>
    <CalendarEventController>
      {({
          formData, frequencyType, handleDateChange, handlePropFromEventChange,
          handleFormDataChange, isFullDay,
      }) => (
        <MuiPickersUtilsProvider locale={locale.pl} utils={DateFnsUtils}>
          <Grid container>
            <TextField
              fullWidth
              label="Nazwa"
              margin="normal"
              onChange={handleFormDataChange('name')}
              value={formData.name != null ? formData.name : ''}
            />
            <div className={classes.columns}>
              <DateTimePicker
                date={formData.startDate}
                fullDay={isFullDay}
                label="Od"
                onChange={handleDateChange('startDate')}
              />
              <DateTimePicker
                date={formData.endDate}
                fullDay={isFullDay}
                label="Do"
                onChange={handleDateChange('endDate')}
              />
            </div>
            <div className={classes.columns}>
              <DateTimePicker
                date={formData.entryStartDate}
                fullDay={isFullDay}
                label="Wejście od"
                onChange={handleDateChange('entryStartDate')}
              />
              <DateTimePicker
                date={formData.entryEndDate}
                fullDay={isFullDay}
                label="Wejście do"
                onChange={handleDateChange('entryEndDate')}
              />
            </div>
            <SwitchLabel
              label="Cały dzień"
              name="isFullDay"
              onChange={handlePropFromEventChange('isFullDay')}
              value={isFullDay}
            />
            <TextField
              margin="normal"
              onChange={handlePropFromEventChange('frequencyType')}
              select
              value={frequencyType}
            >
              {basicFrequencies.map(({ label, value }) => (
                <MenuItem
                  key={value}
                  value={value}
                >
                  {label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </MuiPickersUtilsProvider>
      )}
    </CalendarEventController>
  </div>
);

CalendarEventForm.propTypes = {
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(CalendarEventForm);
