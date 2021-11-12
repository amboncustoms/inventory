import React, { useState, useEffect } from 'react';
import { Cached, FilterList, Info, ListAlt } from '@mui/icons-material';
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
  TablePagination,
  TextField,
  Grid,
  IconButton,
  Alert as MUIAlert,
  Snackbar,
  AlertProps,
  Popper,
} from '@mui/material';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { add, format } from 'date-fns';
import { verify } from 'jsonwebtoken';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Loading from '@src/components/Loading';
import { useAuthState } from '@src/contexts/auth';

const numberFormatterInRupiah = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' });
const numberFormatter = new Intl.NumberFormat();

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MUIAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const Detail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  const [errors, setErrors] = useState(null);
  const [openSnack, setOpenSnack] = useState(false);
  const { authenticated } = useAuthState();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const popperId = open ? 'filter-popper-stock' : undefined;

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
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - stock?.data?.mutations.length) : 0;

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
      } catch (error) {
        if (authenticated) {
          setErrors(error.response.data);
        }
        router.push('/login');
      }
    }
    getStock();
  }, [id, startDate, endDate, authenticated]);

  return (
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
          <Avatar aria-label="recipe" style={{ backgroundColor: '#041A4D' }}>
            <ListAlt style={{ color: 'white' }} />
          </Avatar>
        }
        title="Detail Riwayat Stok"
        action={
          <IconButton onClick={handleClick}>
            <FilterList color="primary" />
          </IconButton>
        }
      />
      <TableContainer
        component="div"
        style={{ margin: '1rem 0', border: '1px solid #E5E8EC', borderRadius: 5, overflow: 'auto' }}
      >
        <Table size="small" sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow style={{ backgroundColor: '#041A4D' }}>
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
                {stock?.data?.description ? stock?.data?.description : '-'}
              </TableCell>
            </TableRow>
            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row" align="left" style={{ width: '30%' }}>
                Saldo Awal
              </TableCell>
              <TableCell align="left" style={{ width: '70%', fontWeight: 'bold' }}>
                {numberFormatter.format(stock?.mainStock)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      {stock?.data?.mutations.length === 0 ? (
        <div
          style={{
            height: '5rem',
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
                  border: '1px solid #041A4D',
                }}
              >
                <Info color="primary" />
              </Avatar>
            }
            title="Tidak ada riwayat stok"
          />
        </div>
      ) : loading || stock.length === 0 ? (
        <Loading />
      ) : (
        <TableContainer component="div" style={{ border: '1px solid #E5E8EC', borderRadius: 5, overflow: 'auto' }}>
          <Table size="small" sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow style={{ backgroundColor: '#041A4D' }}>
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
              {stock?.data?.mutations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, idx) => (
                <TableRow key={item.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row" style={{ width: '10%' }} align="center">
                    {Number(idx) + 1}
                  </TableCell>
                  <TableCell align="center" style={{ width: '45%' }}>
                    {format(new Date(item.date), 'dd MMMM yyyy')}
                  </TableCell>
                  <TableCell align="center" style={{ width: '45%' }}>
                    {item.description}
                  </TableCell>
                  <TableCell align="center" style={{ width: '45%' }}>
                    {numberFormatterInRupiah.format(item.price)}
                  </TableCell>
                  <TableCell align="center" style={{ width: '45%' }}>
                    <Paper style={{ color: item.ket === 'Pemasukan' ? 'green' : 'red' }}>
                      {item.ket === 'Pemasukan'
                        ? numberFormatter.format(item.quantity)
                        : `-${numberFormatter.format(item.quantity)}`}
                    </Paper>
                  </TableCell>
                  <TableCell align="center" style={{ width: '45%' }}>
                    {item.ket}
                  </TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 52.5 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
        <div style={{ display: 'flex', padding: '0.5rem 1rem', border: '1px solid #E5E8EC', borderRadius: 5 }}>
          <Typography variant="body1">Saldo Akhir :</Typography>
          <Typography variant="body1" style={{ marginLeft: '2rem', fontWeight: 'bold' }}>
            {numberFormatter.format(stock?.latestStock)}
          </Typography>
        </div>
      </div>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        labelRowsPerPage={null}
        count={stock?.data?.mutations.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
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
      <Popper
        id={popperId}
        open={open}
        anchorEl={anchorEl}
        placement="bottom-end"
        style={{ backgroundColor: '#fff', borderRadius: 5, padding: '1rem', border: '1px solid #E5E8EC' }}
      >
        <Grid container spacing={1} sx={{ width: { xs: '10rem', md: '20rem' } }}>
          <Grid item xs={12} md={5} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
          <Grid item xs={12} md={5} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
          <Grid item xs={12} md={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <IconButton color="primary" aria-label="upload picture" onClick={handleReset}>
              <Cached />
            </IconButton>
          </Grid>
        </Grid>
      </Popper>
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
