import React from 'react';
import PropTypes from 'prop-types';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DesktopWindows from '@material-ui/icons/DesktopWindows';
import AddIcon from '@material-ui/icons/Add';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import VisibilityIcon from '@material-ui/icons/Visibility';
import NotificationImportantIcon from '@material-ui/icons/NotificationImportant';
import ListItem from '@material-ui/core/ListItem';


const HomeListItem = ({
  blocked,
  icon: Icon,
  primary,
  secondary,
  onAddClick,
  onAddLabel,
  onDeleteClick,
  onDeleteLabel,
  onEditClick,
  onEditLabel,
  onViewClick,
  onViewLabel,
  published,
}) => (
  <ListItem>
    <ListItemIcon>
      <Icon />
    </ListItemIcon>
    <ListItemText
      primary={primary}
      secondary={secondary}
    />
    <ListItemSecondaryAction>
      {blocked &&
        <NotificationImportantIcon color="error" style={{ verticalAlign: 'middle' }} />
      }
      {published &&
        <VisibilityIcon color="primary" style={{ verticalAlign: 'middle' }} />
      }
      {onViewClick &&
        <IconButton
          aria-label={onViewLabel}
          title={onViewLabel}
        >
          <DesktopWindows />
        </IconButton>
      }
      {onAddClick &&
        <IconButton
          aria-label={onAddLabel}
          onClick={onAddClick}
          title={onAddLabel}
        >
          <AddIcon />
        </IconButton>
      }
      {onEditClick &&
        <IconButton
          aria-label={onEditLabel}
          onClick={onEditClick}
          title={onEditLabel}
        >
          <CreateIcon />
        </IconButton>
      }
      {onDeleteClick &&
        <IconButton
          aria-label={onDeleteLabel}
          onClick={onDeleteClick}
          title={onDeleteLabel}
        >
          <DeleteIcon />
        </IconButton>
      }
    </ListItemSecondaryAction>
  </ListItem>
);

HomeListItem.propTypes = {
  blocked: PropTypes.bool,
  icon: PropTypes.func.isRequired,
  onAddClick: PropTypes.func,
  onAddLabel: PropTypes.string,
  onDeleteClick: PropTypes.func,
  onDeleteLabel: PropTypes.string,
  onEditClick: PropTypes.func,
  onEditLabel: PropTypes.string,
  onViewClick: PropTypes.func,
  onViewLabel: PropTypes.string,
  primary: PropTypes.string.isRequired,
  published: PropTypes.bool,
  secondary: PropTypes.string,
};

HomeListItem.defaultProps = {
  blocked: false,
  onAddClick: null,
  onAddLabel: null,
  onDeleteClick: null,
  onDeleteLabel: null,
  onEditClick: null,
  onEditLabel: null,
  onViewClick: null,
  onViewLabel: null,
  published: false,
  secondary: null,
};

export default HomeListItem;
