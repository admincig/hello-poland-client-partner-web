import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import DefaultAvatar from 'components/Layout/DefaultAvatar';

const styles = (theme) => {
  console.log(theme); return ({
    avatar: {
      fontSize: theme.spacing.unit * 10,
    },
    avatarDefault: {
      color: theme.palette.grey[500],
    },
    content: {
      margin: [[theme.spacing.unit * 3, 0]],
    },
  });
};

const UserSummary = ({ classes, profile }) => {
  const { email, name, picture } = profile;
  return (
    <Card>
      <CardContent className={classes.content}>
        <Grid container direction="row" justify="center">
          <Grid item>
            {picture
              ? <Avatar src={picture} className={classes.avatar} />
              : <DefaultAvatar className={classNames(classes.avatar, classes.avatarDefault)} />
            }
            <Typography>
              {name || email}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

UserSummary.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  profile: PropTypes.shape({
    email: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
};

export default withStyles(styles)(UserSummary);
