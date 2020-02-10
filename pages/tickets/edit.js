import TicketsEditView from 'views/TicketsEditView';

TicketsEditView.getInitialProps = ({ query }) => {
  const { itemId } = query;

  return { itemId: +itemId || null };
};

export default TicketsEditView;
