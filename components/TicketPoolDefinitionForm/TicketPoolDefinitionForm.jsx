import React from 'react';
import PropTypes from 'prop-types';
import CalendarEventForm from 'components/CalendarEventForm';

const TicketPoolDefinitionForm = (props) => {
  const { data, onChange, readOnly } = props;

  return (
    <CalendarEventForm
      formData={data}
      readOnly={readOnly}
      onChange={onChange}
    />
  );
};

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
