import React from 'react';
import Router from 'next/router';

export default class extends React.Component {
  static async getInitialProps() {
    Router.push('/account/password');

    return {};
  }
}
