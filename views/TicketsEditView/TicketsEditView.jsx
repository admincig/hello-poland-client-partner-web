import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withRouter } from 'next/router';

// import { CONTENT_LANGUAGES, DEFAULT_LANGUAGE } from 'utils/translations';
import Layout from 'components/Layout';
import TicketDefinitionForm from 'components/TicketDefinitionForm';
import withAuth from 'services/auth/withAuth';
import {
  // actions as ticketDefinitionsActions,
  selectors as ticketDefinitionsSelectors,
} from 'redux/ticketDefinitions';

const styles = theme => ({
  root: {
    flex: 1,
    padding: theme.spacing.unit * 2,
  },
});

class TicketsEditView extends React.Component {
  baseURL = '/tickets';

  state = {
    // availableTranslations: CONTENT_LANGUAGES,
    // isFetching: false,
    // selectedTranslation: DEFAULT_LANGUAGE,
    // snackbarOpen: false,
    // snackbarMessage: '',
  };

  componentDidMount() {
  }

  render() {
    const { classes, item, itemId } = this.props;

    const pageTitle = itemId ? 'Edycja definicji biletu' : 'Nowa definicja biletu';
    return (
      <Layout>
        <Paper className={classes.root}>
          <Grid container justify="space-between">
            <Grid item>
              <Typography variant="h6">{pageTitle}</Typography>
            </Grid>
          </Grid>
          <TicketDefinitionForm initialValues={item} />
        </Paper>
      </Layout>
    );
  }
}

TicketsEditView.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  // fetchItem: PropTypes.func.isRequired,
  item: PropTypes.shape({}),
  itemId: PropTypes.number,
};

TicketsEditView.defaultProps = {
  item: null,
  itemId: null,
};

const mapStateToProps = state => ({
  item: ticketDefinitionsSelectors.getTicketDefinition(state),
});

const mapDispatchToProps = {
  // fetchItem: ticketDefinitionsActions.fetchItem,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withAuth(),
  withRouter,
  withStyles(styles),
)(TicketsEditView);
