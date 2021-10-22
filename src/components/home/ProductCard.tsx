import React, { FC } from 'react';
import { AddShoppingCart } from '@mui/icons-material';
import { Card, CardActions, CardContent, IconButton, Tooltip, Typography, Box, Divider } from '@mui/material';
import Image from 'next/image';
import { Properties, Product } from '@src/utils/types';

interface PropType {
  properties: Properties;
  product: Product;
}

const ProductCard: FC<PropType> = ({ properties, product }) => {
  const { image, color } = properties;
  const { name, latestQuantity } = product;
  return (
    <div>
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
            <Image width={2500} height={2500} src={image} alt="" />
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
            <Tooltip title="Tambahkan">
              <IconButton style={{ backgroundColor: color }}>
                <AddShoppingCart style={{ color: 'white' }} />
              </IconButton>
            </Tooltip>
          </CardActions>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductCard;
