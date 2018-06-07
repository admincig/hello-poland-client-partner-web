import React from 'react';
import Button from '@material-ui/core/Button';
import Link from 'next/link';
import Layout from 'components/Layout';

const AboutView = () => (
  <Layout>
    <div style={{ padding: '16px' }}>
      <Link href="/" passHref>
        <Button component="a" variant="raised" color="primary">Home</Button>
      </Link>
    </div>
  </Layout>
);

export default AboutView;
