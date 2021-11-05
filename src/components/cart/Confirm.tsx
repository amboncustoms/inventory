import React, { useContext, useState } from 'react';
import { Receipt } from '@mui/icons-material';
import { Grid, Typography, Button } from '@mui/material';
import axios from 'axios';
import Image from 'next/image';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { CartContext } from '@src/contexts/cart';
import GeneralModal from '../modal/GeneralModal';

const getIncart = async () => {
  const { data } = await axios.get('/api/incarts');
  return data;
};

const Confirm = ({ rules }) => {
  const { skip } = useContext(CartContext);
  const { data: incart } = useQuery('myincart', getIncart);
  const [skipped, setSkipped] = skip;
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const queryClient = useQueryClient();
  const setAllowMutation = useMutation(
    () => {
      return axios.patch('/api/rules', { allowAddToCart: 'ALLOW' });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('rules');
      },
    }
  );
  const setActiveMutation = useMutation(
    () => {
      return axios.patch('/api/rules', { activeStep: 1 });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('rules');
      },
    }
  );

  const sendOrderMutation = useMutation(
    (data: any) => {
      return axios.post('/api/orders', data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('rules');
      },
    }
  );

  const deleteNotifMutation = useMutation(
    () => {
      return axios.delete('/api/notifs/stockout');
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('notifs');
      },
    }
  );

  const deleteIncartMutation = useMutation(
    () => {
      return axios.delete('/api/incarts');
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('incarts');
      },
    }
  );

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const modalHandler = async () => {
    setOpenModalConfirm(true);
  };

  const runMutation = () => {
    sendOrderMutation.mutate({
      products: incart,
    });
    setAllowMutation.mutate();
    setActiveMutation.mutate();
    deleteIncartMutation.mutate();
    deleteNotifMutation.mutate();
  };

  const handleNext = async () => {
    let newSkipped = skipped;
    if (isStepSkipped(rules?.activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(rules?.activeStep);
    }
    try {
      runMutation();
      setSkipped(newSkipped);
    } catch (err) {
      throw new Error(err);
    }
  };

  return (
    <Grid container style={{ backgroundColor: 'white', minHeight: '33rem', borderRadius: 10 }}>
      <Grid item xs={12} md={6}>
        <Image src="/images/cartTwo.png" width="600" height="600" alt="cart-two-image" />
      </Grid>
      <Grid item xs={12} md={6}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '4rem 2rem',
          }}
        >
          <Typography variant="h6" gutterBottom style={{ fontWeight: 'bold', textAlign: 'center' }}>
            Permohonan telah disetujui Kasubbagian Umum,
          </Typography>
          <Typography variant="h6" style={{ textAlign: 'center' }}>
            Jika barang telah diterima, dimohon untuk konfirmasi dengan klik tombol &quot;Diterima&quot;, kemudian
            silakan untuk mengambil barangnya di RT, Danke.
          </Typography>
          <Button
            startIcon={<Receipt />}
            variant="contained"
            color="primary"
            style={{ marginTop: '3rem' }}
            onClick={modalHandler}
          >
            Diterima
          </Button>
        </div>
      </Grid>
      {/*  <GeneralModal
        open={openModalAuth}
        setOpen={setOpenModalAuth}
        text="Sesi Anda telah berakhir, mohon untuk login kembali."
        type="auth"
      />  */}
      <GeneralModal
        handler={handleNext}
        open={openModalConfirm}
        setOpen={setOpenModalConfirm}
        text="Apakah Anda yakin barang sudah diterima ?."
        type="confirm"
      />
    </Grid>
  );
};

export default Confirm;
