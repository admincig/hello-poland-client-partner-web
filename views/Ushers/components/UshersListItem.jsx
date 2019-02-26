import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = theme => ({
  listItem: {
    '& + &': {
      borderTop: `1px solid ${theme.palette.divider}`,
    },
  },
});

const UshersListItem = ({
  name, email, picture, classes, ...rest
}) => (
  <ListItem {...rest} className={classes.listItem}>
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
  classes: PropTypes.shape({}).isRequired,
};

UshersListItem.defaultProps = {
  picture: null,
};

export default withStyles(styles)(UshersListItem);
