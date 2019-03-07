import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import NoSsr from '@material-ui/core/NoSsr';
import UserSummary from './UserSummary';
import TabWrapper from './TabWrapper';

const ProfileComponent = ({
  activeTab, children, profile, onTabChange, disableProfile,
}) => (
  <Fragment>
    <Grid container spacing={16}>
      <Grid item sm={3} xs={12} style={{ textAlign: 'center' }}>
        {Object.keys(profile).length
          ? (
            <NoSsr>
              <UserSummary profile={profile} />
            </NoSsr>
          )
          : <CircularProgress size={100} thickness={1.6} />
        }
      </Grid>
      <Grid item sm={9} xs={12}>
        <TabWrapper active={activeTab} onChange={onTabChange} disableProfile={disableProfile}>
          {children}
        </TabWrapper>
      </Grid>
    </Grid>
  </Fragment>
);

ProfileComponent.propTypes = {
  activeTab: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  disableProfile: PropTypes.bool.isRequired,
  profile: PropTypes.shape({}).isRequired,
  onTabChange: PropTypes.func.isRequired,
};

export default ProfileComponent;
