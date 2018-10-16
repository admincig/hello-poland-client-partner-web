import React from 'react';
import PropTypes from 'prop-types';
import _find from 'lodash/find';
import { connect } from 'react-redux';
import _cloneDeep from 'lodash/cloneDeep';
import _isNumber from 'lodash/isNumber';
import addMinutes from 'date-fns/addMinutes';
import format from 'date-fns/format';
import setHours from 'date-fns/setHours';
import setMinutes from 'date-fns/setMinutes';
import subMinutes from 'date-fns/subMinutes';
import {
  actions as ticketDefinitionsActions,
  selectors as ticketDefinitionsSelectors,
} from 'redux/ticketDefinitions';

const DATE_FORMAT = 'YYYY-MM-DDTHH:mmZ';

class CalendarEventController extends React.Component {
  constructor(props) {
    super(props);

    this.initialDate = new Date();

    this.state = {
      isFullDay: false,
      isDefinitionFormVisible: false,
      formData: {
        availableTicketsNumber: -1,
        endDate: this.getFormattedDate(addMinutes(this.initialDate, 60)),
        entryEndDate: this.getFormattedDate(addMinutes(this.initialDate, 10)),
        entryStartDate: this.getFormattedDate(subMinutes(this.initialDate, 10)),
        frequencyData: null,
        sightEventId: null,
        startDate: this.getFormattedDate(this.initialDate),
        ticketDefinitions: [],
        ...props.formData,
      },
      frequencyType: 'NONE',
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

  getKeyFromEvent = event => event.target.name;

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

  handleChange = (props) => {
    this.setState(props, () => {
      if (this.props.onChange) {
        this.props.onChange(this.state.formData);
      }
    });
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

  handleDefinitionFormClose = () => this.setState({ isDefinitionFormVisible: false });

  handleDefinitionFormOpen = () => this.setState({ isDefinitionFormVisible: true });

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

  handleFrequencyDataChange = (frequencyData, frequencyType) => {
    const { formData, frequencyType: stateFrequencyType } = this.state;
    const stateFrequencyData = _cloneDeep(formData.frequencyData || {});
    const { daysOfMonth, monthsOfYear } = stateFrequencyData;
    const type = frequencyType || stateFrequencyType;

    if (type !== 'WEEKLY' && daysOfMonth) {
      delete stateFrequencyData.daysOfMonth;
    }

    if (type !== 'YEARLY' && monthsOfYear) {
      delete stateFrequencyData.monthsOfYear;
    }

    this.handleChange({
      formData: {
        ...formData,
        frequencyData: {
          ...stateFrequencyData,
          ...frequencyData,
        },
      },
      frequencyType: type,
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
      [key]: value,
      formData: {
        ...formData,
        endDate: this.getFormattedDate(setMinutes(setHours(endDate, 23), 59)),
        entryEndDate: this.getFormattedDate(setMinutes(setHours(entryEndDate, 23), 59)),
        entryStartDate: this.getFormattedDate(setMinutes(setHours(entryStartDate, 0), 0)),
        startDate: this.getFormattedDate(setMinutes(setHours(startDate, 0), 0)),
      },
    });
  };

  handlePropFromEventChange = (...args) => {
    const key = this.getKeyFromEvent(...args);
    const value = this.getValueFromEvent(...args);

    this.handleChange({ [key]: value });
  };

  handleDateChange = (event) => {
    const dateObj = this.getValueFromEvent(event);
    const date = format(dateObj, DATE_FORMAT);

    this.handleFormDataChange(event, date);
  };

  handleTicketDefinitionAdd = (ticketDefinitionId) => {
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
      handleFormDataChange: this.handleFormDataChange,
      handleFrequencyDataChange: this.handleFrequencyDataChange,
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
