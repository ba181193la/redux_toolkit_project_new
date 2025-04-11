import React from 'react';
import { TextField as MUITextField } from '@mui/material';
import { styled } from 'styled-components';

const StyledTextField = styled(MUITextField)`
  width: 100%;

  & .MuiOutlinedInput-root {
    height: 32px;
    padding: 0px 10px; /* default padding */
    background-color: transparent;

    /* Remove padding when disabled */
    &.Mui-disabled {
      padding: 0px;
    }

    & .MuiInputBase-input {
      height: 32px;
      padding: 0px;
      font-size: 14px;
      line-height: 32px;
      width: 100%;

      &.Mui-disabled {
        background-color: #f2f2f2; /* Full-width gray background */
        width: 100%;
        border-radius: 4px;
      }
    }
  }

  & .MuiInputLabel-root {
    color: #000;
    &.Mui-focused {
      color: #0f6cbd;
    }
  }
`;

export function TextField({ value, onChange, onBlur, width, ...props }) {
  return (
    <StyledTextField
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      autoComplete="off"
      sx={{
        width: width || '100%',
        '& .MuiInputBase-input.Mui-disabled': {
          opacity: 1,
          fontWeight: '400',
          color: 'black',
          WebkitTextFillColor: 'black',
          backgroundColor: '#f2f2f2',
          borderRadius: '4px',
        },
      }}
      {...props}
    />
  );
}
