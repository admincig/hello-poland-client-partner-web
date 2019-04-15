import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Link from 'next/link';
import formatDate from 'date-fns/format';
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
import AlertDialog from 'components/AlertDialog';
import FormDialog from 'components/FormDialog';
import SightFormDialog from 'components/SightForm/Dialog';
import SightEventFormDialog from 'components/SightEventForm/Dialog';
import StatsDialog from 'components/StatsDialog';
import StopSellDialog from 'components/StopSellForm';
import MediaManager from 'components/MediaManager';
import TicketPoolDefinitionForm from 'components/TicketPoolDefinitionForm';
import { EmptyResultsMessage } from 'components/ViewMessage';
import FormGenerator from 'utils/form-generator';
import populate from 'utils/form-generator/data/populate';
import deserialize from 'utils/form-generator/data/deserialize';
import serialize from 'utils/form-generator/data/serialize';
import formatPrice from 'utils/formatPrice';
import createSlug from 'utils/createSlug';
import config from 'config';
import ticketPoolDefinitionSchema from './ticketPoolDefinitionSchema';
import HomeListItem from './HomeListItem';

const PARENT_TYPES = {
  SIGHT: 'SIGHT',
  OFFER: 'OFFER',
};

const FILE_TYPES = {
  DOCUMENT: 'DOCUMENT',
  IMAGE: 'IMAGE',
  MAIN_IMAGE: 'MAIN_IMAGE',
};

class SightsList extends Component {
  state = {
    alertDialog: {
      content: null,
      onSuccess: null,
      open: false,
      title: null,
    },
    dialog: false,
    formConfig: null,
    formData: null,
    formType: null,
    mediaManager: false,
    readOnly: false,
    mediaManagerData: {},
    mediaManagerSubmitting: false,
    schema: null,
    sightForm: false,
    sightEventForm: false,
    stats: {
      open: false,
    },
    stopSellForm: false,
    submitError: false,
    title: '',
  };

