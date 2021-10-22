import React from 'react';
import { TextField } from '@mui/material';
import { useField } from 'formik';

const TextFieldWrapper = ({ name, ...otherProps }) => {
  const [field, meta] = useField(name);

  const configTextField = {
    ...field,
    ...otherProps,
    variant: 'outlined' as const,
    error: false,
    helperText: null,
  };

  if (meta && meta.touched && meta.error) {
    configTextField.error = true;
    configTextField.helperText = meta.error;
  }
  return <TextField {...configTextField} />;
};

export default TextFieldWrapper;
