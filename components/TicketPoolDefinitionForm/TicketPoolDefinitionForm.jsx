import React from 'react';
import PropTypes from 'prop-types';
import format from 'date-fns/format';
import CalendarEventForm from 'components/CalendarEventForm';

class TicketPoolDefinitionForm extends React.Component {
  getParsedDate = date => format(date, 'YYYY-MM-DDTHH:mm');

  handleChange = name => (...args) => {
    const { onChange } = this.props;

    onChange(name)(...args);
  };

  render() {
    const { data, onChange, readOnly } = this.props;

    return (
      <CalendarEventForm
        formData={data}
        readOnly={readOnly}
        onChange={onChange}
      />
    );
  }
}

TicketPoolDefinitionForm.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number,
    sightEventId: PropTypes.number,
  }),
  onChange: PropTypes.func.isRequired,
  readOnly: PropTypes.bool,
};

TicketPoolDefinitionForm.defaultProps = {
  data: null,
  readOnly: false,
};

export default TicketPoolDefinitionForm;
