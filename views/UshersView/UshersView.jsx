import React from 'react';
import Link from 'next/link';
import Button from '@material-ui/core/Button';
import Layout from 'components/Layout';
import UshersList from './components/UshersList';

const UshersView = () => (
  <Layout>
    <Link href="/" passHref prefetch>
      <Button component="a">
        Strona główna
      </Button>
    </Link>
    <UshersList />
  </Layout>
);


export default UshersView;

