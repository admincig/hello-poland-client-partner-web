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
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
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
import serialize from '../../../utils/form-generator/data/serialize';

const IMG_URL = 'https://i.kinja-img.com/gawker-media/image/upload/t_original/wsgtilb9ibbxysybe3mu.png';

const locationSchema = {
  key: 'location',
  type: 'Collection',
  label: 'Lokalizacja',
  schema: [
    {
      component: TextField,
      key: 'street',
      props: {
        fullWidth: true,
        label: 'Ulica',
        margin: 'normal',
      },
    },
    {
      component: TextField,
      key: 'zipCode',
      props: {
        fullWidth: true,
        label: 'Kod pocztowy',
        margin: 'normal',
      },
    },
    {
      component: TextField,
      key: 'city',
      props: {
        fullWidth: true,
        label: 'Miasto',
        margin: 'normal',
      },
    },
    {
      component: TextField,
      key: 'country',
      value: 'Polska',
      props: {
        fullWidth: true,
        label: 'Kraj',
        margin: 'normal',
      },
    },
    {
      component: TextField,
      key: 'latitude',
      props: {
        type: 'hidden',
      },
    },
    {
      component: TextField,
      key: 'longitude',
      props: {
        type: 'hidden',
      },
    },
  ],
};

const sightSchema = [
  {
    component: TextField,
    key: 'id',
    props: {
      type: 'hidden',
    },
  },
  {
    component: TextField,
    key: 'name',
    props: {
      fullWidth: true,
      label: 'Nazwa atrakcji',
      margin: 'normal',
    },
  },
  {
    component: props => (
      <FormControlLabel
        control={<Switch value="generalAdmission" />}
        {...props}
      />
    ),
    key: 'generalAdmission',
    props: {
      checked: true,
      label: 'Dodaj wydarzenie ogólne',
      margin: 'normal',
    },
  },
  {
    component: TextField,
    key: 'lead',
    props: {
      fullWidth: true,
      label: 'Zajawka',
      margin: 'normal',
    },
  },
  {
    component: TextField,
    key: 'description',
    props: {
      fullWidth: true,
      label: 'Opis atrakcji',
      multiline: true,
      rows: 4,
      margin: 'normal',
    },
  },
  {
    component: TextField,
    key: 'email',
    props: {
      fullWidth: true,
      label: 'Adres e-mail',
      margin: 'normal',
    },
  },
  {
    component: TextField,
    key: 'phone',
    props: {
      fullWidth: true,
      label: 'Numer telefonu',
      margin: 'normal',
    },
  },
  {
    ...locationSchema,
  },
];

const sightEventSchema = [
  {
    component: TextField,
    key: 'id',
    props: {
      type: 'hidden',
    },
  },
  {
    component: TextField,
    key: 'sightId',
    props: {
      type: 'hidden',
    },
  },
  {
    component: TextField,
    key: 'name',
    props: {
      fullWidth: true,
      label: 'Nazwa wydarzenia',
      margin: 'normal',
    },
  },
  {
    component: props => (
      <FormControlLabel
        control={<Switch value="generalAdmission" />}
        {...props}
      />
    ),
    key: 'generalAdmission',
    props: {
      checked: true,
      label: 'Dodaj wydarzenie ogólne',
      margin: 'normal',
    },
  },
  {
    component: TextField,
    key: 'lead',
    props: {
      fullWidth: true,
      label: 'Zajawka',
      margin: 'normal',
    },
  },
  {
    component: TextField,
    key: 'description',
    props: {
      fullWidth: true,
      label: 'Opis wydarzenia',
      multiline: true,
      rows: 4,
      margin: 'normal',
    },
  },
  {
    component: TextField,
    key: 'email',
    props: {
      fullWidth: true,
      label: 'Adres e-mail',
      margin: 'normal',
    },
  },
  {
    component: TextField,
    key: 'phone',
    props: {
      fullWidth: true,
      label: 'Numer telefonu',
      margin: 'normal',
    },
  },
  {
    ...locationSchema,
  },
];

