import React from 'react';
import PropTypes from 'prop-types';
import _find from 'lodash/find';
import { connect } from 'react-redux';
import _cloneDeep from 'lodash/cloneDeep';
import _isNumber from 'lodash/isNumber';
import addMinutes from 'date-fns/addMinutes';
import addMonths from 'date-fns/addMonths';
import differenceInMinutes from 'date-fns/differenceInMinutes';
import format from 'date-fns/format';
import getDate from 'date-fns/getDate';
import getMonth from 'date-fns/getMonth';
import getYear from 'date-fns/getYear';
import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';
import isSameDay from 'date-fns/isSameDay';
import setDate from 'date-fns/setDate';
import setHours from 'date-fns/setHours';
import setMinutes from 'date-fns/setMinutes';
import setMonth from 'date-fns/setMonth';
import setYear from 'date-fns/setYear';
import subDays from 'date-fns/subDays';
import subMinutes from 'date-fns/subMinutes';
import {
  actions as ticketDefinitionsActions,
  selectors as ticketDefinitionsSelectors,
} from 'redux/ticketDefinitions';

const DATE_FORMAT = 'yyyy-MM-dd\'T\'HH:mm';
const MIN_TIME_INTERVAL = 30;

class CalendarEventController extends React.Component {
  constructor(props) {
    super(props);
    const { formData, readOnly } = props;
    const {
      endDate, entryEndDate, entryStartDate, frequencyData, isCyclic, startDate,
    } = formData || {};
    const { endDate: frequencyEndDate } = frequencyData || {};

    this.initialDate = this.getInitialDate(startDate);

    const initialStartDate = this.getValidStartDate(this.initialDate);
    const iED = addMinutes(this.initialDate, MIN_TIME_INTERVAL * 2);
    const initialEndDate = this.getValidEndDate(iED);

    this.state = {
      isDefinitionFormVisible: false,
      formData: {
        availableTicketsNumber: -1,
        endDate: endDate || initialEndDate,
        entryEndDate: entryEndDate || initialEndDate,
        entryStartDate: entryStartDate || initialStartDate,
        frequencyData: null,
        sightEventId: null,
        isCyclic: false,
        startDate: startDate || initialStartDate,
        ticketDefinitions: [],
        wholeDay: false,
        ...formData,
      },
      entryStartDateOffset: this.getInitialEntryStartDateOffset(entryStartDate, startDate),
      frequencyType: this.getInitialFrequecyType(isCyclic, readOnly),
      frequencyEndDateType: this.getInitialFrequencyTypeDate(frequencyEndDate),
      poolDate: startDate || initialStartDate,
      selectedTicketDefinitionId: '',
    };
  }

  componentDidMount() {
    const { ticketDefinitionsList } = this.props;

    if (!ticketDefinitionsList || !ticketDefinitionsList.length) {
      const { fetchTicketDefinitions } = this.props;

      fetchTicketDefinitions();
    }
  }

  getFormattedDate = dateObj => format(dateObj, DATE_FORMAT);

  getInitialDate = (startDate) => {
    let initialDate = startDate;

    if (!initialDate) {
      initialDate = new Date();
      const evening = setMinutes(setHours(new Date(), 23), 29);

      if (isAfter(initialDate, evening)) {
        initialDate = addMinutes(initialDate, 60 * 8);
      }
    }

    return this.getFormattedDate(initialDate);
  };

  getInitialEntryStartDateOffset = (entryStartDate, startDate) => {
    if (entryStartDate && startDate) {
      return differenceInMinutes(startDate, entryStartDate);
    }

    return 0;
  };

  getInitialFrequecyType = (isCyclic, readOnly) => (isCyclic && readOnly ? 'CUSTOM' : 'NONE');

  getInitialFrequencyTypeDate = endDate => (endDate ? 'SINGLE' : 'NONE');

  getKeyFromEvent = event => event.target.name;

  getValidEndDate = (endDate) => {
    let date = endDate;
    const morning = setMinutes(setHours(new Date(), 0), 30);
    const today = setMinutes(setHours(new Date(), 23), 59);

    if (isBefore(date, morning)) {
      date = morning;
    }

    if (isAfter(date, today)) {
      date = today;
    }

    return this.getFormattedDate(date);
  };

  getValidStartDate = (startDate) => {
    let date = startDate;
    const evening = setMinutes(setHours(new Date(), 23), 29);
    const today = setMinutes(setHours(new Date(), 0), 0);

    if (isAfter(date, evening)) {
      date = evening;
    }

    if (isBefore(date, today)) {
      date = today;
    }

    return this.getFormattedDate(date);
  };

  getValueFromEvent = (event, value) => {
    let fieldValue = value !== undefined ? value : null;

    if (value === undefined && event && event.target) {
      if (event.target.value != null) {
        fieldValue = event.target.value;
      }

      if (event.target.type === 'number') {
        fieldValue = +fieldValue;
      }
    }

    return fieldValue;
  };

