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
});

function TagsForm({
  tags, classes, defaultTranslation, items, managePublic, manageRestricted, onSubmit,
  onDelete, translation,
}) {
  const { operatorName } = (config && config.public) || {};
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogType, setDialogType] = React.useState(null);
  const [selectedTagId, setSelectedTagId] = React.useState('');

  function getItemsByRestriction(originalItems, isRestricted) {
    if (Array.isArray(originalItems)) {
      return originalItems.filter(({ restricted }) => restricted === isRestricted);
    }

    return [];
  }

  function handleChangeSelectedTagId(event) {
    const { value } = event.target;

    setSelectedTagId(value);
  }

  function handleDialogClose() {
    setDialogOpen(false);
    setDialogType(null);
    setSelectedTagId('');
  }

  function handleDialogOpen(type) {
    setDialogOpen(true);
    setDialogType(type);
  }

  function handleItemDelete(itemId) {
    if (itemId && onDelete) {
      onDelete(itemId);
    }
  }

  function handleItemSubmit(itemId) {
    if (itemId && onSubmit) {
      onSubmit(itemId);
    }

    handleDialogClose();
  }

  const publicItems = getItemsByRestriction(items, false);
  const restrictedItems = getItemsByRestriction(items, true);
  const isDefaultTranslation = defaultTranslation === translation;

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
      <Grid container alignItems="center" justify="space-between" className={classes.section}>
        <Grid item>
          <Typography variant="h6">{`Tagi ${operatorName || 'administratora'}`}</Typography>
        </Grid>
        {manageRestricted
          && (
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
          )
        }
      </Grid>
      {(restrictedItems.length === 0)
        && (
          <Grid container item direction="column" alignItems="center" justify="center">
            <Typography>{`Brak tagów przypisanych przez ${operatorName || 'administratora'}.`}</Typography>
          </Grid>
        )
      }
      {restrictedItems.length > 0
        && (
          <Grid container>
            <Table>
              <TableBody>
                {restrictedItems.map(({ iconUrl, id: itemId, label }) => (
                  <TableRow key={`${label}-${itemId}`} hover={manageRestricted}>
                    <TableCell className={classes.thumbnail} padding="none">
                      {iconUrl
                        ? <img src={iconUrl} height={32} width={32} alt={label} />
                        : <InsertDriveFileIcon />
                      }
                    </TableCell>
                    <TableCell>{label}</TableCell>
                    <TableCell align="right" padding="none">
                      {manageRestricted
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
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Dodaj tag</DialogTitle>
        <DialogContent>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="selected-tag">Tag</InputLabel>
            <Select
              input={<Input id="selected-tag" />}
              onChange={handleChangeSelectedTagId}
              value={selectedTagId}
            >
              {tags.filter(({ id: categoryId, restricted }) => {
                const isExistingCategory = items.some(item => item.id === categoryId);

                switch (dialogType) {
                  case DIALOG_TYPE.RESTRICTED:
                    return !isExistingCategory && restricted;
                  case DIALOG_TYPE.PUBLIC:
                    return !isExistingCategory && !restricted;
                  default:
                    return !isExistingCategory;
                }
              }).map(({ id: categoryId, label }) => (
                <MenuItem key={categoryId} value={categoryId}>{label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Anuluj
          </Button>
          <Button onClick={() => handleItemSubmit(selectedTagId)} color="primary">
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
  onSubmit: null,
  onDelete: null,
  translation: DEFAULT_LANGUAGE,
};

export default withStyles(styles)(TagsForm);
