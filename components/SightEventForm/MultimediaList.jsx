import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography/Typography';
import List from '@material-ui/core/List/List';
import ListItem from '@material-ui/core/ListItem/ListItem';
import ListItemText from '@material-ui/core/ListItemText/ListItemText';
import GridItem from 'components/GridItem/GridItem';
import MultimediaListItem from './MultimediaListItem';

const styles = () => ({
  title: {
    marginTop: 40,
  },
});

const MultimediaList = ({ classes, data, onItemDelete }) => (
  <Fragment>
    <GridItem>
      <Typography variant="title" className={classes.title}>Multimedia</Typography>
    </GridItem>
    <GridItem>
      <List>
        {data.length
          ? data.map(file => (
            <MultimediaListItem key={file.name} {...file} onDelete={onItemDelete} />
          ))
          : (
            <ListItem>
              <ListItemText>
                Brak załączonych plików.
              </ListItemText>
            </ListItem>
          )
        }
      </List>
    </GridItem>
  </Fragment>
);

MultimediaList.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    sightEventId: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
  })),
  onItemDelete: PropTypes.func.isRequired,
};

MultimediaList.defaultProps = {
  data: [],
};

export default withStyles(styles)(MultimediaList);
