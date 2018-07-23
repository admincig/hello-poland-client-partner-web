import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import _isEqual from 'lodash/isEqual';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
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
import populate from '../../../utils/form-generator/data/populate';
import deserialize from '../../../utils/form-generator/data/deserialize';
import serialize from '../../../utils/form-generator/data/serialize';
import SwitchLabel from '../../../components/SwitchLabel';

// const IMG_URL = 'https://i.kinja-img.com/gawker-media/image/upload/t_original/wsgtilb9ibbxysybe3mu.png';

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
    // {
    //   component: TextField,
    //   key: 'latitude',
    //   props: {
    //     type: 'hidden',
    //   },
    // },
    // {
    //   component: TextField,
    //   key: 'longitude',
    //   props: {
    //     type: 'hidden',
    //   },
    // },
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
    component: SwitchLabel,
    key: 'generalAdmission',
    value: true,
    props: {
      label: 'Dodaj wydarzenie ogólne',
    },
  },
  {
    component: TextField,
    key: 'lead',
    props: {
      fullWidth: true,
      label: 'Zajawka',
      margin: 'normal',
      multiline: true,
      rowsMax: 3,
    },
  },
  {
    component: TextField,
    key: 'description',
    props: {
      fullWidth: true,
      label: 'Opis atrakcji',
      margin: 'normal',
      multiline: true,
      rowsMax: 20,
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
    component: SwitchLabel,
    key: 'generalAdmission',
    value: false,
    props: {
      label: 'Dodaj jako wydarzenie ogólne',
    },
  },
  {
    component: TextField,
    key: 'lead',
    props: {
      fullWidth: true,
      label: 'Zajawka',
      margin: 'normal',
      multiline: true,
      rowsMax: 3,
    },
  },
  {
    component: TextField,
    key: 'description',
    props: {
      fullWidth: true,
      label: 'Opis wydarzenia',
      margin: 'normal',
      multiline: true,
      rowsMax: 20,
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

const styles = theme => ({
  generalAdmission: {
    color: theme.palette.primary.light,
  },
});

class SightsList extends Component {
  state = {
    dialog: false,
    formConfig: null,
    formData: null,
    schema: null,
    title: null,
  };

  componentDidMount() {
    const { fetchSightsList, fetchSightEventsList } = this.props;

    fetchSightsList();
    fetchSightEventsList();
  }

  componentDidUpdate(prevProps) {
    const { sight: prevSight, sightEvent: prevSightEvent } = prevProps;
    const { sight, sightEvent } = this.props;
    const { dialog } = this.state;

    if (dialog) {
      if (!_isEqual(prevSight, sight)) {
        this.updateFormData(sightSchema, sight);
      } else if (!_isEqual(prevSightEvent, sightEvent)) {
        this.updateFormData(sightEventSchema, sightEvent);
      }
    }
  }

  setDefaultDialogProperties = () => this.setState({
    formData: null,
    formConfig: null,
    schema: null,
    title: null,
  });

  handleFormDialogClose = () => this.setState({ dialog: false });

  handleFormDialogOpen = ({
    data, formConfig, schema, title,
  }) => {
    const serializedData = serialize(schema);
    const formData = populate(serializedData, data);

    this.setState({
      dialog: true,
      formConfig,
      formData,
      schema,
      title,
    });
  };

  handleSightDelete = (sightId) => {
    const { deleteSight } = this.props;

    if (Number.isInteger(sightId)) {
      deleteSight(sightId);
    }
  };

  handleSightEdit = (data = {}) => {
    const { createSight, updateSight, fetchSight } = this.props;
    const isPersisted = Number.isInteger(data.id);
    const title = isPersisted ? 'Edytuj atrakcję' : 'Dodaj atrakcję';
    const formConfig = {
      action: createSight,
    };

    if (isPersisted) {
      formConfig.action = updateSight;

      fetchSight(data.id);
    }

    this.handleFormDialogOpen({
      data,
      formConfig,
      schema: sightSchema,
      title,
    });
  };

  handleSightEventDelete = (sightEventId) => {
    const { deleteSightEvent } = this.props;

    if (Number.isInteger(sightEventId)) {
      deleteSightEvent(sightEventId);
    }
  };

  handleSightEventEdit = (data = {}) => {
    const { createSightEvent, updateSightEvent, fetchSightEvent } = this.props;
    const isPersisted = Number.isInteger(data.id);
    const title = isPersisted ? 'Edytuj wydarzenie' : 'Dodaj wydarzenie';
    const formConfig = {
      action: createSightEvent,
    };

    if (isPersisted) {
      formConfig.action = updateSightEvent;

      fetchSightEvent(data.id);
    }

    this.handleFormDialogOpen({
      data,
      formConfig,
      schema: sightEventSchema,
      title,
    });
  };

  handleFormChange = name => (event, value) => {
    const { formData } = this.state;

    this.setState({
      formData: {
        ...formData,
        [name]: value !== undefined ? value : event.target.value,
      },
    });
  };

  handleFormSubmit = () => {
    const { formConfig, formData } = this.state;
    const { action } = formConfig || {};
    const data = deserialize(formData);

    if (action) {
      if (Number.isInteger(data.id)) {
        action(data.id, { data });
      } else {
        action({ data });
      }

      this.handleFormDialogClose();
    }
  };

  updateFormData = (schema, data) => {
    const serializedData = serialize(schema);
    const formData = populate(serializedData, data);

    this.setState({ formData });
  };

  render() {
    const { classes, sightEventsList, sightsList } = this.props;
    const {
      dialog, formData, schema, title,
    } = this.state;

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
                        <ListItemIcon
                          className={sightEvent.generalAdmission ? classes.generalAdmission : ''}
                        >
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
          data={formData}
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
  classes: PropTypes.shape({}).isRequired,
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

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),
)(SightsList);
