import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import ClearIcon from '@material-ui/icons/Clear';
import format from 'date-fns/format';
import setHours from 'date-fns/setHours';
import setMinutes from 'date-fns/setMinutes';
import SwitchLabel from 'components/SwitchLabel';
import formatPrice from 'utils/formatPrice';
import AlertDialog from 'components/AlertDialog';

import CalendarEventController from './CalendarEventController';
import TicketDefinitionList from './TicketDefinitionList';
import TicketDefinitionForm from '../TicketDefinitionForm/TicketDefinitionForm';

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

const NORMAL_TICKET_CODE = 'NORMALNY';

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
  horizontal: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
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
  nativeDateField: {
    marginRight: theme.spacing.unit * 2,
  },
  nativeTimeField: {
    marginRight: theme.spacing.unit,
    width: 110,
  },
});

function getNormalizedDay(dateObj) {
  const day = (new Date(dateObj)).getDay();

  if (day === 0) {
    return 7;
  }

  return day;
}

function toDateInputValue(value) {
  if (!value) return '';
  return format(new Date(value), 'yyyy-MM-dd');
}

function toTimeInputValue(value) {
  if (!value) return '';
  return format(new Date(value), 'HH:mm');
}

function mergeDateAndTime(baseValue, timeValue) {
  const [hours, minutes] = timeValue.split(':').map(Number);
  let nextDate = new Date(baseValue);

  nextDate = setHours(nextDate, hours || 0);
  nextDate = setMinutes(nextDate, minutes || 0);

  return nextDate;
}

function getTicketTypeCode(ticketDefinition) {
  return ticketDefinition &&
    ticketDefinition.ticketType &&
    ticketDefinition.ticketType.code
    ? ticketDefinition.ticketType.code
    : null;
}

class CalendarEventForm extends React.Component {
  state = {
    alertDialog: {
      content: null,
      onSubmit: null,
      open: false,
      title: null,
    },
  };

