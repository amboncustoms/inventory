import React, { useState } from 'react';
import { Category } from '@mui/icons-material';
import {
  AlertProps,
  Button,
  Avatar,
  CardHeader,
  Snackbar,
  Alert as MUIAlert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@mui/material';
import axios from 'axios';
import { Formik } from 'formik';
import { useMutation, useQueryClient } from 'react-query';
import * as Yup from 'yup';
import TextField from '@src/components/FormUI/TextField';

const INITIAL_FORM_STATE = {
  title: '',
};
const FORM_VALIDATION = Yup.object().shape({
  title: Yup.string().required('Nama kategori harus diisi'),
});

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MUIAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CategoryDialog({ openCategory, setOpenCategory }) {
  const queryClient = useQueryClient();
  const [errors, setErrors] = useState(null);
  const [openSnack, setOpenSnack] = useState(false);

  const handleClose = () => {
    setOpenCategory(false);
  };

  const mutation = useMutation(
    (data: { title: string }) => {
      return axios.post('/api/categories', data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('categories');
        setErrors(null);
        setOpenSnack(true);
      },
      onError: (error: any) => {
        setErrors(error.response.data);
        setOpenSnack(true);
      },
    }
  );

  const handleFormSubmit = (value, { resetForm }) => {
    mutation.mutate({ title: value.title });
    resetForm();
  };

  return (
    <div>
      <Dialog open={openCategory} onClose={handleClose} maxWidth="xs">
        <CardHeader
          style={{ paddingBottom: 0 }}
          avatar={
            <Avatar aria-label="recipe" style={{ backgroundColor: '#041A4D' }}>
              <Category style={{ color: 'white' }} />
            </Avatar>
          }
          title="Tambah Stok"
        />
        <Formik
          initialValues={{ ...INITIAL_FORM_STATE }}
          validationSchema={FORM_VALIDATION}
          onSubmit={handleFormSubmit}
        >
          {({ handleSubmit, isSubmitting }) => (
            <form onSubmit={handleSubmit} onFocus={() => setOpenSnack(false)}>
              <DialogContent>
                <DialogContentText variant="caption" align="center" marginBottom="0.5rem">
                  Barang persediaan dikelompokkan berdasarkan kategori, sehingga dimohon untuk memberi nama kategori
                  dengan nama yang singkat dan jelas.
                </DialogContentText>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="category"
                  label="Kategori"
                  name="title"
                  autoFocus
                  size="small"
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                  Tambah
                </Button>
              </DialogActions>
            </form>
          )}
        </Formik>
      </Dialog>
      <Snackbar
        open={openSnack}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
      >
        <Alert onClose={handleClose} severity={errors ? 'error' : 'success'} sx={{ width: '100%' }}>
          {errors ? errors?.message : 'Kategori berhasil dibuat !'}
        </Alert>
      </Snackbar>
    </div>
  );
}
