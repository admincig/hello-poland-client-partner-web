import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import LanguagePicker from './LanguagePicker';
import LanguageActions from './LanguageActions';

const ContentLanguage = ({ LanguageActionsProps, LanguagePickerProps, showActions }) => (
  <Grid container alignItems="flex-end" justify="space-between">
    <LanguagePicker {...LanguagePickerProps} />
    {showActions
      && <LanguageActions {...LanguageActionsProps} />
    }
  </Grid>
);

ContentLanguage.propTypes = {
  LanguageActionsProps: PropTypes.shape({}),
  LanguagePickerProps: PropTypes.shape({}),
  showActions: PropTypes.bool,
};

ContentLanguage.defaultProps = {
  LanguageActionsProps: null,
  LanguagePickerProps: null,
  showActions: false,
};

export default ContentLanguage;
