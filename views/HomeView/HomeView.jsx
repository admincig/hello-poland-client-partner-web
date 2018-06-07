import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Link from 'next/link';
import Layout from 'components/Layout';
import { actions, selectors } from './redux/counter';

const styles = {
  content: {
    padding: 16,
  },
};

const HomeView = ({
  classes, count, add, subtract, reset,
}) => (
  <Layout>
    <div className={classes.content}>
      <Typography variant="subheading">
        You can edit <code>pages/index.js</code> now and app will automatically refresh :)
      </Typography>
      <Link href="/about" passHref>
        <Button component="a" variant="raised" color="primary">About</Button>
      </Link>
      <Link href="/movies" passHref>
        <Button component="a" variant="raised" color="primary">Movies</Button>
      </Link>
      <Divider />
      <div>
        <Typography>Count: {count}</Typography>
      </div>
      <Button onClick={add}>Add</Button>
      <Button onClick={subtract}>Subtract</Button>
      <Button onClick={reset}>Reset</Button>
    </div>

  </Layout>
);

HomeView.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  count: PropTypes.number.isRequired,
  add: PropTypes.func.isRequired,
  subtract: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  count: selectors.getCount(state),
});

const mapDispatchToProps = dispatch => ({
  add: () => dispatch(actions.add()),
  subtract: () => dispatch(actions.subtract()),
  reset: () => dispatch(actions.reset()),
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(HomeView);