  handleAvailableTicketsChange = (...args) => {
    const { formData } = this.state;
    const key = this.getKeyFromEvent(...args);
    const value = this.getValueFromEvent(...args);

    this.handleChange({
      formData: {
        ...formData,
        [key]: value > 0 ? value : -1,
      },
    });
  };

  handleChange = (props) => {
    this.setState(props, () => {
      const { formData } = this.state;
      const { onChange } = this.props;

      if (onChange) {
        onChange(formData);
      }
    });
  };

  handleDateChange = (event) => {
    const { entryStartDateOffset, formData } = this.state;
    const key = this.getKeyFromEvent(event);
    const dateObj = this.getValueFromEvent(event);
    const dates = {};

    if (key === 'startDate') {
      dates.startDate = this.getFormattedDate(dateObj);

      const entryStartDateWithOffset = subMinutes(dates.startDate, entryStartDateOffset);
      dates.entryStartDate = this.getFormattedDate(entryStartDateWithOffset);
    } else {
      dates.endDate = this.getFormattedDate(dateObj);
      dates.entryEndDate = this.getFormattedDate(dateObj);
    }

    this.handleChange({
      formData: {
        ...formData,
        ...dates,
      },
    });
  };

  handleDefinitionFormClose = () => this.setState({ isDefinitionFormVisible: false });

  handleDefinitionFormOpen = () => this.setState({ isDefinitionFormVisible: true });

  handleEntryStartDateOffsetChange = (event) => {
    const { formData } = this.state;
    const { startDate } = formData;
    const value = this.getValueFromEvent(event);
    const entryStartDate = this.getFormattedDate(subMinutes(startDate, value));


    this.handleChange({
      entryStartDateOffset: value,
      formData: {
        ...formData,
        entryStartDate,
      },
    });
  };

  handleFormDataChange = (...args) => {
    const { formData } = this.state;
    const key = this.getKeyFromEvent(...args);
    const value = this.getValueFromEvent(...args);

    this.handleChange({
      formData: {
        ...formData,
        [key]: value,
      },
    });
  };

  handleFrequencyDataChange = (nextFrequencyData, frequencyType) => {
    const { formData, frequencyType: stateFrequencyType } = this.state;
    const stateFrequencyData = _cloneDeep(formData.frequencyData || {});
    const { daysOfMonth, monthsOfYear } = stateFrequencyData;
    const type = frequencyType || stateFrequencyType;
    let frequencyData = null;

    if (type !== 'WEEKLY' && daysOfMonth) {
      delete stateFrequencyData.daysOfMonth;
    }

    if (type !== 'YEARLY' && monthsOfYear) {
      delete stateFrequencyData.monthsOfYear;
    }

    if (nextFrequencyData) {
      frequencyData = {
        ...stateFrequencyData,
        ...nextFrequencyData,
      };
    }

    this.handleChange({
      formData: {
        ...formData,
        frequencyData,
        isCyclic: !!frequencyData,
      },
      frequencyType: type,
    });
  };

  handleFrequencyDataFieldChange = (...args) => {
    const { formData } = this.state;
    const key = this.getKeyFromEvent(...args);
    let value = this.getValueFromEvent(...args);

    if (key === 'endDate') {
      const endDate = setMinutes(setHours(value, 23), 59);

      value = this.getFormattedDate(endDate);
    }

    this.handleChange({
      formData: {
        ...formData,
        frequencyData: {
          ...formData.frequencyData,
          [key]: value,
        },
      },
    });
  };

  handleFrequencyEndDateTypeChange = (...args) => {
    const { formData } = this.state;
    const type = this.getValueFromEvent(...args);
    let endDate = null;

    if (type === 'SINGLE') {
      endDate = this.getFormattedDate(addMonths(setMinutes(setHours(formData.endDate, 23), 59), 3));
    }

    this.handleChange({
      formData: {
        ...formData,
        frequencyData: {
          ...formData.frequencyData,
          endDate,
        },
      },
      frequencyEndDateType: type,
    });
  };

  handleFrequencyItemChange = (event, isChecked) => {
    const { formData: { frequencyData } } = this.state;
    const name = this.getKeyFromEvent(event);
    const value = +this.getValueFromEvent(event);
    const items = frequencyData[name] || [];
    const index = items.indexOf(value);

    if (isChecked && index < 0) {
      items.push(value);
    } else if (!isChecked && index >= 0) {
      items.splice(index, 1);
    }

    items.sort();

    this.handleFrequencyDataChange({ [name]: items });
  };

  handleFullDayChange = (...args) => {
    const { formData } = this.state;
    const {
      endDate, entryEndDate, entryStartDate, startDate,
    } = formData;
    const key = this.getKeyFromEvent(...args);
    const value = this.getValueFromEvent(...args);

    this.handleChange({
      formData: {
        ...formData,
        endDate: this.getFormattedDate(setMinutes(setHours(endDate, 23), 59)),
        entryEndDate: this.getFormattedDate(setMinutes(setHours(entryEndDate, 23), 59)),
        entryStartDate: this.getFormattedDate(setMinutes(setHours(entryStartDate, 0), 0)),
        startDate: this.getFormattedDate(setMinutes(setHours(startDate, 0), 0)),
        [key]: value,
      },
    });
  };

