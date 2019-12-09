import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import GetAppIcon from '@material-ui/icons/GetApp';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';

const styles = () => ({
  thumbnail: {
    width: 200,
  },
});

function MultimediaSection({
  classes, items, onDelete, sectionType,
}) {
  if (!items || items.length === 0) {
    return (
      <Grid container item direction="column" alignItems="center" justify="center">
        <Typography>Brak multimediów.</Typography>
      </Grid>
    );
  }

  return (
    <Table>
      <TableBody>
        {items.map(({
          downloadUrl, id: fileId, name, type,
        }) => (
          <TableRow key={`${name}-${fileId}`} hover>
            <TableCell className={classes.thumbnail} padding={type === 'image/jpeg' ? 'none' : 'default'}>
              {type === 'image/jpeg'
                ? <img src={downloadUrl.qvgWebp} width={160} alt={name} />
                : <InsertDriveFileIcon />
              }
            </TableCell>
            <TableCell>{name}</TableCell>
            <TableCell align="right">
              {type !== 'image/jpeg' && (
                <IconButton
                  component="a"
                  href={downloadUrl}
                  aria-label="Pobierz"
                  title="Pobierz"
                  target="_blank"
                >
                  <GetAppIcon />
                </IconButton>
              )}
              <IconButton
                aria-label="Usuń"
                disabled={!onDelete}
                onClick={() => onDelete(fileId, { name, type: sectionType })}
                title="Usuń"
              >
                <DeleteIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

MultimediaSection.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({})),
  sectionType: PropTypes.string.isRequired,
  onDelete: PropTypes.func,
};

MultimediaSection.defaultProps = {
  items: [],
  onDelete: null,
};

export default withStyles(styles)(MultimediaSection);
