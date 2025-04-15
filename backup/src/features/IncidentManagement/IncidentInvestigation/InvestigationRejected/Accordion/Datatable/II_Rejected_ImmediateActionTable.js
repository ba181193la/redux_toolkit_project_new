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
} from '../../../../../../utils/DataTable.styled';
import { FlexContainer } from '../../../../../../utils/StyledComponents';

const II_Rejected_ImmediateActionTable = () => {
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
              Immediate Action Taken	
              </StyledTableHeaderCell>
              <StyledTableHeaderCell color="#000000A6">
              Responsible Staff
              </StyledTableHeaderCell>
              <StyledTableHeaderCell color="#000000A6">
              Department / Speciality
              </StyledTableHeaderCell>
              <StyledTableHeaderCell color="#000000A6">
              Designation
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

export default II_Rejected_ImmediateActionTable;
