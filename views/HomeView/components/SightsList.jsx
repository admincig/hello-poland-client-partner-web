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
  agreements: [],
  description: '',
  email: '',
  id: null,
  lead: '',
  location: {
    city: '',
    street: '',
  },
  mainImage: '',
  minPrice: null,
  name: '',
  openingHours: [],
  phone: '',
  score: null,
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

  handleSightEdit = (sight = {}) => {
    const { fetchSight } = this.props;
    const title = sight.id ? 'Edytuj atrakcję' : 'Dodaj atrakcję';

    if (sight.id) {
      fetchSight(sight.id);
    }

    this.handleFormDialogOpen({
      onSubmit: (data) => {
        console.log('sight submit', data);
        this.handleFormDialogClose();
      },
      schema: sightSchema,
      title,
      values: sight,
    });
  };

  handleSightEventEdit = (sightId, sightEvent = {}) => {
    const { fetchSightEvent } = this.props;
    const title = sightEvent.id ? 'Edytuj wydarzenie' : 'Dodaj wydarzenie';

    if (fetchSightEvent && sightEvent.id) {
      fetchSightEvent(sightEvent.id);
    }

    this.handleFormDialogOpen({
      onSubmit: (data) => {
        console.log('sightEvent submit', data);
        this.handleFormDialogClose();
      },
      schema: sightEventSchema,
      title,
      values: {
        ...sightEvent,
        sightId,
      },
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
                      aria-label="Dodaj wydarzenie"
                      onClick={() => this.handleSightEventEdit(sightId)}
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
                      title="Usuń atrakcję"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <List style={{ marginLeft: 55 }}>
                  {sightEventsList
                    .filter(item => item.sightId === sightId)
                    .map(({ id: sightEventId, name: sightEventName }) => (
                      <ListItem key={sightEventId}>
                        <ListItemIcon>
                          <EventIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={sightEventName}
                        />
                        <ListItemSecondaryAction>
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
                            () => this.handleSightEdit(sightEventId)
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
  fetchSight: PropTypes.func.isRequired,
  fetchSightEvent: PropTypes.func,
  sightEventsList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  sight: PropTypes.shape({}),
  sightsList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
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
    fetchSight: sightsActions.fetchItem,
    fetchSightEvent: sightEventActions.fetchItem,
  }, dispatch);

export default compose(connect(mapStateToProps, mapDispatchToProps))(SightsList);
