import React, { useEffect, useState } from 'react';
// icons
import { Star } from '@mui/icons-material';
import { Grid, Card, CardHeader, Avatar, Typography } from '@mui/material';
import Loading from '../Loading';

const Popular = ({ stocks }) => {
  const [loading, setLoading] = useState(true);
  const [popularData, setPopularData] = useState([]);

  const setData = () => {
    const dateNow = new Date();
    const getMonthNow = dateNow.getMonth();
    const productByMonth = stocks.filter((cart) => {
      const { createdAt } = cart;
      const dateProduct = new Date(createdAt);
      const getMonthProduct = dateProduct.getMonth();
      return getMonthProduct === getMonthNow;
    });

    const sortedProduct = productByMonth.sort((a, b) => b.quantity - a.quantity);
    const pickedProducts = sortedProduct.slice(0, 3);
    setPopularData(pickedProducts);
  };

  useEffect(() => {
    if (!stocks) {
      setLoading(true);
    } else {
      setData();
      setLoading(false);
    }
  }, [stocks]);
  return (
    <>
      {loading ? (
        <Loading />
      ) : popularData?.length !== 0 ? (
        <Grid container spacing={1} style={{ padding: '0.5rem 1rem' }}>
          {popularData.map((popular) => (
            <Grid item xs={12} key={popular.id}>
              <Card
                style={{
                  minHeight: '3rem',
                }}
                elevation={0}
              >
                <CardHeader
                  style={{ textTransform: 'capitalize' }}
                  avatar={
                    <Avatar aria-label="popular" style={{ backgroundColor: 'white' }}>
                      <Star color="primary" />
                    </Avatar>
                  }
                  title={popular.name}
                  subheader={popular.category}
                />
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '14rem',
          }}
        >
          <Typography variant="body2">Barang Kosong.</Typography>
        </div>
      )}
    </>
  );
};

export default Popular;
