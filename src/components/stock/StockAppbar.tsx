import React from 'react';
import { Search } from '@mui/icons-material';
import { AppBar, Paper, InputBase, IconButton } from '@mui/material';

const StockAppbar = () => {
  return (
    <AppBar
      position="fixed"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '0.8rem 1rem',
        backgroundColor: 'white',
        borderBottom: '1px solid #00000020',
      }}
      elevation={0}
    >
      <Paper
        component="form"
        sx={{ padding: '2px 4px', display: 'flex', alignItems: 'center', width: '17rem', height: 40 }}
        elevation={0}
      >
        <InputBase sx={{ marginLeft: '1rem', flex: 1 }} placeholder="Cari..." />
        <IconButton type="submit" sx={{ padding: 10 }} aria-label="search">
          <Search />
        </IconButton>
      </Paper>
    </AppBar>
  );
};

export default StockAppbar;
