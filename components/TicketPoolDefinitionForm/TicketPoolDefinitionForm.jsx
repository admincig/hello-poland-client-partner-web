import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import format from 'date-fns/format';
import SwitchLabel from '../SwitchLabel';

const styles = () => ({
  dates: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
  },
});

class TicketPoolDefinitionForm extends React.Component {
  getParsedDate = date => format(date, 'YYYY-MM-DDTHH:mm');

  handleChange = name => (...args) => {
    const { onChange } = this.props;

    onChange(name)(...args);
  };

  render() {
    const { classes, data } = this.props;
    const {
      availableTicketsNumber,
      isCyclic,
      endDate,
      entryEndDate,
      entryStartDate,
      frequencyData,
      id,
      name,
      sightEventId,
      startDate,
    } = data;

    const { frequency } = frequencyData || {};

    return (
      <Grid container>
        <TextField
          type="hidden"
          key="id"
          name="id"
          onChange={this.handleChange('id')}
          value={id == null ? '' : id}
        />
        <TextField
          type="hidden"
          key="sightEventId"
          name="sightEventId"
          onChange={this.handleChange('sightEventId')}
          value={sightEventId == null ? '' : sightEventId}
        />
        <TextField
          fullWidth
          key="name"
          label="Nazwa"
          margin="normal"
          name="name"
          onChange={this.handleChange('name')}
          value={name == null ? '' : name}
        />
        <div className={classes.dates}>
          <TextField
            key="startDate"
            label="Od"
            margin="normal"
            name="startDate"
            onChange={this.handleChange('startDate')}
            type="datetime-local"
            value={startDate == null
              ? this.getParsedDate(new Date())
              : this.getParsedDate(startDate)
            }
          />
          <TextField
            key="endDate"
            label="Do"
            margin="normal"
            name="endDate"
            onChange={this.handleChange('endDate')}
            type="datetime-local"
            value={endDate == null
              ? this.getParsedDate(new Date())
              : this.getParsedDate(endDate)
            }
          />
        </div>
        <div className={classes.dates}>
          <TextField
            key="entryStartDate"
            label="Wejście od"
            margin="normal"
            name="entryStartDate"
            onChange={this.handleChange('entryStartDate')}
            type="datetime-local"
            value={entryStartDate == null
              ? this.getParsedDate(new Date())
              : this.getParsedDate(entryStartDate)
            }
          />
          <TextField
            key="entryEndDate"
            label="Wejście do"
            margin="normal"
            name="entryEndDate"
            onChange={this.handleChange('entryEndDate')}
            type="datetime-local"
            value={entryEndDate == null
              ? this.getParsedDate(new Date())
              : this.getParsedDate(entryEndDate)
            }
          />
        </div>
        <TextField
          fullWidth
          key="availableTicketsNumber"
          label="Liczba dostępnych biletów"
          margin="normal"
          name="availableTicketsNumber"
          onChange={this.handleChange('availableTicketsNumber')}
          type="number"
          value={availableTicketsNumber == null ? '' : availableTicketsNumber}
        />
        <SwitchLabel
          key="isCyclic"
          label="Pula cykliczna"
          name="isCyclic"
          onChange={this.handleChange('isCyclic')}
          value={isCyclic}
        />
        {isCyclic ?
          <React.Fragment>
            <TextField
              fullWidth
              key="frequencyData.frequency"
              label="Liczba dostępnych biletów"
              name="frequencyData.frequency"
              onChange={this.handleChange('frequencyData.frequency')}
              type="number"
              value={frequency == null ? '' : frequency}
            />
          </React.Fragment>
          :
          null
        }
      </Grid>
    );
  }
}

TicketPoolDefinitionForm.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  data: PropTypes.shape({
    availableTicketsNumber: PropTypes.number,
    isCyclic: PropTypes.bool,
    endDate: PropTypes.string,
    entryEndDate: PropTypes.string,
    entryStartDate: PropTypes.string,
    frequencyData: PropTypes.shape({
      frequency: PropTypes.number,
      frequencyType: PropTypes.string,
    }),
    id: PropTypes.number,
    name: PropTypes.string,
    sightEventId: PropTypes.number,
    startDate: PropTypes.string,
  }),
  onChange: PropTypes.func.isRequired,
};

TicketPoolDefinitionForm.defaultProps = {
  data: null,
};

export default withStyles(styles)(TicketPoolDefinitionForm);
