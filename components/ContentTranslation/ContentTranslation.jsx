import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import LanguagePicker from './TranslationPicker';
import LanguageActions from './TranslationActions';

const styles = theme => ({
  actions: {
    marginLeft: theme.spacing.unit * 2,
  },
});

const ContentTranslation = ({
  actions, classes, TranslationActionsProps, TranslationPickerProps,
}) => (
  <Grid container alignItems="flex-end">
    <LanguagePicker value="" {...TranslationPickerProps} />
    {actions && <LanguageActions className={classes.actions} {...TranslationActionsProps} />}
  </Grid>
);

ContentTranslation.propTypes = {
  actions: PropTypes.bool,
  classes: PropTypes.shape({}).isRequired,
  TranslationActionsProps: PropTypes.shape({}),
  TranslationPickerProps: PropTypes.shape({}),
};

ContentTranslation.defaultProps = {
  actions: false,
  TranslationActionsProps: {},
  TranslationPickerProps: {},
};

export default withStyles(styles)(ContentTranslation);