  handleAlertDialogClear = () => this.setState({
    alertDialog: {
      content: null,
      onSubmit: null,
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

  handleAlertDialogOpen = alertDialog => this.setState({ alertDialog });

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
      frequencyData.daysOfWeek = [getNormalizedDay(startDate)];
    }

    callback(frequencyData);
  };

  isChecked = (data, element) => data && data.some(item => element === item);

  hasTicketAvailabilityLimit = ticketDefinitions =>
    ticketDefinitions.some(
      ({ availableTicketsNumber }) =>
        Number.isInteger(availableTicketsNumber) && availableTicketsNumber > 0,
    );

  hasNormalTicket = ticketDefinitions =>
    Array.isArray(ticketDefinitions) &&
    ticketDefinitions.some(
      ticketDefinition => getTicketTypeCode(ticketDefinition) === NORMAL_TICKET_CODE,
    );

  render() {
    const { alertDialog } = this.state;
    const {
      classes,
      formData: initialFormData,
      onChange,
      readOnly,
    } = this.props;

    return (
      <div>
        <CalendarEventController
          readOnly={readOnly}
          formData={initialFormData}
          onChange={onChange}
        >
          {({
            editMode,
            formData,
            entryStartDateOffset,
            frequencyEndDateType,
            frequencyType,
            selectedTicketDefinitionId,
            ticketDefinitionsList,
            poolDate,
            fetchTicketDefinitions,
            handleAvailableTicketsChange,
            handleDateChange,
            handleDefinitionFormClose,
            handleDefinitionFormOpen,
            handleFormDataChange,
            handleEntryStartDateOffsetChange,
            handleFrequencyDataChange,
            handleFrequencyDataFieldChange,
            handleFrequencyEndDateTypeChange,
            handleFrequencyItemChange,
            handleFullDayChange,
            handlePoolDateChange,
            handlePropFromEventChange,
            handleTicketDefinitionAdd,
            handleTicketDefinitionChange,
            handleTicketDefinitionDelete,
            isDefinitionFormVisible,
          }) => {
            const hasNormalTicket = this.hasNormalTicket(formData.ticketDefinitions);
            const availableTicketDefinitions = (hasNormalTicket
              ? ticketDefinitionsList
              : (ticketDefinitionsList || []).filter(
                ticketDefinition => getTicketTypeCode(ticketDefinition) === NORMAL_TICKET_CODE,
              )) || [];
            const isSelectedTicketDefinitionAvailable = availableTicketDefinitions.some(
              ({ id }) => `${id}` === `${selectedTicketDefinitionId}`,
            );
            const normalizedSelectedTicketDefinitionId = isSelectedTicketDefinitionAvailable
              ? selectedTicketDefinitionId
              : '';
            const canAddSelectedTicket = !!normalizedSelectedTicketDefinitionId;

            return (
            <Grid container>
              <Typography>
                Aby Twoja oferta była widoczna dla kupujących, musisz zdefiniować termin
                i rodzaje produktów. Dla każdej oferty możesz stworzyć kilka pul produktów.
              </Typography>

              <TextField
                disabled={readOnly}
                fullWidth
                helperText="Nazwa puli będzie widoczna tylko w przypadku wielu pul w jednym dniu"
                label="Nazwa puli"
                margin="normal"
                name="name"
                onChange={handleFormDataChange}
                required
                value={formData.name != null ? formData.name : ''}
              />

              <TextField
                fullWidth
                disabled={readOnly || this.hasTicketAvailabilityLimit(formData.ticketDefinitions)}
                helperText="Puste pole - brak limitu"
                label="Limit produktów w puli"
                margin="normal"
                name="availableTicketsNumber"
                onChange={handleAvailableTicketsChange}
                type="number"
                inputProps={{ min: 0 }}
                value={
                  typeof formData.availableTicketsNumber === 'number' &&
                  formData.availableTicketsNumber >= 0
                    ? formData.availableTicketsNumber
                    : ''
                }
              />

              <div className={classNames(classes.section, classes.fullWidth)}>
                <Typography variant="subtitle1" gutterBottom>
                  Termin *:
                </Typography>
              </div>

              <div className={classNames(classes.columns, classes.fullWidth)}>
                <div className={classes.horizontal}>
                  <TextField
                    className={classes.nativeDateField}
                    type="date"
                    disabled={readOnly || editMode}
                    margin="dense"
                    value={toDateInputValue(poolDate)}
                    onChange={(event) => {
                      const value = event.target.value;
                      handlePoolDateChange({
                        target: {
                          name: 'poolDate',
                          value: new Date(`${value}T00:00`),
                        },
                      });
                    }}
                    InputLabelProps={{ shrink: true }}
                  />

                  <TextField
                    className={classes.nativeTimeField}
                    type="time"
                    disabled={readOnly || editMode || formData.wholeDay}
                    margin="dense"
                    value={toTimeInputValue(formData.startDate)}
                    onChange={(event) => {
                      const value = event.target.value;
                      handleDateChange({
                        target: {
                          name: 'startDate',
                          value: mergeDateAndTime(formData.startDate, value),
                        },
                      });
                    }}
                    InputLabelProps={{ shrink: true }}
                  />

                  <TextField
                    className={classes.nativeTimeField}
                    type="time"
                    disabled={readOnly || editMode || formData.wholeDay}
                    margin="dense"
                    value={toTimeInputValue(formData.endDate)}
                    onChange={(event) => {
                      const value = event.target.value;
                      handleDateChange({
                        target: {
                          name: 'endDate',
                          value: mergeDateAndTime(formData.endDate, value),
                        },
                      });
                    }}
                    InputLabelProps={{ shrink: true }}
                  />
                </div>

                <SwitchLabel
                  label="Cały dzień"
                  disabled={readOnly || editMode}
                  name="wholeDay"
                  onChange={handleFullDayChange}
                  value={formData.wholeDay}
                />
              </div>

              <div className={classNames(classes.section, classes.fullWidth)}>
                <div>
                  <Typography variant="subtitle1" gutterBottom>
                    Powtarzaj co:
                  </Typography>
                  <TextField
                    disabled={readOnly || editMode}
                    onChange={this.handleBasicFrequencyChange(handleFrequencyDataChange)}
                    select
                    value={frequencyType}
                  >
                    {basicFrequencies.map(({ label, value }) => (
                      <MenuItem key={value} value={value}>
                        {label}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>

                {frequencyType === 'CUSTOM' && (
                  <div className={classNames(classes.section, classes.fullWidth)}>
                    <Typography variant="subtitle1" gutterBottom>
                      Powtarzanie niestandardowe
                    </Typography>

                    <div className={classNames(classes.inline, classes.fullWidth)}>
                      <Typography>Powtarzaj co:</Typography>

                      <TextField
                        className={classes.frequencyTextfield}
                        disabled={readOnly || editMode}
                        onChange={this.handleFrequencyPropChange(handleFrequencyDataChange)}
                        name="frequency"
                        type="number"
                        value={
                          formData.frequencyData && formData.frequencyData.frequency != null
                            ? formData.frequencyData.frequency
                            : ''
                        }
                      />

                      <TextField
                        disabled={readOnly || editMode}
                        onChange={this.handleFrequencyPropChange(
                          handleFrequencyDataChange,
                          formData.startDate,
                        )}
                        name="frequencyType"
                        select
                        value={
                          formData.frequencyData &&
                          formData.frequencyData.frequencyType != null
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

                    {formData.frequencyData &&
                      formData.frequencyData.frequencyType === 'WEEKLY' && (
                        <div className={classNames(classes.section, classes.fullWidth)}>
                          <Typography>Powtarzaj w:</Typography>

                          {daysOfWeekDefinitions.map(({ label, value }) => (
                            <FormControlLabel
                              key={`${label}-${value}`}
                              control={(
                                <Checkbox
                                  checked={this.isChecked(
                                    formData.frequencyData.daysOfWeek,
                                    value,
                                  )}
                                  disabled={readOnly || editMode}
                                  onChange={handleFrequencyItemChange}
                                  name="daysOfWeek"
                                  value={`${value}`}
                                />
                              )}
                              label={label}
                            />
                          ))}
                        </div>
                      )}
                  </div>
                )}

                {frequencyType !== 'NONE' && (
                  <div className={classNames(classes.section, classes.fullWidth)}>
                    <Typography variant="subtitle1">Kończy się:</Typography>

                    <RadioGroup
                      aria-label="Koniec puli"
                      name="frequencyEndDateType"
                      value={frequencyEndDateType}
                      onChange={handleFrequencyEndDateTypeChange}
                    >
                      <FormControlLabel
                        value="NONE"
                        control={<Radio />}
                        disabled={readOnly || editMode}
                        label="Nigdy"
                      />

                      <FormControlLabel
                        value="SINGLE"
                        disabled={readOnly || editMode}
                        control={<Radio />}
                        label={(
                          <div className={classNames(classes.frequencyRadioWrapper)}>
                            <Typography
                              className={classNames(
                                readOnly || editMode
                                  ? [classes.disabled, classes.frequencyRadioLabel]
                                  : classes.frequencyRadioLabel,
                              )}
                            >
                              W dniu
                            </Typography>

                            {frequencyEndDateType === 'SINGLE' && (
                              <TextField
                                className={classes.nativeDateField}
                                type="date"
                                disabled={readOnly || editMode}
                                margin="dense"
                                value={toDateInputValue(
                                  formData.frequencyData && formData.frequencyData.endDate,
                                )}
                                onChange={(event) => {
                                  const value = event.target.value;
                                  handleFrequencyDataFieldChange({
                                    target: {
                                      name: 'endDate',
                                      value: value ? new Date(`${value}T00:00`) : null,
                                    },
                                  });
                                }}
                                inputProps={{
                                  min: toDateInputValue(formData.endDate),
                                }}
                                InputLabelProps={{ shrink: true }}
                              />
                            )}
                          </div>
                        )}
                      />
                    </RadioGroup>
                  </div>
                )}
              </div>

              {!readOnly && (
                <div className={classNames(classes.section, classes.fullWidth)}>
                  <Typography variant="h6" gutterBottom>
                    Produkty *
                  </Typography>

                  {!hasNormalTicket && (
                    <Typography color="error" gutterBottom>
                      Najpierw dodaj do puli bilet typu Normalny. Potem mozna dodac pozostale typy biletow.
                    </Typography>
                  )}

                  <div className={classNames(classes.columns, classes.fullWidth)}>
                    <TextField
                      onChange={event => handlePropFromEventChange(event)}
                      name="selectedTicketDefinitionId"
                      select
                      SelectProps={{
                        displayEmpty: true,
                      }}
                      value={normalizedSelectedTicketDefinitionId}
                    >
                      <MenuItem disabled value="">
                        Wybierz rodzaj produktu
                      </MenuItem>

                      {availableTicketDefinitions &&
                        availableTicketDefinitions.map(({ id, name, price, ticketType }) => (
                          <MenuItem key={`${id}-${name}`} value={id}>
                            {`${ticketType ? ticketType.label : name} - ${name} - ${formatPrice(price)}`}
                          </MenuItem>
                        ))}
                    </TextField>

                    <div>
                      <Button
                        disabled={!canAddSelectedTicket}
                        onClick={() => handleTicketDefinitionAdd(+normalizedSelectedTicketDefinitionId)}
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
                        Nowy produkt
                      </Button>
                    </div>
                  </div>

                  {formData.ticketDefinitions && (
                    <TicketDefinitionList
                      disableAvailability={
                        Number.isInteger(formData.availableTicketsNumber) &&
                        formData.availableTicketsNumber > 0
                      }
                      items={formData.ticketDefinitions}
                      onChange={handleTicketDefinitionChange}
                      onDelete={ticketDefinition =>
                        this.handleAlertDialogOpen({
                          content: `Próbujesz usunąć produkt o nazwie "${ticketDefinition.name}". Kontynuować?`,
                          onSuccess: () => {
                            handleTicketDefinitionDelete(ticketDefinition.id);
                            this.handleAlertDialogCancel();
                          },
                          open: true,
                          title: 'Czy na pewno usunąć wybrany produkt?',
                        })
                      }
                      readOnly={readOnly}
                    />
                  )}

                  {isDefinitionFormVisible && !readOnly && (
                    <div className={classNames(classes.section, classes.fullWidth)}>
                      <Grid container direction="row" alignItems="center">
                        <Grid item>
                          <Typography variant="h6">
                            Nowy rodzaj produktu
                          </Typography>
                        </Grid>

                        <Grid item>
                          <IconButton onClick={handleDefinitionFormClose}>
                            <ClearIcon />
                          </IconButton>
                        </Grid>
                      </Grid>

                      <TicketDefinitionForm
                        lockedTicketTypeCode={!hasNormalTicket ? NORMAL_TICKET_CODE : null}
                        onSubmitSuccess={(ticketDefinitionId) => {
                          fetchTicketDefinitions({
                            onSuccess: () => handleTicketDefinitionAdd(ticketDefinitionId),
                          });
                          handleDefinitionFormClose();
                        }}
                      />
                    </div>
                  )}
                </div>
              )}

              <div className={classNames(classes.section, classes.fullWidth)}>
                <Typography variant="subtitle1">Sprawdzanie produktów:</Typography>

                <TextField
                  disabled={readOnly || editMode}
                  onChange={handleEntryStartDateOffsetChange}
                  name="entryStartDateOffset"
                  select
                  value={entryStartDateOffset}
                >
                  <MenuItem value={0}>
                    równo z godziną rozpoczęcia
                  </MenuItem>
                  <MenuItem value={15}>
                    15 minut wcześniej
                  </MenuItem>
                  <MenuItem value={30}>
                    30 minut wcześniej
                  </MenuItem>
                  <MenuItem value={60}>
                    60 minut wcześniej
                  </MenuItem>
                </TextField>
              </div>
            </Grid>
            );
          }}
        </CalendarEventController>

        <AlertDialog
          onCancel={this.handleAlertDialogCancel}
          onExited={this.handleAlertDialogClear}
          {...alertDialog}
        />
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
