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
  Card,
  CardContent,
  Box,
} from '@mui/material';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { add, format } from 'date-fns';
import { verify } from 'jsonwebtoken';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Loading from '@src/components/Loading';
import { useAuthState } from '@src/contexts/auth';
import { Properties } from '@src/utils/types';

const numberFormatterInRupiah = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' });
const numberFormatter = new Intl.NumberFormat();

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

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MUIAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const Detail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [startDate, setStartDate] = React.useState(null);
  const [endDate, setEndDate] = React.useState(null);
  const [errors, setErrors] = useState(null);
  const [openSnack, setOpenSnack] = useState(false);
  const { authenticated } = useAuthState();
  const [imageUrl, setImageUrl] = useState('');
  const [imageColor, setImageColor] = useState('');

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
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - stock?.data?.mutations?.length) : 0;

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

  useEffect(() => {
    setImageUrl(getProperties(stock?.data?.category).image);
    setImageColor(getProperties(stock?.data?.category).color);
  }, [stock]);

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
      <Grid container style={{ margin: '1rem 0 2rem 0' }}>
        {loading || stock?.length === 0 ? (
          <Grid item xs={12} md={5} lg={4} xl={3} style={{ height: '100%' }} />
        ) : (
          <Grid item xs={12} md={5} lg={4} xl={3} sx={{ marginBottom: { xs: '2rem', md: 0 } }}>
            <Box sx={{ paddingRight: { md: '2rem', height: '100%' } }}>
              <Card
                sx={{
                  height: '100%',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  bgcolor: imageColor !== '' && imageColor,
                }}
              >
                <svg
                  viewBox="0 0 375 283"
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
                  <rect
                    x="159.52"
                    y="175"
                    width="152"
                    height="152"
                    rx="8"
                    transform="rotate(-45 159.52 175)"
                    fill="white"
                  />
                  <rect y="107.48" width="152" height="152" rx="8" transform="rotate(-45 0 107.48)" fill="white" />
                </svg>
                <CardContent>
                  <div
                    style={{
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
                        marginBottom: '-1rem',
                        marginLeft: '2.3rem',
                        background: 'radial-gradient(black, transparent 60%)',
                        transform: 'rotate3d(0,0,1, 20dg) scale3d(1, 0.6, 1)',
                        opacity: '0.2',
                      }}
                    />
                    <Image width={500} height={500} src={imageUrl !== '' && imageUrl} alt="" />
                  </div>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        )}
        <Grid item xs={12} md={7} lg={8} xl={9}>
          <TableContainer
            component="div"
            style={{ border: '1px solid #E5E8EC', borderRadius: 5, overflow: 'auto', height: '100%' }}
          >
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
        </Grid>
      </Grid>
      {stock?.data?.mutations?.length === 0 ? (
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
      ) : loading || stock?.length === 0 ? (
        <Loading />
      ) : (
        <TableContainer component="div" style={{ border: '1px solid #E5E8EC', borderRadius: 5, overflow: 'auto' }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
                    {rowsPerPage * page + idx + 1}
                  </TableCell>
                  <TableCell align="center" style={{ width: '45%' }}>
                    {format(new Date(item.date), 'dd MMMM yyyy')}
                  </TableCell>
                  <TableCell align="center" style={{ width: '45%' }}>
                    {item.description ? item.description : '-'}
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
        labelRowsPerPage=""
        count={stock?.data?.mutations?.length}
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
