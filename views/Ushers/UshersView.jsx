import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Link from 'next/link';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import GridItem from 'components/GridItem';
import Layout from 'components/Layout';
import {
  actions as ushersActions,
  selectors as ushersSelectors,
} from 'redux/ushers';
import withAuth from 'services/auth/withAuth';
import UshersList from './components/UshersList';
import UsherFormDialog from './components/UsherFormDialog';

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
    const { ushers } = this.props;
    const { usherForm } = this.state;

    return (
      <Layout>
        <Grid container spacing={8}>
          <GridItem>
            <Button onClick={this.handleUsherFormOpen}>
              Dodaj biletera
            </Button>
          </GridItem>
          <GridItem>
            <UshersList ushers={ushers} />
          </GridItem>
        </Grid>
        <UsherFormDialog open={usherForm} onClose={this.handleUsherFormClose} />
      </Layout>
    );
  }
}

UshersView.propTypes = {
  clearError: PropTypes.func.isRequired,
  fetchUshers: PropTypes.func.isRequired,
  ushers: PropTypes.arrayOf(PropTypes.shape({})),
};

UshersView.defaultProps = {
  ushers: [],
};

const mapStateToProps = state => ({
  ushers: ushersSelectors.getUshers(state),
});

const mapDispatchToProps = {
  clearError: ushersActions.clearError,
  fetchUshers: ushersActions.fetchList,
};

export default compose(
  withAuth(),
  connect(mapStateToProps, mapDispatchToProps),
)(UshersView);
