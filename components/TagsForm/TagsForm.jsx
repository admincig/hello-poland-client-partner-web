import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import Checkbox from '@material-ui/core/Checkbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { DEFAULT_LANGUAGE } from 'utils/translations';
import config from 'config';

const DIALOG_TYPE = {
  COMBINED: 'COMBINED',
  PUBLIC: 'PUBLIC',
  RESTRICTED: 'RESTRICTED',
};

const styles = theme => ({
  formControl: {
    minWidth: 200,
  },
  image: {
    color: theme.palette.grey[500],
    fontSize: theme.spacing.unit * 10,
  },
  listItem: {
    '&:hover': {
      backgroundColor: theme.palette.grey[200],
    },
  },
  section: {
    '& ~ &': {
      marginTop: theme.spacing.unit * 2,
    },
  },
  thumbnail: {
    width: 70,
  },
  listBox: {
    width: 360,
    maxHeight: 380, // ~10-12 pozycji
    overflowY: 'auto',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 6,
    padding: theme.spacing.unit,
  },
});

function TagsForm({
  tags, classes, defaultTranslation, items, managePublic, manageRestricted, showRestrictedSection,
  onSubmit, onDelete, translation,
}) {
  const { brandName } = (config && config.public) || {};
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogType, setDialogType] = React.useState(null);
  const [selectedTagIds, setSelectedTagIds] = React.useState([]);

  function getItemsByRestriction(originalItems, isRestricted) {
    if (Array.isArray(originalItems)) {
      return originalItems.filter(({ restricted }) => restricted === isRestricted);
    }

    return [];
  }

 function handleChangeSelectedTagId(event) {
   const { value } = event.target;
   setSelectedTagIds(value);
 }

  function handleDialogClose() {
    setDialogOpen(false);
    setDialogType(null);
    setSelectedTagIds([]);
  }

  function handleDialogOpen(type) {
    setDialogType(type);

    const existingIds = Array.isArray(items)
      ? items.map(item => item.id)
      : [];

    setSelectedTagIds(existingIds);
    setDialogOpen(true);
  }

  function handleItemDelete(itemId) {
    if (itemId && onDelete) {
      onDelete(itemId);
    }
  }

  function handleItemSubmit() {
    if (selectedTagIds.length && onSubmit) {
      onSubmit(selectedTagIds); // <-- zamiast forEach
    }
    handleDialogClose();
  }

  function toggleTag(tagId) {
    setSelectedTagIds(prev =>
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    );
  }

  const publicItems = getItemsByRestriction(items, false);
  const restrictedItems = getItemsByRestriction(items, true);
  const isDefaultTranslation = defaultTranslation === translation;
  const availableTags = tags
    .filter(({ id: tagId, restricted }) => {
      const isExisting = items.some(item => item.id === tagId);
      if (isExisting) return false;

      switch (dialogType) {
        case DIALOG_TYPE.RESTRICTED:
          return restricted;
        case DIALOG_TYPE.PUBLIC:
          return !restricted;
        default:
          return true;
      }
    });


  return (
    <React.Fragment>
      <Grid container alignItems="center" justify="space-between" className={classes.section}>
        <Grid item>
          <Typography variant="h6">Tagi partnera</Typography>
        </Grid>
        {managePublic
          && (
            <Grid item>
              <IconButton
                aria-label="Dodaj"
                disabled={!isDefaultTranslation}
                onClick={() => handleDialogOpen(DIALOG_TYPE.PUBLIC)}
                title="Dodaj"
              >
                <AddIcon />
              </IconButton>
            </Grid>
          )
        }
      </Grid>
      {(publicItems.length === 0)
        && (
          <Grid container item direction="column" alignItems="center" justify="center">
            <Typography>Brak tagów przypisanych przez partnera.</Typography>
          </Grid>
        )
      }
      {publicItems.length > 0
        && (
          <Grid container>
            <Table>
              <TableBody>
                {publicItems.map(({ iconUrl, id: itemId, label }) => (
                  <TableRow key={`${label}-${itemId}`} hover={managePublic}>
                    <TableCell className={classes.thumbnail} padding="none">
                      {iconUrl
                        ? <img src={iconUrl} height={32} width={32} alt={label} />
                        : <InsertDriveFileIcon />
                      }
                    </TableCell>
                    <TableCell>{label}</TableCell>
                    <TableCell align="right" padding="none">
                      {managePublic
                        && (
                          <IconButton
                            aria-label="Usuń"
                            disabled={!isDefaultTranslation}
                            onClick={() => handleItemDelete(itemId)}
                            title="Usuń"
                          >
                            <DeleteIcon />
                          </IconButton>
                        )
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Grid>
        )
      }
      {showRestrictedSection && (
        <>
          <Grid
            container
            alignItems="center"
            justify="space-between"
            className={classes.section}
          >
            <Grid item>
              <Typography variant="h6">
                {`Tagi ${brandName || 'administratora'}`}
              </Typography>
            </Grid>

            {manageRestricted && (
              <Grid item>
                <IconButton
                  aria-label="Dodaj"
                  disabled={!isDefaultTranslation}
                  onClick={() => handleDialogOpen(DIALOG_TYPE.RESTRICTED)}
                  title="Dodaj"
                >
                  <AddIcon />
                </IconButton>
              </Grid>
            )}
          </Grid>

          {restrictedItems.length === 0 && (
            <Grid
              container
              item
              direction="column"
              alignItems="center"
              justify="center"
            >
              <Typography>
                {`Brak tagów przypisanych przez ${brandName || 'administratora'}.`}
              </Typography>
            </Grid>
          )}

          {restrictedItems.length > 0 && (
            <Grid container>
              <Table>
                <TableBody>
                  {restrictedItems.map(({ iconUrl, id: itemId, label }) => (
                    <TableRow key={`${label}-${itemId}`} hover>
                      <TableCell className={classes.thumbnail} padding="none">
                        {iconUrl
                          ? <img src={iconUrl} height={32} width={32} alt={label} />
                          : <InsertDriveFileIcon />
                        }
                      </TableCell>
                      <TableCell>{label}</TableCell>
                      <TableCell align="right" padding="none">
                        {manageRestricted && (
                          <IconButton
                            aria-label="Usuń"
                            disabled={!isDefaultTranslation}
                            onClick={() => handleItemDelete(itemId)}
                            title="Usuń"
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Grid>
          )}
        </>
      )}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Dodaj tag</DialogTitle>
        <DialogContent>
          <div className={classes.listBox}>
            <List dense>
              {availableTags.map(({ id: tagId, label, iconUrl }) => (
                <ListItem
                  key={tagId}
                  button
                  onClick={() => toggleTag(tagId)}
                  style={{ paddingTop: 6, paddingBottom: 6 }}
                >

                  {/* CHECKBOX */}
                  <ListItemIcon style={{ minWidth: 36 }}>
                    <Checkbox
                      edge="start"
                      checked={selectedTagIds.includes(tagId)}
                      tabIndex={-1}
                      disableRipple
                      style={{ padding: 4 }}
                    />
                  </ListItemIcon>

                  {/* IKONA */}
                  <ListItemIcon style={{ minWidth: 36 }}>
                    {iconUrl
                      ? (
                        <img
                          src={iconUrl}
                          alt={label}
                          style={{
                            width: 20,
                            height: 20,
                            display: 'block'
                          }}
                        />
                      )
                      : <InsertDriveFileIcon style={{ fontSize: 20 }} />
                    }
                  </ListItemIcon>

                  {/* TEKST */}
                  <ListItemText
                    primary={label}
                    primaryTypographyProps={{
                      style: { fontSize: 14 }
                    }}
                  />

                </ListItem>
              ))}
            </List>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Anuluj
          </Button>
          <Button onClick={handleItemSubmit} color="primary" disabled={!selectedTagIds.length}>
            Dodaj
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

TagsForm.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.shape({})),
  classes: PropTypes.shape({}).isRequired,
  defaultTranslation: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.shape({})),
  managePublic: PropTypes.bool,
  manageRestricted: PropTypes.bool,
  showRestrictedSection: PropTypes.bool,
  onSubmit: PropTypes.func,
  onDelete: PropTypes.func,
  translation: PropTypes.string,
};

TagsForm.defaultProps = {
  tags: [],
  defaultTranslation: DEFAULT_LANGUAGE,
  items: [],
  managePublic: false,
  manageRestricted: false,
  showRestrictedSection: true,
  onSubmit: null,
  onDelete: null,
  translation: DEFAULT_LANGUAGE,
};

export default withStyles(styles)(TagsForm);