  componentDidMount() {
    const { fetchSightsList, fetchSightEventsList } = this.props;

    fetchSightsList();
    fetchSightEventsList();
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
                  <Typography variant="h6" style={{ marginTop: 40 }}>{item.label}</Typography>
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
    title: '',
  });

  handleAlertDialogClear = () => this.setState({
    alertDialog: {
      content: null,
      onSuccess: null,
      open: false,
      title: null,
    },
  });

  handleAlertDialogCancel = () => {
    this.setState(state => ({
      alertDialog: {
        ...state.alertDialog,
        open: false,
      },
    }));
  };

  handleAlertDialogOpen = alertDialog => this.setState({ alertDialog });

  handleFormDialogClose = () => this.setState({ dialog: false, submitError: false });

  handleFormDialogOpen = ({
    data, formConfig, formType, schema, title,
  }) => {
    const serializedData = serialize(schema);
    const formData = populate(serializedData, data);

    this.setState({
      dialog: true,
      formConfig,
      readOnly: false,
      formData,
      formType,
      schema,
      title,
    });
  };

  handleMediaManagerClose = () => this.setState({
    mediaManager: false,
    mediaManagerData: {},
    mediaManagerSubmitting: false,
    submitError: false,
  });

  handleMediaManagerOpen = ({ parentId, parentType, fileType }) => this.setState({
    mediaManager: true,
    mediaManagerData: {
      fileType,
      parentId,
      parentType,
    },
  });

  handleMediaManagerSubmit = ({ data, options }) => {
    const { createMainSightImage, createMainSightEventImage, createPDF } = this.props;
    const { mediaManagerData } = this.state;
    const { fileType, parentId, parentType } = mediaManagerData;
    let action = null;

    if (fileType === FILE_TYPES.MAIN_IMAGE) {
      if (parentType === PARENT_TYPES.SIGHT) {
        action = createMainSightImage;
      } else {
        action = createMainSightEventImage;
      }
    } else if (fileType === FILE_TYPES.IMAGE) {
      if (parentType === PARENT_TYPES.SIGHT) {
        action = null;
      } else {
        action = null;
      }
    } else if (fileType === FILE_TYPES.DOCUMENT) {
      action = createPDF;
    }
    const requestOptions = {
      ...options,
      timeout: 20000,
    };

    action({
      id: parentId,
      data,
      options: requestOptions,
      onFailure: this.handleMediaManagerSubmitFailure,
      onSuccess: this.handleMediaManagerSubmitSuccess,
    });

    this.setState({ mediaManagerSubmitting: true, submitError: false });
  };

  handleMediaManagerSubmitFailure = () => this.setState({
    mediaManagerSubmitting: false,
    submitError: true,
  });

  handleMediaManagerSubmitSuccess = () => this.handleMediaManagerClose();

  handleSightDelete = (sightId) => {
    const { deleteSight } = this.props;

    if (Number.isInteger(sightId)) {
      deleteSight({ id: sightId, onSuccess: this.handleFormSubmitSuccess });
    }
  };

  handleSightFormClose = () => this.setState({
    sightForm: false,
    formData: null,
    title: '',
  });

  handleSightFormOpen = ({ sightId, title }) => this.setState({
    sightForm: true,
    formData: {
      itemId: sightId,
    },
    title,
  });

  handleSightEventFormClose = () => this.setState({
    sightEventForm: false,
    formData: null,
    title: '',
  });

  handleSightEventFormOpen = ({ sightEventId, sightId, title }) => this.setState({
    sightEventForm: true,
    formData: {
      parentId: sightId,
      itemId: sightEventId,
    },
    title,
  });

  handleSightEventDelete = (sightEventId) => {
    const { deleteSightEvent } = this.props;

    if (Number.isInteger(sightEventId)) {
      deleteSightEvent({ id: sightEventId, onSuccess: this.handleFormSubmitSuccess });
    }
  };

  handleStopSellClick = (sightEventId, poolDefinitionId, poolDefinitionName, startDate) => {
    this.setState({
      stopSellForm: true,
      formData: {
        sightEventId, poolDefinitionId, poolDefinitionName, startDate,
      },
      title: 'Zatrzymaj sprzedaż biletów',
    });
  };

  handleStopSellClose = () => {
    this.setState({ stopSellForm: false, formData: null });
  };

  handleTicketPoolDelete = (ticketPoolDefinitionId) => {
    const { deleteTicketPoolDefinition } = this.props;

    if (Number.isInteger(ticketPoolDefinitionId)) {
      deleteTicketPoolDefinition({
        id: ticketPoolDefinitionId,
        onSuccess: this.handleFormSubmitSuccess,
      });
    }
  };

  handleTicketPoolEdit = (data = {}) => {
    const {
      createTicketPoolDefinition, updateTicketPoolDefinition, fetchTicketPoolDefinition,
    } = this.props;
    const isPersisted = Number.isInteger(data.id);
    let title = isPersisted ? 'Edytuj pulę biletów' : 'Dodaj pulę biletów';
    const formType = 'TicketPoolDefinitionForm';
    const formConfig = {
      action: createTicketPoolDefinition,
    };

    if (isPersisted) {
      formConfig.action = updateTicketPoolDefinition;

      fetchTicketPoolDefinition(data.id);
    }

    title += ' - ustaw dostępność biletów dla oferty';

    this.handleFormDialogOpen({
      data,
      formConfig,
      formType,
      schema: ticketPoolDefinitionSchema,
      title,
    });
  };

  handleTicketPoolPreview = (formData) => {
    this.setState({
      formData,
      readOnly: true,
      dialog: true,
      formType: 'TicketPoolDefinitionForm',
      schema: ticketPoolDefinitionSchema,
      title: 'Podgląd puli',
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

  handleStatsDialogClose = () => this.setState(state => ({
    stats: {
      ...state.stats,
      open: false,
    },
  }));

  handleStatsDialogOpen = () => this.setState(state => ({
    stats: {
      ...state.stats,
      open: true,
    },
  }));

  updateFormData = (schema, data) => {
    const serializedData = serialize(schema);
    const formData = populate(serializedData, data);

    this.setState({ formData });
  };

  render() {
    const { sightEventsList, sightsList } = this.props;
    const {
      alertDialog, dialog, formData, formType, mediaManager, mediaManagerSubmitting, schema,
      sightForm, sightEventForm, stats, stopSellForm, submitError, title, readOnly,
    } = this.state;

    return (
      <Fragment>
        <Button onClick={() => this.handleSightFormOpen({ title: 'Dodaj atrakcję' })}>
          Dodaj atrakcję
        </Button>
        <Link href="/ushers" passHref prefetch>
          <Button component="a">
            Bileterzy
          </Button>
        </Link>
        <Button onClick={this.handleStatsDialogOpen}>
          Statystyki
        </Button>
        {sightsList && sightsList.length
          ? (
            <List>
              {sightsList.map(sight => (
                <Fragment key={`sight-${sight.id}-${sight.name}`}>
                  <HomeListItem
                    blocked={sight.blocked}
                    icon={PlaceIcon}
                    key={`${sight.id}-${sight.name}`}
                    primary={sight.name}
                    onAddClick={() => this.handleSightEventFormOpen({
                      sightId: sight.id,
                      title: 'Dodaj ofertę',
                    })}
                    onAddLabel="Dodaj ofertę"
                    onDeleteClick={() => this.handleAlertDialogOpen({
                      content: '',
                      onSuccess: () => {
                        this.handleSightDelete(sight.id);
                        this.handleAlertDialogCancel();
                      },
                      open: true,
                      title: 'Czy na pewno usunąć wybraną atrakcję?',
                    })}
                    onDeleteLabel="Usuń atrakcję"
                    onEditClick={() => {
                      this.handleSightFormOpen({ sightId: sight.id, title: 'Edytuj atrakcję' });
                    }}
                    onEditLabel="Edytuj atrakcję"
                    onMainImageClick={() => {
                      this.handleMediaManagerOpen({
                        parentId: sight.id,
                        parentType: PARENT_TYPES.SIGHT,
                        fileType: FILE_TYPES.MAIN_IMAGE,
                      });
                    }}
                    onMainImageLabel="Dodaj główny obrazek"
                    published={sight.published}
                  />
                  <List style={{ marginLeft: 55 }}>
                    {sightEventsList && sightEventsList
                      .filter(item => item.sightId === sight.id)
                      .map(sightEvent => (
                        <Fragment key={`sightEvent-${sightEvent.id}-${sightEvent.name}`}>
                          <HomeListItem
                            blocked={sightEvent.blocked}
                            icon={ImportContacts}
                            key={`${sightEvent.id}-${sightEvent.name}`}
                            primary={sightEvent.name}
                            onAddClick={() => {
                              this.handleTicketPoolEdit({ sightEventId: sightEvent.id });
                            }}
                            onAddLabel="Dodaj pulę biletów"
                            onDeleteClick={() => this.handleAlertDialogOpen({
                              content: '',
                              onSuccess: () => {
                                this.handleSightEventDelete(sightEvent.id);
                                this.handleAlertDialogCancel();
                              },
                              open: true,
                              title: 'Czy na pewno usunąć wybraną ofertę?',
                            })}
                            onDeleteLabel="Usuń ofertę"
                            onEditClick={() => this.handleSightEventFormOpen({
                              sightId: sight.id,
                              sightEventId: sightEvent.id,
                              title: 'Edytuj ofertę',
                            })}
                            onEditLabel="Edytuj ofertę"
                            onMainImageClick={() => {
                              this.handleMediaManagerOpen({
                                parentId: sightEvent.id,
                                parentType: PARENT_TYPES.OFFER,
                                fileType: FILE_TYPES.MAIN_IMAGE,
                              });
                            }}
                            onMainImageLabel="Dodaj główny obrazek"
                            onDocumentClick={() => {
                              this.handleMediaManagerOpen({
                                parentId: sightEvent.id,
                                parentType: PARENT_TYPES.OFFER,
                                fileType: FILE_TYPES.DOCUMENT,
                              });
                            }}
                            onDocumentLabel="Dodaj broszurę PDF"
                            published={sightEvent.published}
                            affiliation={sightEvent.partnerAffiliateCode
                              ? {
                                code: sightEvent.partnerAffiliateCode,
                                slug: createSlug(sightEvent.name, sightEvent.id),
                              }
                              : null
                            }
                            onStatsClick={() => {
                              const URI = config.public.availableTicketsURL;

                              return URI
                                .replace(':id', sightEvent.id)
                                .replace(':date', formatDate(new Date(), 'YYYY-MM-dd'));
                            }}
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
                                    `Limit biletów w puli: ${ticketPoolDefinition.availableTicketsNumber === -1
                                      ? 'Brak' : `${ticketPoolDefinition.availableTicketsNumber} szt`
                                    }`
                                  }
                                    onPreviewClick={
                                    () => this.handleTicketPoolPreview(ticketPoolDefinition)
                                  }
                                    onStopSellClick={
                                    () => this.handleStopSellClick(
                                      sightEvent.id,
                                      ticketPoolDefinition.id,
                                      ticketPoolDefinition.name,
                                      ticketPoolDefinition.startDate,
                                    )
                                  }
                                    onStopSellLabel="Wstrzymaj sprzedaż"
                                    onPreviewLabel="Podgląd puli"
                                    onDeleteClick={() => this.handleAlertDialogOpen({
                                      content: '',
                                      onSuccess: () => {
                                        this.handleTicketPoolDelete(ticketPoolDefinition.id);
                                        this.handleAlertDialogCancel();
                                      },
                                      open: true,
                                      title: 'Czy na pewno usunąć wybraną pulę?',
                                    })}
                                    onAddLabel="Usuń pulę biletów"
                                  />
                                  <List style={{ marginLeft: 55 }}>
                                    {ticketPoolDefinition.ticketDefinitions
                                    && ticketPoolDefinition.ticketDefinitions
                                      .map(ticketDefinition => (
                                        <HomeListItem
                                          icon={LocalOfferIcon}
                                          key={`ticketDefinition-${ticketDefinition.id}-${ticketDefinition.name}`}
                                          primary={ticketDefinition.name}
                                          secondary={(() => {
                                            const { availableTicketsNumber } = ticketDefinition;
                                            const availableTickets = !availableTicketsNumber
                                              || availableTicketsNumber === -1
                                              ? 'Brak'
                                              : `${availableTicketsNumber} szt`;
                                            const price = formatPrice(ticketDefinition.price);

                                            return (
                                              `Limit biletów: ${availableTickets} | Cena: ${price}`
                                            );
                                          })()}
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
          )
          : <EmptyResultsMessage message="Brak elementów do wyświetlenia" />
        }
        <AlertDialog
          onCancel={this.handleAlertDialogCancel}
          onExited={this.handleAlertDialogClear}
          {...alertDialog}
        />
        <FormDialog
          disableBackdropClick
          onCancel={this.handleFormDialogClose}
          onExited={this.setDefaultDialogProperties}
          onSubmit={this.handleFormSubmit}
          open={dialog}
          error={submitError}
          readOnly={readOnly}
          title={title}
        >
          {this.getFormComponent({
            data: formData,
            schema,
            readOnly,
          }, formType)}
        </FormDialog>
        <SightFormDialog
          disableBackdropClick
          onClose={this.handleSightFormClose}
          open={sightForm}
          title={title}
          {...formData}
        />
        <SightEventFormDialog
          disableBackdropClick
          onClose={this.handleSightEventFormClose}
          open={sightEventForm}
          title={title}
          {...formData}
        />
        <StopSellDialog
          disableBackdropClick
          onClose={this.handleStopSellClose}
          open={stopSellForm}
          title={title}
          {...formData}
        />
        <MediaManager
          disableBackdropClick
          error={submitError}
          onClose={this.handleMediaManagerClose}
          onSubmit={this.handleMediaManagerSubmit}
          open={mediaManager}
          submitting={mediaManagerSubmitting}
          title="Dodaj multimedia"
        />
        <StatsDialog
          onClose={this.handleStatsDialogClose}
          {...stats}
        />
      </Fragment>
    );
  }
}

SightsList.propTypes = {
  createMainSightImage: PropTypes.func.isRequired,
  createMainSightEventImage: PropTypes.func.isRequired,
  createPDF: PropTypes.func.isRequired,
  createTicketPoolDefinition: PropTypes.func.isRequired,
  deleteSight: PropTypes.func.isRequired,
  deleteSightEvent: PropTypes.func.isRequired,
  deleteTicketPoolDefinition: PropTypes.func.isRequired,
  fetchSightEvent: PropTypes.func.isRequired,
  fetchTicketPoolDefinition: PropTypes.func.isRequired,
  fetchSightsList: PropTypes.func.isRequired,
  fetchSightEventsList: PropTypes.func.isRequired,
  sight: PropTypes.shape({}),
  sightEvent: PropTypes.shape({}),
  sightsList: PropTypes.arrayOf(PropTypes.shape({})),
  sightEventsList: PropTypes.arrayOf(PropTypes.shape({})),
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

const mapDispatchToProps = {
  createMainSightImage: sightsActions.createMainImage,
  createMainSightEventImage: sightEventActions.createMainImage,
  createPDF: sightEventActions.createPDF,
  createTicketPoolDefinition: ticketPoolDefinitionActions.createItem,
  deleteSight: sightsActions.deleteItem,
  deleteSightEvent: sightEventActions.deleteItem,
  deleteTicketPoolDefinition: ticketPoolDefinitionActions.deleteItem,
  fetchSightEvent: sightEventActions.fetchItem,
  fetchTicketPoolDefinition: ticketPoolDefinitionActions.fetchItem,
  fetchSightsList: sightsActions.fetchList,
  fetchSightEventsList: sightEventActions.fetchList,
  updateSightEvent: sightEventActions.updateItem,
  updateTicketPoolDefinition: ticketPoolDefinitionActions.updateItem,
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(SightsList);
