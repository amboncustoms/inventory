import React, { FC, useContext } from 'react';
import { AddShoppingCart, Block } from '@mui/icons-material';
import { Card, CardActions, CardContent, IconButton, Tooltip, Typography, Box, Divider } from '@mui/material';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { QueryClient, useQuery, dehydrate } from 'react-query';
import { CartContext } from '@src/contexts/cart';
import { Properties, Product as TProduct } from '@src/utils/types';

interface PropType {
  properties: Properties;
  product: TProduct;
}

const getRules = async () => {
  const { data } = await axios.get('/api/rules');
  return data;
};

const Product: FC<PropType> = ({ properties, product }) => {
  const { data: rules, isSuccess } = useQuery('rules', getRules);
  const { image, color } = properties;
  const { name, latestQuantity, id, category } = product;
  const { setCartProduct } = useContext(CartContext);

  const addToCart = () => {
    const cartProduct = {
      productId: id,
      name,
      category,
      quantity: latestQuantity,
      incart: 1,
    };
    setCartProduct(cartProduct);
  };
  return (
    <Card
      elevation={0}
      sx={{
        height: '20rem',
        display: 'flex',
        border: '1px solid #E5E8EC80',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        margin: {
          md: 0,
        },
        bgcolor: 'white',
      }}
    >
      <svg
        viewBox="0 0 375 310"
        fill="none"
        style={{
          transform: 'scale(1.5)',
          opacity: '0.1',
          position: 'absolute',
          bottom: '0',
          left: '0',
          marginBottom: '2rem',
        }}
      >
        <rect x="159.52" y="175" width="152" height="152" rx="8" transform="rotate(-45 159.52 175)" fill={color} />
        <rect y="107.48" width="152" height="152" rx="8" transform="rotate(-45 0 107.48)" fill={color} />
      </svg>
      <CardContent>
        <Box
          sx={{
            position: 'relative',
            padding: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '12rem',
          }}
        >
          <div
            style={{
              display: 'block',
              position: 'absolute',
              width: '10rem',
              height: '10rem',
              bottom: '0',
              left: '0',
              right: '0',
              marginBottom: '-2rem',
              marginLeft: '1.5rem',
              background: 'radial-gradient(black, transparent 60%)',
              transform: 'rotate3d(0,0,1, 20dg) scale3d(1, 0.6, 1)',
              opacity: '0.2',
            }}
          />
          <Image src={image} layout="fill" objectFit="contain" alt="" />
        </Box>
        <Divider />
        <CardActions
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem',
            width: '13rem',
          }}
        >
          <Box style={{ color: '#000', letterSpacing: '.3px' }}>
            <Typography gutterBottom variant="body2" style={{ fontWeight: 'bolder', textTransform: 'capitalize' }}>
              {name}
            </Typography>

            <Typography variant="caption" style={{ textTransform: 'capitalize' }}>
              {latestQuantity}
            </Typography>
          </Box>
          {isSuccess && rules?.allowAddToCart === 'ALLOW' ? (
            <Tooltip title="Tambahkan">
              <IconButton style={{ backgroundColor: 'white' }} onClick={addToCart}>
                <AddShoppingCart style={{ color }} />
              </IconButton>
            </Tooltip>
          ) : (
            <IconButton style={{ backgroundColor: 'white' }} disabled>
              <Block color="secondary" />
            </IconButton>
          )}
        </CardActions>
      </CardContent>
    </Card>
  );
};

export default Product;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  try {
    const { cookie } = req.headers;
    if (!cookie) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }
    const getServerRules = async () => {
      const { data } = await axios.get('/api/rules', { headers: { cookie } });
      return data;
    };
    const queryClient = new QueryClient();
    await queryClient.prefetchQuery('rules', getServerRules);
    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
    };
  } catch (err) {
    res.writeHead(307, { Location: '/login' }).end();
  }
};