class SightsList extends Component {
  state = {
    dialog: false,
    formData: null,
    schema: null,
    title: null,
  };

  setDefaultDialogProperties = () => this.setState({
    formData: null,
    schema: null,
    title: null,
  });

  handleFormDialogClose = () => this.setState({ dialog: false });

  handleFormDialogOpen = ({ ...props }) => this.setState({
    dialog: true,
    ...props,
  });

  handleSightDelete = (sightId) => {

  };

  handleSightEdit = (sight = {}) => {
    // const { createSight, updateSight, fetchSight } = this.props;
    const title = Number.isInteger(sight.id) ? 'Edytuj atrakcję' : 'Dodaj atrakcję';
    const serializedData = serialize(sightSchema);

    this.handleFormDialogOpen({
      formData: serializedData,
      schema: sightSchema,
      title,
    });
  };

  handleSightEventDelete = (sightEventId) => {

  };

  handleSightEventEdit = (sightEvent = {}) => {

  };

  handleFormChange = name => (event, value) => {
    const { formData } = this.state;

    console.log(name, event.target.value, value);
    this.setState({
      formData: {
        ...formData,
        [name]: value !== undefined ? value : event.target.value,
      },
    });
  };

  handleFormSubmit = () => console.log('submiting...');

  render() {
    const { sightEventsList, sightsList } = this.props;
    const { dialog, schema, title } = this.state;

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
                            // onClick={() => {
                            //   this.handleSightEventEdit({ sightEventId: sightEvent.id });
                            // }}
                            title="Dodaj bilet"
                          >
                            <AddIcon />
                          </IconButton>
                          <IconButton
                            aria-label="Edytuj wydarzenie"
                            onClick={() => this.handleSightEventEdit(sightEvent)}
                            title="Edytuj wydarzenie"
                          >
                            <CreateIcon />
                          </IconButton>
                          <IconButton
                            aria-label="Usuń wydarzenie"
                            onClick={() => this.handleSightEventDelete(sightEvent.id)}
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
          disableBackdropClick
          onChange={this.handleFormChange}
          onClose={this.handleFormDialogClose}
          onExited={this.setDefaultDialogProperties}
          onSubmit={this.handleFormSubmit}
          open={dialog}
          schema={schema}
          title={title}
        />

      </Fragment>
    );
  }
}

SightsList.propTypes = {
  createSight: PropTypes.func.isRequired,
  createSightEvent: PropTypes.func.isRequired,
  deleteSight: PropTypes.func.isRequired,
  deleteSightEvent: PropTypes.func.isRequired,
  fetchSight: PropTypes.func.isRequired,
  fetchSightEvent: PropTypes.func.isRequired,
  fetchSightsList: PropTypes.func.isRequired,
  fetchSightEventsList: PropTypes.func.isRequired,
  sight: PropTypes.shape({}),
  sightEvent: PropTypes.shape({}),
  sightsList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  sightEventsList: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  updateSight: PropTypes.func.isRequired,
  updateSightEvent: PropTypes.func.isRequired,
};

SightsList.defaultProps = {
  sight: null,
  sightEvent: null,
};

const mapStateToProps = state => ({
  sight: sightsSelectors.getSight(state),
  sightEvent: sightEventSelectors.getSightEvent(state),
  sightsList: sightsSelectors.getSights(state),
  sightEventsList: sightEventSelectors.getSightEvents(state),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    createSight: sightsActions.createItem,
    createSightEvent: sightEventActions.createItem,
    deleteSight: sightsActions.deleteItem,
    deleteSightEvent: sightEventActions.deleteItem,
    fetchSight: sightsActions.fetchItem,
    fetchSightEvent: sightEventActions.fetchItem,
    fetchSightsList: sightsActions.fetchList,
    fetchSightEventsList: sightEventActions.fetchList,
    updateSight: sightsActions.updateItem,
    updateSightEvent: sightEventActions.updateItem,
  }, dispatch);

export default compose(connect(mapStateToProps, mapDispatchToProps))(SightsList);
