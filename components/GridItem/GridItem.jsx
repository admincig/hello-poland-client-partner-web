import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';

const GridItem = ({ children, ...props }) => (
  <Grid item md={12} sm={12} xs={12} {...props}>
    {children}
  </Grid>
);

GridItem.propTypes = {
  children: PropTypes.node,
};

GridItem.defaultProps = {
  children: null,
};

export default GridItem;
