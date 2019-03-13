import React from 'react';
import PropTypes from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { getLanguageLabel } from 'utils/content-language';

const ContentLanguage = ({
  defaultItem, FormControlProps, InputLabelProps, InputProps, label, listItems, ...props
}) => (
  <FormControl {...FormControlProps}>
    {label
      && (
        <InputLabel {...InputLabelProps} htmlFor="language">{label}</InputLabel>
      )
    }
    <Select
      {...props}
      inputProps={{
        id: 'language',
        ...InputProps,
      }}
    >
      {listItems.map((item) => {
        const langLabel = getLanguageLabel(item, true, { locale: 'pl-PL' });

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

ContentLanguage.propTypes = {
  defaultItem: PropTypes.string,
  FormControlProps: PropTypes.shape({}),
  InputLabelProps: PropTypes.shape({}),
  InputProps: PropTypes.shape({}),
  label: PropTypes.string,
  listItems: PropTypes.arrayOf(PropTypes.string),
};

ContentLanguage.defaultProps = {
  defaultItem: '',
  FormControlProps: {},
  InputLabelProps: {},
  InputProps: {},
  label: null,
  listItems: [],
};

export default ContentLanguage;
