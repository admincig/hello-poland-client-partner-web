import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import SelectActions from './SelectActions';
import SelectLanguage from './SelectLanguage';

const lngList = {
  'en-GB': 'angielski',
  'pl-PL': 'polski',
  'de-DE': 'niemiecki',
};

const styles = {
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
  },
  selectLabel: {
    color: 'black',
    fontWeight: 400,
  },
  defaultLanguage: {
    width: 165,
  },
};

const LanguageActions = ({ classes, defaultLanguage, actions }) => {
  const [language, handleLanguageChange] = useState(defaultLanguage);
  return (
    <div className={classes.root}>
      <Button variant="contained" color="primary" className={classes.defaultLanguage}>
        {`${language === defaultLanguage ? '(+) ' : ''} ${lngList[language]} - ${language}`}
      </Button>
      <SelectLanguage
        languageList={lngList}
        handleChange={handleLanguageChange}
        language={language}
      />
      <SelectActions actions={actions} language={language} />
    </div>
  );
};

LanguageActions.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  classes: PropTypes.shape({}).isRequired,
  defaultLanguage: PropTypes.string.isRequired,
};

export default withStyles(styles)(LanguageActions);
