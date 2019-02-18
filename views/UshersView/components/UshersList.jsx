import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { EmptyResultsMessage } from 'components/ViewMessage';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import {
  actions as ushersActions,
  selectors as ushersSelectors,
} from 'redux/ushers';
import UshersListItem from './UshersListItem';


class UshersList extends Component {
  componentDidMount() {
    const { fetchUshers } = this.props;

    fetchUshers();
  }

  render() {
    const { ushers } = this.props;
    return (
      <Fragment>
        <Typography variant="title">
          Bileterzy
        </Typography>
        <List>
          {
            ushers && ushers.length > 0
              ? ushers.map(({
                  name, picture, email, id,
              }) => (
                <UshersListItem
                  key={`${id}-${email}`}
                  name={name}
                  picture={picture}
                  email={email}
                />
              ))
              : <EmptyResultsMessage message="Brak bileterów do wyświetlenia" />
          }
        </List>
      </Fragment>
    );
  }
}

UshersList.propTypes = {
  fetchUshers: PropTypes.func.isRequired,
  ushers: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

const mapStateToProps = state => ({
  ushers: ushersSelectors.getUshers(state),
});

const mapDispatchToProps = {
  fetchUshers: ushersActions.fetchList,
};

export default connect(mapStateToProps, mapDispatchToProps)(UshersList);
