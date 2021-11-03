import React, { useEffect, useState } from 'react';
import {
  AddBox,
  Block,
  FilterTiltShift,
  IndeterminateCheckBox,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  CardHeader,
  Collapse,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import Loading from '@src/components/Loading';
import GeneralModal from '@src/components/modal/GeneralModal';

function setLocalStorage(key, value) {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
}

// eslint-disable-next-line consistent-return
function getLocalStorage(key, initialValue) {
  try {
    if (typeof window !== 'undefined') {
      const value = window.localStorage.getItem(key);
      return value ? JSON.parse(value) : initialValue;
    }
    return initialValue;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
}
// eslint-disable-next-line consistent-return
function deleteLocalStorage(key: string) {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(key);
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
}

function renderAdjusment(props) {
  const { incartsUpdate, setIncartsUpdate, id, productQuantity, incart, setProductQuantity, quantity } = props;
  const increase = () => {
    if (productQuantity > quantity) {
      setProductQuantity(quantity);
    } else {
      setProductQuantity((prev) => prev + 1);
    }
  };
  const decrease = () => {
    if (productQuantity <= 1) {
      setProductQuantity(1);
    } else {
      setProductQuantity((prev) => prev - 1);
    }
  };

  useEffect(() => {
    const updated = incartsUpdate?.map((c) => (c.id === id ? { ...c, productIncart: productQuantity } : c));
    setIncartsUpdate(updated);
  }, [productQuantity]);
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
      }}
    >
      <IconButton onClick={decrease}>
        <IndeterminateCheckBox />
      </IconButton>
      <Typography variant="body2" style={{ margin: '0 .5rem' }}>
        {incart}
      </Typography>
      <IconButton onClick={increase} disabled={quantity - productQuantity === 0}>
        {quantity - productQuantity === 0 ? <Block /> : <AddBox />}
      </IconButton>
    </div>
  );
}

function Row(props) {
  const { incartsUpdate, incart: baseIncart, idx, setIncartsUpdate } = props;
  const {
    id,
    productId,
    productName,
    productCategory,
    productIncart: incart,
    productQuantity: quantity,
    productCode,
  } = baseIncart;
  const [open, setOpen] = useState(false);
  const [productQuantity, setProductQuantity] = useState(incart);
  const [product, setProduct] = useState(null);
  const handleClick = async (myId) => {
    try {
      const { data } = await axios.get(`/api/products/id/${myId}`);
      setProduct(data);
      setOpen(!open);
    } catch (err) {
      throw new Error(err);
    }
  };

  const adjustmentProps = {
    incartsUpdate,
    setIncartsUpdate,
    id,
    incart,
    productQuantity,
    setProductQuantity,
    quantity,
  };

  return (
    <>
      <TableRow sx={{ '& > *': { border: 'unset' } }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => handleClick(productId)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" align="center">
          {idx + 1}
        </TableCell>
        <TableCell align="center">{productCode}</TableCell>
        <TableCell align="center">{productCategory}</TableCell>
        <TableCell align="center">{productName}</TableCell>
        <TableCell align="center">{renderAdjusment(adjustmentProps)}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: '1rem 1rem 2rem 1rem' }}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Kode Barang</TableCell>
                    <TableCell align="center">Nama Barang</TableCell>
                    <TableCell align="center">Harga Satuan</TableCell>
                    <TableCell align="center">Jumlah Stok</TableCell>
                    <TableCell align="center" style={{ maxWidth: '15rem' }}>
                      Keterangan
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row" align="center">
                      {product?.code}
                    </TableCell>
                    <TableCell align="center">{product?.name}</TableCell>
                    <TableCell align="center">{product?.price}</TableCell>
                    <TableCell align="center">{product?.latestQuantity}</TableCell>
                    <TableCell align="center">{product?.productDesc}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function CollapsibleTable({ userId, setOpen, notifId }) {
  const [loading, setLoading] = useState(true);
  const [incartsUpdate, setIncartsUpdate] = useState(() => getLocalStorage('incarts', []));
  const queryClient = useQueryClient();

  const [openModalAuth, setOpenModalAuth] = useState(false);
  const [openModalConfirm, setOpenModalConfirm] = useState(false);

  const updateIncartsMutation = useMutation(
    (data: any) => {
      return axios.patch('/api/incarts', data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('incart');
      },
    }
  );

  const updateNotifMutation = useMutation(
    (id) => {
      return axios.patch(`/api/notifs/stockout/approval/${id}`, { status: 'APPROVED' });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('notifs');
      },
    }
  );

  const modalHandler = async () => {
    setOpenModalConfirm(true);
  };

  const handleApprove = async () => {
    try {
      updateIncartsMutation.mutate({ incarts: incartsUpdate });
      updateNotifMutation.mutate(notifId);
    } catch (err) {
      throw new Error(err);
    } finally {
      setIncartsUpdate([]);
      deleteLocalStorage('incarts');
      setOpen(false);
    }
  };

  useEffect(() => {
    if (!userId) {
      setLoading(true);
      return;
    }
    const setIncart = async () => {
      const { data: incarts } = await axios.get(`/api/incarts/${userId}`);
      setIncartsUpdate((prev) => (prev.length !== 0 ? prev : incarts?.products));
      setLoading(false);
    };
    setIncart();
  }, [userId]);

  useEffect(() => {
    setLocalStorage('incarts', incartsUpdate);
  }, [incartsUpdate]);

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
        title="Detail Permohonan Barang"
        subheader="Radar"
      />
      <Paper
        style={{
          borderRadius: 10,
          border: '1px solid #E5E8EC',
          margin: '2rem 0',
        }}
        elevation={0}
      >
        <TableContainer component="div" style={{ borderRadius: 10 }}>
          <Table aria-label="collapsible table" size="small">
            <TableHead>
              <TableRow style={{ backgroundColor: '#aa33be' }}>
                <TableCell />
                <TableCell align="center" style={{ color: '#fff' }}>
                  No
                </TableCell>
                <TableCell align="center" style={{ color: '#fff' }}>
                  Kode Barang
                </TableCell>
                <TableCell align="center" style={{ color: '#fff' }}>
                  Kategori
                </TableCell>
                <TableCell align="center" style={{ color: '#fff' }}>
                  Nama Barang
                </TableCell>
                <TableCell align="center" style={{ color: '#fff' }}>
                  Jumlah
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {incartsUpdate?.length !== 0 &&
                incartsUpdate?.map((item, index) => (
                  <Row
                    key={item.id}
                    incart={item}
                    idx={index}
                    setIncartsUpdate={setIncartsUpdate}
                    incartsUpdate={incartsUpdate}
                  />
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button size="small" color="secondary" variant="contained" onClick={() => setOpen(false)}>
          Reject
        </Button>
        <Button size="small" color="primary" variant="contained" style={{ marginLeft: '1rem' }} onClick={modalHandler}>
          Aprrove
        </Button>
      </div>
      <GeneralModal
        open={openModalAuth}
        setOpen={setOpenModalAuth}
        text="Sesi Anda telah berakhir, mohon untuk login kembali."
        type="auth"
      />
      <GeneralModal
        handler={handleApprove}
        open={openModalConfirm}
        setOpen={setOpenModalConfirm}
        text="Apakah anda yakin?."
        type="confirm"
      />
    </Paper>
  );
}
