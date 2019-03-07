import UshersView from 'views/Ushers';
import Router from 'next/router';

UshersView.getInitialProps = ({ res, query }) => {
  const { usherId } = query;

  if (usherId) {
    const href = `/ushers/profile?usherId=${usherId}`;
    const as = `/ushers/${usherId}/profile`;

    if (res) {
      res.writeHead(301, { Location: as });
      res.end();
    } else {
      Router.push(href, as);
    }
  }

  return {};
};


export default UshersView;
