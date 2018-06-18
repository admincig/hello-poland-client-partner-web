// See https://github.com/zeit/next.js#exposing-configuration-to-the-server--client-side
module.exports = {
  // Will only be available on the server side
  server: {
    apiURL: 'https://hpl.fream.pl/api/v1',
  },
  // Will be available on both server and client
  public: {
    name: 'Hello Poland Partner',
    axios: {
      baseURL: 'http://localhost:3000/api',
    },
  },
};
