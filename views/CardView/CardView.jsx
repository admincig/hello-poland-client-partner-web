import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import _sortedUniq from 'lodash/sortedUniq';
import Link from 'next/link';

import Layout from 'components/Layout';
import ContentTranslation from 'components/ContentTranslation';
import {
  actions as partnersActions,
  selectors as partnersSelectors,
} from 'redux/partners';
import withAuth from 'services/auth/withAuth';
import { CONTENT_LANGUAGES, DEFAULT_LANGUAGE } from 'utils/translations';
import PartnerMarketForm from './components/PartnerMarketForm';
import PartnerMultimediaForm from './components/PartnerMultimediaForm';

const styles = theme => ({
  wrapper: {
    padding: theme.spacing.unit * 2,
  },
});

const tabs = [
  { id: 'card', label: 'Wizytówka' },
  { id: 'multimedia', label: 'Multimedia' },
];

class CardView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      availableTranslations: CONTENT_LANGUAGES,
      selectedTab: tabs[0].id,
      selectedTranslation: DEFAULT_LANGUAGE,
      snackbarOpen: false,
      snackbarMessage: '',
    };
  }

  componentDidMount() {
    const { selectedTranslation } = this.state;

    this.handleFetchItem(selectedTranslation);
  }

  getMultimediaFromItem = (item) => {
    const { mainImage } = item;
    const data = [];

    if (mainImage) {
      data.push({
        createdBy: '',
        createdDate: '',
        id: 1,
        modifiedBy: '',
        modifiedDate: '',
        name: 'mainImage',
        path: '/home/hpl/var/DMS/omg/1234.jpg',
        size: 12345,
        type: 'image/jpeg',
        downloadUrl: mainImage,
      });
    }

    return data;
  };

  setSelectedTab = selectedTab => this.setState({ selectedTab });

  handleFetchItemFailure = () => this.handleRequestFailure();

  handleFetchItemSuccess = () => {
    const { item } = this.props;
    const { availableLanguageVersions, language } = item || {};

    this.setState({
      availableTranslations: availableLanguageVersions || [],
      selectedTranslation: language || DEFAULT_LANGUAGE,
    });
  };

  handleFetchItem = (language) => {
    const { fetchItem } = this.props;

    fetchItem({
      options: {
        headers: {
          'Content-Language': language,
        },
      },
      onFailure: this.handleFetchItemFailure,
      onSuccess: this.handleFetchItemSuccess,
    });
  };

  handleRequestFailure = () => {
    const { clearError, error } = this.props;

    this.handleSnackbarOpen(error && error.message);

    if (clearError) {
      clearError();
    }
  };

  handleTranslationChange = (event) => {
    const selectedTranslation = event.target.value;

    this.setState({ selectedTranslation });

    this.handleFetchItem(selectedTranslation);
  };

  handleTranslationCreate = (language) => {
    this.setState(state => ({
      availableTranslations: _sortedUniq([
        ...state.availableTranslations,
        language,
      ]),
      selectedTranslation: language,
    }));
  };

  handleTranslationDefaultChangeFailure = () => this.handleRequestFailure();

  handleTranslationDefaultChangeSuccess = () => {
    const { selectedTranslation } = this.state;

    this.handleFetchItem(selectedTranslation);
  };

  handleTranslationDefaultChange = () => {
    const { selectedTranslation } = this.state;
    const { changeDefaultTranslation } = this.props;
    const options = {
      headers: {
        'Content-Language': selectedTranslation,
      },
    };

    changeDefaultTranslation({
      options,
      onFailure: this.handleTranslationDefaultChangeFailure,
      onSuccess: this.handleTranslationDefaultChangeSuccess,
    });
  };

  handleTranslationDeleteFailure = () => this.handleRequestFailure();

  handleTranslationDeleteSuccess = () => {
    const { item } = this.props;
    const { defaultLanguage } = item || {};

    this.handleFetchItem(defaultLanguage);
  };

  handleTranslationDelete = () => {
    const { selectedTranslation } = this.state;
    const { deleteTranslation } = this.props;

    deleteTranslation({
      onFailure: this.handleTranslationDeleteFailure,
      onSuccess: this.handleTranslationDeleteSuccess,
      pathParams: {
        languageVersion: selectedTranslation,
      },
    });
  };

  handleSnackbarOpen = message => this.setState({
    snackbarOpen: true,
    snackbarMessage: typeof message === 'string' ? message : 'Wystąpił nieznany błąd.',
  });

  handleSnackbarClose = () => this.setState({
    snackbarOpen: false,
    snackbarMessage: '',
  });

  handleSubmitSuccess = (entityId, actions) => {
    const { selectedTranslation } = this.state;
    const { resetForm, setSubmitting } = actions;

    this.handleFetchItem(selectedTranslation);

    setSubmitting(false);
    resetForm();
  };

  render() {
    const {
      availableTranslations, selectedTab, selectedTranslation, snackbarMessage, snackbarOpen,
    } = this.state;
    const { classes, item } = this.props;

    const { defaultLanguage } = item || {};
    const hasLanguageActions = !!(item && item.id);

    return (
      <Layout>
        <Link href="/" passHref prefetch>
          <Button component="a">Strona główna</Button>
        </Link>
        <Typography variant="h6" gutterBottom>Dane partnera</Typography>
        <Paper className={classes.wrapper}>
          <Grid container justify="flex-end">
            <Grid item>
              <ContentTranslation
                actions={hasLanguageActions}
                TranslationPickerProps={{
                  defaultValue: defaultLanguage || DEFAULT_LANGUAGE,
                  items: availableTranslations || CONTENT_LANGUAGES,
                  onChange: this.handleTranslationChange,
                  value: selectedTranslation || DEFAULT_LANGUAGE,
                }}
                TranslationActionsProps={{
                  availableTranslations,
                  defaultTranslation: defaultLanguage,
                  selectedTranslation,
                  onCreateTranslation: this.handleTranslationCreate,
                  onDeleteTranslation: this.handleTranslationDelete,
                  onSetDefaultTranslation: this.handleTranslationDefaultChange,
                }}
              />
            </Grid>
          </Grid>
          <Tabs
            onChange={(event, tabValue) => this.setSelectedTab(tabValue)}
            indicatorColor="primary"
            textColor="primary"
            value={selectedTab}
          >
            {tabs.map(({ id, ...tabProps }) => <Tab key={id} value={id} {...tabProps} />)}
          </Tabs>
          {tabs[0].id === selectedTab && (
            <PartnerMarketForm
              initialValues={item}
              language={selectedTranslation}
              onSubmitSuccess={this.handleSubmitSuccess}
            />
          )}
          {tabs[1].id === selectedTab && (
            <PartnerMultimediaForm
              data={this.getMultimediaFromItem(item)}
              defaultTranslation={defaultLanguage}
              onFailure={() => this.handleRequestFailure()}
              onSuccess={() => this.handleFetchItem(selectedTranslation)}
              translation={selectedTranslation}
            />
          )}
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

CardView.propTypes = {
  changeDefaultTranslation: PropTypes.func.isRequired,
  classes: PropTypes.shape({}).isRequired,
  clearError: PropTypes.func.isRequired,
  deleteTranslation: PropTypes.func.isRequired,
  error: PropTypes.shape({}),
  fetchItem: PropTypes.func.isRequired,
  item: PropTypes.shape({}),
};

CardView.defaultProps = {
  error: null,
  item: {},
};

const mapStateToProps = state => ({
  error: partnersSelectors.getError(state),
  item: partnersSelectors.getItem(state),
});

const mapDispatchToProps = {
  changeDefaultTranslation: partnersActions.changeDefaultTranslation,
  clearError: partnersActions.clearError,
  clearItem: partnersActions.clearItem,
  deleteTranslation: partnersActions.deleteTranslation,
  fetchItem: partnersActions.fetchItem,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withAuth(),
  withStyles(styles),
)(CardView);
