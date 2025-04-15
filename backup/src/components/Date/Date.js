import React from 'react';
import { TextField } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
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

  const handleDateChange = (selectedDate) => {
    if (onChange && selectedDate) {
      const utcDate = new Date(
        Date.UTC(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
          selectedDate.getHours(),
          selectedDate.getMinutes(),
          selectedDate.getSeconds()
        )
      );
      onChange(utcDate.toISOString()); 
    } else {
      onChange(null); 
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        slots={{
          openPickerIcon: CustomCalendarIcon,
        }}
        value={value ? new Date(value) : null} 
        onChange={handleDateChange} 
        format="dd/MM/yyyy"
        maxDate={new Date()}
        sx={{
          width: '100%',
          '& .MuiInputBase-root': {
            height: '32px',
            borderRadius: '4px',
            width: '100%',
          },
          '& .MuiInputBase-input': {
            padding: '4px 8px',
            fontSize: '12px',
          },
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
