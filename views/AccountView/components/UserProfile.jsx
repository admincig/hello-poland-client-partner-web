import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import AccountCircle from '@material-ui/icons/AccountCircle';
import IconAccountBox from '@material-ui/icons/AccountBox';
import IconMail from '@material-ui/icons/Mail';

const styles = theme => ({
  paper: {
    width: '100%',
    height: '100%',
    padding: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    margin: 10,
    alignSelf: 'center',
  },
  avatarSvg: {
    fontSize: theme.spacing.unit * 8,
  },
  iconProfile: {
    marginBottom: -5,
  },
  profileInfo: {
    lineHeight: 0,
    marginRight: 10,
  },
});

const UserProfile = ({ profile: { email, name, picture }, classes, ...rest }) => (
  <Grid container direction="column" {...rest}>
    <Paper className={classes.paper}>
      <Grid container direction="column" justify="center" spacing={8}>
        <Avatar src={picture} className={classes.avatar}>
          {
            !picture && <AccountCircle className={classes.avatarSvg} />
          }
        </Avatar>
        {
          name &&
          <Typography variant="caption" align="center" className={classes.profileInfo}>
            <IconAccountBox fontSize="small" className={classes.iconProfile} />&nbsp;{name}
          </Typography>
        }
        <Typography variant="caption" align="center" className={classes.profileInfo}>
          <IconMail fontSize="small" className={classes.iconProfile} />&nbsp;{email}
        </Typography>
      </Grid>
    </Paper>
  </Grid>
);

UserProfile.propTypes = {
  profile: PropTypes.shape({}).isRequired,
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(UserProfile);
