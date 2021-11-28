import React, { useState, useContext } from 'react';
import { Summarize } from '@mui/icons-material';
import {
  AlertProps,
  Button,
  TextField as MUITextField,
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
import Select from '@src/components/FormUI/Select';
import TextField from '@src/components/FormUI/TextField';
import { CategoryContext } from '@src/contexts/category';
import { RevalidateContext } from '@src/contexts/revalidation';

type ProductValue = {
  categoryId: string;
  code: string;
  description: string;
  name: string;
};

const INITIAL_FORM_STATE = {
  categoryId: '',
  code: '',
  description: '',
  name: '',
};
const FORM_VALIDATION = Yup.object().shape({
  categoryId: Yup.string().required('Kategori harus diisi'),
  code: Yup.string().required('Kode harus diisi'),
  description: Yup.string()?.optional(),
  name: Yup.string().required('Nama harus diisi'),
});

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MUIAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function ProductDialog({ openProduct, setOpenProduct }) {
  const { setRevalidateProduct } = useContext(RevalidateContext);
  const queryClient = useQueryClient();
  const [errors, setErrors] = useState(null);
  const [openSnack, setOpenSnack] = useState(false);
  const { categories, isSuccess } = useContext(CategoryContext);

  const handleClose = () => {
    setOpenProduct(false);
    setOpenSnack(false);
  };
  const handleCloseSnack = () => {
    setOpenSnack(false);
  };

  const mutation = useMutation(
    (data: ProductValue) => {
      return axios.post('/api/products', data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('products');
        setErrors(null);
        setOpenSnack(true);
        setRevalidateProduct(true);
      },
      onError: (error: any) => {
        setErrors(error.response.data);
        setOpenSnack(true);
      },
    }
  );

  const handleFormSubmit = (value, { resetForm }) => {
    const { categoryId, code, description, name } = value;
    const payload = {
      categoryId,
      code,
      description,
      name,
    };
    mutation.mutate(payload);
    resetForm();
  };

  return (
    <div>
      <Dialog open={openProduct} onClose={handleClose} maxWidth="xs">
        <CardHeader
          style={{ paddingBottom: 0 }}
          avatar={
            <Avatar aria-label="recipe" style={{ backgroundColor: '#041A4D' }}>
              <Summarize style={{ color: 'white' }} />
            </Avatar>
          }
          title="Tambah Barang"
        />
        <Formik
          initialValues={{ ...INITIAL_FORM_STATE }}
          validationSchema={FORM_VALIDATION}
          onSubmit={handleFormSubmit}
        >
          {({ handleSubmit, isSubmitting, values, handleChange }) => (
            <form onSubmit={handleSubmit} onFocus={() => setOpenSnack(false)}>
              <DialogContent>
                <DialogContentText variant="caption" align="center" marginBottom="0.5rem">
                  Input barang hanya dilakukan ketika barang belum pernah diinput sebelumya, jika sudah pernah diinput,
                  maka seharusnya cukup dengan tambah stok, dankee.
                </DialogContentText>
                <Select
                  name="categoryId"
                  fullWidth
                  label="Kategori"
                  options={isSuccess && categories}
                  size="small"
                  style={{ textTransform: 'capitalize' }}
                />
                <TextField margin="normal" required fullWidth id="code" label="Kode Barang" name="code" size="small" />
                <TextField margin="normal" required fullWidth id="name" label="Nama Barang" name="name" size="small" />
                <MUITextField
                  label="Multiline"
                  multiline
                  name="description"
                  fullWidth
                  rows={4}
                  margin="normal"
                  onChange={handleChange}
                  value={values.description}
                  placeholder="Diisi keterangan barang (optional), misalnya kegunaan barang, warna dll. yang sekiranya dibutuhkan."
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
        onClose={handleCloseSnack}
        anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
      >
        <Alert onClose={handleCloseSnack} severity={errors ? 'error' : 'success'} sx={{ width: '100%' }}>
          {errors ? errors?.message : 'Produk berhasil dibuat !'}
        </Alert>
      </Snackbar>
    </div>
  );
}
