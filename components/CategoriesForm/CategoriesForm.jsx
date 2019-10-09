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

function CategoriesForm({
  categories, classes, defaultTranslation, items, managePublic, manageRestricted, onSubmit,
  onDelete, translation,
}) {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogType, setDialogType] = React.useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = React.useState('');

  function getCategoriesByRestriction(originalItems, isRestricted) {
    if (Array.isArray(originalItems)) {
      return originalItems.filter(({ restricted }) => restricted === isRestricted);
    }

    return [];
  }

  function handleChangeSelectedCategoryId(event) {
    const { value } = event.target;

    setSelectedCategoryId(value);
  }

  function handleDialogClose() {
    setDialogOpen(false);
    setDialogType(null);
    setSelectedCategoryId('');
  }

  function handleDialogOpen(type) {
    setDialogOpen(true);
    setDialogType(type);
  }

  function handleCategoryDelete(categoryId) {
    if (categoryId && onDelete) {
      onDelete(categoryId);
    }
  }

  function handleCategorySubmit(categoryId) {
    if (categoryId && onSubmit) {
      onSubmit(categoryId);
    }

    handleDialogClose();
  }

  const publicCategories = getCategoriesByRestriction(items, false);
  const restrictedCategories = getCategoriesByRestriction(items, true);
  const isDefaultTranslation = defaultTranslation === translation;

  return (
    <React.Fragment>
      <Grid container alignItems="center" justify="space-between" className={classes.section}>
        <Grid item>
          <Typography variant="h6">Kategorie partnera</Typography>
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
      {(publicCategories.length === 0)
        && (
          <Grid container item direction="column" alignItems="center" justify="center">
            <Typography>Brak kategorii przypisanych przez partnera.</Typography>
          </Grid>
        )
      }
      {publicCategories.length > 0
        && (
          <Grid container>
            {publicCategories.length
              && (
                <Table>
                  <TableBody>
                    {publicCategories.map(({ iconUrl, id: itemId, label }) => (
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
                                onClick={() => handleCategoryDelete(itemId)}
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
              )
            }
          </Grid>
        )
      }
      <Grid container alignItems="center" justify="space-between" className={classes.section}>
        <Grid item>
          <Typography variant="h6">Kategorie Hello! Poland</Typography>
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
      {(restrictedCategories.length === 0)
        && (
          <Grid container item direction="column" alignItems="center" justify="center">
            <Typography>Brak kategorii przypisanych przez Hello! Poland.</Typography>
          </Grid>
        )
      }
      {restrictedCategories.length > 0
        && (
          <Grid container>
            {restrictedCategories.length
              && (
                <Table>
                  <TableBody>
                    {restrictedCategories.map(({ iconUrl, id: itemId, label }) => (
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
                                onClick={() => handleCategoryDelete(itemId)}
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
              )
            }
          </Grid>
        )
      }
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Dodaj kategorię</DialogTitle>
        <DialogContent>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="selected-category">Kategoria</InputLabel>
            <Select
              input={<Input id="selected-category" />}
              onChange={handleChangeSelectedCategoryId}
              value={selectedCategoryId}
            >
              {categories.filter(({ id: categoryId, restricted }) => {
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
          <Button onClick={() => handleCategorySubmit(selectedCategoryId)} color="primary">
            Dodaj
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

CategoriesForm.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.shape({})),
  classes: PropTypes.shape({}).isRequired,
  defaultTranslation: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.shape({})),
  managePublic: PropTypes.bool,
  manageRestricted: PropTypes.bool,
  onSubmit: PropTypes.func,
  onDelete: PropTypes.func,
  translation: PropTypes.string,
};

CategoriesForm.defaultProps = {
  categories: [],
  defaultTranslation: DEFAULT_LANGUAGE,
  items: [],
  managePublic: false,
  manageRestricted: false,
  onSubmit: null,
  onDelete: null,
  translation: DEFAULT_LANGUAGE,
};

export default withStyles(styles)(CategoriesForm);
