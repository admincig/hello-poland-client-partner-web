import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Link from 'next/link';
import Typography from '@material-ui/core/Typography';
import { selectors as moviesSelectors } from 'redux/movies';
import Layout from 'components/Layout';

const MovieView = ({ id, movie }) => (
  <Layout>
    <Card>
      <CardHeader
        title={movie.title}
      />
      <CardMedia
        component="img"
        style={{ width: 'auto' }}
        src={movie.poster}
        title="poster"
      />
      <CardContent>
        <Link href={`/movies/edit?id=${id}`} as={`/movies/${id}/edit`} passHref>
          <Button>Edit</Button>
        </Link>
        <Typography component="p">
          {movie.description}
        </Typography>
      </CardContent>
    </Card>
  </Layout>
);

MovieView.propTypes = {
  id: PropTypes.string.isRequired,
  movie: PropTypes.shape({}),
};

MovieView.defaultProps = {
  movie: {},
};

const mapStateToProps = (state, { id }) => ({
  movie: moviesSelectors.getMovie(state, id),
});

export default connect(mapStateToProps)(MovieView);
