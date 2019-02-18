import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

const UshersListItem = ({
  name, email, picture,
}) => (
  <ListItem>
    <ListItemIcon>
      {picture
          ? <Avatar src={picture} />
          : <AccountCircle style={{ fontSize: 42 }} />
      }
    </ListItemIcon>
    <ListItemText primary={name} secondary={email} />
  </ListItem>
);

UshersListItem.propTypes = {
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  picture: PropTypes.string,
};

UshersListItem.defaultProps = {
  picture: null,
};

export default UshersListItem;
