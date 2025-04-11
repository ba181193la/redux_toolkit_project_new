import { Box, Button, Grid, Typography } from '@mui/material';
import styled from 'styled-components';
import { StyledTypography } from '../../../utils/StyledComponents';

export const SectionHeader = styled(Box)`
  background-color: #da83c3;
  padding: 10px 20px;
  font-weight: bold;
  color: #fff;
`;

export const StyledGridContainer = styled(Grid)`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  padding: 20px;
`;

export const StyledGridItem = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 5px;
`;

export const FormContainer = styled(Box)`
  margin: 20px;
  background-color: #fff;
`;

export const FormLabel = styled(Typography)`
  font-weight: 400 !important;
  color: #0083c0;
`;

export const ActionButton = styled(Button)`
  color: #fff !important;
  border-radius: 6px !important;
  text-transform: none !important;
  box-shadow: 0px 4px 4px 0px #00000040 !important;

  &:hover {
    transform: scale(1.05) !important;
    transition: transform 0.3s ease !important;
  }
`;

export const CancelButton = styled(Button)`
  margin-left: 10px;
  border-color: #007bba;
`;

export const StyledGrid = styled(Grid)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  text-align: left;
`;
export const ReadOnlyText = styled(StyledTypography)`
  font-weight: 500 !important;
  font-size: 14px !important;
`;
