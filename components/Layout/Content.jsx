import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import classNames from 'classnames';

const styles = {
  root: {
    width: '100%',
    padding: [[72, 8, 8]],
    margin: '0 auto',
  },
};

const Content = ({
  classes, className, children, ...props
}) => (
  <div className={classNames(classes.root, className)} {...props}>
    {children}
  </div>
);

Content.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.object,
  ]),
};

Content.defaultProps = {
  className: '',
  children: null,
};

export default withStyles(styles)(Content);
