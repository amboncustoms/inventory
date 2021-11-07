import React, { useState, useEffect } from 'react';
import { FilterTiltShift, Info, Replay } from '@mui/icons-material';
import { LocalizationProvider, DatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  CardHeader,
  Typography,
  TableFooter,
  TablePagination,
  TextField,
  Grid,
  IconButton,
} from '@mui/material';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { add, format } from 'date-fns';
import { verify } from 'jsonwebtoken';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Loading from '@src/components/Loading';

const numberFormatterInRupiah = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' });
const numberFormatter = new Intl.NumberFormat();
const Detail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = React.useState(2);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  const { back } = useRouter();

  const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
  };

  useEffect(() => {
    if (!id) {
      setLoading(true);
      return;
    }
    async function getStock() {
      try {
        if (startDate === null || endDate === null) {
          setLoading(true);
          const { data } = await axios.get(`/api/reports/stocks/${id}`);
          setStock(data);
          setLoading(false);
        } else {
          setLoading(true);
          const customStart = new Date(startDate.setHours(0, 0, 0, 0));
          const customEnd = add(new Date(endDate).setHours(0, 0, 0, 0), {
            days: 1,
          });
          const { data } = await axios.get(`/api/reports/stocks/${id}/${customStart}/${customEnd}`);
          setStock(data);
          setLoading(false);
        }
      } catch (err) {
        back();
      }
    }
    getStock();
  }, [id, startDate, endDate]);

  return loading || stock.length === 0 ? (
    <Loading />
  ) : (
    <Paper
      style={{
        borderRadius: 10,
        border: '1px solid #E5E8EC',
        padding: '1rem 2rem 2rem',
      }}
      elevation={0}
    >
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" style={{ backgroundColor: '#9500ae' }}>
            <FilterTiltShift style={{ color: 'white' }} />
          </Avatar>
        }
        title="Detail Riwayat Stok"
        action={
          <Grid container spacing={1} sx={{ width: { xs: '10rem', md: '20rem' } }}>
            <Grid item xs={12} md={5}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start"
                  value={startDate}
                  onChange={(newValue) => {
                    setStartDate(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} helperText={null} size="small" style={{ width: '8rem' }} />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={5}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End"
                  value={endDate}
                  onChange={(newValue) => {
                    setEndDate(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} helperText={null} size="small" style={{ width: '8rem' }} />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={2}>
              <IconButton color="primary" aria-label="upload picture" onClick={handleReset}>
                <Replay />
              </IconButton>
            </Grid>
          </Grid>
        }
      />
      <TableContainer
        component="div"
        style={{ margin: '1rem 0', border: '1px solid #E5E8EC', borderRadius: 5, overflow: 'auto' }}
      >
        <Table size="small" sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow style={{ backgroundColor: '#aa33be' }}>
              <TableCell align="left" style={{ width: '30%', color: '#fff' }}>
                Properti
              </TableCell>
              <TableCell align="left" style={{ width: '70%', color: '#fff' }}>
                Detail
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row" align="left" style={{ width: '30%' }}>
                Kode Barang
              </TableCell>
              <TableCell align="left" style={{ width: '70%' }}>
                {stock?.data?.code}
              </TableCell>
            </TableRow>
            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row" align="left" style={{ width: '30%' }}>
                Kategori
              </TableCell>
              <TableCell align="left" style={{ width: '70%', textTransform: 'capitalize' }}>
                {stock?.data?.category}
              </TableCell>
            </TableRow>
            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row" align="left" style={{ width: '30%' }}>
                Nama Barang
              </TableCell>
              <TableCell align="left" style={{ width: '70%', textTransform: 'capitalize' }}>
                {stock?.data?.name}
              </TableCell>
            </TableRow>
            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row" align="left" style={{ width: '30%' }}>
                Deskripsi
              </TableCell>
              <TableCell align="left" style={{ width: '70%' }}>
                {stock?.data?.description}
              </TableCell>
            </TableRow>
            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row" align="left" style={{ width: '30%' }}>
                Saldo Awal
              </TableCell>
              <TableCell align="left" style={{ width: '70%' }}>
                {numberFormatter.format(stock?.mainStock)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      {stock?.data?.mutations.length === 0 ? (
        <div
          style={{
            height: '10rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <CardHeader
            avatar={
              <Avatar
                aria-label="recipe"
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #9500ae',
                }}
              >
                <Info color="primary" />
              </Avatar>
            }
            title="Tidak ada riwayat stok"
          />
        </div>
      ) : (
        <TableContainer component="div" style={{ border: '1px solid #E5E8EC', borderRadius: 5, overflow: 'auto' }}>
          <Table size="small" sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow style={{ backgroundColor: '#aa33be' }}>
                <TableCell align="center" style={{ width: '10%', color: '#fff' }}>
                  Nomor
                </TableCell>
                <TableCell align="center" style={{ width: '45%', color: '#fff' }}>
                  Tanggal
                </TableCell>
                <TableCell align="center" style={{ width: '45%', color: '#fff' }}>
                  Deskripsi
                </TableCell>
                <TableCell align="center" style={{ width: '45%', color: '#fff' }}>
                  Harga
                </TableCell>
                <TableCell align="center" style={{ width: '45%', color: '#fff' }}>
                  Jumlah
                </TableCell>
                <TableCell align="center" style={{ width: '45%', color: '#fff' }}>
                  Ket.
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stock?.data?.mutations.map((item, idx) => (
                <TableRow key={item.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row" style={{ width: '10%' }} align="center">
                    {Number(idx) + 1}
                  </TableCell>
                  <TableCell align="center" style={{ width: '45%' }}>
                    {format(new Date(item.date), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell align="center" style={{ width: '45%' }}>
                    {item.description}
                  </TableCell>
                  <TableCell align="center" style={{ width: '45%' }}>
                    {numberFormatterInRupiah.format(item.price)}
                  </TableCell>
                  <TableCell align="center" style={{ width: '45%' }}>
                    {numberFormatter.format(item.quantity)}
                  </TableCell>
                  <TableCell align="center" style={{ width: '45%' }}>
                    {item.ket}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  count={100}
                  align="right"
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      )}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
        <div style={{ display: 'flex', padding: '0.5rem 1rem', border: '1px solid #E5E8EC', borderRadius: 5 }}>
          <Typography variant="body1">Saldo Akhir :</Typography>
          <Typography variant="body1" style={{ marginLeft: '2rem' }}>
            {numberFormatter.format(stock?.latestStock)}
          </Typography>
        </div>
      </div>
    </Paper>
  );
};

export default Detail;

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
