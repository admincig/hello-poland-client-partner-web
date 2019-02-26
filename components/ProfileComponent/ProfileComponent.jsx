import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import NoSsr from '@material-ui/core/NoSsr';
import UserSummary from './UserSummary';
import TabWrapper from './TabWrapper';

const ProfileComponent = ({
  activeTab, children, profile,
}) => (
  <Fragment>
    <Grid container spacing={16}>
      <Grid item sm={3} xs={12}>
        <NoSsr>
          <UserSummary profile={profile} />
        </NoSsr>
      </Grid>
      <Grid item sm={9} xs={12}>
        <TabWrapper active={activeTab} onChange={() => {}}>
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
};

export default ProfileComponent;
