import React from 'react';
import { TextField } from '@mui/material';
import {
  LocalizationProvider,
  DatePicker,
  TimePicker,
  DesktopTimePicker,
  StaticTimePicker,
  MobileTimePicker,
  MobileDateTimePicker,
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import CalendarIcon from '../../assets/images/calendar.png';

const CustomTimePicker = ({ value = null, onChange, ...props }) => {
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
      <MobileDateTimePicker
        // ampm={true}
        ampm={false}
        value={value || ''}
        onChange={onChange}
        defaultValue={null}
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

export default CustomTimePicker;
