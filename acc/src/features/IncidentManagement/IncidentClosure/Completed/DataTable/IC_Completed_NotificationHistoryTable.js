import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';
import {
  StyledTableBodyCell,
  StyledTableHeaderCell,
  StyledTableRow,
  StyledTableHead,
} from '../../../../../utils/DataTable.styled';
import { FlexContainer } from '../../../../../utils/StyledComponents';

const IC_Completed_NotificationHistoryTable = () => {
  return (
    <FlexContainer flexDirection="column" width="100%">
      <TableContainer component={Paper}>
        <Table>
          <StyledTableHead backgroundColor="#FFCDF2">
            <StyledTableRow>
              <StyledTableHeaderCell color="#000000A6">
                S.No
              </StyledTableHeaderCell>
              <StyledTableHeaderCell color="#000000A6">
                Task
              </StyledTableHeaderCell>
              <StyledTableHeaderCell color="#000000A6">
                Mail Subject
              </StyledTableHeaderCell>
              <StyledTableHeaderCell color="#000000A6">
                Mail Id
              </StyledTableHeaderCell>
              <StyledTableHeaderCell color="#000000A6">
                User Name
              </StyledTableHeaderCell>
              <StyledTableHeaderCell color="#000000A6">
                Submitted By
              </StyledTableHeaderCell>
              <StyledTableHeaderCell color="#000000A6">
                Sent Date & Time
              </StyledTableHeaderCell>
              <StyledTableHeaderCell color="#000000A6">
                Remarks
              </StyledTableHeaderCell>
              <StyledTableHeaderCell color="#000000A6">
                Action
              </StyledTableHeaderCell>
            </StyledTableRow>
          </StyledTableHead>
          <TableBody>
            <StyledTableRow>
              <StyledTableBodyCell>No data Found</StyledTableBodyCell>
            </StyledTableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </FlexContainer>
  );
};

export default IC_Completed_NotificationHistoryTable;
