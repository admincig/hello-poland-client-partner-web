import React from 'react';
import PropTypes from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { CONTENT_LANGUAGES } from 'utils/content-languages';
import i18n from './i18n/pl-PL';

const ContentLanguage = ({
  FormControlProps, InputLabelProps, InputProps, label, ...props
}) => (
  <FormControl {...FormControlProps}>
    <InputLabel {...InputLabelProps} htmlFor="language">{label}</InputLabel>
    <Select
      {...props}
      inputProps={{
        id: 'language',
        ...InputProps,
      }}
    >
      {Object.values(CONTENT_LANGUAGES).map(lng => (
        <MenuItem key={lng} value={lng}>{i18n.languages[lng]}</MenuItem>
      ))}
    </Select>
  </FormControl>
);

ContentLanguage.propTypes = {
  FormControlProps: PropTypes.shape({}),
  InputLabelProps: PropTypes.shape({}),
  InputProps: PropTypes.shape({}),
  label: PropTypes.string,
};

ContentLanguage.defaultProps = {
  FormControlProps: {},
  InputLabelProps: {},
  InputProps: {},
  label: i18n.label,
};

export default ContentLanguage;
