import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import DatePicker from 'material-ui-pickers/DatePicker';
import TimePicker from 'material-ui-pickers/TimePicker';
import getHours from 'date-fns/getHours';
import getMinutes from 'date-fns/getMinutes';
import setHours from 'date-fns/setHours';
import setMinutes from 'date-fns/setMinutes';

const styles = {
  datePicker: {
    width: 90,
  },
  timePicker: {
    marginLeft: 10,
    width: 45,
  },
  wrapper: {
    display: 'flex',
    alignItems: 'flex-end',
  },
};

const changeTypes = {
  DATE: 'DATE',
  TIME: 'TIME',
};

class DateTimePicker extends Component {
  handleChange = type => (dateObj) => {
    const { name, onChange } = this.props;
    let nextDateObj;

    if (type === changeTypes.DATE) {
      const { date } = this.props;

      nextDateObj = new Date(dateObj);
      nextDateObj = setMinutes(nextDateObj, getMinutes(date));
      nextDateObj = setHours(nextDateObj, getHours(date));
    }

    if (onChange) {
      onChange({
        target: { name, type, value: nextDateObj || dateObj },
      });
    }
  };

  render() {
    const {
      classes, date, DatePickerProps, fullDay, hasDate, hasTime, label, TimePickerProps,
    } = this.props;

    return (
      <div className={classes.wrapper}>
        {hasDate
          && (
          <DatePicker
            className={classes.datePicker}
            disablePast
            format="dd MMM yyyy"
            label={label}
            margin="normal"
            onChange={this.handleChange(changeTypes.DATE)}
            value={date}
            {...DatePickerProps}
          />
          )
        }
        {!fullDay && hasTime
          && (
          <TimePicker
            ampm={false}
            className={classes.timePicker}
            clearable
            margin="normal"
            onChange={this.handleChange(changeTypes.TIME)}
            value={date}
            {...TimePickerProps}
          />
          )
        }
      </div>
    );
  }
}

DateTimePicker.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  date: PropTypes.oneOfType([
    PropTypes.shape({}),
    PropTypes.string,
  ]).isRequired,
  disabled: PropTypes.bool,
  DatePickerProps: PropTypes.shape({}),
  fullDay: PropTypes.bool,
  hasDate: PropTypes.bool,
  hasTime: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  TimePickerProps: PropTypes.shape({}),
};

DateTimePicker.defaultProps = {
  DatePickerProps: undefined,
  disabled: false,
  fullDay: false,
  hasDate: true,
  hasTime: true,
  label: undefined,
  name: undefined,
  TimePickerProps: undefined,
};

export default withStyles(styles)(DateTimePicker);
