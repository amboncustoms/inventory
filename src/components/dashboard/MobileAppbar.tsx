import React from 'react';
import { LocalizationProvider, DatePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { AppBar, TextField } from '@mui/material';

const MobileAppbar = ({ selectedDate, setSelectedDate }) => {
  return (
    <AppBar
      position="fixed"
      style={{
        padding: '0.8rem 1rem',
        backgroundColor: 'white',
        borderBottom: '1px solid #00000020',
      }}
      elevation={0}
    >
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            views={['year']}
            label="Tahun"
            value={selectedDate}
            onChange={(newValue) => {
              setSelectedDate(newValue);
            }}
            renderInput={(params) => <TextField {...params} helperText={null} size="small" style={{ width: '8rem' }} />}
          />
        </LocalizationProvider>
      </div>
    </AppBar>
  );
};

export default MobileAppbar;
