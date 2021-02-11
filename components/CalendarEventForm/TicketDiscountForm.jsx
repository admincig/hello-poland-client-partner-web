import React from 'react';
import PropTypes from 'prop-types';
import _isEqual from 'lodash/isEqual';
import _isNumber from 'lodash/isNumber';
import { Formik, Form, Field } from 'formik';
import { CheckboxWithLabel, Select, TextField } from 'formik-material-ui';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import formatPrice from 'utils/formatPrice';
import yupNumber from 'yup/lib/number';
import yupObject from 'yup/lib/object';
import yupString from 'yup/lib/string';
import config from 'config';

const DISCOUNT_TYPES = {
  FLAT: 'FLAT',
  PERCENT: 'PERCENT',
};

const DISCOUNT_TYPES_NAMES = {
  [DISCOUNT_TYPES.FLAT]: 'Kwotowy',
  [DISCOUNT_TYPES.PERCENT]: 'Procentowy',
};

const formattedDiscountType = {
  [DISCOUNT_TYPES.FLAT]: 'zł',
  [DISCOUNT_TYPES.PERCENT]: '%',
};

class TicketDiscountForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      initialValues: this.getInitialValues(props.ticketDefinition),
      resetDialog: false,
    };

    this.validationSchema = yupObject().shape({
      type: yupString().required(),
      value: yupNumber().min(0).required(),
    });
  }

  componentDidUpdate(prevProps) {
    const { ticketDefinition: prevTicketDefinition } = prevProps;
    const { ticketDefinition } = this.props;

    if (!_isEqual(prevTicketDefinition, ticketDefinition)) {
      this.setInitialValues(ticketDefinition);
    }
  }

  getInitialValues = (initialValues) => {
    const { discount = {} } = initialValues || {};
    let value = _isNumber(discount.value) ? discount.value : '';

    if (discount.type === DISCOUNT_TYPES.FLAT) {
      value = this.convertBaseCurrencyToCurrency(value);
    }

    return {
      amount: _isNumber(discount.amount) ? discount.amount : '',
      hplPart: _isNumber(discount.hplPart)
        ? this.convertBaseCurrencyToCurrency(discount.hplPart)
        : '',
      isCustomCommission: discount.isCustomCommission || false,
      partnerPart: _isNumber(discount.partnerPart)
        ? this.convertBaseCurrencyToCurrency(discount.partnerPart)
        : '',
      price: _isNumber(discount.price) ? discount.price : '',
      type: discount.type || '',
      value,
    };
  };

  setInitialValues = initialValues => this.setState({
    initialValues: this.getInitialValues(initialValues),
  });

  handleResetDialogAccept = ({ resetForm }) => {
    this.handleReset();
    this.handleResetDialogClose();

    if (resetForm) {
      resetForm();
    }
  };

  handleResetDialogClose = () => this.setState({ resetDialog: false });

  handleResetDialogOpen = () => this.setState({ resetDialog: true });

  calculateDiscountAmount = (baseDiscountPrice) => {
    const { ticketDefinition } = this.props;
    const { originalPrice } = ticketDefinition || {};

    return originalPrice - baseDiscountPrice;
  };

  calculateDiscountPrice = (type, value) => {
    const { ticketDefinition } = this.props;
    const { originalPrice } = ticketDefinition || {};
    let calculatedValue = 0;

    if (type === DISCOUNT_TYPES.FLAT) {
      calculatedValue = +(value * 100).toFixed(0);
    } else if (type === DISCOUNT_TYPES.PERCENT) {
      calculatedValue = +(originalPrice * value / 100).toFixed(0);
    }

    return originalPrice - calculatedValue;
  };

  calculatePartnerCommission = (baseCommission, baseAmount) => baseAmount - baseCommission;

  convertBaseCurrencyToCurrency = baseCurrency => +(baseCurrency / 100).toFixed(2);

  convertCurrencyToBaseCurrency = currency => +(currency * 100).toFixed(0);

  handleReset = () => {
    const { onReset, ticketDefinition } = this.props;

    if (onReset) {
      const { discount, ...ticket } = ticketDefinition;

      onReset({ ...ticket, price: ticket.originalPrice });
    }
  };

  handleSubmit = (discount, { setSubmitting }) => {
    const { onSubmit, ticketDefinition } = this.props;

    if (onSubmit) {
      onSubmit({
        ...ticketDefinition,
        price: discount.price,
        discount: {
          ...discount,
          hplPart: this.convertCurrencyToBaseCurrency(discount.hplPart),
          partnerPart: this.convertCurrencyToBaseCurrency(discount.partnerPart),
          value: discount.type === DISCOUNT_TYPES.FLAT
            ? this.convertCurrencyToBaseCurrency(discount.value)
            : +discount.value,
        },
      });
    }

    setSubmitting(false);
  };

  render() {
    const { initialValues, resetDialog } = this.state;
    const {
      disabled, enableCustomCommission, FormikProps, ticketDefinition,
    } = this.props;
    const { brandName } = (config && config.public) || {};

    return (
      <Formik
        enableReinitialize
        {...FormikProps}
        initialValues={initialValues}
        validationSchema={this.validationSchema}
        onSubmit={this.handleSubmit}
      >
        {({
          dirty, resetForm, setFieldValue, values,
        } = {}) => (
          <Form autoComplete="off" noValidate style={{ width: '100%' }}>
            <Grid container spacing={24}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" paragraph>Ustawienia</Typography>
                <Grid container spacing={16}>
                  <Grid item>
                    <FormControl required style={{ minWidth: 175 }}>
                      <InputLabel htmlFor="discount-type">Rodzaj rabatu</InputLabel>
                      <Field
                        component={Select}
                        disabled={disabled}
                        inputProps={{
                          id: 'discount-type',
                          name: 'type',
                          onChange: (event) => {
                            const { name, value } = event.target;

                            setFieldValue(name, value);

                            if (values.value) {
                              setFieldValue('value', '');
                              setFieldValue('price', '');
                              setFieldValue('amount', '');
                              setFieldValue('hplPart', '');
                              setFieldValue('partnerPart', '');
                            }
                          },
                        }}
                        name="type"
                      >
                        {Object.values(DISCOUNT_TYPES).map(discountTypeName => (
                          <MenuItem key={discountTypeName} value={discountTypeName}>
                            {DISCOUNT_TYPES_NAMES[discountTypeName]}
                          </MenuItem>
                        ))}
                      </Field>
                    </FormControl>
                  </Grid>
                  <Grid item>
                    <Field
                      component={TextField}
                      disabled={disabled}
                      label="Wartość rabatu"
                      name="value"
                      required
                      type="number"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {formattedDiscountType[values.type] || ' '}
                          </InputAdornment>
                        ),
                        onChange: (event) => {
                          const { name, value: dirtyValue } = event.target;
                          const { value: currentValue } = values;
                          let value = !dirtyValue || +dirtyValue > 0 ? +dirtyValue : 0;

                          value = values.type === DISCOUNT_TYPES.FLAT ? value : value.toFixed(0);

                          let price = this.calculateDiscountPrice(values.type, value);

                          if (price < 0) {
                            value = currentValue;
                            price = this.calculateDiscountPrice(values.type, value);
                          }

                          const amount = this.calculateDiscountAmount(price);
                          const hplPart = 0;
                          const partnerPart = this.calculatePartnerCommission(hplPart, amount);

                          setFieldValue(name, value, true);
                          setFieldValue('price', price);
                          setFieldValue('amount', amount);
                          setFieldValue('hplPart', this.convertBaseCurrencyToCurrency(hplPart));
                          setFieldValue('partnerPart', this.convertBaseCurrencyToCurrency(partnerPart));
                        },
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" paragraph>Podział kosztu rabatu</Typography>
                <Typography paragraph>{`Wartość rabatu: ${formatPrice(values.amount)}`}</Typography>
                {enableCustomCommission && (
                  <Field
                    component={CheckboxWithLabel}
                    disabled={disabled}
                    name="isCustomCommission"
                    Label={{ label: 'Niestandardowy podział kosztu rabatu' }}
                  />
                )}
                <Grid container spacing={16}>
                  <Grid item>
                    <Field
                      component={TextField}
                      disabled={disabled || !enableCustomCommission || !values.isCustomCommission}
                      label="Partner"
                      name="partnerPart"
                      type="number"
                      InputProps={{
                        endAdornment: <InputAdornment position="end">zł</InputAdornment>,
                        onBlur: (event) => {
                          const { name, value } = event.target;
                          let finalValue = value;

                          if (!value) {
                            finalValue = 0;
                          }

                          setFieldValue(name, finalValue);
                        },
                        onChange: (event) => {
                          const { name, value } = event.target;
                          const basePartnerPart = this.convertCurrencyToBaseCurrency(value);

                          if (basePartnerPart >= 0 && basePartnerPart <= values.amount) {
                            setFieldValue(name, value);
                            setFieldValue('hplPart', this.convertBaseCurrencyToCurrency(
                              values.amount - basePartnerPart,
                            ));
                          }
                        },
                      }}
                    />
                  </Grid>
                  <Grid item>
                    <Field
                      component={TextField}
                      disabled
                      label={brandName || 'Administrator serwisu'}
                      name="hplPart"
                      type="number"
                      InputProps={{
                        endAdornment: <InputAdornment position="end">zł</InputAdornment>,
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" paragraph>Podsumowanie</Typography>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>Cena przed rabatem:</TableCell>
                      <TableCell align="right">
                        {formatPrice(ticketDefinition.originalPrice)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Wartość rabatu:</TableCell>
                      <TableCell align="right">
                        {formatPrice(values.amount)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Cena po rabacie:</TableCell>
                      <TableCell align="right">
                        {formatPrice(
                          _isNumber(values.price) ? values.price : ticketDefinition.originalPrice,
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Grid>
              <Grid item container justify="flex-end">
                <Button color="primary" onClick={this.handleResetDialogOpen}>
                  Wyczyść rabat
                </Button>
                <Button color="primary" disabled={!dirty} variant="contained" type="submit">
                  Ustaw rabat
                </Button>
              </Grid>
            </Grid>
            <Dialog
              open={resetDialog}
              aria-labelledby="reset-dialog-title"
              aria-describedby="reset-dialog-description"
            >
              <DialogTitle id="reset-dialog-title">
                Wyczyść rabat
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="reset-dialog-description">
                  Czy napewno wyczyścić rabat dla wybranego rodzaju produktu?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleResetDialogClose} color="primary">
                  Anuluj
                </Button>
                <Button onClick={() => this.handleResetDialogAccept({ resetForm })} color="primary">
                  OK
                </Button>
              </DialogActions>
            </Dialog>
          </Form>
        )}
      </Formik>
    );
  }
}

TicketDiscountForm.propTypes = {
  disabled: PropTypes.bool,
  enableCustomCommission: PropTypes.bool,
  FormikProps: PropTypes.shape({}),
  onSubmit: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  ticketDefinition: PropTypes.shape({
    discount: PropTypes.shape({
      amount: PropTypes.number,
      hplPart: PropTypes.number,
      isCustomCommission: PropTypes.bool,
      partnerPart: PropTypes.number,
      percent: PropTypes.number,
      type: PropTypes.string,
      value: PropTypes.number,
    }),
    originalPrice: PropTypes.number,
  }).isRequired,
};

TicketDiscountForm.defaultProps = {
  disabled: false,
  enableCustomCommission: false,
  FormikProps: null,
};

export default TicketDiscountForm;
