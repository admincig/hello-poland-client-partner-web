import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import AddIcon from '@material-ui/icons/Add';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';

import EmptyView from 'components/EmptyView';
import Layout from 'components/Layout';
import withAuth from 'services/auth/withAuth';

const tableColumns = [
  { id: 'id', label: '#' },
  { id: 'name', label: 'Nazwa biletu' },
  { id: 'price', label: 'Cena' },
  { id: 'menu', label: '' },
];

const styles = theme => ({
  root: {
    minHeight: '100%',
  },
  paper: {
    flex: 1,
    overflow: 'hidden',
  },
  toolbar: {
    padding: theme.spacing.unit,
  },
});

function TicketsListView({ classes }) {
  const sortedList = [];
  const isFetching = false;

  return (
    <Layout>
      <Grid container className={classes.root}>
        <Paper className={classes.paper}>
          <Grid container direction="column" className={classes.toolbar}>
            <Grid container item justify="flex-end">
              <Grid item>
                <Button component="a">
                  <AddIcon className={classes.icon} />
                  Dodaj
                </Button>
              </Grid>
            </Grid>
          </Grid>
          {sortedList.length === 0 && (
            <EmptyView
              image={LocalOfferIcon}
              label="Brak biletów"
              loading={isFetching}
              message="Dodaj bilet lub ponów zapytanie aby wyświetlić listę."
              // onRefresh={this.handleFetchItems}
            />
          )}
        </Paper>
      </Grid>
    </Layout>
  );
}

TicketsListView.propTypes = {
  classes: PropTypes.shape({}).isRequired,
};

export default compose(
  withAuth(),
  withStyles(styles),
)(TicketsListView);
