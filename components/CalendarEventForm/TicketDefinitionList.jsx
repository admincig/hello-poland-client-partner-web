import React from 'react';
import PropTypes from 'prop-types';
import _find from 'lodash/find';
import List from '@material-ui/core/List/List';
import ListItem from '@material-ui/core/ListItem/ListItem';
import ListItemText from '@material-ui/core/ListItemText/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton/IconButton';
import formatPrice from 'utils/formatPrice';

const TicketDefinitionList = ({
  disableAvailability, onAvailabilityChange, onDeleteClick, ticketDefinitions,
  ticketDefinitionsList, readOnly,
}) => (ticketDefinitions && ticketDefinitions.length ?
  <List>
    {ticketDefinitions.map((selected) => {
      const ticketDefinition = _find(ticketDefinitionsList, { id: selected.id }) || selected;
      if (!ticketDefinition) {
        return null;
      }

      const { availableTicketsNumber } = selected;
      const key = `${ticketDefinition.name}-${ticketDefinition.id}`;

      return (
        <ListItem key={key}>
          <ListItemText
            primary={ticketDefinition.name}
            required
            secondary={formatPrice(ticketDefinition.price) || ''}
          />
          <ListItemSecondaryAction>
            <TextField
              style={{ width: '150px' }}
              helperText="Puste pole - brak limitu"
              label="Limit biletów"
              disabled={readOnly || disableAvailability}
              onChange={event => onAvailabilityChange(event, ticketDefinition.id)}
              name="availableTicketsNumber"
              type="number"
              value={availableTicketsNumber && availableTicketsNumber > 0
                ? availableTicketsNumber
                : ''
              }
            />
            {!readOnly &&
              <IconButton
                aria-label="Usuń bilet z puli"
                onClick={() => onDeleteClick(selected.id, ticketDefinition.name)}
                title="Usuń bilet z puli"
              >
                <DeleteIcon />
              </IconButton>
            }
          </ListItemSecondaryAction>
        </ListItem>
      );
    })}
  </List>
  : null
);

TicketDefinitionList.propTypes = {
  disableAvailability: PropTypes.bool,
  onDeleteClick: PropTypes.func.isRequired,
  onAvailabilityChange: PropTypes.func.isRequired,
  ticketDefinitions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    availableTicketsNumber: PropTypes.number,
  })).isRequired,
  ticketDefinitionsList: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number,
  })).isRequired,
  readOnly: PropTypes.bool,
};

TicketDefinitionList.defaultProps = {
  disableAvailability: false,
  readOnly: false,
};

export default TicketDefinitionList;
