import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import GridItem from 'components/GridItem';
import Typography from '@material-ui/core/Typography';
import AccountCircle from '@material-ui/icons/AccountCircle';

const UserProfile = ({ profile: { email, name, picture } }) => (
  <Grid container>
    <GridItem>
      <Typography variant="title">Profil</Typography>
    </GridItem>
    <Grid item xs={12} container style={{ padding: 25 }}>
      <Grid item md={6} xs={12} style={{ padding: 30 }}>
        {
          picture
          ? <Avatar src={picture} style={{ width: '80%', height: '80%' }} />
          : <AccountCircle style={{ fontSize: 60 }} />
        }
      </Grid>
      <Grid item md={6} xs={12} container spacing={24}>
        <GridItem>
          <Typography variant="subheading">Nazwa użytkownika</Typography>
          <Typography variant="body2">{ name || 'brak nazwy' }</Typography>
        </GridItem>
        <GridItem>
          <Typography variant="subheading">Email</Typography>
          <Typography variant="body2">{email}</Typography>
        </GridItem>
      </Grid>
    </Grid>
  </Grid>
);

UserProfile.propTypes = {
  profile: PropTypes.shape({}).isRequired,
};

export default UserProfile;
