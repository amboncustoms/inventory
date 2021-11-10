import React, { useState } from 'react';
import { Search, Category, PostAdd, Summarize } from '@mui/icons-material';
import { Grid, Paper, InputBase, IconButton, ButtonGroup, Tooltip, Button, Box } from '@mui/material';
import { PrismaClient } from '@prisma/client';
import { verify } from 'jsonwebtoken';
import { GetServerSideProps } from 'next';
import CategoryDialog from '@src/components/stock/dialog/CategoryDialog';
import ProductDialog from '@src/components/stock/dialog/ProductDialog';
import StockDialog from '@src/components/stock/dialog/StockDialog';
import MobileAppbar from '@src/components/stock/MobileAppbar';
import StockTable from '@src/components/stock/StockTable';

const Stock = () => {
  const [openCategory, setOpenCategory] = useState(false);
  const [openProduct, setOpenProduct] = useState(false);
  const [openStock, setOpenStock] = useState(false);
  const [revalidateProduct, setRevalidateProduct] = useState(false);
  const [revalidateStock, setRevalidateStock] = useState(false);
  const [filterFn, setFilterFn] = useState({ fn: (items) => items });

  const handleSearch = (event) => {
    const target = event.target.value;
    setFilterFn({
      fn: (items) => {
        if (target === '') return items;
        return items.filter((i) => i.name.toLowerCase().includes(target));
      },
    });
  };

  const ActionButtons = () => {
    return (
      <ButtonGroup variant="contained" size="small">
        <Tooltip title="Tambah Kategori" placement="top">
          <Button onClick={() => setOpenCategory(true)}>
            <Category />
          </Button>
        </Tooltip>
        <Tooltip title="Tambah Barang" placement="top">
          <Button onClick={() => setOpenProduct(true)}>
            <Summarize />
          </Button>
        </Tooltip>
        <Tooltip title="Tambah Stok" placement="top">
          <Button onClick={() => setOpenStock(true)}>
            <PostAdd />
          </Button>
        </Tooltip>
      </ButtonGroup>
    );
  };
  return (
    <>
      <div style={{ width: '100%' }}>
        <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center' }}>
          <MobileAppbar handleSearch={handleSearch} />
        </Box>
        <Grid container style={{ flexGrow: 1 }} sx={{ display: { xs: 'none', md: 'flex' }, width: '100%' }}>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: 'flex',
              justifyContent: { xs: 'center', md: 'flex-start' },
              margin: { md: '0 0 1.5rem' },
              alignItems: 'center',
            }}
          >
            <Paper
              component="form"
              sx={{
                padding: '2px 4px',
                display: 'flex',
                alignItems: 'center',
                width: { xs: '17rem', md: '25rem' },
                height: 40,
                borderRadius: 20,
                border: '1px solid #E5E8EC',
              }}
              elevation={0}
            >
              <InputBase style={{ marginLeft: '1rem', flex: 1 }} placeholder="Cari..." onChange={handleSearch} />
              <IconButton style={{ padding: 10 }} aria-label="search">
                <Search />
              </IconButton>
            </Paper>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: 'flex',
              justifyContent: { xs: 'center', md: 'flex-end' },
              alignItems: 'center',
              margin: { xs: '1.5rem 0 1.5rem', md: '0 0 1.5rem' },
            }}
          >
            <ActionButtons />
          </Grid>
        </Grid>
        <StockTable
          revalidateProduct={revalidateProduct}
          setRevalidateProduct={setRevalidateProduct}
          revalidateStock={revalidateStock}
          setRevalidateStock={setRevalidateStock}
          filterFn={filterFn}
        />
      </div>
      <CategoryDialog openCategory={openCategory} setOpenCategory={setOpenCategory} />
      <ProductDialog openProduct={openProduct} setOpenProduct={setOpenProduct} setRevalidate={setRevalidateProduct} />
      <StockDialog openStock={openStock} setOpenStock={setOpenStock} setRevalidate={setRevalidateStock} />
    </>
  );
};

export default Stock;

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
