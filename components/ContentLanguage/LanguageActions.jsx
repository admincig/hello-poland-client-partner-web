import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';

const styles = () => ({
  button: {
    boxShadow: 'none',
  },
});

class LanguageActions extends Component {
  state = {
    anchorEl: null,
  };

  handleClick = event => this.setState({ anchorEl: event.currentTarget });

  handleClose = () => this.setState({ anchorEl: null });

  handleActionClick = (action) => {
    const { language } = this.props;

    action(language);

    this.handleClose();
  };

  render() {
    const { anchorEl } = this.state;
    const { actions, classes } = this.props;

    return (
      <Grid>
        <Button
          className={classes.button}
          onClick={this.handleClick}
          aria-owns={anchorEl ? 'actions-menu' : undefined}
          aria-haspopup="true"
          variant="contained"
        >
          Zarządzaj
          <ArrowDropDown />
        </Button>
        <Menu
          id="actions-menu"
          anchorEl={anchorEl}
          open={!!anchorEl}
          onClose={this.handleClose}
        >
          {
            actions.map(({ disabled, label, action }) => (
              <MenuItem key={label} disabled={disabled} onClick={() => this.handleActionClick(action)}>
                {label}
              </MenuItem>
            ))
          }
        </Menu>
      </Grid>
    );
  }
}

LanguageActions.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.shape({
    action: PropTypes.func,
    label: PropTypes.string,
  })).isRequired,
  classes: PropTypes.shape({}).isRequired,
  language: PropTypes.string.isRequired,
};

export default withStyles(styles)(LanguageActions);
