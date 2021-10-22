import * as React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableFooter,
} from '@mui/material';

function createData(id: number, name: string, calories: number, fat: number, carbs: number, protein: number) {
  return { id, name, calories, fat, carbs, protein };
}

const rows = [
  createData(1, 'Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData(2, 'Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData(3, 'Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData(4, 'Eclair', 262, 16.0, 24, 6.0),
  createData(5, 'Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData(6, 'Cupcake', 305, 3.7, 67, 4.3),
  createData(7, 'Eclair', 262, 16.0, 24, 6.0),
  createData(8, 'Gingerbread', 356, 16.0, 49, 3.9),
  createData(9, 'Cupcake', 305, 3.7, 67, 4.3),
  createData(10, 'Gingerbread', 356, 16.0, 49, 3.9),
];

const StockTable = () => {
  const [page, setPage] = React.useState(2);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Kategori</TableCell>
            <TableCell align="center">Kode Barang</TableCell>
            <TableCell align="center">Nama Barang</TableCell>
            <TableCell align="right">Stok</TableCell>
            <TableCell align="right">Harga</TableCell>
            <TableCell align="right">Nilai</TableCell>
            <TableCell align="right">Detail</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row" align="center">
                {row.id}
              </TableCell>
              <TableCell align="center">{row.calories}</TableCell>
              <TableCell align="center">{row.fat}</TableCell>
              <TableCell align="center">{row.carbs}</TableCell>
              <TableCell align="right">{row.protein}</TableCell>
              <TableCell align="right">{row.protein}</TableCell>
              <TableCell align="right">{row.protein}</TableCell>
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
  );
};

export default StockTable;
