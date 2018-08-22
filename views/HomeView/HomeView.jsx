import React from 'react';
import withAuth from 'services/auth/withAuth';
import Layout from 'components/Layout';
import SightsList from 'views/HomeView/components/SightsList';
import CalendarEventForm from 'components/CalendarEventForm/CalendarEventForm';

const HomeView = () => (
  <Layout>
    <SightsList />
    <CalendarEventForm />
  </Layout>
);

export default withAuth({ redirectURL: '/login' })((HomeView));
