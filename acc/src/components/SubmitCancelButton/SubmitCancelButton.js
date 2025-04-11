import { Button } from '@mui/material';
import React from 'react';
import { StyledTypography } from '../../utils/StyledComponents';
import DoneIcon from '../../assets/Icons/DoneIcon.png';
import DoNotDisturbAltIcon from '../../assets/Icons/DoNotDisturbIcon.png';

export default function SubmitCancel({ onCancel }) {
  return (
    <>
      <Button
        type="submit" // Add this to make it a submit button
        variant="contained"
        sx={{
          color: '#0083C0',
          boxShadow: '0px 4px 4px 0px #00000040;',
          '&:hover': {
            transform: 'scale(1.05) !important',
            transition: 'transform 0.3s ease !important',
          },
        }}
        startIcon={
          <img
            src={DoneIcon}
            style={{
              marginBottom: '1px',
              color: '#FFFFFF',
            }}
          />
        }
      >
        <StyledTypography textTransform="none" marginTop="1px" color="#FFFFFF">
          Submit
        </StyledTypography>
      </Button>
      <Button
        variant="outlined"
        onClick={onCancel}
        sx={{
          boxShadow: '0px 4px 4px 0px #00000040',
          '&:hover': {
            transform: 'scale(1.05) !important',
            transition: 'transform 0.3s ease !important',
          },
        }}
        startIcon={
          <img
            src={DoNotDisturbAltIcon}
            style={{
              marginBottom: '1px',
            }}
          />
        }
      >
        <StyledTypography textTransform="none" marginTop="1px">
          Cancel
        </StyledTypography>
      </Button>
    </>
  );
}
