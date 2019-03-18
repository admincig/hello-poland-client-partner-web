import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import LanguagePicker from './LanguagePicker';
import SelectActions from './SelectActions';

const ContentLanguage = ({
  actions,
  defaultItem,
  label,
  listItems,
  value,
  ...props
}) => (
  <Grid container alignItems="flex-end" justify="space-between">
    <LanguagePicker
      lablel={label}
      defaultItem={defaultItem}
      value={value}
      listItems={listItems}
      {...props}
    />
    {
      actions
      && <SelectActions actions={actions} language={value} />
    }
  </Grid>
);

ContentLanguage.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.shape({})),
  defaultItem: PropTypes.string,
  label: PropTypes.string,
  listItems: PropTypes.arrayOf(PropTypes.string),
  value: PropTypes.string.isRequired,
};

ContentLanguage.defaultProps = {
  actions: null,
  defaultItem: '',
  label: null,
  listItems: [],
};

export default ContentLanguage;
