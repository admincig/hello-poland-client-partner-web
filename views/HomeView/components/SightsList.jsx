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

function serializeFormFields(formFields) {
  return Object.entries(formFields).reduce((acc, [key, value]) => {
    if (key.indexOf('.') !== -1) {
      const keys = key.split('.');
      const keyName = keys.shift();
      const nextPath = keys.join('.');

      return {
        ...acc,
        [keyName]: {
          ...acc[keyName],
          ...serializeFormFields({ [nextPath]: value }),
        },
      };
    }

    return {
      ...acc,
      [key]: value,
    };
  }, {});
}

function serializeFormSchema(schema, values, path = '') {
  return Object.entries(schema).reduce((acc, [sKey, sValue]) => {
    const key = path.length ? `${path}.${sKey}` : sKey;
    const value = (values && values[sKey]) || null;

    if (sValue && typeof sValue === 'object' && !Array.isArray(sValue)) {
      return {
        ...acc,
        ...serializeFormSchema(sValue, value, key),
      };
    }

    return {
      ...acc,
      [key]: value,
    };
  }, {});
}

class SightsList extends Component {
  state = {
    dialog: false,
    dialogProperties: {
      onSubmit: () => {},
      formFields: {},
      title: '',
    },
  };

  componentDidMount() {
    const { fetchSightsList } = this.props;

    fetchSightsList();
  }

  setDefaultDialogProperties = () => this.setState({
    dialogProperties: {
      onSubmit: () => {},
      formFields: {},
      title: '',
    },
  });

  handleFormDialogClose = () => this.setState({ dialog: false });

  handleFormDialogOpen = dialogProperties => this.setState({
    dialog: true,
    dialogProperties,
  });

  handleSightDelete = (sightId) => {
    const { deleteSight } = this.props;

    if (Number.isInteger(sightId)) {
      deleteSight(sightId);
    }
  };

  handleSightEdit = (sight = {}) => {
    const { createSight, updateSight, fetchSight } = this.props;
    const title = Number.isInteger(sight.id) ? 'Edytuj atrakcję' : 'Dodaj atrakcję';

    if (Number.isInteger(sight.id)) {
      fetchSight(sight.id);
    }

    this.handleFormDialogOpen({
      formFields: serializeFormSchema(sightSchema, sight),
      onSubmit: (serializedData) => {
        const data = serializeFormFields(serializedData);
        console.log('sight submit', data);

        if (Number.isInteger(data.id)) {
          updateSight(data.id, { data });
        } else {
          createSight({
            data: {
              ...data,
              id: null, // remove when field id will be hidden
            },
          });
        }

        this.handleFormDialogClose();
      },
      title,
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
      formFields: serializeFormSchema(sightEventSchema, sightEvent),
      onSubmit: (data) => {
        console.log('sightEvent submit', data);
        // debugger;
        this.handleFormDialogClose();
      },
      title,
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
              <Fragment key={`sight-${sightId}`}>
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
                      <ListItem key={`sightEvent-${sightEvent.id}`}>
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
          onExited={this.setDefaultDialogProperties}
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
