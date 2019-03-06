import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { EmptyResultsMessage } from 'components/ViewMessage';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import Link from 'next/link';

import UshersListItem from './UshersListItem';

const UshersList = ({ ushers }) => (
  <Fragment>
    {
      ushers && ushers.length > 0
      ? (
        <Paper elevation={1}>
          <List>
            {ushers.map(({
              name, picture, email, id,
            }) => (
              <Link key={`${id}-${email}`} href={`/ushers?usherId=${id}`} as={`/ushers/${id}/profile`} passHref prefetch>
                <UshersListItem
                  name={name}
                  picture={picture}
                  email={email}
                  component="a"
                />
              </Link>
            ))}
          </List>
        </Paper>
      )
      : (
        <EmptyResultsMessage message="Brak bileterów do wyświetlenia" />
      )
    }
  </Fragment>
);

UshersList.propTypes = {
  ushers: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default (UshersList);
