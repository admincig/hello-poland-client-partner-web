import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import Typography from '@material-ui/core/Typography';
import { withRouter } from 'next/router';

import {
  // CONTENT_LANGUAGES,
  DEFAULT_LANGUAGE,
} from 'utils/translations';
import Layout from 'components/Layout';
import TicketDefinitionForm from 'components/TicketDefinitionForm';
import withAuth from 'services/auth/withAuth';
import {
  actions as ticketDefinitionsActions,
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
    isFetching: false,
    selectedTranslation: DEFAULT_LANGUAGE,
    snackbarOpen: false,
    snackbarMessage: '',
  };

  componentDidMount() {
    const {
      itemId, clearError, clearItem, error, item,
    } = this.props;

    if (item) {
      clearItem();
    }

    if (error) {
      clearError();
    }

    if (itemId) {
      this.handleFetchItem(itemId, DEFAULT_LANGUAGE);
    }
  }

  componentDidUpdate() {
    const { item, itemId } = this.props;
    const { isFetching } = this.state;

    if (itemId && !isFetching && (!item || item.id !== itemId)) {
      const { selectedTranslation } = this.state;

      this.handleFetchItem(itemId, selectedTranslation);
    }
  }

  handleFetchItemFailure = () => {
    const { clearError, error } = this.props;

    this.setState({ isFetching: false });

    if (error) {
      const { data: errorData } = error;

      this.handleSnackbarOpen(errorData && errorData.message);

      if (clearError) {
        clearError();
      }
    }
  };

  handleFetchItemSuccess = () => {
    const { item } = this.props;
    const {
      // availableLanguageVersions,
      language,
    } = item || {};

    this.setState({
      // availableTranslations: availableLanguageVersions,
      isFetching: false,
      selectedTranslation: language || DEFAULT_LANGUAGE,
    });
  };

  handleFetchItem = (itemId, language) => {
    const { fetchItem } = this.props;

    fetchItem({
      id: itemId,
      options: {
        headers: {
          'Content-Language': language,
        },
      },
      onFailure: this.handleFetchItemFailure,
      onSuccess: this.handleFetchItemSuccess,
    });

    this.setState({ isFetching: true });
  };

  handleSnackbarOpen = message => this.setState({
    snackbarOpen: true,
    snackbarMessage: typeof message === 'string' ? message : 'Wystąpił nieznany błąd.',
  });

  handleSnackbarClose = () => this.setState({
    snackbarOpen: false,
    snackbarMessage: '',
  });

  handleSubmitSuccess = (submittedItemId, actions) => {
    const { selectedTranslation } = this.state;
    const { itemId } = this.props;
    const { setSubmitting } = actions;

    setSubmitting(false);

    if (itemId) {
      this.handleFetchItem(itemId, selectedTranslation);
    } else {
      const { router } = this.props;

      const path = `${this.baseURL}/edit?itemId=${submittedItemId}`;
      const pathname = `${this.baseURL}/${submittedItemId}/edit`;

      router.push(path, pathname);
    }
  };

  render() {
    const { snackbarOpen, snackbarMessage } = this.state;
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
          <TicketDefinitionForm
            initialValues={item}
            onSubmitSuccess={this.handleSubmitSuccess}
          />
          <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            open={snackbarOpen}
            onClose={this.handleSnackbarClose}
            ContentProps={{
              'aria-describedby': 'message-id',
            }}
            message={snackbarMessage}
          />
        </Paper>
      </Layout>
    );
  }
}

TicketsEditView.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  clearError: PropTypes.func.isRequired,
  clearItem: PropTypes.func.isRequired,
  error: PropTypes.shape({}),
  fetchItem: PropTypes.func.isRequired,
  item: PropTypes.shape({}),
  itemId: PropTypes.number,
  router: PropTypes.shape({}).isRequired,
};

TicketsEditView.defaultProps = {
  error: null,
  item: null,
  itemId: null,
};

const mapStateToProps = state => ({
  error: ticketDefinitionsSelectors.getError(state),
  item: ticketDefinitionsSelectors.getTicketDefinition(state),
});

const mapDispatchToProps = {
  clearError: ticketDefinitionsActions.clearError,
  clearItem: ticketDefinitionsActions.clearItem,
  fetchItem: ticketDefinitionsActions.fetchItem,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withAuth(),
  withRouter,
  withStyles(styles),
)(TicketsEditView);
