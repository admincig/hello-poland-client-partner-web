import axios from 'axios';
import config from 'config';

const instance = axios.create({
  ...config.public.axios,
});

export default instance;
