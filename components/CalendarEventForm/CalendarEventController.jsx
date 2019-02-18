import React from 'react';
import PropTypes from 'prop-types';
import _find from 'lodash/find';
import { connect } from 'react-redux';
import _cloneDeep from 'lodash/cloneDeep';
import _isNumber from 'lodash/isNumber';
import addMinutes from 'date-fns/addMinutes';
import addMonths from 'date-fns/addMonths';
import format from 'date-fns/format';
import differenceInMinutes from 'date-fns/differenceInMinutes';
import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';
import setHours from 'date-fns/setHours';
import setMinutes from 'date-fns/setMinutes';
import subMinutes from 'date-fns/subMinutes';
import {
  actions as ticketDefinitionsActions,
  selectors as ticketDefinitionsSelectors,
} from 'redux/ticketDefinitions';

const DATE_FORMAT = 'YYYY-MM-DDTHH:mm';
const MIN_TIME_INTERVAL = 30;

class CalendarEventController extends React.Component {
  constructor(props) {
    super(props);
    const { formData, readOnly } = props;
    const {
      entryStartDate, frequencyData, isCyclic, startDate,
    } = formData || {};
    const { endDate } = frequencyData || {};

    this.initialDate = this.getInitialDate();

    this.state = {
      isDefinitionFormVisible: false,
      formData: {
        availableTicketsNumber: -1,
        endDate: this.getValidEndDate(addMinutes(this.initialDate, MIN_TIME_INTERVAL * 2)),
        entryEndDate: this.getValidEndDate(addMinutes(this.initialDate, MIN_TIME_INTERVAL * 2)),
        entryStartDate: this.getFormattedDate(this.initialDate),
        frequencyData: null,
        sightEventId: null,
        isCyclic: false,
        startDate: this.getValidStartDate(this.initialDate),
        ticketDefinitions: [],
        wholeDay: false,
        ...formData,
      },
      entryStartDateOffset: this.getInitialEntryStartDateOffset(entryStartDate, startDate),
      frequencyType: this.getInitialFrequecyType(isCyclic, readOnly),
      frequencyEndDateType: this.getInitialFrequencyTypeDate(endDate),
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

  getInitialDate = () => {
    const evening = setMinutes(setHours(new Date(), 23), 29);
    let initialDate = new Date();

    if (isAfter(initialDate, evening)) {
      initialDate = addMinutes(initialDate, 60 * 8);
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
      if (this.props.onChange) {
        this.props.onChange(this.state.formData);
      }
    });
  };

  handleDateChange = (event) => {
    const { entryStartDateOffset, formData } = this.state;
    const { endDate, startDate } = formData;
    const key = this.getKeyFromEvent(event);
    const dateObj = this.getValueFromEvent(event);
    const dates = {};

    if (key === 'startDate') {
      dates.startDate = this.getValidStartDate(dateObj);

      if (isAfter(dates.startDate, endDate)) {
        dates.endDate = this.getFormattedDate(addMinutes(dates.startDate, MIN_TIME_INTERVAL));
      }

      const entryStartDateWithOffset = subMinutes(dates.startDate, entryStartDateOffset);
      dates.entryStartDate = this.getFormattedDate(entryStartDateWithOffset);
    } else {
      dates.endDate = this.getValidEndDate(dateObj);
      dates.entryEndDate = this.getValidEndDate(dateObj);

      if (isBefore(dates.endDate, startDate)) {
        dates.startDate = this.getFormattedDate(subMinutes(dates.endDate, MIN_TIME_INTERVAL));
      }
    }

    this.setState({
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


    this.setState({
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
    const value = this.getValueFromEvent(...args);

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
