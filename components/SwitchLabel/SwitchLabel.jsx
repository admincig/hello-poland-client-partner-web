import React from 'react';
import PropTypes from 'prop-types';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

const SwitchLabel = ({
  FormControlLabelProps, label, name, value, ...props
}) => (
  <FormControlLabel
    control={<Switch value={name} checked={value} {...props} />}
    label={label}
    {...FormControlLabelProps}
  />
);

SwitchLabel.propTypes = {
  FormControlLabelProps: PropTypes.shape({}),
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.bool,
};

SwitchLabel.defaultProps = {
  FormControlLabelProps: {},
  label: '',
  value: false,
};

export default SwitchLabel;
