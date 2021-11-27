import React, { useState, useEffect, useContext } from 'react';
import { Container, Grid, CssBaseline, Typography, Button, Box, AlertProps } from '@mui/material';
import axios from 'axios';
import { Formik } from 'formik';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import * as Yup from 'yup';
import TextField from '@src/components/FormUI/TextField';
import { useAuthDispatch, useAuthState } from '@src/contexts/auth';
import { RevalidateContext } from '@src/contexts/revalidation';

const MUIAlert = dynamic(() => import('@mui/material/Alert'));
const Snackbar = dynamic(() => import('@mui/material/Snackbar'));
const Image = dynamic(() => import('next/image'));

type LoginValue = {
  username: string;
  password: string;
};

const INITIAL_FORM_STATE = {
  username: '',
  password: '',
};
const FORM_VALIDATION = Yup.object().shape({
  username: Yup.string().required('Username harus diisi'),
  password: Yup.string().required('Password harus diisi'),
});

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MUIAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Login() {
  const [errors, setErrors] = useState(null);
  const [openSnack, setOpenSnack] = useState(false);
  const { loginSuccess, setLoginSuccess } = useContext(RevalidateContext);
  const router = useRouter();
  const dispatch = useAuthDispatch();

  const { authenticated } = useAuthState();

  useEffect(() => {
    if (authenticated || loginSuccess) router.push('/');
  }, [authenticated, loginSuccess]);

  const handleClose = (_event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnack(false);
  };

  const mutation = useMutation(
    (data: LoginValue) => {
      return axios.post('/api/auth/login', data);
    },
    {
      onSuccess: (data) => {
        dispatch('LOGIN', data.data);
        setLoginSuccess(true);
      },
      onError: (error: any) => {
        setErrors(error.response.data);
        setOpenSnack(true);
      },
    }
  );

  const handleFormSubmit = (values: LoginValue, { resetForm }) => {
    const { username, password } = values;
    const payload = {
      username,
      password,
    };
    mutation.mutate(payload);
    resetForm();
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 10,
          paddingRight: '10%',
          paddingLeft: '10%',
        }}
      >
        <Image width={80} height={80} src="/box.png" alt="main logo" />
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        <Formik
          initialValues={{ ...INITIAL_FORM_STATE }}
          validationSchema={FORM_VALIDATION}
          onSubmit={handleFormSubmit}
        >
          {({ handleSubmit, isSubmitting }) => (
            <form onSubmit={handleSubmit} onFocus={() => setOpenSnack(false)}>
              <Box component="div" sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoFocus
                  size="small"
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  size="small"
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  size="small"
                  disabled={isSubmitting}
                >
                  Sign In
                </Button>
                <Grid container>
                  <Grid item xs>
                    <Typography variant="body2" align="center">
                      Ada masalah? silahkan hubungi RT.
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
      <Snackbar
        open={openSnack}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {errors?.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
