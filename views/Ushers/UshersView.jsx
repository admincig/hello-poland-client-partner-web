import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Link from 'next/link';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
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
    this.setState({
      usherForm: true,
    });
  }

  handleUsherFormClose = () => {
    this.setState({
      usherForm: false,
    });
  }

  render() {
    const { ushers } = this.props;
    const { usherForm } = this.state;

    return (
      <Layout>
        <Link href="/" passHref prefetch>
          <Button component="a">Strona główna</Button>
        </Link>
        <Link href="/ushers" passHref prefetch>
          <Button component="a">
            Bileterzy
          </Button>
        </Link>
        <Typography variant="h6" gutterBottom>Bileterzy</Typography>
        <Button
          color="primary"
          size="small"
          variant="contained"
          style={{ marginBottom: '1rem' }}
          onClick={this.handleUsherFormOpen}
        >
            Dodaj biletera
        </Button>
        <UsherFormDialog open={usherForm} onClose={this.handleUsherFormClose} />
        <UshersList ushers={ushers} />
      </Layout>
    );
  }
}

UshersView.propTypes = {
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
  fetchUshers: ushersActions.fetchList,
};

export default compose(
  withAuth(),
  connect(mapStateToProps, mapDispatchToProps),
)(UshersView);
