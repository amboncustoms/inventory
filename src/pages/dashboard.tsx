import React, { useState, useEffect } from 'react';
import { BarChart, TrackChanges, Favorite } from '@mui/icons-material';
import { LocalizationProvider, DatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import {
  TextField,
  Grid,
  Paper,
  CardHeader,
  Avatar,
  Box,
  AlertProps,
  Snackbar,
  Alert as MUIAlert,
} from '@mui/material';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { format } from 'date-fns';
import { verify } from 'jsonwebtoken';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import InfoCard from '@src/components/dashboard/InfoCard';
import LineChart from '@src/components/dashboard/LineChart';
import MobileAppbar from '@src/components/dashboard/MobileAppbar';
import Popular from '@src/components/dashboard/Popular';
import RadarChart from '@src/components/dashboard/RadarChart';
import Loading from '@src/components/Loading';
import { useAuthState } from '@src/contexts/auth';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MUIAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const Dashboard = () => {
  const router = useRouter();
  const dateNow = new Date();
  const popularDate = format(dateNow, 'dd MMM, yyyy');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [stocks, setStocks] = useState(null);
  const [errors, setErrors] = useState(null);
  const [openSnack, setOpenSnack] = useState(false);
  const { authenticated } = useAuthState();

  async function loadData() {
    const { data } = await axios.get(`/api/stocks/out/${selectedDate}`);
    setStocks(data);
    setIsLoading(false);
  }
  useEffect(() => {
    try {
      setIsLoading(true);
      loadData();
    } catch (error) {
      if (authenticated) {
        setErrors(error.response.data);
      }
      router.push('/login');
    }
  }, [selectedDate, authenticated]);
  return (
    <main>
      <Box sx={{ display: { md: 'none' } }}>
        <MobileAppbar setSelectedDate={setSelectedDate} selectedDate={selectedDate} />
      </Box>
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
            value={selectedDate}
            onChange={(newValue) => {
              setSelectedDate(newValue);
            }}
            renderInput={(params) => <TextField {...params} helperText={null} size="small" style={{ width: '8rem' }} />}
          />
        </LocalizationProvider>
      </Box>
      {isLoading ? (
        <Loading />
      ) : (
        <Grid
          container
          sx={{
            flexGrow: 1,
          }}
          spacing={4}
        >
          <Grid item md={8} xs={12}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <InfoCard
                categoryTotal={stocks?.categoryTotal}
                productTotal={stocks?.productTotal}
                stockOutTotal={stocks?.stockOutTotal}
              />
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
                  <Avatar aria-label="recipe" style={{ backgroundColor: '#041A4D' }}>
                    <BarChart style={{ color: 'white' }} />
                  </Avatar>
                }
                title="Tingkat Permintaan Produk"
                subheader="Line"
              />
              <div style={{ overflow: 'auto' }}>
                <LineChart stocks={stocks?.stockOut} />
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
                    <Avatar aria-label="recipe" style={{ backgroundColor: '#041A4D' }}>
                      <TrackChanges style={{ color: 'white' }} />
                    </Avatar>
                  }
                  title="Tingkat Permintaan Produk"
                  subheader="Radar"
                />
                <RadarChart stocks={stocks?.stockOut} />
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
                    <Avatar aria-label="recipe" style={{ backgroundColor: '#041A4D' }}>
                      <Favorite style={{ color: 'white' }} />
                    </Avatar>
                  }
                  title="Produk Terlaris"
                  subheader={popularDate}
                />
                <Popular stocks={stocks?.stockOut} />
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      )}
      <Snackbar
        open={openSnack}
        autoHideDuration={6000}
        onClose={() => setOpenSnack(false)}
        anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
      >
        <Alert onClose={() => setOpenSnack(false)} severity="error" sx={{ width: '100%' }}>
          {`Mohon maaf terjadi error : ${errors?.message}`}
        </Alert>
      </Snackbar>
    </main>
  );
};

export default Dashboard;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const prisma = new PrismaClient();
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
    const { authorization } = req.cookies;
    const { userId }: any = verify(authorization, process.env.JWT_SECRET);
    await prisma.user.findUnique({ where: { id: userId } });
    return {
      props: {},
    };
  } catch (err) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
};
