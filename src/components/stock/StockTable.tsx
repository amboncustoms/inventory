import React, { useState, useEffect, useContext } from 'react';
import { Cached, ViewStream, ListAltOutlined, FilterList } from '@mui/icons-material';
import { LocalizationProvider, DatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import {
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Avatar,
  CardHeader,
  Typography,
  Grid,
  TextField,
  AlertProps,
  Snackbar,
  Alert as MUIAlert,
} from '@mui/material';
import axios from 'axios';
import { add } from 'date-fns';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useAuthState } from '@src/contexts/auth';
import { RevalidateContext } from '@src/contexts/revalidation';

const numberFormatterInRupiah = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' });
const numberFormatter = new Intl.NumberFormat();

const Table = dynamic(() => import('@mui/material/Table'), { ssr: false });
const Loading = dynamic(() => import('@src/components/Loading'));
const Popper = dynamic(() => import('@mui/material/Popper'));

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MUIAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const StockTable = ({ filterFn }) => {
  const { revalidateProduct, setRevalidateProduct, revalidateStock, setRevalidateStock } =
    useContext(RevalidateContext);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [errors, setErrors] = useState(null);
  const [openSnack, setOpenSnack] = useState(false);
  const { authenticated } = useAuthState();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'filter-popper' : undefined;

  const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const detailHandler = (stockId: any) => {
    router.push(`stock/${stockId}`);
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - product?.products?.length) : 0;

  async function getStock() {
    try {
      if (startDate === null || endDate === null) {
        const { data } = await axios.get(`/api/reports/products`);
        setProduct(data);
        setLoading(false);
      } else {
        const customStart = new Date(startDate.setHours(0, 0, 0, 0));
        const customEnd = add(new Date(endDate).setHours(0, 0, 0, 0), {
          days: 1,
        });
        const { data } = await axios.get(`/api/reports/products/${customStart}/${customEnd}`);
        setProduct(data);
        setLoading(false);
      }
    } catch (error) {
      if (authenticated) {
        setErrors(error.response.data);
      }
      router.push('/login');
    }
  }

  useEffect(() => {
    getStock();
    return () => {
      setRevalidateProduct(false);
      setRevalidateStock(false);
    };
  }, [startDate, endDate, revalidateProduct, revalidateStock, authenticated]);

  return loading ? (
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
          <Avatar aria-label="recipe" style={{ backgroundColor: '#041A4D' }}>
            <ViewStream style={{ color: 'white' }} />
          </Avatar>
        }
        title="Barang Persediaan"
        action={
          <IconButton onClick={handleClick}>
            <FilterList color="primary" />
          </IconButton>
        }
      />
      <TableContainer
        component="div"
        style={{ marginBottom: '1rem', border: '1px solid #E5E8EC', borderRadius: 5, overflow: 'auto' }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="a dense table" size="small">
          <TableHead>
            <TableRow style={{ backgroundColor: '#041A4D' }}>
              <TableCell align="center" style={{ color: '#fff' }}>
                Nomor
              </TableCell>
              <TableCell align="center" style={{ color: '#fff' }}>
                Kategori
              </TableCell>
              <TableCell align="center" style={{ color: '#fff' }}>
                Kode Barang
              </TableCell>
              <TableCell align="center" style={{ color: '#fff' }}>
                Nama Barang
              </TableCell>
              <TableCell align="center" style={{ color: '#fff' }}>
                Stok
              </TableCell>
              <TableCell align="right" style={{ color: '#fff' }}>
                Harga
              </TableCell>
              <TableCell align="right" style={{ color: '#fff' }}>
                Nilai
              </TableCell>
              <TableCell align="center" style={{ color: '#fff' }}>
                Detail
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {product?.products?.length !== 0 &&
              filterFn
                .fn(product.products)
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((p, idx) => (
                  <TableRow key={p.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component="th" scope="row" align="center">
                      {rowsPerPage * page + idx + 1}
                    </TableCell>
                    <TableCell align="center" style={{ textTransform: 'capitalize' }}>
                      {p.category}
                    </TableCell>
                    <TableCell align="center">{p.code}</TableCell>
                    <TableCell align="center" style={{ textTransform: 'capitalize' }}>
                      {p.name}
                    </TableCell>
                    <TableCell align="center">{numberFormatter.format(p.latestQuantity)}</TableCell>
                    <TableCell align="right">{numberFormatterInRupiah.format(p.price)}</TableCell>
                    <TableCell align="right">{numberFormatterInRupiah.format(p.value)}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => detailHandler(p.id)}>
                        <ListAltOutlined color="primary" />
                      </IconButton>
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
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ display: 'flex', padding: '0.5rem 1rem', border: '1px solid #E5E8EC', borderRadius: 5 }}>
          <Typography variant="body1">Total Nilai :</Typography>
          <Typography variant="body1" style={{ marginLeft: '2rem', fontWeight: 'bold' }}>
            {numberFormatterInRupiah.format(product.totalValue)}
          </Typography>
        </div>
      </div>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        labelRowsPerPage=""
        component="div"
        count={product?.products?.length}
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
        id={id}
        open={open}
        anchorEl={anchorEl}
        placement="top-end"
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

export default StockTable;
