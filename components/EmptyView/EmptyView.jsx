import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';

const styles = theme => ({
  root: {
    height: '100%',
  },
  fetchButton: {
    marginTop: theme.spacing.unit * 3,
  },
  image: {
    color: theme.palette.grey[500],
    fontSize: theme.spacing.unit * 10,
  },
  progressBar: {
    width: theme.spacing.unit * 10,
  },
});

function EmptyView({
  classes, image: Image, label, loading, message, onRefresh,
}) {
  return (
    <Grid container item className={classes.root} direction="column" alignItems="center" justify="center">
      {loading
        ? (
          <Fragment>
            <CloudDownloadIcon className={classes.image} />
            <LinearProgress className={classes.progressBar} />
          </Fragment>
        )
        : (
          <Fragment>
            <Image className={classes.image} />
            <Typography variant="h6">{label}</Typography>
            <Typography>{message}</Typography>
            {onRefresh
            && (
              <Button className={classes.fetchButton} variant="outlined" onClick={onRefresh}>
                Ponów
              </Button>
            )
            }
          </Fragment>
        )
      }
    </Grid>
  );
}

EmptyView.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  image: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  message: PropTypes.string,
  onRefresh: PropTypes.func,
};

EmptyView.defaultProps = {
  loading: false,
  message: '',
  onRefresh: null,
};

export default withStyles(styles)(EmptyView);
