import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';

import Grid from '@material-ui/core/Grid';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import Layout from 'components/Layout';
import withAuth from 'services/auth/withAuth';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { ReactReduxContext } from 'react-redux';
import { actions as bookingsActions } from '@hello-poland/commons/redux/bookings';

import SalesExport from './components/SalesExport';
import MailingForm from './components/MailingForm';

const styles = {
  content: { padding: 16 },
  item: { marginBottom: 24 },
  section: { padding: 16, marginTop: 24 },
  cell: { padding: '6px 10px', fontSize: 12 },
  tableWrapper: {
    maxHeight: 700, // ~15 wierszy
    overflowY: 'auto',
  },
   headerCellStyle: {
          textAlign: 'left',
          padding: '10px 12px',
          whiteSpace: 'nowrap',
          position: 'sticky',
          top: 0,
          background: '#fff',
          zIndex: 2,
          borderBottom: '1px solid #e0e0e0',
        },
};



const STATUS_MAP = {
  CONFIRMED: 'Potwierdzony',
  CANCELLED: 'Anulowany',
  BOOKED: 'Zarezerwowany',
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('pl-PL');
};

const formatDateTime = (dateStr) => {
  if (!dateStr) return '';

  const date = new Date(dateStr);
  const pad = (v) => String(v).padStart(2, '0');

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const SalesView = ({ classes }) => {
  const { store } = React.useContext(ReactReduxContext);
  const { httpClient } = store.logicMiddleware;

  const [sales, setSales] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // 🔥 główna funkcja fetch
  const handleFetch = (fromDate, toDate) => {
    httpClient
      .get(`/analytics/sales?fromDate=${fromDate}&toDate=${toDate}`)
      .then((res) => {
        const data = res.data || [];

        data.sort(
          (a, b) =>
            new Date(b.purchaseDate) - new Date(a.purchaseDate)
        );

        setSales(data);
      });
  };

  // 🔥 AUTOLOAD – ostatnie 7 dni
  useEffect(() => {
    const today = new Date();
    const last7 = new Date();
    last7.setDate(today.getDate() - 7);

    const from = last7.toISOString().substring(0, 10);
    const to = today.toISOString().substring(0, 10);

    setFromDate(from);
    setToDate(to);

    handleFetch(from, to);
  }, []);

  const resend = (orderHash) => {
    store.dispatch(
      bookingsActions.sendTicketsEmail({ orderId: orderHash })
    );
  };

  const canResend = (status) => status === 'CONFIRMED';

  return (
    <Layout>
      <Grid container className={classes.content}>

        {/* ===== LEWA KOLUMNA ===== */}
        <Grid container item md={4} direction="column">
          <Grid item className={classes.item}>
            <Typography variant="h6" gutterBottom>
              Statystyki sprzedaży
            </Typography>

            <SalesExport onFetch={handleFetch} />
          </Grid>
        </Grid>

        {/* ===== ŚRODEK ===== */}
        <Grid container item md={4} direction="column">
          <Grid item>
            <Typography variant="h6" gutterBottom>
              Wyślij email z produktami
            </Typography>
            <MailingForm />
          </Grid>
        </Grid>

        <Grid container item md={4} direction="column" />

        {/* ===== TABELA ===== */}
        <Grid item xs={12}>
          <Paper className={classes.section}>
            <Typography variant="h6" gutterBottom>
              Ostatnia sprzedaż
            </Typography>

            {/* 🔥 FILTRY DAT */}
            <Grid container spacing={2} alignItems="center" style={{ marginBottom: 12 }}>
              <Grid item>
                <TextField
                  label="Od"
                  type="date"
                  size="small"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item>
                <TextField
                  label="Do"
                  type="date"
                  size="small"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item>
                <Typography
                  style={{ color: '#ff1744', cursor: 'pointer', fontWeight: 500 }}
                  onClick={() => handleFetch(fromDate, toDate)}
                >
                  POBIERZ
                </Typography>
              </Grid>
            </Grid>

            <div className={classes.tableWrapper}>
              <Table size="small" stickyHeader>
               <TableHead>
                    <TableRow>
                      <TableCell className={classes.headerCellStyle}>ID</TableCell>
                      <TableCell className={classes.headerCellStyle}>Data zakupu</TableCell>
                      <TableCell className={classes.headerCellStyle}>Data wydarzenia</TableCell>
                      <TableCell className={classes.headerCellStyle}>Wydarzenie</TableCell>
                      <TableCell className={classes.headerCellStyle}>Obiekt</TableCell>
                      <TableCell className={classes.headerCellStyle}>Klient</TableCell>
                      <TableCell className={classes.headerCellStyle}>Email</TableCell>
                      <TableCell className={classes.headerCellStyle}>Status</TableCell>
                      <TableCell className={classes.headerCellStyle}></TableCell>
                    </TableRow>
                  </TableHead>

              <TableBody>
                {sales.map((row) => (
                  <TableRow key={row.bookingId}>
                    <TableCell className={classes.cell}>
                      {row.bookingId}
                    </TableCell>
                    <TableCell className={classes.cell}>
                      {formatDateTime(row.purchaseDate)}
                    </TableCell>
                    <TableCell className={classes.cell}>
                      {formatDateTime(row.eventDate)}
                    </TableCell>
                    <TableCell className={classes.cell}>
                      {row.sightEventName || '-'}
                    </TableCell>
                    <TableCell className={classes.cell}>
                      {row.objectName || '-'}
                    </TableCell>
                    <TableCell className={classes.cell}>
                      {row.customerName}
                    </TableCell>
                    <TableCell className={classes.cell}>
                      {row.customerEmail}
                    </TableCell>
                    <TableCell className={classes.cell}>
                      {STATUS_MAP[row.status] || row.status}
                    </TableCell>
                    <TableCell className={classes.cell}>
                      <Button
                        disabled={!canResend(row.status)}
                        onClick={() => resend(row.hash)}
                      >
                        WYŚLIJ PONOWNIE
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              </Table>
            </div>

          </Paper>
        </Grid>

      </Grid>
    </Layout>
  );
};

SalesView.propTypes = {
  classes: PropTypes.shape({}).isRequired,
};

export default compose(
  withAuth(),
  withStyles(styles),
)(SalesView);
