import React from 'react';
import withAuth from 'services/auth/withAuth';
import Layout from 'components/Layout';
import SightsList from 'views/HomeView/components/SightsList';
// import SightForm from 'components/SightForm';

const HomeView = () => (
  <Layout>
    <SightsList />
    {/*<SightForm />*/}
  </Layout>
);

export default withAuth()(HomeView);
