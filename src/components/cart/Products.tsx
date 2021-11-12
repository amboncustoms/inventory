import React, { useContext, useState } from 'react';
import { ShoppingCart } from '@mui/icons-material';
import axios from 'axios';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useQueryClient, useMutation } from 'react-query';
import { CartContext } from '@src/contexts/cart';
import { ERule, Properties } from '@src/utils/types';
import GeneralModal from '../modal/GeneralModal';
import Product from './Product';

const Grid = dynamic(() => import('@mui/material/Grid'));
const Typography = dynamic(() => import('@mui/material/Typography'), { ssr: false });
const Divider = dynamic(() => import('@mui/material/Divider'));
const Button = dynamic(() => import('@mui/material/Button'), { ssr: false });
const Box = dynamic(() => import('@mui/material/Box'), { ssr: false });

type Rule = {
  activeStep?: number;
  allowAddToCart?: string;
  userId?: any;
};

interface Incart {
  products: [{ productId: string | null; quantity: number | null }];
}

const getProperties = (category) => {
  const properties: Properties = {
    image: '',
    color: '',
  };
  switch (category) {
    case 'alat tulis kantor':
      properties.image = '/images/atk.png';
      properties.color = '#00666690';
      break;
    case 'alat kebersihan':
      properties.image = '/images/alat-kebersihan.png';
      properties.color = '#4d4dff90';
      break;
    case 'alat kendaraan':
      properties.image = '/images/alat-kendaraan.png';
      properties.color = '#ff333390';
      break;
    case 'alat komputer':
      properties.image = '/images/alat-komputer.png';
      properties.color = '#ffa50090';
      break;
    case 'obat obatan':
      properties.image = '/images/box.png';
      properties.color = '#00800090';
      break;
    default:
      properties.image = '/images/others.png';
      properties.color = '#883dbd90';
      break;
  }
  return properties;
};

const Products = ({ rules, isSuccess }) => {
  const { skip, cart, setCartToEmpty, incartTotal } = useContext(CartContext);
  const [skipped, setSkipped] = skip;
  const [openModalAuth, setOpenModalAuth] = useState(false);
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const queryClient = useQueryClient();
  const setAllowMutation = useMutation(
    (data: Rule) => {
      return axios.patch('/api/rules', data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('rules');
      },
    }
  );
  const setActiveMutation = useMutation(
    (data: Rule) => {
      return axios.patch('/api/rules', data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('rules');
      },
    }
  );
  const saveCartMutation = useMutation((data: Incart) => {
    return axios.post('/api/incarts', data);
  });

  const setAllowAddToCart = async (value: string) => {
    setAllowMutation.mutate({ allowAddToCart: value });
  };

  const setActiveStep = async (value: number) => {
    setActiveMutation.mutate({ activeStep: value });
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const isAuthenticated = async () => {
    try {
      await axios.get('/api/auth/me');
      return true;
    } catch (err) {
      return false;
    }
  };

  const modalHandler = async () => {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      setOpenModalAuth(true);
    } else {
      setOpenModalConfirm(true);
    }
  };

  const saveCartToDatabase = async (callback) => {
    if (cart.lenght !== 0) {
      saveCartMutation.mutate({ products: cart });
      callback(ERule.PREVENT);
    }
  };

  const handleNext = async () => {
    let newSkipped = skipped;
    if (isStepSkipped(rules.activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(rules.activeStep);
    }
    saveCartToDatabase(setAllowAddToCart)
      .then(() => {
        setSkipped(newSkipped);
        setActiveStep(2);
      })
      .catch((err) => {
        throw new Error(err);
      })
      .finally(async () => {
        setCartToEmpty();
        await queryClient.invalidateQueries('notifs');
      });
  };

  return (
    <>
      {cart?.length !== 0 && isSuccess ? (
        <>
          <Grid container style={{ justifyContent: 'flex-start' }} spacing={4}>
            {cart.map((c) => (
              <Grid item key={c.productId} xs={12} sm={6} md={4} lg={3}>
                <Product
                  productId={c.productId}
                  name={c.name}
                  quantity={c.quantity}
                  incart={c.incart}
                  image={getProperties(c.category).image}
                  color={getProperties(c.category).color}
                />
              </Grid>
            ))}
          </Grid>
          <Divider style={{ margin: '3rem 0 0 0' }} />
          <Box
            id="incart-total"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1.5rem',
            }}
          >
            <Typography variant="h5">Total: {incartTotal}</Typography>
            <Button startIcon={<ShoppingCart />} variant="contained" color="primary" onClick={modalHandler}>
              Ajukan
            </Button>
          </Box>
        </>
      ) : (
        <Box
          style={{
            marginTop: '1rem',
            marginBottom: '1rem',
            display: 'flex',
            justifyContent: 'center',
            height: '14rem',
          }}
        >
          <Box
            id="warning-wrapper"
            style={{
              marginTop: '1rem',
              marginBottom: '1rem',
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography align="center">
              Keranjang masih konsong, silahkan pilih barang terlebih dahulu pada Gallery.
            </Typography>
            <Link href="/" passHref>
              <Button style={{ minWidth: '120px', marginTop: '2rem' }} variant="contained" color="primary">
                Gallery
              </Button>
            </Link>
          </Box>
        </Box>
      )}
      <GeneralModal
        open={openModalAuth}
        setOpen={setOpenModalAuth}
        text="Sesi Anda telah berakhir, mohon untuk login kembali."
        type="auth"
      />
      <GeneralModal
        handler={handleNext}
        open={openModalConfirm}
        setOpen={setOpenModalConfirm}
        text="Apakah jumlah dan jenis barang sudah benar ?."
        type="confirm"
      />
    </>
  );
};

export default Products;
