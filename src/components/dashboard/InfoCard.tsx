import React from 'react';
import { Category, CallMissedOutgoing, ShowChart } from '@mui/icons-material';
import { Grid, Paper, Avatar, Typography, Box } from '@mui/material';

const InfoCard = ({ categories = [], products = [], totalStockOut = 0 }) => {
  return (
    <Grid item container spacing={4} style={{ flexGrow: 1 }}>
      <Grid item md={4} xs={12}>
        <Paper style={{ backgroundColor: '#ED893630', borderRadius: 10 }} elevation={0}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              padding: '2rem',
              minHeight: { xs: '10rem', md: '8rem' },
            }}
          >
            <Avatar aria-label="recipe" style={{ backgroundColor: '#ED893630', color: '#ED8936' }}>
              <Category />
            </Avatar>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginLeft: '1.5rem',
              }}
            >
              <Typography variant="h5" style={{ fontWeight: 'bold', color: '#ED8936' }}>
                {categories.length}
              </Typography>
              <Typography variant="body1">Kategori</Typography>
            </div>
          </Box>
        </Paper>
      </Grid>

      <Grid item md={4} xs={12}>
        <Paper style={{ backgroundColor: '#38B2AC30', borderRadius: 10 }} elevation={0}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              padding: '2rem',
              minHeight: { xs: '10rem', md: '8rem' },
            }}
          >
            <Avatar aria-label="recipe" style={{ backgroundColor: '#38B2AC30', color: '#38B2AC' }}>
              <ShowChart />
            </Avatar>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginLeft: '1.5rem',
              }}
            >
              <Typography variant="h5" style={{ fontWeight: 'bold', color: '#38B2AC' }}>
                {products.length}
              </Typography>
              <Typography variant="body1">Stock</Typography>
            </div>
          </Box>
        </Paper>
      </Grid>

      <Grid item md={4} xs={12}>
        <Paper style={{ backgroundColor: '#9F7AEA30', borderRadius: 10 }} elevation={0}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              padding: '2rem',
              minHeight: { xs: '10rem', md: '8rem' },
            }}
          >
            <Avatar aria-label="recipe" style={{ backgroundColor: '#9F7AEA30', color: '#9F7AEA' }}>
              <CallMissedOutgoing />
            </Avatar>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                marginLeft: '1.5rem',
              }}
            >
              <Typography variant="h5" style={{ fontWeight: 'bold', color: '#9F7AEA' }}>
                {totalStockOut}
              </Typography>
              <Typography variant="body1">Stock Out</Typography>
            </div>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default InfoCard;
