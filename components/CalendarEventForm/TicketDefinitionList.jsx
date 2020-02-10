import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import TextField from '@material-ui/core/TextField';
import CardGiftcardIcon from '@material-ui/icons/CardGiftcard';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton/IconButton';
import formatPrice from 'utils/formatPrice';
import TicketDiscountForm from './TicketDiscountForm';

const styles = theme => ({
  availabilityTextfield: {
    width: 150,
  },
  discountWrapper: {
    padding: [[0, theme.spacing.unit * 6]],
    paddingBottom: theme.spacing.unit * 4,
  },
});

class TicketDefinitionList extends React.Component {
  state = {
    activeDiscountSettings: [],
  };

  getPriceTag = (ticketDefinition) => {
    const { discount, price, originalPrice } = ticketDefinition;
    let result = `Cena: ${formatPrice(originalPrice)}`;

    if (!discount) {
      return result;
    }

    result = `${result} / Promocja: ${formatPrice(price)}`;

    return result;
  };

  handleChange = (item) => {
    const { onChange } = this.props;

    if (onChange) {
      onChange(item);
    }
  };

  handleDelete = (item) => {
    const { onDelete } = this.props;

    if (onDelete) {
      onDelete(item);
    }
  };

  parsePropertyValue = (name, value) => {
    if (name === 'availableTicketsNumber') {
      const parsedValue = Number(value);
      return parsedValue > 0 ? parsedValue : -1;
    }

    return value;
  };

  handlePropertyChange = (event, item) => {
    const { name, value } = event.target || {};

    if (name) {
      this.handleChange({ ...item, [name]: this.parsePropertyValue(name, value) });
    }
  };

  toggleDiscountSettings = (itemId) => {
    const { activeDiscountSettings } = this.state;

    if (activeDiscountSettings.includes(itemId)) {
      const itemIndex = activeDiscountSettings.indexOf(itemId);

      activeDiscountSettings.splice(itemIndex, 1);
    } else {
      activeDiscountSettings.push(itemId);
    }

    this.setState({ activeDiscountSettings });
  };

  render() {
    const { activeDiscountSettings } = this.state;
    const {
      classes, disableAvailability, items, onDelete, readOnly,
    } = this.props;

    console.log(items);
    return (items && items.length
      ? (
        <List component="div">
          {items.map((item) => {
            const key = `${item.name}-${item.id}`;
            const isDisabled = readOnly;
            const hasDiscount = !!item.discount;
            const availableTicketsNumber = item.availableTicketsNumber > 0
              ? item.availableTicketsNumber
              : '';

            return (
              <React.Fragment key={`${key}-details`}>
                <ListItem ContainerComponent="div">
                  <ListItemText primary={item.name} required secondary={this.getPriceTag(item)} />
                  <ListItemSecondaryAction>
                    <TextField
                      className={classes.availabilityTextfield}
                      helperText="Puste pole - brak limitu"
                      label="Limit biletów"
                      disabled={isDisabled || disableAvailability}
                      onChange={event => this.handlePropertyChange(event, item)}
                      name="availableTicketsNumber"
                      type="number"
                      value={availableTicketsNumber}
                    />
                    <IconButton
                      aria-label="Ustawienia rabatu"
                      onClick={() => this.toggleDiscountSettings(item.id)}
                      title="Ustawienia rabatu"
                    >
                      <CardGiftcardIcon color={hasDiscount ? 'primary' : 'inherit'} />
                    </IconButton>
                    {!readOnly && onDelete && (
                    <IconButton
                      aria-label="Usuń bilet z puli"
                      onClick={() => this.handleDelete(item)}
                      title="Usuń bilet z puli"
                    >
                      <DeleteIcon />
                    </IconButton>
                    )}
                  </ListItemSecondaryAction>
                </ListItem>
                {activeDiscountSettings.includes(item.id) && (
                <ListItem component="div" className={classes.discountWrapper}>
                  <Grid container>
                    <TicketDiscountForm
                      disabled={isDisabled}
                      onSubmit={this.handleChange}
                      onReset={this.handleChange}
                      ticketDefinition={item}
                    />
                  </Grid>
                </ListItem>
                )}
              </React.Fragment>
            );
          })}
        </List>
      )
      : null
    );
  }
}

TicketDefinitionList.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  disableAvailability: PropTypes.bool,
  onChange: PropTypes.func,
  onDelete: PropTypes.func,
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    availableTicketsNumber: PropTypes.number,
    name: PropTypes.string,
    originalPrice: PropTypes.number,
    price: PropTypes.number,
  })).isRequired, // rename
  readOnly: PropTypes.bool,
};

TicketDefinitionList.defaultProps = {
  disableAvailability: false,
  onChange: null,
  onDelete: null,
  readOnly: false,
};

export default withStyles(styles)(TicketDefinitionList);
