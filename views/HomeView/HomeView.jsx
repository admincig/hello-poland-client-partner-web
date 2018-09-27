import React from 'react';
import withAuth from 'services/auth/withAuth';
import Layout from 'components/Layout';
import SightsList from 'views/HomeView/components/SightsList';
import TicketDefinitionForm from 'components/TicketDefinitionForm';

const HomeView = () => (
  <Layout>
    <SightsList />
    <TicketDefinitionForm />
  </Layout>
);

export default withAuth({ redirectURL: '/login' })((HomeView));
