import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import AddIcon from '@material-ui/icons/Add';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Link from 'next/link';
import { withRouter } from 'next/router';

import { DEFAULT_LANGUAGE } from 'utils/translations';
import EmptyView from 'components/EmptyView';
import formatPrice from 'utils/formatPrice';
import Layout from 'components/Layout';
import TableHead from 'components/Table/TableHead';
import withAuth from 'services/auth/withAuth';
import {
  actions as ticketDefinitionsActions,
  selectors as ticketDefinitionsSelectors,
} from 'redux/ticketDefinitions';

const tableColumns = [
  { id: 'name', label: 'Nazwa biletu' },
  { id: 'price', label: 'Cena' },
  { id: 'menu', label: '' },
];

const styles = theme => ({
  root: {
    minHeight: '100%',
  },
  actions: {
    minWidth: 150,
  },
  paper: {
    flex: 1,
    overflow: 'hidden',
  },
  toolbar: {
    padding: theme.spacing.unit,
  },
});

class TicketsListView extends React.Component {
  baseURL = '/tickets';

  state = {
    isFetching: false,
    menuAnchor: null,
    menuItemId: null,
    snackbarOpen: false,
    snackbarMessage: '',
  };

  componentDidMount() {
    this.handleFetchItems();
  }

  handleFetchItems = () => {
    const { fetchList } = this.props;

    if (fetchList) {
      fetchList({
        options: {
          headers: {
            'Content-Language': DEFAULT_LANGUAGE,
          },
        },
        onFailure: this.handleFetchItemsFailure,
        onSuccess: this.handleFetchItemsSuccess,
      });

      this.setState({ isFetching: true });
    }
  };

  handleFetchItemsFailure = () => this.setState({ isFetching: false });

  handleFetchItemsSuccess = () => this.setState({ isFetching: false });

  handleItemDelete = (itemId) => {
    const { deleteItem } = this.props;

    if (deleteItem) {
      deleteItem({
        id: itemId,
        onFailure: this.handleItemDeleteFailure,
        onSuccess: () => this.handleFetchItems(),
      });
    }

    this.handleMenuClose();
  };

  handleItemDeleteFailure = () => {
    const { clearError, error } = this.props;

    if (error) {
      const { data: errorData } = error;

      this.handleSnackbarOpen(errorData && errorData.message);

      if (clearError) {
        clearError();
      }
    }
  };

  handleItemEdit = (itemId) => {
    const { router } = this.props;

    const href = `${this.baseURL}/edit?itemId=${itemId}`;
    const pathname = `${this.baseURL}/${itemId}/edit`;

    router.push(href, pathname);

    this.handleMenuClose();
  };

  handleMenuOpen = (event, itemId) => this.setState({
    menuAnchor: event.currentTarget,
    menuItemId: itemId,
  });

  handleMenuClose = () => this.setState({ menuAnchor: null });

  handleMenuExited = () => this.setState({ menuItemId: null });

  handleSnackbarOpen = message => this.setState({
    snackbarOpen: true,
    snackbarMessage: typeof message === 'string' ? message : 'Wystąpił nieznany błąd.',
  });

  handleSnackbarClose = () => this.setState({
    snackbarOpen: false,
    snackbarMessage: '',
  });

  render() {
    const {
      isFetching, menuAnchor, menuItemId, snackbarOpen, snackbarMessage,
    } = this.state;
    const { classes, items: sortedList } = this.props;

    return (
      <Layout>
        <Grid container className={classes.root}>
          <Paper className={classes.paper}>
            <Grid container direction="column" className={classes.toolbar}>
              <Grid container item justify="flex-end">
                <Grid item>
                  <Link href={`${this.baseURL}/create`} passHref>
                    <Button component="a">
                      <AddIcon className={classes.icon} />
                      Dodaj
                    </Button>
                  </Link>
                </Grid>
              </Grid>
            </Grid>
            {sortedList.length === 0 && (
              <EmptyView
                image={LocalOfferIcon}
                label="Brak biletów"
                loading={isFetching}
                message="Dodaj bilet lub ponów zapytanie aby wyświetlić listę."
                onRefresh={this.handleFetchItems}
              />
            )}
            {sortedList.length > 0 && (
              <React.Fragment>
                <Table aria-labelledby="items-list">
                  <TableHead columns={tableColumns} />
                  <TableBody>
                    {
                      sortedList.map(({
                        id: listItemId, name, price,
                      }) => (
                        <TableRow key={listItemId} hover>
                          <TableCell>{name}</TableCell>
                          <TableCell>{formatPrice(price)}</TableCell>
                          <TableCell align="right" className={classes.actions}>
                            <IconButton
                              aria-owns={menuAnchor ? 'item-menu' : undefined}
                              aria-haspopup="true"
                              onClick={event => this.handleMenuOpen(event, listItemId)}
                            >
                              <MoreVertIcon />
                            </IconButton>

                          </TableCell>
                        </TableRow>
                      ))
                    }
                  </TableBody>
                </Table>
                <Menu
                  id="item-menu"
                  anchorEl={menuAnchor}
                  open={Boolean(menuAnchor)}
                  onClose={this.handleMenuClose}
                  onExited={this.handleMenuExited}
                >
                  <MenuItem onClick={() => this.handleItemEdit(menuItemId)}>
                    Edytuj
                  </MenuItem>
                  <MenuItem onClick={() => this.handleItemDelete(menuItemId)}>
                    Usuń
                  </MenuItem>
                </Menu>

              </React.Fragment>
            )}
          </Paper>
          <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            open={snackbarOpen}
            onClose={this.handleSnackbarClose}
            ContentProps={{
              'aria-describedby': 'message-id',
            }}
            message={snackbarMessage}
          />
        </Grid>
      </Layout>
    );
  }
}

TicketsListView.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  clearError: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired,
  error: PropTypes.shape({}),
  fetchList: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  router: PropTypes.shape({}).isRequired,
};

TicketsListView.defaultProps = {
  error: null,
};

const mapStateToProps = state => ({
  error: ticketDefinitionsSelectors.getError(state),
  items: ticketDefinitionsSelectors.getTicketDefinitions(state),
});

const mapDispatchToProps = {
  clearError: ticketDefinitionsActions.clearError,
  deleteItem: ticketDefinitionsActions.deleteItem,
  fetchList: ticketDefinitionsActions.fetchList,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withAuth(),
  withRouter,
  withStyles(styles),
)(TicketsListView);
