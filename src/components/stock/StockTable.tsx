import * as React from 'react';
import { FilterTiltShift, ListAltOutlined, Replay } from '@mui/icons-material';
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
  TableFooter,
  IconButton,
  Avatar,
  CardHeader,
  Typography,
  Grid,
  TextField,
} from '@mui/material';
import axios from 'axios';
import { add } from 'date-fns';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import Loading from '@src/components/Loading';

const numberFormatterInRupiah = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' });
const numberFormatter = new Intl.NumberFormat();

const Table = dynamic(() => import('@mui/material/Table'), { ssr: false });

const StockTable = () => {
  const [page, setPage] = React.useState(2);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const router = useRouter();
  const [product, setProduct] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [endDate, setEndDate] = React.useState<Date | null>(null);

  const handleChangePage = (_event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const detailHandler = (id) => {
    router.push(`stock/${id}`);
  };

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
  };

  React.useEffect(() => {
    async function getStock() {
      try {
        if (startDate === null || endDate === null) {
          setLoading(true);
          const { data } = await axios.get(`/api/reports/products`);
          setProduct(data);
          setLoading(false);
        } else {
          setLoading(true);
          const customStart = new Date(startDate.setHours(0, 0, 0, 0));
          const customEnd = add(new Date(endDate).setHours(0, 0, 0, 0), {
            days: 1,
          });
          const { data } = await axios.get(`/api/reports/products/${customStart}/${customEnd}`);
          setProduct(data);
          setLoading(false);
        }
      } catch (err) {
        throw new Error(err);
      }
    }
    getStock();
  }, [startDate, endDate]);

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
          <Avatar aria-label="recipe" style={{ backgroundColor: '#9500ae' }}>
            <FilterTiltShift style={{ color: 'white' }} />
          </Avatar>
        }
        title="Barang Persediaan"
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
        style={{ marginBottom: '2rem', border: '1px solid #E5E8EC', borderRadius: 5, overflow: 'auto' }}
      >
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow style={{ backgroundColor: '#aa33be' }}>
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
              <TableCell align="right" style={{ color: '#fff' }}>
                Detail
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {product.products?.map((p, idx) => (
              <TableRow key={p.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row" align="center">
                  {Number(idx) + 1}
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
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ display: 'flex', padding: '0.5rem 1rem', border: '1px solid #E5E8EC', borderRadius: 5 }}>
          <Typography variant="h6">Total Nilai Persediaan :</Typography>
          <Typography variant="h6" style={{ marginLeft: '2rem' }}>
            {numberFormatterInRupiah.format(product.totalValue)}
          </Typography>
        </div>
      </div>
    </Paper>
  );
};

export default StockTable;
