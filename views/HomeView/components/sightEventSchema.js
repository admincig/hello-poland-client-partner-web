import TextField from '@material-ui/core/TextField';
import SwitchLabel from 'components/SwitchLabel';
import locationSchema from './locationSchema';

export default [
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
    key: 'published',
    value: true,
    props: {
      label: 'Opublikowano',
    },
  },
  {
    component: SwitchLabel,
    key: 'generalAdmission',
    value: false,
    props: {
      label: 'Wydarzenie ogólne',
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
