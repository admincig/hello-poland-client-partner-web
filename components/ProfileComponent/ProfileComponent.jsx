import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import NoSsr from '@material-ui/core/NoSsr';
import UserSummary from './UserSummary';
import TabWrapper from './TabWrapper';

const ProfileComponent = ({
  activeTab, children, profile, handleTabChange,
}) => (
  <Fragment>
    <Grid container spacing={16}>
      <Grid item sm={3} xs={12} style={{ textAlign: 'center' }}>
        {
          profile.email ? (
            <NoSsr>
              <UserSummary profile={profile} />
            </NoSsr>
          )
          : (
            <CircularProgress size={170} thickness={1.6} />
          )
        }
      </Grid>
      <Grid item sm={9} xs={12}>
        <TabWrapper active={activeTab} onChange={handleTabChange}>
          {children}
        </TabWrapper>
      </Grid>
    </Grid>
  </Fragment>
);

ProfileComponent.propTypes = {
  activeTab: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  profile: PropTypes.shape({}).isRequired,
  handleTabChange: PropTypes.func.isRequired,
};

export default ProfileComponent;
