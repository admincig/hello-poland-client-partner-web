import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import withStyles from '@material-ui/core/styles/withStyles';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import SwitchLabel from 'components/SwitchLabel';

import plLocale from 'date-fns/locale/pl';

import CalendarEventController from './CalendarEventController';
import DateTimePicker from './DateTimePicker';

const locale = {
  pl: plLocale,
};

const frequencyTypes = [
  {
    label: 'dzień',
    value: 'DAILY',
  },
  {
    label: 'tydzień',
    value: 'WEEKLY',
  },
  {
    label: 'miesiąc',
    value: 'MONTHLY',
  },
];

const daysOfWeekDefinitions = [
  {
    label: 'PN',
    value: 1,
  },
  {
    label: 'WT',
    value: 2,
  },
  {
    label: 'ŚR',
    value: 3,
  },
  {
    label: 'CZ',
    value: 4,
  },
  {
    label: 'PT',
    value: 5,
  },
  {
    label: 'SO',
    value: 6,
  },
  {
    label: 'NI',
    value: 7,
  },
];

const basicFrequencies = [
  {
    frequencyData: null,
    label: 'Nie powtarza się',
    value: 'NONE',
  },
  {
    frequencyData: {
      frequency: 1,
      frequencyType: 'DAILY',
    },
    label: 'Codziennie',
    value: 'DAILY',
  },
  {
    frequencyData: {
      daysOfWeek: [1, 2, 3, 4, 5],
      frequency: 1,
      frequencyType: 'WEEKLY',
    },
    label: 'Dni robocze',
    value: 'WEEKDAYS',
  },
  {
    frequencyData: {
      daysOfWeek: [6, 7],
      frequency: 1,
      frequencyType: 'WEEKLY',
    },
    label: 'Weekendy',
    value: 'WEEKENDS',
  },
  {
    frequencyData: {
      daysOfWeek: [],
      frequency: 1,
      frequencyType: 'DAILY',
    },
    label: 'Niestandardowe...',
    value: 'CUSTOM',
  },
];

const styles = theme => ({
  columns: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  frequencyCustomizer: {
    marginTop: theme.spacing.unit * 3,
  },
  frequencyTextfield: {
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 2,
    width: 50,
  },
  fullWidth: {
    width: '100%',
  },
  inline: {
    alignItems: 'center',
    display: 'inline-flex',
  },
  vertical: {
    display: 'flex',
    alignItems: 'center',
  },
});

function getNormalizedDay(dateObj) {
  const day = (new Date(dateObj)).getDay();

  if (day === 0) {
    return 7;
  }

  return day;
}

class CalendarEventForm extends React.Component {
  handleBasicFrequencyChange = callback => (event) => {
    const type = event.target.value;
    const item = basicFrequencies.find(({ value }) => type === value);

    callback(item.frequencyData, type);
  };

  handleFrequencyPropChange = (callback, startDate) => (event) => {
    const { name, value } = event.target;
    const frequencyData = {
      [name]: value,
    };

    if (value === 'WEEKLY') {
      frequencyData.daysOfWeek = [
        getNormalizedDay(startDate),
      ];
    }

    callback(frequencyData);
  };

  isChecked = (data, element) => data && data.some(item => element === item);

