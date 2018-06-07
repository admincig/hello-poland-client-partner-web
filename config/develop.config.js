// See https://github.com/zeit/next.js#exposing-configuration-to-the-server--client-side
module.exports = {
  // Will only be available on the server side
  server: {},
  // Will be available on both server and client
  public: {
    name: 'Default application name',
    axios: {
      baseURL: '/',
    },
  },
};
