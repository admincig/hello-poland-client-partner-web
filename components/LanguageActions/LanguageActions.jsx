import React, { Component } from 'react';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import withStyles from '@material-ui/core/styles/withStyles';

const lngList = {
  'en-GB': 'angielski',
  'pl-PL': 'polski',
  'de-DE': 'niemiecki',
};

const styles = theme => ({
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
});

class LanguageActions extends Component {
  constructor(props) {
    super(props);
    this.state = { lng: 'pl-PL' };
  }

  handleAction = e => e.target.value(this.state.lng);

  handleLngChange = e => this.setState({ lng: e.target.value });

  render() {
    const { actions, classes, rootLng } = this.props;
    const { lng } = this.state;
    return (
      <div className={classes.root}>
        <Button variant="contained" color="primary" className={classes.defaultLanguage}>
          {`${lng === rootLng ? '(+) ': ''}${lngList[lng]} - ${lng}`}
        </Button>
        <FormControl>
          <InputLabel className={classes.selectLabel} shrink={false} htmlFor="action-select-placeholder">{`Języki (${Object.keys(lngList).length})`}</InputLabel>
          <Select
            value={false}
            onChange={this.handleLngChange}
            style={{ width: 160 }}
          >
            {Object.keys(lngList).map(key => (
              <MenuItem key={key} value={key}>
                {
                  key === rootLng
                    ? (`(+)${lngList[key]} - ${key}`)
                    : (`${lngList[key]} - ${key}`)
                }
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <InputLabel className={classes.selectLabel} shrink={false} htmlFor="action-select-placeholder">Zarządzaj językami</InputLabel>
          <Select
            onChange={this.handleAction}
            value={false}
            style={{ width: 160 }}
          >
            {
              actions.map(({ label, action }) => (
                <MenuItem
                  key={label}
                  value={(value) => { action(value); }}
                  data-value={false}
                >
                  {label}
                </MenuItem>
              ))
            }
          </Select>
        </FormControl>
      </div>
    );
  }
}

export default withStyles(styles)(LanguageActions);
