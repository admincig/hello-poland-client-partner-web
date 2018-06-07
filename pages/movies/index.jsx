import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import withRoot from 'src/withRoot';
import withRedux from 'services/redux/withRedux';
import {
  actions as moviesActions,
  selectors as moviesSelectors,
} from 'redux/movies';
import MovieView from 'views/MovieView';
import MoviesView from 'views/MoviesView';

class MoviesWrapper extends React.Component {
  static async getInitialProps(initialProps) {
    const { store, query } = initialProps;
    const { id } = query;

    if (id) {
      const movieData = moviesSelectors.getMovie(store.getState(), id);

      if (!movieData) {
        await store.dispatch(moviesActions.fetchMovies());
      }

      return {
        id,
        movie: movieData || {},
      };
    }

    await initialProps.store.dispatch(moviesActions.fetchMovies());

    return {};
  }

  render() {
    const { id } = this.props;

    return id ? <MovieView id={id} /> : <MoviesView />;
  }
}

MoviesWrapper.propTypes = {
  id: PropTypes.string,
};

MoviesWrapper.defaultProps = {
  id: '',
};

export default compose(
  withRedux(),
  withRoot,
)(MoviesWrapper);