  render() {
    const { classes, formData: initialFormData, onChange } = this.props;

    return (
      <div>
        <CalendarEventController formData={initialFormData} onChange={onChange}>
          {({
              formData, frequencyType, handleDateChange, handleFormDataChange,
              handleFrequencyDataChange, handleFrequencyItemChange, handleFullDayChange, isFullDay,
            }) => (
              <MuiPickersUtilsProvider locale={locale.pl} utils={DateFnsUtils}>
                <Grid container>
                  <TextField
                    fullWidth
                    label="Nazwa"
                    margin="normal"
                    name="name"
                    onChange={handleFormDataChange}
                    value={formData.name != null ? formData.name : ''}
                  />
                  <TextField
                    fullWidth
                    label="Liczba dostępnych biletów"
                    margin="normal"
                    name="availableTicketsNumber"
                    onChange={handleFormDataChange}
                    type="number"
                    value={
                      formData.availableTicketsNumber != null ? formData.availableTicketsNumber : ''
                    }
                  />
                  <div className={classNames(classes.columns, classes.fullWidth)}>
                    <DateTimePicker
                      date={formData.startDate}
                      fullDay={isFullDay}
                      label="Od"
                      name="startDate"
                      onChange={handleDateChange}
                    />
                    <DateTimePicker
                      date={formData.endDate}
                      fullDay={isFullDay}
                      label="Do"
                      name="endDate"
                      onChange={handleDateChange}
                    />
                  </div>
                  <div className={classNames(classes.columns, classes.fullWidth)}>
                    <DateTimePicker
                      date={formData.entryStartDate}
                      fullDay={isFullDay}
                      label="Wejście od"
                      name="entryStartDate"
                      onChange={handleDateChange}
                    />
                    <DateTimePicker
                      date={formData.entryEndDate}
                      fullDay={isFullDay}
                      label="Wejście do"
                      name="entryEndDate"
                      onChange={handleDateChange}
                    />
                  </div>
                  <div className={classNames(classes.vertical, classes.fullWidth)}>
                    <SwitchLabel
                      label="Cały dzień"
                      name="isFullDay"
                      onChange={handleFullDayChange}
                      value={isFullDay}
                    />
                    <TextField
                      onChange={this.handleBasicFrequencyChange(handleFrequencyDataChange)}
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
                  </div>
                  {frequencyType === 'CUSTOM' &&
                    <div className={classNames(classes.frequencyCustomizer, classes.fullWidth)}>
                      <Typography variant="title" gutterBottom>
                        Powtarzanie niestandardowe
                      </Typography>
                      <div className={classNames(classes.inline, classes.fullWidth)}>
                        <Typography>Powtarzaj co:</Typography>
                        <TextField
                          className={classes.frequencyTextfield}
                          onChange={this.handleFrequencyPropChange(handleFrequencyDataChange)}
                          name="frequency"
                          type="number"
                          value={formData.frequencyData && formData.frequencyData.frequency != null
                            ? formData.frequencyData.frequency
                            : ''
                          }
                        />
                        <TextField
                          onChange={
                            this.handleFrequencyPropChange(
                              handleFrequencyDataChange,
                              formData.startDate,
                            )
                          }
                          name="frequencyType"
                          select
                          value={
                            formData.frequencyData && formData.frequencyData.frequencyType != null
                              ? formData.frequencyData.frequencyType
                              : frequencyTypes[0].value
                          }
                        >
                          {frequencyTypes.map(({ label, value }) => (
                            <MenuItem
                              key={value}
                              value={value}
                            >
                              {label}
                            </MenuItem>
                          ))}
                        </TextField>
                      </div>
                      {formData.frequencyData && formData.frequencyData.frequencyType === 'WEEKLY' &&
                        <div className={classNames(classes.frequencyCustomizer, classes.fullWidth)}>
                          <Typography>Powtarzaj w:</Typography>
                          {daysOfWeekDefinitions.map(({ label, value }) => (
                            <FormControlLabel
                              key={`${label}-${value}`}
                              control={
                                <Checkbox
                                  checked={this.isChecked(formData.frequencyData.daysOfWeek, value)}
                                  onChange={handleFrequencyItemChange}
                                  name="daysOfWeek"
                                  value={`${value}`}
                                />
                              }
                              label={label}
                            />
                          ))}
                        </div>
                      }
                    </div>
                  }
                </Grid>
              </MuiPickersUtilsProvider>
          )}
        </CalendarEventController>
      </div>
    );
  }
}

CalendarEventForm.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  formData: PropTypes.shape({}),
  onChange: PropTypes.func,
};

CalendarEventForm.defaultProps = {
  formData: null,
  onChange: null,
};

export default withStyles(styles)(CalendarEventForm);
