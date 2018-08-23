import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import DatePicker from 'material-ui-pickers/DatePicker';
import TimePicker from 'material-ui-pickers/TimePicker';

const styles = {
  datePicker: {
    width: 85,
  },
  timePicker: {
    marginLeft: 10,
    width: 40,
  },
};

const DateTimePicker = ({
  classes, date, DatePickerProps, fullDay, label, onChange, TimePickerProps
}) => (
  <div>
    <DatePicker
      className={classes.datePicker}
      disablePast
      format="DD MMM YYYY"
      label={label}
      margin="normal"
      onChange={onChange}
      value={date}
      {...DatePickerProps}
    />
    {!fullDay &&
      <TimePicker
        ampm={false}
        className={classes.timePicker}
        clearable
        margin="normal"
        onChange={onChange}
        value={date}
        {...TimePickerProps}
      />
    }
  </div>
);

DateTimePicker.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  date: PropTypes.oneOfType([
    PropTypes.shape({}),
    PropTypes.string,
  ]).isRequired,
  DatePickerProps: PropTypes.shape({}),
  fullDay: PropTypes.bool,
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  TimePickerProps: PropTypes.shape({}),
};

DateTimePicker.defaultProps = {
  DatePickerProps: null,
  fullDay: false,
  label: null,
  TimePickerProps: null,
};

export default withStyles(styles)(DateTimePicker);
