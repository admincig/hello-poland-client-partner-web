import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import TimePicker from 'material-ui-pickers/TimePicker';

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

class CustomTimePicker extends Component {
  handleChange = type => (value) => {
    const { name } = this.props;

    if (this.props.onChange) {
      this.props.onChange({
        target: {
          name,
          type,
          value,
        },
      });
    }
  };

  render() {
    const {
      classes, date, fullDay, TimePickerProps,
    } = this.props;

    return (
      <div className={classes.wrapper}>
        {!fullDay &&
          <TimePicker
            ampm={false}
            className={classes.timePicker}
            clearable
            margin="normal"
            onChange={this.handleChange(changeTypes.TIME)}
            value={date}
            {...TimePickerProps}
          />
        }
      </div>
    );
  }
}

CustomTimePicker.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  date: PropTypes.oneOfType([
    PropTypes.shape({}),
    PropTypes.string,
  ]).isRequired,
  disabled: PropTypes.bool,
  fullDay: PropTypes.bool,
  hasDate: PropTypes.bool,
  hasTime: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  TimePickerProps: PropTypes.shape({}),
};

CustomTimePicker.defaultProps = {
  disabled: false,
  fullDay: false,
  hasDate: true,
  hasTime: true,
  label: undefined,
  name: undefined,
  TimePickerProps: undefined,
};

export default withStyles(styles)(CustomTimePicker);
