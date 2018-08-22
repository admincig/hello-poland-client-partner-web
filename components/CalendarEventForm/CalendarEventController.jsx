import React from 'react';
import PropTypes from 'prop-types';
import addMinutes from 'date-fns/addMinutes';
import format from 'date-fns/format';
import subMinutes from 'date-fns/subMinutes';

const initialDate = format(new Date(), 'YYYY-MM-DDTHH:mmZ');

class CalendarEventController extends React.Component {
  state = {
    isFullDay: false,
    formData: {
      availableTicketsNumber: null,
      endDate: addMinutes(initialDate, 30),
      entryEndDate: addMinutes(initialDate, 10),
      entryStartDate: subMinutes(initialDate, 10),
      frequencyData: null,
      sightEventId: null,
      startDate: initialDate,
    },
    frequencyType: 'null',
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

  handleChange = (key, value) => {
    console.log(key, value);
    this.setState({ [key]: value });
  };

  handleFormDataChange = fieldName => (...args) => {
    const { formData } = this.state;
    const fieldValue = this.getValueFromEvent(...args);

    this.handleChange('formData', {
      ...formData,
      [fieldName]: fieldValue,
    });
  };

  handlePropFromEventChange = key => (...args) => {
    const value = this.getValueFromEvent(...args);

    this.handleChange(key, value);
  };

  handleDateChange = fieldName => (dateObj) => {
    const date = format(dateObj, 'YYYY-MM-DDTHH:mm');

    this.handleFormDataChange(fieldName)({}, date);
  };

  render() {
    const { children } = this.props;

    return children({
      ...this.state,
      handleChange: this.handleChange,
      handleDateChange: this.handleDateChange,
      handleFormDataChange: this.handleFormDataChange,
      handlePropFromEventChange: this.handlePropFromEventChange,
    });
  }
}

CalendarEventController.propTypes = {
  children: PropTypes.func.isRequired,
};

export default CalendarEventController;
