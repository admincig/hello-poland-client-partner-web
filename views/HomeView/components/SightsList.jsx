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
import PlaceIcon from '@material-ui/icons/Place';
import {
  actions as sightsActions,
  selectors as sightsSelectors,
} from 'redux/sights';
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
    const { list } = this.props;
    const { dialog, dialogProperties } = this.state;

    return (
      <Fragment>
        <Button onClick={() => this.handleSightEdit()}>
          Dodaj atrakcję
        </Button>
        {list && list.length ?
          <List>
            {list.map(({ id, name }) => (
              <ListItem key={id}>
                <ListItemIcon>
                  <PlaceIcon />
                </ListItemIcon>
                <ListItemText
                  primary={name}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    aria-label="Dodaj wydarzenie"
                    onClick={() => this.handleSightEventEdit(id)}
                    title="Dodaj wydarzenie"
                  >
                    <AddIcon />
                  </IconButton>
                  <IconButton
                    aria-label="Edytuj atrakcję"
                    onClick={() => this.handleSightEdit(list.find(item => item.id === id))}
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
  list: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  sight: PropTypes.shape({}),
};

SightsList.defaultProps = {
  fetchSightEvent: null,
  sight: null,
};

const mapStateToProps = state => ({
  list: sightsSelectors.getSights(state),
  sight: sightsSelectors.getSight(state),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    fetchSight: sightsActions.fetchItem,
  }, dispatch);

export default compose(connect(mapStateToProps, mapDispatchToProps))(SightsList);
