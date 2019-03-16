import React from 'react';
import PropTypes from 'prop-types';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import withStyles from '@material-ui/core/styles/withStyles';
import { getLanguageLabel } from 'utils/content-language';
import AddLanguage from './AddLanguage';
import SelectActions from './SelectActions';

const styles = {
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  lngPicker: {
    width: 170,
  },
};

const ContentLanguage = ({
  actions,
  classes,
  defaultItem,
  handleAddLanguage,
  FormControlProps,
  InputLabelProps,
  InputProps,
  label,
  listItems,
  notTranslatedLanguages,
  value,
  ...props
}) => (
  <div className={classes.root}>
    <FormControl {...FormControlProps} className={classes.lngPicker}>
      {label
        && (
          <InputLabel {...InputLabelProps} htmlFor="language">{label}</InputLabel>
        )
      }
      <Select
        value={value}
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
    {
      actions
      && <SelectActions actions={actions} language={value} />
    }
  </div>
);

ContentLanguage.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.shape({})),
  classes: PropTypes.shape({}).isRequired,
  defaultItem: PropTypes.string,
  FormControlProps: PropTypes.shape({}),
  InputLabelProps: PropTypes.shape({}),
  InputProps: PropTypes.shape({}),
  label: PropTypes.string,
  listItems: PropTypes.arrayOf(PropTypes.string),
  value: PropTypes.string.isRequired,
};

ContentLanguage.defaultProps = {
  actions: null,
  defaultItem: '',
  FormControlProps: {},
  InputLabelProps: {},
  InputProps: {},
  label: null,
  listItems: [],
};

export default withStyles(styles)(ContentLanguage);
