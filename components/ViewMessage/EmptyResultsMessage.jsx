import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import IconButton from '@material-ui/core/IconButton';
import BlockIcon from '@material-ui/icons/Block';
import RefreshIcon from '@material-ui/icons/Refresh';
import ViewMessage from './ViewMessage';

const styles = theme => ({
  icon: {
    color: theme.palette.text.secondary,
    height: 56,
    width: 56,
  },
});

const EmptyResultsMessage = ({ classes, message, onRefresh }) => (
  <ViewMessage icon={<BlockIcon className={classes.icon} />} message={message}>
    {onRefresh
      && (
      <IconButton onClick={() => onRefresh()}>
        <RefreshIcon />
      </IconButton>
      )
    }
  </ViewMessage>
);

EmptyResultsMessage.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  message: PropTypes.string,
  onRefresh: PropTypes.func,
};

EmptyResultsMessage.defaultProps = {
  message: '',
  onRefresh: null,
};

export default withStyles(styles)(EmptyResultsMessage);
