import React from 'react';
import { TextField } from '@mui/material';
import {
  LocalizationProvider,
  DatePicker,
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CalendarIcon from '../../assets/images/calendar.png';

const CustomDatePicker = ({ value = null, onChange, ...props }) => {
  const CustomCalendarIcon = () => (
    <img
      src={CalendarIcon}
      alt="calendar-icon"
      style={{
        width: '14px',
        height: '14px',
        top: '3px',
        left: '3px',
      }}
    />
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        value={value || null}
        onChange={onChange}
        components={{
          OpenPickerIcon: CustomCalendarIcon, // Use your custom calendar icon
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            sx={{
              height: 32,
              width: '100%',
              '& .MuiInputBase-input': {
                padding: '7px 8px',
                fontSize: '12px',
              },
            }}
          />
        )}
        {...props}
      />
    </LocalizationProvider>
  );
};

export default CustomDatePicker;
