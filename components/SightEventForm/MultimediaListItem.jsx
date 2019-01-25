import React from 'react';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import GetAppIcon from '@material-ui/icons/GetApp';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';

const multimediaIcons = {
  PDF: <InsertDriveFileIcon />,
};

const MultimediaListItem = ({
  name, onDelete, downloadUrl, sightEventId, type,
}) => (
  <ListItem>
    <ListItemIcon>
      {multimediaIcons[type]}
    </ListItemIcon>
    <ListItemText>
      {name}
    </ListItemText>
    <ListItemSecondaryAction>
      <IconButton
        component="a"
        href={downloadUrl}
        aria-label="Podgląd"
        title="Podgląd"
        target="_blank"
      >
        <GetAppIcon />
      </IconButton>
      <IconButton aria-label="Usuń" title="Usuń" onClick={() => onDelete(sightEventId, name)}>
        <DeleteIcon />
      </IconButton>
    </ListItemSecondaryAction>
  </ListItem>
);

MultimediaListItem.propTypes = {
  name: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  downloadUrl: PropTypes.string.isRequired,
  sightEventId: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
};

export default MultimediaListItem;
