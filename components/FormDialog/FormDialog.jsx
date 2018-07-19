import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Typography from '@material-ui/core/Typography';
import FormGenerator from '../../utils/form-generator';

const FormDialog = ({
  data, onChange, onClose, onSubmit, schema, title, ...rest
}) => (
  <Dialog onClose={onClose} aria-labelledby="form-dialog-title" {...rest}>
    <DialogTitle id="form-dialog-title">{title}</DialogTitle>
    <DialogContent>
      {schema &&
        <FormGenerator
          data={data}
          onChange={onChange}
          renderGroup={({ children, item }) => (
            <FormControl key={item.key} component="fieldset" fullWidth>
              <FormLabel component="legend">
                <Typography variant="title" style={{ marginTop: 40 }}>{item.label}</Typography>
              </FormLabel>
              {children}
            </FormControl>
          )}
          schema={schema}
        />
      }
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">Anuluj</Button>
      <Button onClick={onSubmit} color="primary">Zapisz</Button>
    </DialogActions>
  </Dialog>
);

FormDialog.propTypes = {
  data: PropTypes.shape({}),
  onChange: PropTypes.func.isRequired,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  schema: PropTypes.arrayOf(PropTypes.shape({})),
  title: PropTypes.string,
};

FormDialog.defaultProps = {
  data: {},
  onClose: () => {},
  schema: null,
  title: null,
};

export default FormDialog;
