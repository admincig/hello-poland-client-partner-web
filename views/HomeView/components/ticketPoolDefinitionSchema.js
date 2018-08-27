import TextField from '@material-ui/core/TextField';


export default [
  {
    component: TextField,
    key: 'sightEventId',
    props: {
      type: 'hidden',
    },
  },
  {
    component: TextField,
    key: 'isCyclic',
    value: false,
    props: {
      type: 'hidden',
    },
  },
];
