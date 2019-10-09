import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import { CONTENT_LANGUAGES, getUntranslatedLanguages } from 'utils/translations';
import CreateTranslationDialog from './CreateTranslationDialog';

const ACTION_TYPES = {
  CREATE_TRANSLATION: 'CREATE_TRANSLATION',
  DELETE_TRANSLATION: 'DELETE_TRANSLATION',
  DEFAULT_TRANSLATION: 'DEFAULT_TRANSLATION',
};

const styles = () => ({
  button: {
    boxShadow: 'none',
  },
});

class TranslationActions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      actions: [
        {
          actionType: ACTION_TYPES.CREATE_TRANSLATION,
          label: 'Dodaj tłumaczenie',
        },
        {
          actionType: ACTION_TYPES.DELETE_TRANSLATION,
          label: 'Usuń tłumaczenie',
        },
        {
          actionType: ACTION_TYPES.DEFAULT_TRANSLATION,
          label: 'Ustaw tłumaczenie jako domyślne',
        },
      ],
      anchorEl: null,
      dialog: false,
    };
  }

  isDisabled = (actionType) => {
    const { availableTranslations, defaultTranslation, selectedTranslation } = this.props;

    switch (actionType) {
      case ACTION_TYPES.CREATE_TRANSLATION:
        return !!(
          availableTranslations
          && CONTENT_LANGUAGES.length === availableTranslations.length
        );
      case ACTION_TYPES.DEFAULT_TRANSLATION:
      case ACTION_TYPES.DELETE_TRANSLATION:
        return selectedTranslation === defaultTranslation;
      default:
        return true;
    }
  };

  handleActionClick = (actionType) => {
    const { onCreateTranslation, onDeleteTranslation, onSetDefaultTranslation } = this.props;

    if (actionType === ACTION_TYPES.CREATE_TRANSLATION && onCreateTranslation) {
      this.setState({ dialog: true });
    }

    if (actionType === ACTION_TYPES.DEFAULT_TRANSLATION && onSetDefaultTranslation) {
      onSetDefaultTranslation();
    }

    if (actionType === ACTION_TYPES.DELETE_TRANSLATION && onDeleteTranslation) {
      onDeleteTranslation();
    }

    this.handleMenuClose();
  };

  handleButtonClick = event => this.setState({ anchorEl: event.currentTarget });

  handleDialogClose = () => this.setState({ dialog: false });

  handleDialogSuccess = (selectedTranslation) => {
    const { onCreateTranslation } = this.props;

    if (onCreateTranslation) {
      onCreateTranslation(selectedTranslation);
    }

    this.handleDialogClose();
  };

  handleMenuClose = () => this.setState({ anchorEl: null });

  render() {
    const { anchorEl, actions, dialog } = this.state;
    const {
      availableTranslations, classes, defaultTranslation, onCreateTranslation, onDeleteTranslation,
      onSetDefaultTranslation, selectedTranslation, ...rest
    } = this.props;

    return (
      <Grid {...rest}>
        <Button
          className={classes.button}
          onClick={this.handleButtonClick}
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
          onClose={this.handleMenuClose}
        >
          {actions && actions.map(({ label, actionType }) => (
            <MenuItem
              key={label}
              disabled={this.isDisabled(actionType)}
              onClick={() => this.handleActionClick(actionType)}
            >
              {label}
            </MenuItem>
          ))}
        </Menu>
        <CreateTranslationDialog
          open={dialog}
          translations={getUntranslatedLanguages(availableTranslations)}
          onCancel={this.handleDialogClose}
          onSuccess={this.handleDialogSuccess}
        />
      </Grid>
    );
  }
}

TranslationActions.propTypes = {
  availableTranslations: PropTypes.arrayOf(PropTypes.string),
  classes: PropTypes.shape({}).isRequired,
  defaultTranslation: PropTypes.string,
  onCreateTranslation: PropTypes.func,
  onDeleteTranslation: PropTypes.func,
  onSetDefaultTranslation: PropTypes.func,
  selectedTranslation: PropTypes.string,
};

TranslationActions.defaultProps = {
  availableTranslations: null,
  defaultTranslation: null,
  onCreateTranslation: null,
  onDeleteTranslation: null,
  onSetDefaultTranslation: null,
  selectedTranslation: null,
};

export default withStyles(styles)(TranslationActions);
