import TextField from '@material-ui/core/TextField';
import format from 'date-fns/format';
import SwitchLabel from '../../../components/SwitchLabel';

const currentDate = format(new Date(), 'YYYY-MM-DDTHH:mm');

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
    key: 'sightEventId',
    props: {
      type: 'hidden',
    },
  },
  {
    component: TextField,
    key: 'name',
    props: {
      fullWidth: true,
      label: 'Nazwa puli',
      margin: 'normal',
    },
  },
  {
    component: TextField,
    key: 'availableTicketsNumber',
    props: {
      fullWidth: true,
      label: 'Liczba biletów w puli',
      margin: 'normal',
    },
  },
  {
    component: TextField,
    key: 'startDate',
    value: currentDate,
    props: {
      label: 'Rozpoczęcie',
      margin: 'normal',
      type: 'datetime-local',
      InputLabelProps: {
        shrink: true,
      },
    },
  },
  {
    component: TextField,
    key: 'endDate',
    value: currentDate,
    props: {
      label: 'Zakończenie',
      margin: 'normal',
      type: 'datetime-local',
      InputLabelProps: {
        shrink: true,
      },
    },
  },
  {
    component: TextField,
    key: 'entryStartDate',
    value: currentDate,
    props: {
      label: 'Rozpoczęcie skanowania biletów',
      margin: 'normal',
      type: 'datetime-local',
      InputLabelProps: {
        shrink: true,
      },
    },
  },
  {
    component: TextField,
    key: 'entryEndDate',
    value: currentDate,
    props: {
      label: 'Zakończenie skanowania biletów',
      margin: 'normal',
      type: 'datetime-local',
      InputLabelProps: {
        shrink: true,
      },
    },
  },
  {
    component: SwitchLabel,
    key: 'isCyclic',
    value: false,
    props: {
      label: 'Pula cykliczna',
    },
  },
  {
    key: 'frequencyData',
    type: 'Collection',
    label: 'Powtarzalność puli',
    schema: [
      {
        component: TextField,
        key: 'frequencyType',
        props: {
          fullWidth: true,
          label: 'Rodzaj',
          margin: 'normal',
        },
      },
      {
        component: TextField,
        key: 'frequency',
        props: {
          fullWidth: true,
          label: 'Częstotliwość',
          margin: 'normal',
        },
      },
    ],
  },
];
