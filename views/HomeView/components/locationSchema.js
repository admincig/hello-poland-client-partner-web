import TextField from '@material-ui/core/TextField';

export default {
  key: 'location',
  type: 'Collection',
  label: 'Lokalizacja',
  schema: [
    {
      component: TextField,
      key: 'street',
      props: {
        fullWidth: true,
        label: 'Ulica',
        margin: 'normal',
      },
    },
    {
      component: TextField,
      key: 'zipCode',
      props: {
        fullWidth: true,
        label: 'Kod pocztowy',
        margin: 'normal',
      },
    },
    {
      component: TextField,
      key: 'city',
      props: {
        fullWidth: true,
        label: 'Miasto',
        margin: 'normal',
      },
    },
    {
      component: TextField,
      key: 'country',
      value: 'Polska',
      props: {
        fullWidth: true,
        label: 'Kraj',
        margin: 'normal',
      },
    },
    // {
    //   component: TextField,
    //   key: 'latitude',
    //   props: {
    //     type: 'hidden',
    //   },
    // },
    // {
    //   component: TextField,
    //   key: 'longitude',
    //   props: {
    //     type: 'hidden',
    //   },
    // },
  ],
};
