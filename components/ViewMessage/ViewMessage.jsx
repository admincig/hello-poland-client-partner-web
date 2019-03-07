import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const styles = () => ({
  container: {
    position: 'relative',
  },
  content: {
    margin: 'auto',
    textAlign: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

const ViewMessage = ({
  children, classes, icon: Icon, message,
}) => (
  <Grid container className={classes.container} direction="column" alignItems="center">
    <Grid item className={classes.content} xs={8}>
      {Icon}
      {message && message.length
        ? (
          <Typography align="center" variant="h5">
            {message}
          </Typography>
        )
        : null
      }
      {children}
    </Grid>
  </Grid>
);

ViewMessage.propTypes = {
  children: PropTypes.node,
  classes: PropTypes.shape({}).isRequired,
  icon: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.node,
  ]),
  message: PropTypes.string,
};

ViewMessage.defaultProps = {
  children: null,
  icon: null,
  message: null,
};

export default withStyles(styles)(ViewMessage);