  handlePoolDateChange = (event) => {
    const dateObj = this.getValueFromEvent(event);
    const poolDate = this.getFormattedDate(dateObj);
    const { formData } = this.state;
    const {
      endDate, entryEndDate, entryStartDate, startDate,
    } = formData;

    const year = getYear(poolDate);
    const month = getMonth(poolDate);
    const date = getDate(poolDate);

    const eD = setYear(setMonth(setDate(endDate, date), month), year);
    const eED = setYear(setMonth(setDate(entryEndDate, date), month), year);
    const sD = setYear(setMonth(setDate(startDate, date), month), year);
    const eSD = setYear(setMonth(setDate(entryStartDate, date), month), year);

    const dates = {
      endDate: this.getFormattedDate(eD),
      entryEndDate: this.getFormattedDate(eED),
      entryStartDate: this.getFormattedDate(eSD),
      startDate: this.getFormattedDate(sD),
    };

    if (!isSameDay(entryStartDate, startDate)) {
      dates.entryStartDate = this.getFormattedDate(subDays(dates.entryStartDate, 1));
    }

    this.handleChange({
      formData: {
        ...formData,
        ...dates,
      },
      poolDate,
    });
  };

  handlePropFromEventChange = (...args) => {
    const key = this.getKeyFromEvent(...args);
    const value = this.getValueFromEvent(...args);

    this.handleChange({ [key]: value });
  };

  handleTicketDefinitionAdd = (ticketDefinitionId) => {
    if (ticketDefinitionId) {
      const { formData } = this.state;
      const ticketDefinition = _find(formData.ticketDefinitions, { id: ticketDefinitionId });

      if (!ticketDefinition) {
        this.handleChange(({
          formData: {
            ...formData,
            ticketDefinitions: [
              ...formData.ticketDefinitions,
              { id: ticketDefinitionId, availableTicketsNumber: -1 },
            ],
          },
          selectedTicketDefinitionId: '',
        }));
      }
    }
  };

  handleTicketDefinitionChange = (event, ticketDefinitionId) => {
    const { formData } = this.state;
    const value = this.getValueFromEvent(event);
    const availableTicketsNumber = _isNumber(value) && value > 0 ? value : -1;

    this.handleChange(({
      formData: {
        ...formData,
        ticketDefinitions: formData.ticketDefinitions.map((item) => {
          if (item.id === ticketDefinitionId) {
            return {
              ...item,
              availableTicketsNumber,
            };
          }

          return item;
        }),
      },
    }));
  };

  handleTicketDefinitionDelete = (ticketDefinitionId) => {
    const { formData } = this.state;
    const ticketDefinition = _find(formData.ticketDefinitions, { id: ticketDefinitionId });

    if (ticketDefinition) {
      const ticketDefinitions = formData.ticketDefinitions
        .filter(({ id }) => id !== ticketDefinitionId);

      this.handleChange(({
        formData: {
          ...formData,
          ticketDefinitions,
        },
      }));
    }
  };

  render() {
    const { children } = this.props;

    return children({
      ...this.props,
      ...this.state,
      handleAvailableTicketsChange: this.handleAvailableTicketsChange,
      handleChange: this.handleChange,
      handleDateChange: this.handleDateChange,
      handleDefinitionFormClose: this.handleDefinitionFormClose,
      handleDefinitionFormOpen: this.handleDefinitionFormOpen,
      handleEntryStartDateOffsetChange: this.handleEntryStartDateOffsetChange,
      handleFormDataChange: this.handleFormDataChange,
      handleFrequencyDataChange: this.handleFrequencyDataChange,
      handleFrequencyDataFieldChange: this.handleFrequencyDataFieldChange,
      handleFrequencyEndDateTypeChange: this.handleFrequencyEndDateTypeChange,
      handleFrequencyItemChange: this.handleFrequencyItemChange,
      handleFullDayChange: this.handleFullDayChange,
      handlePoolDateChange: this.handlePoolDateChange,
      handlePropFromEventChange: this.handlePropFromEventChange,
      handleTicketDefinitionAdd: this.handleTicketDefinitionAdd,
      handleTicketDefinitionChange: this.handleTicketDefinitionChange,
      handleTicketDefinitionDelete: this.handleTicketDefinitionDelete,
    });
  }
}

CalendarEventController.propTypes = {
  children: PropTypes.func.isRequired,
  fetchTicketDefinitions: PropTypes.func.isRequired,
  formData: PropTypes.shape({}),
  onChange: PropTypes.func,
  readOnly: PropTypes.bool.isRequired,
  ticketDefinitionsList: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
  })).isRequired,
};

CalendarEventController.defaultProps = {
  formData: {},
  onChange: null,
};

const mapStateToProps = state => ({
  ticketDefinitionsList: ticketDefinitionsSelectors.getTicketDefinitions(state),
});

const mapDispatchToProps = {
  fetchTicketDefinitions: ticketDefinitionsActions.fetchList,
};

export default connect(mapStateToProps, mapDispatchToProps)(CalendarEventController);
