import React from 'react';
import withAuth from 'services/auth/withAuth';
import Layout from 'components/Layout';
import SightsList from 'views/HomeView/components/SightsList';

const HomeView = () => (
  <Layout>
    <SightsList />
  </Layout>
);

export default withAuth({ redirectURL: '/login' })((HomeView));
