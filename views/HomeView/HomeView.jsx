import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import Router from 'next/router';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { selectors as profileSelectors } from 'shared/redux/profile';
import Layout from 'components/Layout';
import {actions as profileActions} from "../../shared/redux/profile";

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
      </Layout>
    );
  }
}

HomeView.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  classes: PropTypes.shape({}).isRequired,
  fetchProfile: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  isAuthenticated: profileSelectors.isAuthenticated(state),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    fetchProfile: profileActions.fetchProfile,
  }, dispatch);

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(HomeView);
