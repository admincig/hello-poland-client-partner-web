import React from 'react';
import PropTypes from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { getLanguageLabel } from 'utils/content-language';

const LanguagePicker = ({
  defaultItem, inputProps, label, listItems, value, ...props
}) => (
  <FormControl>
    {label
      && (
        <InputLabel htmlFor="language">{label}</InputLabel>
      )
    }
    <Select
      value={value}
      {...props}
      inputProps={{
        ...inputProps,
        id: 'language',
      }}
    >
      {listItems.map((item) => {
        const langLabel = getLanguageLabel(item, { locale: 'pl-PL' });

        return (
          <MenuItem key={item} value={item}>
            {item === defaultItem
              ? `${langLabel} - domyślny`
              : langLabel
            }
          </MenuItem>
        );
      })}
    </Select>
  </FormControl>
);

LanguagePicker.propTypes = {
  defaultItem: PropTypes.string,
  inputProps: PropTypes.shape({}),
  label: PropTypes.string.isRequired,
  listItems: PropTypes.arrayOf(PropTypes.string).isRequired,
  value: PropTypes.string.isRequired,
};

LanguagePicker.defaultProps = {
  defaultItem: null,
  inputProps: null,
};

export default LanguagePicker;
