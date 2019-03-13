import React from 'react';
import PropTypes from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const SelectLanguage = ({ handleChange, language, languageList }) => (
  <FormControl>
    <InputLabel style={{ color: 'black' }} shrink={false} htmlFor="action-select-placeholder">
      {`Języki (${Object.keys(languageList).length})`}
    </InputLabel>
    <Select
      value={false}
      onChange={e => handleChange(e.target.value)}
      style={{ width: 160 }}
    >
      {Object.keys(languageList).map(key => (
        <MenuItem key={key} value={key} style={{ fontWeight: `${key === language ? 600 : 400}` }}>
          {
            `${languageList[key]} - ${key}`
          }
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

SelectLanguage.propTypes = {
  handleChange: PropTypes.func.isRequired,
  languageList: PropTypes.shape({}).isRequired,
  language: PropTypes.string.isRequired,
};

export default SelectLanguage;
