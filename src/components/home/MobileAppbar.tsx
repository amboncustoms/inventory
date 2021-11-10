import React from 'react';
import { Search } from '@mui/icons-material';
import { AppBar, Box, Paper, InputBase, IconButton, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const MobileAppbar = ({ category, handleCategoryFilter, handleSearch, categories }) => {
  return (
    <AppBar
      position="fixed"
      style={{
        padding: '0.8rem 1rem',
        backgroundColor: 'white',
        borderBottom: '1px solid #E5E8EC',
      }}
      elevation={0}
    >
      <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Paper
          component="form"
          sx={{
            padding: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            height: 40,
            borderRadius: 5,
            width: { xs: '12rem', md: '17rem' },
            border: '1px solid #E5E8EC',
            marginBottom: { md: 0 },
          }}
          elevation={0}
        >
          <InputBase style={{ marginLeft: '1rem', flex: 1 }} placeholder="Cari..." onChange={handleSearch} />
          <IconButton style={{ padding: 10 }} aria-label="search">
            <Search />
          </IconButton>
        </Paper>
        <Paper
          component="form"
          style={{
            height: '40px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 0,
            width: '150px',
          }}
          elevation={0}
        >
          <FormControl variant="outlined" style={{ margin: '0', minWidth: 150 }} size="small">
            <InputLabel id="demo-simple-select-outlined-label">Category</InputLabel>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={category}
              onChange={(e) => handleCategoryFilter(e.target.value)}
              style={{ textTransform: 'capitalize' }}
              label="Category"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {categories &&
                categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.title}>
                    {cat.title}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Paper>
      </Box>
    </AppBar>
  );
};

export default MobileAppbar;
