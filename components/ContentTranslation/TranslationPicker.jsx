import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { getLanguageLabel } from 'utils/translations';

const styles = () => ({
  root: {
    minWidth: 200,
  },
});

const TranslationPicker = ({
  classes, defaultValue, label, items, ...selectProps
}) => (
  <FormControl className={classes.root}>
    {label && <InputLabel htmlFor="selected-language">{label}</InputLabel>}
    <Select {...selectProps} inputProps={{ id: 'selected-language' }}>
      {items && items.map((item) => {
        let langLabel = getLanguageLabel(item, { locale: 'pl-PL' });

        if (item === defaultValue) {
          langLabel = `${langLabel} - domyślny`;
        }

        return <MenuItem key={item} value={item}>{langLabel}</MenuItem>;
      })}
    </Select>
  </FormControl>
);

TranslationPicker.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  defaultValue: PropTypes.string,
  label: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.string),
};

TranslationPicker.defaultProps = {
  defaultValue: null,
  label: 'Wybrany język',
  items: [],
};

export default withStyles(styles)(TranslationPicker);
