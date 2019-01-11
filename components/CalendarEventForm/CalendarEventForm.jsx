import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import SwitchLabel from 'components/SwitchLabel';
import formatPrice from 'utils/formatPrice';

import plLocale from 'date-fns/locale/pl';

import CalendarEventController from './CalendarEventController';
import DateTimePicker from './DateTimePicker';
import TicketDefinitionList from './TicketDefinitionList';
import TicketDefinitionForm from '../TicketDefinitionForm/TicketDefinitionForm';

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
      endDate: null,
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
  frequencyRadioWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  frequencyRadioLabel: {
    marginRight: 40,
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
  section: {
    marginTop: theme.spacing.unit * 3,
  },
  vertical: {
    display: 'flex',
    alignItems: 'center',
  },
  disabled: {
    color: 'rgba(0, 0, 0, 0.38)',
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

  hasTicketAvailabilityLimit = ticketDefinitions => ticketDefinitions
    .some(({ availableTicketsNumber }) => (
      Number.isInteger(availableTicketsNumber) && availableTicketsNumber > 0
    ));

  render() {
    const {
      classes, formData: initialFormData, onChange, readOnly,
    } = this.props;
    return (
      <div>
        <CalendarEventController readOnly={readOnly} formData={initialFormData} onChange={onChange}>
          {({
            formData, frequencyEndDateType, frequencyType, selectedTicketDefinitionId,
            ticketDefinitionsList, fetchTicketDefinitions,
            handleAvailableTicketsChange, handleDateChange, handleDefinitionFormClose,
            handleDefinitionFormOpen, handleFormDataChange, handleFrequencyDataChange,
            handleFrequencyDataFieldChange, handleFrequencyEndDateTypeChange,
            handleFrequencyItemChange, handleFullDayChange, handlePropFromEventChange,
            handleTicketDefinitionAdd, handleTicketDefinitionChange, handleTicketDefinitionDelete,
            isFullDay, isDefinitionFormVisible,
          }) => (
            <MuiPickersUtilsProvider locale={locale.pl} utils={DateFnsUtils}>
              <Grid container>
                <TextField
                  disabled={readOnly}
                  fullWidth
                  label="Nazwa"
                  margin="normal"
                  name="name"
                  onChange={handleFormDataChange}
                  value={formData.name != null ? formData.name : ''}
                />
                <TextField
                  fullWidth
                  disabled={readOnly || this.hasTicketAvailabilityLimit(formData.ticketDefinitions)}
                  label="Limit biletów w puli"
                  margin="normal"
                  name="availableTicketsNumber"
                  onChange={handleAvailableTicketsChange}
                  type="number"
                  value={
                    formData.availableTicketsNumber && formData.availableTicketsNumber > 0
                      ? formData.availableTicketsNumber : ''
                  }
                />
                <div className={classNames(classes.columns, classes.fullWidth)}>
                  <DateTimePicker
                    disabled={readOnly}
                    date={formData.startDate}
                    fullDay={isFullDay}
                    label="Wydarzenie od"
                    name="startDate"
                    onChange={handleDateChange}
                    DatePickerProps={{
                      disabled: readOnly,
                    }}
                    TimePickerProps={{
                      disabled: readOnly,
                    }}
                  />
                  <DateTimePicker
                    disabled={readOnly}
                    date={formData.endDate}
                    fullDay={isFullDay}
                    label="Wydarzenie do"
                    name="endDate"
                    onChange={handleDateChange}
                    DatePickerProps={{
                      disabled: readOnly,
                      minDate: formData.startDate,
                    }}
                    TimePickerProps={{
                      disabled: readOnly,
                    }}
                  />
                </div>
                <div className={classNames(classes.columns, classes.fullWidth)}>
                  <DateTimePicker
                    disabled={readOnly}
                    date={formData.entryStartDate}
                    fullDay={isFullDay}
                    label="Wejście od"
                    name="entryStartDate"
                    onChange={handleDateChange}
                    DatePickerProps={{
                       disabled: readOnly,
                    }}
                    TimePickerProps={{
                      disabled: readOnly,
                    }}
                  />
                  <DateTimePicker
                    disabled={readOnly}
                    date={formData.entryEndDate}
                    fullDay={isFullDay}
                    label="Wejście do"
                    name="entryEndDate"
                    onChange={handleDateChange}
                    DatePickerProps={{
                      disabled: readOnly,
                      minDate: formData.entryEndDate,
                    }}
                    TimePickerProps={{
                      disabled: readOnly,
                    }}
                  />
                </div>
                <div className={classNames(classes.vertical, classes.fullWidth)}>
                  <SwitchLabel
                    label="Cały dzień"
                    disabled={readOnly}
                    name="isFullDay"
                    onChange={handleFullDayChange}
                    value={isFullDay}
                  />
                </div>
                <div className={classNames(classes.section, classes.fullWidth)}>
                  <div>
                    <Typography variant="title" gutterBottom>
                      Ustawienia powtarzalności
                    </Typography>
                    <TextField
                      disabled={readOnly}
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
                    <div className={classNames(classes.section, classes.fullWidth)}>
                      <Typography variant="title" gutterBottom>
                        Powtarzanie niestandardowe
                      </Typography>
                      <div className={classNames(classes.inline, classes.fullWidth)}>
                        <Typography>Powtarzaj co:</Typography>
                        <TextField
                          className={classes.frequencyTextfield}
                          disabled={readOnly}
                          onChange={this.handleFrequencyPropChange(handleFrequencyDataChange)}
                          name="frequency"
                          type="number"
                          value={formData.frequencyData && formData.frequencyData.frequency != null
                            ? formData.frequencyData.frequency
                            : ''
                            }
                        />
                        <TextField
                          disabled={readOnly}
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
                            <MenuItem key={value} value={value}>
                              {label}
                            </MenuItem>
                          ))}
                        </TextField>
                      </div>
                      {formData.frequencyData && formData.frequencyData.frequencyType === 'WEEKLY' &&
                        <div className={classNames(classes.section, classes.fullWidth)}>
                          <Typography>Powtarzaj w:</Typography>
                          {daysOfWeekDefinitions.map(({ label, value }) => (
                            <FormControlLabel
                              key={`${label}-${value}`}
                              control={
                                <Checkbox
                                  checked={this.isChecked(formData.frequencyData.daysOfWeek, value)}
                                  disabled={readOnly}
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
                      <div className={classNames(classes.section, classes.fullWidth)}>
                        <Typography>Kończy się:</Typography>
                        <RadioGroup
                          aria-label="Koniec puli"
                          name="frequencyEndDateType"
                          value={frequencyEndDateType}
                          onChange={handleFrequencyEndDateTypeChange}
                        >
                          <FormControlLabel
                            value="NONE"
                            control={<Radio />}
                            disabled={readOnly}
                            label="Nigdy"
                          />
                          <FormControlLabel
                            value="SINGLE"
                            disabled={readOnly}
                            control={<Radio />}
                            label={
                              <div className={classNames(classes.frequencyRadioWrapper)}>
                                <Typography className={classNames(readOnly
                                  ? [classes.disabled, classes.frequencyRadioLabel]
                                  : classes.frequencyRadioLabel)}
                                >
                                  W dniu
                                </Typography>
                                {frequencyEndDateType === 'SINGLE' &&
                                  <DateTimePicker
                                    date={formData.frequencyData.endDate}
                                    fullDay
                                    name="endDate"
                                    onChange={handleFrequencyDataFieldChange}
                                    DatePickerProps={{
                                      disabled: readOnly,
                                      minDate: formData.endDate,
                                    }}
                                  />
                                }
                              </div>
                            }
                          />
                        </RadioGroup>
                      </div>
                    </div>
                  }
                </div>
                {!readOnly &&
                  <div className={classNames(classes.section, classes.fullWidth)}>
                    <Typography variant="title" gutterBottom>
                      Bilety
                    </Typography>
                    {!readOnly &&
                      <div className={classNames(classes.columns, classes.fullWidth)}>
                        <TextField
                          onChange={event => handlePropFromEventChange(event)}
                          name="selectedTicketDefinitionId"
                          select
                          SelectProps={{
                            displayEmpty: true,
                          }}
                          value={selectedTicketDefinitionId}
                        >
                          <MenuItem
                            disabled
                            value=""
                          >
                            Wybierz definicję biletu
                          </MenuItem>
                          {ticketDefinitionsList &&
                            ticketDefinitionsList.map(({ id, name, price }) => (
                              <MenuItem
                                key={`${id}-${name}`}
                                value={id}
                              >
                                {`${name} - ${formatPrice(price)}`}
                              </MenuItem>
                            ))
                            }
                        </TextField>
                        <div>
                          <Button
                            onClick={() => handleTicketDefinitionAdd(+selectedTicketDefinitionId)}
                            style={{ marginRight: 10 }}
                            variant="outlined"
                          >
                            Dodaj do puli
                          </Button>
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={handleDefinitionFormOpen}
                          >
                            Zdefiniuj bilet
                          </Button>
                        </div>
                      </div>
                    }
                    {formData.ticketDefinitions &&
                      <TicketDefinitionList
                        disableAvailability={
                          Number.isInteger(formData.availableTicketsNumber)
                          && formData.availableTicketsNumber > 0
                        }
                        ticketDefinitions={formData.ticketDefinitions}
                        ticketDefinitionsList={ticketDefinitionsList}
                        onAvailabilityChange={handleTicketDefinitionChange}
                        onDeleteClick={handleTicketDefinitionDelete}
                        readOnly={readOnly}
                      />
                    }
                    {isDefinitionFormVisible && !readOnly &&
                      <div className={classNames(classes.section, classes.fullWidth)}>
                        <Typography variant="title">
                          Nowy rodzaj biletu
                        </Typography>
                        <TicketDefinitionForm
                          onReset={handleDefinitionFormClose}
                          onSubmitSuccess={(ticketDefinitionId) => {
                            fetchTicketDefinitions();
                            handleTicketDefinitionAdd(ticketDefinitionId);
                            handleDefinitionFormClose();
                          }}
                        />
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
  readOnly: PropTypes.bool,
};

CalendarEventForm.defaultProps = {
  formData: null,
  onChange: null,
  readOnly: false,
};

export default withStyles(styles)(CalendarEventForm);
