import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import InputLabel from '@material-ui/core/InputLabel';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import {
  actions as partnerUsersActions,
  selectors as partnerUsersSelectors,
} from 'redux/partnerUsers';
import {
  actions as sightsActions,
  selectors as sightsSelectors,
} from '@hello-poland/commons/redux/sights';

const ROLE_ADMIN = 'PARTNER_ADMIN';
const ROLE_SALESMAN = 'PARTNER_SALESMAN';

const roleLabels = {
  [ROLE_ADMIN]: 'Admin',
  [ROLE_SALESMAN]: 'Salesman',
};

const styles = theme => ({
  root: {
    marginBottom: theme.spacing.unit * 3,
  },
  header: {
    padding: theme.spacing.unit * 2,
  },
  actions: {
    whiteSpace: 'nowrap',
  },
  headerActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    '& > * + *': {
      marginLeft: theme.spacing.unit,
    },
  },
  formControl: {
    marginTop: theme.spacing.unit,
    minWidth: 240,
  },
});

class PartnerUsersManager extends React.Component {
  state = {
    dialogOpen: false,
    passwordDialogOpen: false,
    editingUser: null,
    passwordUser: null,
    form: {
      email: '',
      name: '',
      password: '',
      role: ROLE_ADMIN,
      allowedSightIds: [],
    },
    newPassword: '',
  };

  componentDidMount() {
    const { fetchSights, fetchUsers } = this.props;
    fetchUsers();
    fetchSights();
  }

  getRole = user => (
    user.roles && user.roles.includes(ROLE_SALESMAN) ? ROLE_SALESMAN : ROLE_ADMIN
  );

  getSightLabel = (id) => {
    const { sights } = this.props;
    const sight = sights.find(item => String(item.id) === String(id));
    return sight ? sight.name : id;
  };

  openCreateDialog = () => this.setState({
    dialogOpen: true,
    editingUser: null,
    form: {
      email: '',
      name: '',
      password: '',
      role: ROLE_ADMIN,
      allowedSightIds: [],
    },
  });

  openEditDialog = user => this.setState({
    dialogOpen: true,
    editingUser: user,
    form: {
      email: user.email || '',
      name: user.name || '',
      password: '',
      role: this.getRole(user),
      allowedSightIds: (user.allowedSightIds || []).map(String),
    },
  });

  closeDialog = () => this.setState({ dialogOpen: false, editingUser: null });

  openPasswordDialog = user => this.setState({
    passwordDialogOpen: true,
    passwordUser: user,
    newPassword: '',
  });

  closePasswordDialog = () => this.setState({ passwordDialogOpen: false, passwordUser: null });

  handleChange = field => event => this.setState({
    form: {
      ...this.state.form,
      [field]: event.target.value,
    },
  });

  handleRoleChange = (event) => {
    const role = event.target.value;
    this.setState({
      form: {
        ...this.state.form,
        role,
        allowedSightIds: role === ROLE_ADMIN ? [] : this.state.form.allowedSightIds,
      },
    });
  };

  handleSave = () => {
    const { createUser, updateUser } = this.props;
    const { editingUser, form } = this.state;
    const payload = {
      email: form.email,
      name: form.name,
      roles: [form.role],
      allowedSightIds: form.role === ROLE_SALESMAN
        ? form.allowedSightIds.map(id => Number(id))
        : [],
    };

    if (!editingUser) {
      payload.password = form.password;
      createUser({ data: payload, onSuccess: this.closeDialog });
      return;
    }

    updateUser({ id: editingUser.id, data: payload, onSuccess: this.closeDialog });
  };

  handlePasswordSave = () => {
    const { changePassword } = this.props;
    const { passwordUser, newPassword } = this.state;

    if (passwordUser) {
      changePassword({
        id: passwordUser.id,
        data: { password: newPassword },
        onSuccess: this.closePasswordDialog,
      });
    }
  };

  handleDelete = user => () => {
    const { deleteUser } = this.props;
    deleteUser({ id: user.id });
  };

