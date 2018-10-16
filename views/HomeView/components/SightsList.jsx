import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import _isEqual from 'lodash/isEqual';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Typography from '@material-ui/core/Typography';
import ImportContacts from '@material-ui/icons/ImportContacts';
import EventIcon from '@material-ui/icons/Event';
import PlaceIcon from '@material-ui/icons/Place';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import {
  actions as sightsActions,
  selectors as sightsSelectors,
} from '@hello-poland/commons/redux/sights';
import {
  actions as sightEventActions,
  selectors as sightEventSelectors,
} from '@hello-poland/commons/redux/sightEvents';
import { actions as ticketPoolDefinitionActions } from '@hello-poland/commons/redux/ticketPoolDefinitions';
import FormDialog from 'components/FormDialog';
import TicketPoolDefinitionForm from 'components/TicketPoolDefinitionForm';
import { EmptyResultsMessage } from 'components/ViewMessage';
import FormGenerator from 'utils/form-generator';
import populate from 'utils/form-generator/data/populate';
import deserialize from 'utils/form-generator/data/deserialize';
import serialize from 'utils/form-generator/data/serialize';
import formatPrice from 'utils/formatPrice';
import sightSchema from './sightSchema';
import sightEventSchema from './sightEventSchema';
import ticketPoolDefinitionSchema from './ticketPoolDefinitionSchema';
import HomeListItem from './HomeListItem';

// const IMG_URL = 'https://i.kinja-img.com/gawker-media/image/upload/t_original/wsgtilb9ibbxysybe3mu.png';

