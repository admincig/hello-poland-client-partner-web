import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import { selectors as moviesSelectors } from 'redux/movies';
import Layout from 'components/Layout';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
});

const MovieEditView = ({ classes, movie }) => (
  <Layout>
    <Card>
      <CardHeader
        title={movie.title}
      />
      <CardContent>
        <form className={classes.container} noValidate autoComplete="off">
          <TextField
            id="title"
            label="Title"
            className={classes.textField}
            value={movie.title}
            margin="normal"
          />
          <TextField
            id="description"
            label="Description"
            className={classes.textField}
            value={movie.description}
            margin="normal"
          />
        </form>
      </CardContent>
    </Card>
  </Layout>
);

MovieEditView.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  movie: PropTypes.shape({}),
};

MovieEditView.defaultProps = {
  movie: {},
};

const mapStateToProps = (state, { id }) => ({
  movie: moviesSelectors.getMovie(state, id),
});

export default compose(
  connect(mapStateToProps),
  withStyles(styles),
)(MovieEditView);
