import React from 'react';
import PropTypes from 'prop-types';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DesktopWindows from '@material-ui/icons/DesktopWindows';
import AddIcon from '@material-ui/icons/Add';
import AddAPhoto from '@material-ui/icons/AddAPhoto';
import AssessmentIcon from '@material-ui/icons/Assessment';
import CreateIcon from '@material-ui/icons/Create';
import InfoIcon from '@material-ui/icons/Info';
import DeleteIcon from '@material-ui/icons/Delete';
import GetApp from '@material-ui/icons/GetApp';
import NoteAdd from '@material-ui/icons/NoteAdd';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Typography from '@material-ui/core/Typography';
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
  onDeletePDFClick,
  onDeletePDFLabel,
  onDocumentClick,
  onDocumentLabel,
  onEditClick,
  onOpenFileLabel,
  onOpenFileLink,
  onPreviewClick,
  onPreviewLabel,
  onEditLabel,
  onMainImageClick,
  onMainImageLabel,
  onStatsClick,
  onViewClick,
  onViewLabel,
  published,
}) => (
  <ListItem>
    <ListItemIcon>
      <Icon />
    </ListItemIcon>
    <ListItemText
      primary={<Typography noWrap style={{ width: '60%' }}>{primary}</Typography>}
      secondary={<Typography noWrap style={{ width: '60%' }}>{secondary}</Typography>}
    />
    <ListItemSecondaryAction>
      {blocked &&
        <IconButton
          aria-label={onViewLabel}
          style={{ cursor: 'default' }}
          title="Zablokowane"
        >
          <NotificationImportantIcon color="error" />
        </IconButton>
      }
      {published &&
        <IconButton
          aria-label={onViewLabel}
          style={{ cursor: 'default' }}
          title="Opublikowane"
        >
          <VisibilityIcon color="primary" />
        </IconButton>
      }
      {onViewClick &&
        <IconButton
          aria-label={onViewLabel}
          title={onViewLabel}
        >
          <DesktopWindows />
        </IconButton>
      }
      {onStatsClick &&
        <IconButton
          aria-label="Pokaż dostępność biletów"
          component="a"
          href={onStatsClick()}
          target="_blank"
          title="Pokaż dostępność biletów"
        >
          <AssessmentIcon />
        </IconButton>
      }
      {onMainImageClick &&
        <IconButton
          aria-label={onMainImageLabel}
          onClick={onMainImageClick}
          title={onMainImageLabel}
        >
          <AddAPhoto />
        </IconButton>
      }
      {onDocumentClick &&
        <IconButton
          aria-label={onDocumentLabel}
          onClick={onDocumentClick}
          title={onDocumentLabel}
        >
          <NoteAdd />
        </IconButton>
      }
      {onOpenFileLink &&
        <IconButton
          aria-label={onOpenFileLabel}
          title={onOpenFileLabel}
          onClick={onOpenFileLink}
        >
          <GetApp />
        </IconButton>
      }
      {onDeletePDFClick &&
        <IconButton
          aria-label={onDeletePDFLabel}
          onClick={onDeletePDFClick}
          title={onDeletePDFLabel}
        >
          <DeleteIcon />
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
      {onPreviewClick &&
        <IconButton
          aria-label={onPreviewLabel}
          onClick={onPreviewClick}
          title={onPreviewLabel}
        >
          <InfoIcon />
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
  onDeletePDFClick: PropTypes.func,
  onDeletePDFLabel: PropTypes.string,
  onDocumentClick: PropTypes.func,
  onDocumentLabel: PropTypes.string,
  onEditClick: PropTypes.func,
  onEditLabel: PropTypes.string,
  onOpenFileLabel: PropTypes.string,
  onOpenFileLink: PropTypes.func,
  onPreviewClick: PropTypes.func,
  onPreviewLabel: PropTypes.string,
  onMainImageClick: PropTypes.func,
  onMainImageLabel: PropTypes.string,
  onStatsClick: PropTypes.func,
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
  onDeletePDFClick: null,
  onDeletePDFLabel: null,
  onDocumentClick: null,
  onDocumentLabel: null,
  onEditClick: null,
  onEditLabel: null,
  onOpenFileLabel: null,
  onOpenFileLink: null,
  onPreviewClick: null,
  onPreviewLabel: null,
  onMainImageClick: null,
  onMainImageLabel: null,
  onStatsClick: null,
  onViewClick: null,
  onViewLabel: null,
  published: false,
  secondary: null,
};

export default HomeListItem;
