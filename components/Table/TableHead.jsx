import React from 'react';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

function SortableTableHead({ columns }) {
  return (
    <TableHead>
      <TableRow>
        {columns.map(({
          align, id: columnId, label, ...columnProps
        }) => (
          <TableCell key={columnId} {...columnProps}>
            {label}
          </TableCell>
        ), this)}
      </TableRow>
    </TableHead>
  );
}

SortableTableHead.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })).isRequired,
};

export default SortableTableHead;
