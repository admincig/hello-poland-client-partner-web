import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import Router from 'next/router';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {
  actions as profileActions,
  selectors as profileSelectors,
} from 'redux/profile';
import Layout from 'components/Layout';

const styles = {
  content: {
    padding: 16,
  },
};

class HomeView extends Component {
  componentDidMount() {
    const { isAuthenticated } = this.props;

    if (!isAuthenticated) {
      Router.push('/login');
    }
  }

  handleFetch = () => {
    const { fetchProfile } = this.props;

    fetchProfile();
  };

  handleLogout = () => {
    const { logout } = this.props;

    logout();
  };

  render() {
    const { classes } = this.props;

    return (
      <Layout>
        <Typography className={classes.content}>
          Home view
        </Typography>
        <Button
          variant="raised"
          color="primary"
          className={classes.button}
          onClick={() => this.handleFetch()}
        >
          Pobierz dane
        </Button>
        <Button
          variant="raised"
          color="primary"
          className={classes.button}
          onClick={() => this.handleLogout()}
        >
          Wyloguj
        </Button>
      </Layout>
    );
  }
}

HomeView.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  classes: PropTypes.shape({}).isRequired,
  fetchProfile: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  isAuthenticated: profileSelectors.isAuthenticated(state),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    fetchProfile: profileActions.fetchProfile,
    logout: profileActions.logout,
  }, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(HomeView);
