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

const IC_Completed_Re_AsignedInvestor = () => {
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
                Re-Assigned By
              </StyledTableHeaderCell>
              <StyledTableHeaderCell color="#000000A6">
                Re-Assigned Date
              </StyledTableHeaderCell>
              <StyledTableHeaderCell color="#000000A6">
                From Investigator
              </StyledTableHeaderCell>
              <StyledTableHeaderCell color="#000000A6">
                To Investigator
              </StyledTableHeaderCell>
              <StyledTableHeaderCell color="#000000A6">
                Remarks
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

export default IC_Completed_Re_AsignedInvestor;