  render() {
    const {
      classes, error, onAddUsher, sights, users,
    } = this.props;
    const {
      dialogOpen, editingUser, form, newPassword, passwordDialogOpen, passwordUser,
    } = this.state;
    const errorMessage = error && error.data && error.data.message;
    const isSalesman = form.role === ROLE_SALESMAN;

    return (
      <Paper className={classes.root}>
        <Grid container justify="space-between" alignItems="center" className={classes.header}>
          <Grid item>
            <Typography variant="h6">Użytkownicy panelu Partnera</Typography>
          </Grid>
          <Grid item className={classes.headerActions}>
            <Button onClick={this.openCreateDialog}>Dodaj użytkownika panelu</Button>
            <Button onClick={onAddUsher}>Dodaj biletera</Button>
          </Grid>
        </Grid>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>E-mail</TableCell>
              <TableCell>Nazwa</TableCell>
              <TableCell>Poziom</TableCell>
              <TableCell>Obiekty</TableCell>
              <TableCell align="right">Akcje</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.name || '-'}</TableCell>
                <TableCell>{roleLabels[this.getRole(user)]}</TableCell>
                <TableCell>
                  {this.getRole(user) === ROLE_ADMIN
                    ? 'Wszystkie'
                    : (user.allowedSightIds || []).map(this.getSightLabel).join(', ') || '-'}
                </TableCell>
                <TableCell align="right" className={classes.actions}>
                  <Button onClick={() => this.openEditDialog(user)}>Edytuj</Button>
                  <Button onClick={() => this.openPasswordDialog(user)}>Hasło</Button>
                  <Button onClick={this.handleDelete(user)} color="secondary">Usuń</Button>
                </TableCell>
              </TableRow>
            ))}
            {!users.length && (
              <TableRow>
                <TableCell colSpan={5}>Brak użytkowników panelu.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <Dialog open={dialogOpen} onClose={this.closeDialog}>
          <DialogTitle>{editingUser ? 'Edytuj użytkownika panelu' : 'Dodaj użytkownika panelu'}</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              margin="dense"
              label="Email"
              value={form.email}
              onChange={this.handleChange('email')}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Nazwa"
              value={form.name}
              onChange={this.handleChange('name')}
            />
            {!editingUser && (
              <TextField
                fullWidth
                margin="dense"
                type="password"
                label="Hasło"
                value={form.password}
                onChange={this.handleChange('password')}
              />
            )}
            <FormControl fullWidth className={classes.formControl}>
              <InputLabel>Poziom</InputLabel>
              <Select value={form.role} onChange={this.handleRoleChange}>
                <MenuItem value={ROLE_ADMIN}>Admin</MenuItem>
                <MenuItem value={ROLE_SALESMAN}>Salesman</MenuItem>
              </Select>
            </FormControl>
            {isSalesman && (
              <FormControl fullWidth className={classes.formControl}>
                <InputLabel>Obiekty</InputLabel>
                <Select
                  multiple
                  value={form.allowedSightIds}
                  onChange={this.handleChange('allowedSightIds')}
                  renderValue={selected => selected.map(this.getSightLabel).join(', ')}
                >
                  {sights.map(sight => (
                    <MenuItem key={sight.id} value={String(sight.id)}>
                      <Checkbox checked={form.allowedSightIds.includes(String(sight.id))} />
                      <ListItemText primary={sight.name} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {errorMessage && (
              <Typography color="error">{errorMessage}</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closeDialog}>Anuluj</Button>
            <Button onClick={this.handleSave} color="primary">Zapisz</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={passwordDialogOpen} onClose={this.closePasswordDialog}>
          <DialogTitle>Zmiana hasła</DialogTitle>
          <DialogContent>
            <Typography>{passwordUser ? passwordUser.email : ''}</Typography>
            <TextField
              fullWidth
              margin="dense"
              type="password"
              label="Nowe hasło"
              value={newPassword}
              onChange={event => this.setState({ newPassword: event.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.closePasswordDialog}>Anuluj</Button>
            <Button onClick={this.handlePasswordSave} color="primary">Zapisz</Button>
          </DialogActions>
        </Dialog>
      </Paper>
    );
  }
}

PartnerUsersManager.propTypes = {
  changePassword: PropTypes.func.isRequired,
  classes: PropTypes.shape({}).isRequired,
  createUser: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
  error: PropTypes.shape({}),
  fetchSights: PropTypes.func.isRequired,
  fetchUsers: PropTypes.func.isRequired,
  onAddUsher: PropTypes.func.isRequired,
  sights: PropTypes.arrayOf(PropTypes.shape({})),
  updateUser: PropTypes.func.isRequired,
  users: PropTypes.arrayOf(PropTypes.shape({})),
};

PartnerUsersManager.defaultProps = {
  error: null,
  sights: [],
  users: [],
};

const mapStateToProps = state => ({
  error: partnerUsersSelectors.getError(state),
  sights: sightsSelectors.getSights(state),
  users: partnerUsersSelectors.getUsers(state),
});

const mapDispatchToProps = {
  changePassword: partnerUsersActions.changePassword,
  createUser: partnerUsersActions.createItem,
  deleteUser: partnerUsersActions.deleteItem,
  fetchSights: sightsActions.fetchList,
  fetchUsers: partnerUsersActions.fetchList,
  updateUser: partnerUsersActions.updateItem,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles),
)(PartnerUsersManager);
