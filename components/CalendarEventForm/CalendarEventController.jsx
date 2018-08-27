import React from 'react';
import PropTypes from 'prop-types';
import _cloneDeep from 'lodash/cloneDeep';
import addMinutes from 'date-fns/addMinutes';
import format from 'date-fns/format';
import setHours from 'date-fns/setHours';
import setMinutes from 'date-fns/setMinutes';
import subMinutes from 'date-fns/subMinutes';

const DATE_FORMAT = 'YYYY-MM-DDTHH:mmZ';

class CalendarEventController extends React.Component {
  constructor(props) {
    super(props);

    this.initialDate = new Date();

    this.state = {
      isFullDay: false,
      formData: {
        availableTicketsNumber: null,
        endDate: this.getFormattedDate(addMinutes(this.initialDate, 60)),
        entryEndDate: this.getFormattedDate(addMinutes(this.initialDate, 10)),
        entryStartDate: this.getFormattedDate(subMinutes(this.initialDate, 10)),
        frequencyData: null,
        sightEventId: null,
        startDate: this.getFormattedDate(this.initialDate),
        ...props.formData,
      },
      frequencyType: 'NONE',
    };
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

  render() {
    const { children } = this.props;

    console.log('CalendarEventController state', this.state);
    return children({
      ...this.state,
      handleChange: this.handleChange,
      handleDateChange: this.handleDateChange,
      handleFormDataChange: this.handleFormDataChange,
      handleFrequencyDataChange: this.handleFrequencyDataChange,
      handleFrequencyItemChange: this.handleFrequencyItemChange,
      handleFullDayChange: this.handleFullDayChange,
      handlePropFromEventChange: this.handlePropFromEventChange,
    });
  }
}

CalendarEventController.propTypes = {
  formData: PropTypes.shape({}),
  children: PropTypes.func.isRequired,
  onChange: PropTypes.func,
};

CalendarEventController.defaultProps = {
  formData: {},
  onChange: null,
};

export default CalendarEventController;
