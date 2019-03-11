import React, { Component } from 'react';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const lngList = {
  'en-GB': 'angielski',
  'pl-PL': 'polski',
  'de-DE': 'niemiecki',
};

class LanguageActions extends Component {
  constructor(props) {
    super(props);
    this.state = { lng: 'pl-PL' };
  }

  handleLngChange = e => this.setState({ lng: e.target.value });

  render() {
    const { actions } = this.props;
    const { lng } = this.state;
    return (
      <FormControl>
        <div>
          {`${lngList[lng]} - ${lng}`}
        </div>
        <Select
          value={lng}
          onChange={this.handleLngChange}
        >
          {Object.keys(lngList).map(key => (
            <MenuItem value={key}>{lngList[key]}</MenuItem>
          ))}
        </Select>
        <Select>
          {

          }
        </Select>
      </FormControl>
    );
  }
}

export default LanguageActions;
