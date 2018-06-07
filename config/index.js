import getConfig from 'next/config';

const config = getConfig();

export default {
  server: config.serverRuntimeConfig,
  public: config.publicRuntimeConfig,
};
