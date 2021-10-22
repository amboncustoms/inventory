import React from 'react';
// icons
import { Star } from '@mui/icons-material';
import { Grid, Card, CardHeader, Avatar } from '@mui/material';

const Popular = () => {
  /* const [loading, setLoading] = useState(true);
  const [popularData, setPopularData] = useState([]);

  const setData = () => {
    const dateNow = new Date();
    const getMonthNow = dateNow.getMonth();
    let filteredProducts = [];
    orders.forEach((order) => {
      const productByMonth = order.carts.filter((cart) => {
        const { createdAt } = cart;
        const dateProduct = new Date(createdAt);
        const getMonthProduct = dateProduct.getMonth();
        return getMonthProduct == getMonthNow;
      });
      filteredProducts.push(...productByMonth);
    });
    const sortedProduct = filteredProducts.sort((a, b) => b.quantity - a.quantity);
    const pickedProducts = sortedProduct.slice(0, 3);
    setPopularData(pickedProducts);
  };

  useEffect(() => {
    if (!orders) {
      setLoading(true);
    } else {
      setData();
      setLoading(false);
    }
  }, [orders]); */
  return (
    <>
      <Grid container spacing={1} style={{ padding: '0.5rem 1rem' }}>
        <Grid item xs={12}>
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
              title="title"
              subheader="subheader"
            />
          </Card>
        </Grid>
        <Grid item xs={12}>
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
              title="title"
              subheader="subheader"
            />
          </Card>
        </Grid>
        <Grid item xs={12}>
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
              title="title"
              subheader="subheader"
            />
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default Popular;
