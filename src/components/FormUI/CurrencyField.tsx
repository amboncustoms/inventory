import React, { useState } from 'react';
import NumberFormat from 'react-number-format';
import TextField from '@src/components/FormUI/TextField';

export const handleValueChange = (name, setFieldValue) => (val) => setFieldValue(name, val.floatValue);

const CurrencyFieldText = ({ currencySymbol, ...props }) => {
  const [displayValue, setDisplayValue] = useState();
  return (
    <NumberFormat
      customInput={TextField}
      variant="outlined"
      isNumericString
      thousandSeparator
      value={displayValue}
      decimalScale={2}
      onValueChange={(vals: any) => setDisplayValue(vals.formattedValue)}
      InputProps={{
        startAdornment: <span>{currencySymbol} </span>,
      }}
      {...props}
    />
  );
};

CurrencyFieldText.defaultProps = {
  currencySymbol: 'Rp. ',
};

export default CurrencyFieldText;
