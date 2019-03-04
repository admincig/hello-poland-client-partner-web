import UshersView from 'views/Ushers';
import Router from 'next/router';

UshersView.getInitialProps = ({ query }) => {
  const { usherId } = query;

  if (usherId) {
    Router.push(`/ushers/${usherId}/profile`);
  }

  return {};
};


export default UshersView;
