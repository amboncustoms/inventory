import React from 'react';
import { TextField, MenuItem } from '@mui/material';
import { useField, useFormikContext } from 'formik';

const SelectWrapper = ({ name, options, ...otherProps }) => {
  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  const handleChange = (e) => {
    const { value } = e.target;
    setFieldValue(name, value);
  };

  const configSelect = {
    ...field,
    ...otherProps,
    select: true,
    variant: 'outlined' as const,
    onChange: handleChange,
    error: false,
    helperText: null,
  };

  if (meta && meta.touched && meta.error) {
    configSelect.error = true;
    configSelect.helperText = meta.error;
  }
  return (
    <TextField {...configSelect}>
      <MenuItem value="">
        <em>None</em>
      </MenuItem>
      {options?.map((item: any) => {
        return (
          <MenuItem key={item.id} value={item.id} style={{ textTransform: 'capitalize' }}>
            {item.title}
          </MenuItem>
        );
      })}
    </TextField>
  );
};

export default SelectWrapper;
