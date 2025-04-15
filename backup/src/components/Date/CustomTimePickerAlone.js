import React from 'react';
import { TextField } from '@mui/material';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const CustomTimePickerAlone = ({ value = null, onChange, ...props }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <TimePicker
        ampm={false} // Ensures 24-hour format
        value={value || null}
        onChange={onChange}
        sx={{width:"100%"}}
        renderInput={(params) => (
          <TextField
            {...params}
            sx={{
              height: 32,
              width: '100%',
              '& .MuiInputBase-root': {
                height: '32px',
                borderRadius: '4px',
              },
              '& .MuiInputBase-input': {
                padding: '7px 8px',
                fontSize: '12px',
              },
              "& .MuiInputBase-input.Mui-disabled": {
                opacity: "1 !important",
                color: "black !important",
                fontSize: "14px !important",
                fontWeight: "bold !important",
                "-webkit-text-fill-color": "black !important",   // Forces black text in Chrome/Safari
              },
            }}
          />
        )}
        {...props}
      />
    </LocalizationProvider>
  );
};

export default CustomTimePickerAlone;
