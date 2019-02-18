import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import NoSsr from '@material-ui/core/NoSsr';
import Layout from 'components/Layout';
import UserSummary from './UserSummary';
import TabWrapper from './TabWrapper';

const styles = theme => ({
  root: {
    marginTop: theme.spacing.unit * 2,
  },
});

const AccountViewWrapper = ({
  activeTab, children, classes, profile,
}) => (
  <Layout>
    <Grid container spacing={16} className={classes.root}>
      <Grid item sm={3} xs={12}>
        <NoSsr>
          <UserSummary profile={profile} />
        </NoSsr>
      </Grid>
      <Grid item sm={9} xs={12}>
        <TabWrapper active={activeTab} onChange={console.log}>
          {children}
        </TabWrapper>
      </Grid>
    </Grid>
  </Layout>
);

AccountViewWrapper.propTypes = {
  activeTab: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  classes: PropTypes.shape({}).isRequired,
  profile: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(AccountViewWrapper);

