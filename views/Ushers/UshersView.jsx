import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import LockIcon from '@material-ui/icons/Lock';
import EmptyView from 'components/EmptyView';
import GridItem from 'components/GridItem';
import Layout from 'components/Layout';
import {
  actions as ushersActions,
  selectors as ushersSelectors,
} from 'redux/ushers';
import { selectors as profileSelectors } from 'redux/profile';
import withAuth from 'services/auth/withAuth';
import PartnerUsersManager from './components/PartnerUsersManager';
import UshersList from './components/UshersList';
import UsherFormDialog from './components/UsherFormDialog';

const styles = theme => ({
  noAccess: {
    minHeight: `calc(100vh - ${theme.spacing.unit * 10}px)`,
  },
});

class UshersView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      usherForm: false,
    };
  }

  componentDidMount() {
    const { fetchUshers } = this.props;

    fetchUshers();
  }

  handleUsherFormOpen = () => {
    const { clearError } = this.props;
    clearError();
    this.setState({ usherForm: true });
  }

  handleUsherFormClose = () => this.setState({ usherForm: false });

  render() {
    const { classes, profile, ushers } = this.props;
    const { usherForm } = this.state;
    const roles = (profile && profile.roles) || [];
    const canManageUsers = !roles.includes('PARTNER_SALESMAN');

    return (
      <Layout>
        <Grid container spacing={8}>
          {canManageUsers && (
            <GridItem>
              <PartnerUsersManager onAddUsher={this.handleUsherFormOpen} />
            </GridItem>
          )}
          {canManageUsers && (
            <GridItem>
              <Typography variant="h6" gutterBottom>Bileterzy</Typography>
            </GridItem>
          )}
          {canManageUsers && (
            <GridItem>
              <UshersList ushers={ushers} />
            </GridItem>
          )}
          {!canManageUsers && (
            <GridItem className={classes.noAccess}>
              <EmptyView
                image={LockIcon}
                label="Brak dostępu do pracowników"
                message="Twoje konto nie ma uprawnień do zarządzania użytkownikami i bileterami."
              />
            </GridItem>
          )}
        </Grid>
        {canManageUsers && (
          <UsherFormDialog open={usherForm} onClose={this.handleUsherFormClose} />
        )}
      </Layout>
    );
  }
}

UshersView.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  clearError: PropTypes.func.isRequired,
  fetchUshers: PropTypes.func.isRequired,
  profile: PropTypes.shape({}),
  ushers: PropTypes.arrayOf(PropTypes.shape({})),
};

UshersView.defaultProps = {
  profile: {},
  ushers: [],
};

const mapStateToProps = state => ({
  profile: profileSelectors.getProfile(state),
  ushers: ushersSelectors.getUshers(state),
});

const mapDispatchToProps = {
  clearError: ushersActions.clearError,
  fetchUshers: ushersActions.fetchList,
};

export default compose(
  withAuth(),
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(UshersView);
