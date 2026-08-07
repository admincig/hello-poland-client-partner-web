import React from 'react';
import PropTypes from 'prop-types';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import { Field, getIn } from 'formik';

export const POLISH_VOIVODESHIPS = [
  'dolnośląskie',
  'kujawsko-pomorskie',
  'lubelskie',
  'lubuskie',
  'łódzkie',
  'małopolskie',
  'mazowieckie',
  'opolskie',
  'podkarpackie',
  'podlaskie',
  'pomorskie',
  'śląskie',
  'świętokrzyskie',
  'warmińsko-mazurskie',
  'wielkopolskie',
  'zachodniopomorskie',
];

const MENU_ITEM_HEIGHT = 48;
const VISIBLE_MENU_ITEMS = 6;

const normalizeQuery = value => String(value || '')
  .toLocaleLowerCase('pl')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/ł/g, 'l')
  .trim();

export const filterVoivodeships = query => POLISH_VOIVODESHIPS.filter(
  voivodeship => normalizeQuery(voivodeship).includes(normalizeQuery(query)),
);

const styles = {
  root: {
    position: 'relative',
  },
  dropdown: {
    left: 0,
    maxHeight: MENU_ITEM_HEIGHT * VISIBLE_MENU_ITEMS,
    overflowY: 'auto',
    position: 'absolute',
    right: 0,
    top: '100%',
    zIndex: 30,
  },
  dropdownButton: {
    padding: 4,
  },
  menuItem: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
};

export class VoivodeshipSelectInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false,
      query: props.value || '',
      syncedValue: props.value || '',
    };
  }

  static getDerivedStateFromProps(props, state) {
    const nextValue = props.value || '';
    if (nextValue === state.syncedValue) {
      return null;
    }
    if (state.menuOpen && !nextValue) {
      return { syncedValue: nextValue };
    }
    return {
      query: nextValue,
      syncedValue: nextValue,
    };
  }

  getFilteredOptions = () => {
    const { value } = this.props;
    const { query } = this.state;
    return filterVoivodeships(value && query === value ? '' : query);
  };

  handleInputChange = (event) => {
    const { form, name, value } = this.props;
    if (value) {
      form.setFieldValue(name, '');
    }
    this.setState({
      menuOpen: true,
      query: event.target.value,
    });
  };

  handleFocus = (event) => {
    event.target.select();
    this.setState({ menuOpen: true });
  };

  handleBlur = () => {
    const { form, name } = this.props;
    form.setFieldTouched(name, true, false);
  };

  handleMenuToggle = () => this.setState(state => ({
    menuOpen: !state.menuOpen,
  }));

  handleMenuClose = () => {
    const { value } = this.props;
    this.setState({
      menuOpen: false,
      query: value || '',
    });
  };

  handleSelect = (voivodeship) => {
    const { form, name } = this.props;
    form.setFieldValue(name, voivodeship);
    form.setFieldTouched(name, true, false);
    this.setState({
      menuOpen: false,
      query: voivodeship,
    });
  };

  handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      this.handleMenuClose();
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      const [firstOption] = this.getFilteredOptions();
      if (firstOption) {
        this.handleSelect(firstOption);
      }
    }
  };

  render() {
    const {
      classes, disabled, error, name, required, value,
    } = this.props;
    const { menuOpen, query } = this.state;
    const filteredOptions = this.getFilteredOptions();

    return (
      <ClickAwayListener onClickAway={this.handleMenuClose}>
        <div className={classes.root}>
          <TextField
            fullWidth
            required={required}
            disabled={disabled}
            error={Boolean(error)}
            helperText={error || ''}
            id={`${name.replace(/\./g, '-')}-select`}
            label="Województwo"
            name={`${name}Query`}
            placeholder="Wybierz województwo"
            value={query}
            onBlur={this.handleBlur}
            onChange={this.handleInputChange}
            onFocus={this.handleFocus}
            onKeyDown={this.handleKeyDown}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Rozwiń listę województw"
                    className={classes.dropdownButton}
                    disabled={disabled}
                    onClick={this.handleMenuToggle}
                  >
                    <ArrowDropDownIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {menuOpen && !disabled && (
            <Paper className={classes.dropdown}>
              {filteredOptions.map(voivodeship => (
                <MenuItem
                  className={classes.menuItem}
                  key={voivodeship}
                  selected={voivodeship === value}
                  onClick={() => this.handleSelect(voivodeship)}
                >
                  {voivodeship}
                </MenuItem>
              ))}
              {!filteredOptions.length && (
                <MenuItem className={classes.menuItem} disabled>
                  Brak wyników
                </MenuItem>
              )}
            </Paper>
          )}
        </div>
      </ClickAwayListener>
    );
  }
}

VoivodeshipSelectInput.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  disabled: PropTypes.bool.isRequired,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  form: PropTypes.shape({
    setFieldTouched: PropTypes.func.isRequired,
    setFieldValue: PropTypes.func.isRequired,
  }).isRequired,
  name: PropTypes.string.isRequired,
  required: PropTypes.bool.isRequired,
  value: PropTypes.string,
};

VoivodeshipSelectInput.defaultProps = {
  error: false,
  value: '',
};

const StyledVoivodeshipSelectInput = withStyles(styles)(VoivodeshipSelectInput);

const VoivodeshipSelect = ({ disabled, name, required }) => (
  <Field
    name={name}
    render={({ field, form }) => (
      <StyledVoivodeshipSelectInput
        disabled={disabled || form.isSubmitting}
        error={getIn(form.touched, name) && getIn(form.errors, name)}
        form={form}
        name={name}
        required={required}
        value={field.value}
      />
    )}
  />
);

VoivodeshipSelect.propTypes = {
  disabled: PropTypes.bool,
  name: PropTypes.string,
  required: PropTypes.bool,
};

VoivodeshipSelect.defaultProps = {
  disabled: false,
  name: 'location.voivodeship',
  required: true,
};

export default VoivodeshipSelect;
