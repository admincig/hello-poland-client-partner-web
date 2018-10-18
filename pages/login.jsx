import React from 'react';
import LoginView from 'views/LoginView';

const Login = props => (
  <LoginView {...props} />
);

Login.getInitialProps = ({ query }) => {
  const { returnUrl } = query;

  return {
    returnUrl,
  };
};

export default Login;
