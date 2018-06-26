import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import CreateIcon from '@material-ui/icons/Create';
import DeleteIcon from '@material-ui/icons/Delete';
import DesktopWindows from '@material-ui/icons/DesktopWindows';
import EventIcon from '@material-ui/icons/Event';
import PlaceIcon from '@material-ui/icons/Place';
import {
  actions as sightsActions,
  selectors as sightsSelectors,
} from 'redux/sights';
import {
  actions as sightEventActions,
  selectors as sightEventSelectors,
} from 'redux/sightEvents';
import FormDialog from 'components/FormDialog';
import { EmptyResultsMessage } from 'components/ViewMessage';

const sightSchema = {
  description: '',
  email: '',
  id: null,
  lead: '',
  location: {
    city: '',
    country: '',
    latitude: null,
    longitude: null,
    street: '',
    zipCode: '',
  },
  name: '',
  phone: '',
};

const sightEventSchema = {
  description: '',
  id: null,
  lead: '',
  name: '',
  sightId: null,
};

class SightsList extends Component {
  static getDerivedStateFromProps(props, state) {
    const { sight } = props;
    const { dialogProperties } = state;
    const { values } = dialogProperties;

    if (sight && values && sight.id === values.id) {
      return {
        ...state,
        dialogProperties: {
          ...dialogProperties,
          values: sight,
        },
      };
    }

    return null;
  }

  state = {
    dialog: false,
    dialogProperties: {
      onSubmit: () => {},
      schema: {},
      title: '',
      values: {},
    },
  };

  componentDidMount() {
    const { fetchSightsList } = this.props;

    fetchSightsList();
  }

  handleFormDialogClose = () => {
    const dialogProperties = {
      onSubmit: () => {},
      schema: {},
      title: '',
      values: {},
    };

    this.setState({
      dialog: false,
      dialogProperties,
    });
  };

  handleFormDialogOpen = (dialogProperties) => {
    this.setState({
      dialog: true,
      dialogProperties,
    });
  };

  handleSightDelete = (sightId) => {
    const { deleteSight } = this.props;

    if (!Number.isNaN(sightId)) {
      deleteSight(sightId);
    }
  };

  handleSightEdit = (sight = {}) => {
    const { createSight, updateSight, fetchSight } = this.props;
    const title = sight.id ? 'Edytuj atrakcję' : 'Dodaj atrakcję';

    if (sight.id) {
      fetchSight(sight.id);
    }

    this.handleFormDialogOpen({
      onSubmit: (data) => {
        console.log('sight submit', data);

        if (data.id) {
          updateSight(data.id, { data });
        } else {
          createSight({
            data: {
              ...data,
              id: null,
            },
          });
        }

        this.handleFormDialogClose();
      },
      schema: sightSchema,
      title,
      values: sight,
    });
  };

  handleSightEventEdit = (sightEvent = {}) => {
    const { fetchSightEvent } = this.props;
    const title = sightEvent.id ? 'Edytuj wydarzenie' : 'Dodaj wydarzenie';

    console.log(sightEvent);
    if (sightEvent.id) {
      fetchSightEvent(sightEvent.id);
    }

    this.handleFormDialogOpen({
      onSubmit: (data) => {
        console.log('sightEvent submit', data);
        // debugger;
        this.handleFormDialogClose();
      },
      schema: sightEventSchema,
      title,
      values: sightEvent,
    });
  };

  render() {
    const { sightEventsList, sightsList } = this.props;
    const { dialog, dialogProperties } = this.state;

    return (
      <Fragment>
        <Button onClick={() => this.handleSightEdit()}>
          Dodaj atrakcję
        </Button>
        {sightsList && sightsList.length ?
          <List>
            {sightsList.map(({ id: sightId, name }) => (
              <Fragment key={sightId * Math.random()}>
                <ListItem key={sightId}>
                  <ListItemIcon>
                    <PlaceIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={name}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      aria-label="Podgląd"
                      title="Podgląd"
                    >
                      <DesktopWindows />
                    </IconButton>
                    <IconButton
                      aria-label="Dodaj wydarzenie"
                      onClick={() => this.handleSightEventEdit({ sightId })}
                      title="Dodaj wydarzenie"
                    >
                      <AddIcon />
                    </IconButton>
                    <IconButton
                      aria-label="Edytuj atrakcję"
                      onClick={
                        () => this.handleSightEdit(sightsList.find(item => item.id === sightId))
                      }
                      title="Edytuj atrakcję"
                    >
                      <CreateIcon />
                    </IconButton>
                    <IconButton
                      aria-label="Usuń atrakcję"
                      onClick={() => this.handleSightDelete(sightId)}
                      title="Usuń atrakcję"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <List style={{ marginLeft: 55 }}>
                  {sightEventsList
                    .filter(item => item.sightId === sightId)
                    .map(sightEvent => (
                      <ListItem key={sightEvent.id}>
                        <ListItemIcon>
                          <EventIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={sightEvent.name}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            aria-label="Podgląd"
                            title="Podgląd"
                          >
                            <DesktopWindows />
                          </IconButton>
                          <IconButton
                            aria-label="Dodaj bilet"
                          // onClick={() => this.handleSightEventEdit(id)}
                            title="Dodaj bilet"
                          >
                            <AddIcon />
                          </IconButton>
                          <IconButton
                            aria-label="Edytuj wydarzenie"
                            onClick={
                            () => this.handleSightEventEdit(sightEvent)
                          }
                            title="Edytuj wydarzenie"
                          >
                            <CreateIcon />
                          </IconButton>
                          <IconButton
                            aria-label="Usuń wydarzenie"
                            title="Usuń wydarzenie"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                  ))}
                </List>
              </Fragment>
            ))}
          </List>
          :
          <EmptyResultsMessage message="Brak elementów do wyświetlenia" />
        }
        <FormDialog
          onClose={this.handleFormDialogClose}
          open={dialog}
          {...dialogProperties}
        />
      </Fragment>
    );
  }
}

SightsList.propTypes = {
  createSight: PropTypes.func.isRequired,
  deleteSight: PropTypes.func.isRequired,
  fetchSight: PropTypes.func.isRequired,
  fetchSightEvent: PropTypes.func,
  fetchSightsList: PropTypes.func.isRequired,
  sightEventsList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  sight: PropTypes.shape({}),
  sightsList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  updateSight: PropTypes.func.isRequired,
};

SightsList.defaultProps = {
  fetchSightEvent: null,
  sight: null,
};

const mapStateToProps = state => ({
  sightEventsList: sightEventSelectors.getSightEvents(state),
  sight: sightsSelectors.getSight(state),
  sightsList: sightsSelectors.getSights(state),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    createSight: sightsActions.createItem,
    deleteSight: sightsActions.deleteItem,
    fetchSight: sightsActions.fetchItem,
    fetchSightEvent: sightEventActions.fetchItem,
    fetchSightsList: sightsActions.fetchList,
    updateSight: sightsActions.updateItem,
  }, dispatch);

export default compose(connect(mapStateToProps, mapDispatchToProps))(SightsList);
