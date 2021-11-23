import React, { useEffect, useState, useContext } from 'react';
import {
  AddBox,
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
import { CartNotifContext } from '@src/contexts/cartnotif';
import { RevalidateContext } from '@src/contexts/revalidation';

function renderAdjusment(props) {
  const { cartNotifUpdate, setNewCart } = useContext(CartNotifContext);
  const { latestQuantity, id, productQuantity, setProductQuantity } = props;
  const increase = () => {
    if (productQuantity >= latestQuantity) {
      setProductQuantity(productQuantity);
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
    const updated = cartNotifUpdate?.map((c) => (c.id === id ? { ...c, productQuantity } : c));
    setNewCart(updated);
  }, [productQuantity]);
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
      }}
    >
      <IconButton onClick={decrease} disabled={productQuantity <= 0}>
        <IndeterminateCheckBox />
      </IconButton>
      <Typography variant="body2" style={{ margin: '0 .5rem' }}>
        {productQuantity}
      </Typography>
      <IconButton onClick={increase}>
        <AddBox />
      </IconButton>
    </div>
  );
}

function Row(props) {
  const { item, idx } = props;
  const { id, productId, productCode, productName, productCategory, productQuantity: productIncart } = item;
  const [open, setOpen] = useState(false);
  const [productQuantity, setProductQuantity] = useState(productIncart);
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
    id,
    latestQuantity: product?.latestQuantity,
    setProductQuantity,
    productQuantity,
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
            <Box sx={{ margin: '2rem' }}>
              <Table aria-label="purchases" style={{ border: '1px solid #E5E8EC' }}>
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
  const { cartNotifUpdate, setCartToEmpty, setCartNotifUpdate } = useContext(CartNotifContext);
  const queryClient = useQueryClient();
  const { setRevalidateStock } = useContext(RevalidateContext);

  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const [openModalReject, setOpenModalReject] = useState(false);

  const updateNotifMutation = useMutation(
    (value: any) => {
      return axios.post(`/api/notifs/stockin/approval/${value.id}`, { value: value.notifCart });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('notifs');
        setRevalidateStock(true);
      },
    }
  );

  const modalHandler = async () => {
    setOpenModalConfirm(true);
  };

  const handleApprove = async () => {
    const notifCart = cartNotifUpdate.map((c) => {
      return { id: c.id, quantity: c.productQuantity };
    });
    try {
      updateNotifMutation.mutate({ id: notifId, notifCart });
    } catch (err) {
      throw new Error(err);
    } finally {
      setCartToEmpty();
      setOpen(false);
    }
  };

  useEffect(() => {
    if (!notifId) {
      setLoading(true);
      return;
    }
    const setIncart = async () => {
      const { data: notifCart } = await axios.get(`/api/notifs/${notifId}`);
      setCartNotifUpdate((prev) => (prev?.length !== 0 ? prev : notifCart));
      setLoading(false);
    };
    setIncart();
  }, [notifId]);

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
            <FilterTiltShift style={{ color: 'white' }} />
          </Avatar>
        }
        title="Detail Pemasukan Barang"
      />
      <Paper
        style={{
          borderRadius: 10,
          border: '1px solid #E5E8EC',
          margin: '1rem 0 2rem 0',
        }}
        elevation={0}
      >
        <TableContainer component="div" style={{ borderRadius: 10 }}>
          <Table aria-label="collapsible table" size="small">
            <TableHead>
              <TableRow style={{ backgroundColor: '#041A4D' }}>
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
              {cartNotifUpdate?.length !== 0 &&
                cartNotifUpdate?.map((item, index) => <Row key={item.id} item={item} idx={index} />)}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button size="small" color="secondary" variant="contained" onClick={() => setOpenModalReject(true)}>
          Reject
        </Button>
        <Button size="small" color="primary" variant="contained" style={{ marginLeft: '1rem' }} onClick={modalHandler}>
          Aprrove
        </Button>
      </div>

      <GeneralModal
        handler={handleApprove}
        open={openModalConfirm}
        setOpen={setOpenModalConfirm}
        text="Apakah anda yakin?."
        type="confirm"
      />
      <GeneralModal
        notifId={notifId}
        userId={userId}
        open={openModalReject}
        setOpen={setOpenModalReject}
        setOpenApprovalPopper={setOpen}
        setCartNotifUpdate={setCartNotifUpdate}
        type="reject"
      />
    </Paper>
  );
}
