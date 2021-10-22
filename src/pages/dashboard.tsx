import React from 'react';
import { BarChart, TrackChanges, Favorite } from '@mui/icons-material';
import { LocalizationProvider, DatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { TextField, Grid, Paper, CardHeader, Avatar, Box } from '@mui/material';
import InfoCard from '@src/components/dashboard/InfoCard';
import LineChart from '@src/components/dashboard/LineChart';
import Popular from '@src/components/dashboard/Popular';
import RadarChart from '@src/components/dashboard/RadarChart';

const Dashboard = () => {
  const [value, setValue] = React.useState<Date | null>(new Date());
  return (
    <main>
      <Box
        sx={{
          display: {
            xs: 'none',
            md: 'flex',
          },
          justifyContent: {
            md: 'flex-end',
          },
          marginBottom: {
            md: '1.5rem',
          },
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            views={['year']}
            label="Tahun"
            value={value}
            onChange={(newValue) => {
              setValue(newValue);
            }}
            renderInput={(params) => <TextField {...params} helperText={null} size="small" style={{ width: '8rem' }} />}
          />
        </LocalizationProvider>
      </Box>
      <Grid
        container
        sx={{
          flexGrow: 1,
          marginTop: {
            xs: '5rem',
            md: 0,
          },
        }}
        spacing={4}
      >
        <Grid item md={8} xs={12}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <InfoCard />
          </div>
          <Paper
            sx={{
              margin: { xs: '2rem 0 0 0', md: '2rem 0 2rem' },
              position: 'relative',
              borderRadius: 3,
              border: '1px solid #E5E8EC',
            }}
            elevation={0}
          >
            <CardHeader
              avatar={
                <Avatar aria-label="recipe" style={{ backgroundColor: '#9500ae' }}>
                  <BarChart style={{ color: 'white' }} />
                </Avatar>
              }
              title="Tingkat Permintaan Produk"
              subheader="Line"
            />
            <div style={{ overflow: 'auto' }}>
              <LineChart />
            </div>
          </Paper>
        </Grid>
        <Grid item container md={4} xs={12} style={{ flexGrow: 1 }}>
          <Grid item md={12} xs={12} sx={{ marginBottom: { xs: '2rem', md: 0 } }}>
            <Paper
              style={{
                height: '24rem',
                borderRadius: 10,
                border: '1px solid #E5E8EC',
              }}
              elevation={0}
            >
              <CardHeader
                avatar={
                  <Avatar aria-label="recipe" style={{ backgroundColor: '#9500ae' }}>
                    <TrackChanges style={{ color: 'white' }} />
                  </Avatar>
                }
                title="Tingkat Permintaan Produk"
                subheader="Radar"
              />
              <RadarChart />
            </Paper>
          </Grid>
          <Grid item md={12} xs={12}>
            <Paper
              elevation={0}
              style={{
                minHeight: '21rem',
                borderRadius: 10,
                border: '1px solid #E5E8EC',
              }}
            >
              <CardHeader
                avatar={
                  <Avatar aria-label="recipe" style={{ backgroundColor: '#9500ae' }}>
                    <Favorite style={{ color: 'white' }} />
                  </Avatar>
                }
                title="Produk Terlaris"
                // subheader={popularDate}
              />
              <Popular />
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </main>
  );
};

export default Dashboard;
