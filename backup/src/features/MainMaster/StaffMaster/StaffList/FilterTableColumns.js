import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogTitle,
  ListItemText,
  MenuItem,
  Select,
  InputLabel,
  DialogContent,
  IconButton,
} from '@mui/material';
import { useState } from 'react';
import styled from 'styled-components';
import {
  CommonStyledButton,
  FlexContainer,
  StyledImage,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import DoneIcon from '../../../../assets/Icons/DoneIcon.png';
import DoNotDisturbIcon from '../../../../assets/Icons/DoNotDisturbIcon.png';
import CloseIcon from '../../../../assets/Icons/CloseIcon.png';

const StyledDialog = styled(Dialog)`
  .MuiDialogTitle-root {
    color: #ffffff;
    font-weight: 700;
  }
  .MuiDialogContent-root {
    padding: 24px;
  }
  .MuiDialogActions-root {
    padding: 16px;
  }
`;

const StyledSelect = styled(Select)`
  .MuiSelect-select {
    padding: 8px;
    font-size: 14px;
  }
  .MuiMenuItem-root {
    font-size: 14px;
  }
`;

const StyledCheckbox = styled(Checkbox)`
  &.MuiCheckbox-root {
    padding: 4px;
  }
`;

const StyledDialogContent = styled(DialogContent)`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export default function ColumnFilterModal({
  open,
  onClose,
  selectedColumns,
  onSelectColumns,
}) {
  const [localSelectedColumns, setLocalSelectedColumns] =
    useState(selectedColumns);

  const handleChange = (event) => {
    setLocalSelectedColumns(event.target.value);
  };

  const handleApply = () => {
    onSelectColumns(localSelectedColumns);
    onClose();
  };

  const columns = [
    'Staff Name',
    'Employee ID',
    'Primary Designation',
    'Secondary Designation',
    'Employment Type',
    'Email ID',
    'Date of Hire',
    'Status',
  ];

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
        },
      }}
    >
      <Box sx={{ width: 430 }}>
        <DialogTitle
          sx={{
            backgroundColor: '#205475',
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            height: 40,
            alignItems: 'center',
            padding: '0 8px',
          }}
        >
          <StyledTypography
            fontSize="18px"
            fontWeight="300"
            lineHeight="18px"
            padding="0 12px"
            color="#fff"
          >
            Column Filter
          </StyledTypography>
          <IconButton
            onClick={onClose}
            sx={{
              color: '#fff',
              '&:hover': {
                transform: 'scale(1.05)',
                transition: 'transform 0.3s ease',
                backgroundColor: 'rgba(15, 108, 189, 0.2)',
              },
            }}
          >
            <StyledImage src={CloseIcon} alt="Close Icon" />
          </IconButton>
        </DialogTitle>
        <StyledDialogContent>
          <StyledTypography
            fontSize="18px"
            fontWeight="300"
            lineHeight="18px"
            padding="12px 0 0px 0"
            color="#000"
          >
            Select Columns
          </StyledTypography>
          <StyledSelect
            multiple
            value={localSelectedColumns}
            onChange={handleChange}
            renderValue={(selected) => selected.join(', ')}
            MenuProps={{
              PaperProps: {
                sx: {
                  maxHeight: 200,
                  overflowY: 'auto',
                },
              },
            }}
          >
            {columns.map((column) => (
              <MenuItem key={column} value={column}>
                <StyledCheckbox
                  checked={localSelectedColumns.indexOf(column) > -1}
                />
                <ListItemText primary={column} width="auto" />
              </MenuItem>
            ))}
          </StyledSelect>

          <FlexContainer
            gap="16px"
            justifyContent="center"
            padding="10px 15px 10px 0px"
          >
            <CommonStyledButton
              type="submit"
              variant="contained"
              text-color="#0083C0"
              startIcon={
                <StyledImage
                  src={DoneIcon}
                  sx={{
                    marginBottom: '1px',
                    color: '#FFFFFF',
                  }}
                />
              }
              onClick={handleApply}
            >
              <StyledTypography marginTop="1px" color="#FFFFFF">
                Apply
              </StyledTypography>
            </CommonStyledButton>
            <CommonStyledButton
              type="button"
              variant="outlined"
              startIcon={<StyledImage src={DoNotDisturbIcon} />}
              onClick={onClose}
            >
              <StyledTypography marginTop="1px">Cancel</StyledTypography>
            </CommonStyledButton>
          </FlexContainer>
        </StyledDialogContent>
      </Box>
    </StyledDialog>
  );
}
