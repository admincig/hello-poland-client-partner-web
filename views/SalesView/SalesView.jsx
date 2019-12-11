import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Layout from 'components/Layout';
import withAuth from 'services/auth/withAuth';
import SalesExport from './components/SalesExport';
import MailingForm from './components/MailingForm';

const styles = {
  content: {
    padding: 16,
  },
  item: {
    marginBottom: 24,
  },
};

const SalesView = ({ classes }) => (
  <Layout>
    <Grid container className={classes.content}>
      <Grid container item md={4} direction="column">
        <Grid item className={classes.item}>
          <Typography variant="h6" gutterBottom>Statystyki sprzedaży</Typography>
          <SalesExport />
        </Grid>
      </Grid>
      <Grid container item md={4} direction="column">
        <Grid item>
          <Typography variant="h6" gutterBottom>Wyślij email z biletami</Typography>
          <MailingForm />
        </Grid>
      </Grid>
      <Grid container item md={4} direction="column" />
    </Grid>
  </Layout>
);

SalesView.propTypes = {
  classes: PropTypes.shape({}).isRequired,
};

export default compose(
  withStyles(styles),
  withAuth(),
)(SalesView);