class SightsList extends Component {
  state = {
    dialog: false,
    formConfig: null,
    formData: null,
    formType: null,
    schema: null,
    submitError: false,
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

  getFormattedDate = (date) => {
    if (date == null) {
      return null;
    }

    const d = new Date(date);

    return `${d.toLocaleDateString()} ${d.toLocaleTimeString().substr(0, 5)}`;
  };

  getFormComponent = (props, type) => {
    switch (type) {
      case 'TicketPoolDefinitionForm':
        return (
          <TicketPoolDefinitionForm
            {...props}
            onChange={this.handleSimpleFormChange}
          />
        );
      case 'FormGenerator': {
        const { schema } = props;

        return schema && schema.length ? (
          <FormGenerator
            {...props}
            onChange={this.handleFormChange}
            renderGroup={({ children, item }) => (
              <FormControl key={item.key} component="fieldset" fullWidth>
                <FormLabel component="legend">
                  <Typography variant="title" style={{ marginTop: 40 }}>{item.label}</Typography>
                </FormLabel>
                {children}
              </FormControl>
            )}
          />
        ) : null;
      }
      default:
        return null;
    }
  };

  setDefaultDialogProperties = () => this.setState({
    formData: null,
    formConfig: null,
    formType: null,
    schema: null,
    title: null,
  });

  handleFormDialogClose = () => this.setState({ dialog: false, submitError: false });

  handleFormDialogOpen = ({
    data, formConfig, formType, schema, title,
  }) => {
    const serializedData = serialize(schema);
    const formData = populate(serializedData, data);

    this.setState({
      dialog: true,
      formConfig,
      formData,
      formType,
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

      fetchSight({ id: data.id });
    }

    this.handleFormDialogOpen({
      data,
      formConfig,
      formType: 'FormGenerator',
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
    const formType = 'FormGenerator';
    const formConfig = {
      action: createSightEvent,
    };

    if (isPersisted) {
      formConfig.action = updateSightEvent;

      fetchSightEvent({ id: data.id });
    }

    this.handleFormDialogOpen({
      data,
      formConfig,
      formType,
      schema: sightEventSchema,
      title,
    });
  };

  handleTicketPoolDelete = (ticketPoolDefinitionId) => {
    const { deleteTicketPoolDefinition } = this.props;

    if (Number.isInteger(ticketPoolDefinitionId)) {
      deleteTicketPoolDefinition(ticketPoolDefinitionId);
    }
  };

  handleTicketPoolEdit = (data = {}) => {
    const {
      createTicketPoolDefinition, updateTicketPoolDefinition, fetchTicketPoolDefinition,
    } = this.props;
    const isPersisted = Number.isInteger(data.id);
    const title = isPersisted ? 'Edytuj pulę biletów' : 'Dodaj pulę biletów';
    const formType = 'TicketPoolDefinitionForm';
    const formConfig = {
      action: createTicketPoolDefinition,
    };

    if (isPersisted) {
      formConfig.action = updateTicketPoolDefinition;

      fetchTicketPoolDefinition(data.id);
    }

    this.handleFormDialogOpen({
      data,
      formConfig,
      formType,
      schema: ticketPoolDefinitionSchema,
      title,
    });
  };

  handleFormChange = name => (event, value) => {
    const { formData } = this.state;

    let inputValue = value !== undefined ? value : event.target.value;

    if (event.target.type === 'number') {
      inputValue = +inputValue;
    }

    this.setState({
      formData: {
        ...formData,
        [name]: inputValue,
      },
    });
  };

  handleSimpleFormChange = formData => this.setState({ formData });

  handleFormSubmitSuccess = () => {
    const { fetchSightsList, fetchSightEventsList } = this.props;

    fetchSightsList();
    fetchSightEventsList();

    this.handleFormDialogClose();
  };

  handleFormSubmitError = () => this.setState({ submitError: true });

  clearFormSubmitError = () => this.setState({ submitError: false });

  handleFormSubmit = () => {
    const { formConfig, formData, formType } = this.state;
    const { action } = formConfig || {};
    let data;

    this.clearFormSubmitError();

    if (formType === 'FormGenerator') {
      data = deserialize(formData);
    } else {
      data = formData;
    }

    if (action) {
      if (Number.isInteger(data.id)) {
        action({
          id: data.id,
          data,
          onFailure: this.handleFormSubmitError,
          onSuccess: this.handleFormSubmitSuccess,
        });
      } else {
        action({
          data,
          onFailure: this.handleFormSubmitError,
          onSuccess: this.handleFormSubmitSuccess,
        });
      }
    }
  };

  updateFormData = (schema, data) => {
    const serializedData = serialize(schema);
    const formData = populate(serializedData, data);

    this.setState({ formData });
  };

  render() {
    const { sightEventsList, sightsList } = this.props;
    const {
      dialog, formData, formType, schema, submitError, title,
    } = this.state;

    return (
      <Fragment>
        <Button onClick={() => this.handleSightEdit()}>
          Dodaj atrakcję
        </Button>
        {sightsList && sightsList.length ?
          <List>
            {sightsList.map(({ id: sightId, name }) => (
              <Fragment key={`sight-${sightId}-${name}`}>
                <HomeListItem
                  icon={PlaceIcon}
                  key={`${sightId}-${name}`}
                  primary={name}
                  onAddClick={() => this.handleSightEventEdit({ sightId })}
                  onAddLabel="Dodaj wydarzenie"
                  onDeleteClick={() => this.handleSightDelete(sightId)}
                  onDeleteLabel="Usuń atrakcję"
                  onEditClick={() => {
                    this.handleSightEdit(sightsList.find(sight => sight.id === sightId));
                  }}
                  onEditLabel="Edytuj atrakcję"
                />
                <List style={{ marginLeft: 55 }}>
                  {sightEventsList && sightEventsList
                    .filter(item => item.sightId === sightId)
                    .map(sightEvent => (
                      <Fragment key={`sightEvent-${sightEvent.id}-${sightEvent.name}`}>
                        <HomeListItem
                          icon={ImportContacts}
                          key={`${sightEvent.id}-${sightEvent.name}`}
                          primary={sightEvent.name}
                          onAddClick={() => {
                            this.handleTicketPoolEdit({ sightEventId: sightEvent.id });
                          }}
                          onAddLabel="Dodaj pulę biletów"
                          onDeleteClick={() => this.handleSightEventDelete(sightEvent.id)}
                          onDeleteLabel="Usuń wydarzenie"
                          onEditClick={() => this.handleSightEventEdit(sightEvent)}
                          onEditLabel="Edytuj wydarzenie"
                        />
                        <List style={{ marginLeft: 55 }}>
                          {sightEvent.ticketPoolDefinitions && sightEvent.ticketPoolDefinitions
                            .filter(({ deleted }) => !deleted).map(ticketPoolDefinition => (
                              <Fragment
                                key={`ticketPoolDefinition-${ticketPoolDefinition.id}-${ticketPoolDefinition.name}`}
                              >
                                <HomeListItem
                                  icon={EventIcon}
                                  key={`${ticketPoolDefinition.id}-${ticketPoolDefinition.name}`}
                                  primary={ticketPoolDefinition.name}
                                  secondary={
                                    `Liczba biletów: ${ticketPoolDefinition.availableTicketsNumber}`
                                  }
                                  onDeleteClick={
                                    () => this.handleTicketPoolDelete(ticketPoolDefinition.id)
                                  }
                                  onAddLabel="Usuń pulę biletów"
                                />
                                <List style={{ marginLeft: 55 }}>
                                  {ticketPoolDefinition.ticketDefinitions &&
                                    ticketPoolDefinition.ticketDefinitions.map(ticketDefinition => (
                                      <HomeListItem
                                        icon={LocalOfferIcon}
                                        key={`ticketDefinition-${ticketDefinition.id}-${ticketDefinition.name}`}
                                        primary={ticketDefinition.name}
                                        secondary={
                                          `Cena: ${formatPrice(ticketDefinition.price)}`
                                        }
                                      />
                                    ))
                                  }
                                </List>
                              </Fragment>
                            ))
                          }
                        </List>
                      </Fragment>
                    ))
                  }
                </List>
              </Fragment>
            ))}
          </List>
          :
          <EmptyResultsMessage message="Brak elementów do wyświetlenia" />
        }
        <FormDialog
          disableBackdropClick
          onClose={this.handleFormDialogClose}
          onExited={this.setDefaultDialogProperties}
          onSubmit={this.handleFormSubmit}
          open={dialog}
          error={submitError}
          title={title}
        >
          {this.getFormComponent({
            data: formData,
            schema,
          }, formType)}
        </FormDialog>

      </Fragment>
    );
  }
}

SightsList.propTypes = {
  createSight: PropTypes.func.isRequired,
  createSightEvent: PropTypes.func.isRequired,
  createTicketPoolDefinition: PropTypes.func.isRequired,
  deleteSight: PropTypes.func.isRequired,
  deleteSightEvent: PropTypes.func.isRequired,
  deleteTicketPoolDefinition: PropTypes.func.isRequired,
  fetchSight: PropTypes.func.isRequired,
  fetchSightEvent: PropTypes.func.isRequired,
  fetchTicketPoolDefinition: PropTypes.func.isRequired,
  fetchSightsList: PropTypes.func.isRequired,
  fetchSightEventsList: PropTypes.func.isRequired,
  sight: PropTypes.shape({}),
  sightEvent: PropTypes.shape({}),
  sightsList: PropTypes.arrayOf(PropTypes.shape({})),
  sightEventsList: PropTypes.arrayOf(PropTypes.shape({})),
  updateSight: PropTypes.func.isRequired,
  updateSightEvent: PropTypes.func.isRequired,
  updateTicketPoolDefinition: PropTypes.func.isRequired,
};

SightsList.defaultProps = {
  sight: null,
  sightEvent: null,
  sightEventsList: null,
  sightsList: null,
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
    createTicketPoolDefinition: ticketPoolDefinitionActions.createItem,
    deleteSight: sightsActions.deleteItem,
    deleteSightEvent: sightEventActions.deleteItem,
    deleteTicketPoolDefinition: ticketPoolDefinitionActions.deleteItem,
    fetchSight: sightsActions.fetchItem,
    fetchSightEvent: sightEventActions.fetchItem,
    fetchTicketPoolDefinition: ticketPoolDefinitionActions.fetchItem,
    fetchSightsList: sightsActions.fetchList,
    fetchSightEventsList: sightEventActions.fetchList,
    updateSight: sightsActions.updateItem,
    updateSightEvent: sightEventActions.updateItem,
    updateTicketPoolDefinition: ticketPoolDefinitionActions.updateItem,
  }, dispatch);

export default compose(connect(mapStateToProps, mapDispatchToProps))(SightsList);
