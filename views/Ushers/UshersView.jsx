import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Link from 'next/link';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Layout from 'components/Layout';
import {
  actions as ushersActions,
  selectors as ushersSelectors,
} from 'redux/ushers';
import UshersList from './components/UshersList';

class UshersView extends Component {
  componentDidMount() {
    const { fetchUshers } = this.props;

    fetchUshers();
  }

  render() {
    const { ushers } = this.props;

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
        <Typography variant="title" gutterBottom>Bileterzy</Typography>
        <UshersList ushers={ushers} />
      </Layout>
    );
  }
}

UshersView.propTypes = {
  fetchUshers: PropTypes.func.isRequired,
  ushers: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

const mapStateToProps = state => ({
  ushers: ushersSelectors.getUshers(state),
});

const mapDispatchToProps = {
  fetchUshers: ushersActions.fetchList,
};

export default connect(mapStateToProps, mapDispatchToProps)(UshersView);
