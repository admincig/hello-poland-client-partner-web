import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Link from 'next/link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { selectors as moviesSelectors } from 'redux/movies';
import Layout from 'components/Layout';

const MoviesView = ({ movies }) => (
  <Layout>
    <List>
      {movies.map(({ description, id, title }) => (
        <Link key={id} href={`/movies?id=${id}`} as={`/movies/${id}`} passHref>
          <ListItem dense button component="a">
            <ListItemText primary={title} secondary={description} />
          </ListItem>
        </Link>
      ))}
    </List>
  </Layout>
);

MoviesView.propTypes = {
  movies: PropTypes.arrayOf(PropTypes.shape({})),
};

MoviesView.defaultProps = {
  movies: [],
};

const mapStateToProps = state => ({
  movies: moviesSelectors.getMovies(state),
});

export default connect(mapStateToProps)(MoviesView);
