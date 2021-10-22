import React from 'react';
import { Queue, Search } from '@mui/icons-material';
import { Button, Grid, Paper, InputBase, IconButton } from '@mui/material';
import StockTable from '@src/components/stock/StockTable';
// import StockAppbar from '@src/components/stock/StockAppbar';

const Stock = () => {
  return (
    <>
      <div style={{ width: '100%' }}>
        {/* <Box sx={{ display: { xs: 'flex', md: 'none' }, justifyContent: 'center' }}>
          <StockAppbar />
          <div
            style={{
              display: 'flex',
              width: '100%',
              margin: '5rem 0 1.5rem',
              justifyContent: 'space-between',
              maxWidth: '17rem',
            }}
          >
            <Button variant="contained" color="primary" startIcon={<Queue />} style={{ marginRight: '1rem' }}>
              Kategori
            </Button>

            <Button variant="contained" color="primary" startIcon={<Queue />}>
              Produk
            </Button>
          </div>
        </Box> */}
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
              }}
              elevation={0}
            >
              <InputBase style={{ marginLeft: '1rem', flex: 1 }} placeholder="Cari..." />
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
            <div
              style={{
                display: 'flex',
                width: '100%',
                justifyContent: 'space-between',
                maxWidth: '17rem',
              }}
            >
              <Button variant="contained" color="primary" startIcon={<Queue />} style={{ marginRight: '1rem' }}>
                Kategori
              </Button>

              <Button variant="contained" color="primary" startIcon={<Queue />}>
                Produk
              </Button>
            </div>
          </Grid>
        </Grid>
        {/* <Modal
          className={classes.modal}
          open={openAddProduct}
          onClose={handleAddProductClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <div>
            <Product
              handleClose={handleAddProductClose}
              revalidate={revalidateProducts}
              setDataToExport={setDataToExport}
            />
          </div>
        </Modal>
        <Modal
          className={classes.modal}
          open={openAddCategory}
          onClose={handleAddCategoryClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <div>
            <Category handleClose={handleAddCategoryClose} revalidate={revalidateProducts} />
          </div>
        </Modal> */}
        <StockTable />
      </div>
    </>
  );
};

export default Stock;
