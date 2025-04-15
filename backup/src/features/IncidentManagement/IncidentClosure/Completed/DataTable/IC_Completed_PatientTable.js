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

const IC_Completed_PatientTable = () => {
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
                Patient Id
              </StyledTableHeaderCell>
              <StyledTableHeaderCell color="#000000A6">
                Patient Name
              </StyledTableHeaderCell>
              <StyledTableHeaderCell color="#000000A6">
                Age
              </StyledTableHeaderCell>
              <StyledTableHeaderCell color="#000000A6">
                Gender
              </StyledTableHeaderCell>
              <StyledTableHeaderCell color="#000000A6">
                Department / Unit
              </StyledTableHeaderCell>
              <StyledTableHeaderCell color="#000000A6">
                Room No / Details
              </StyledTableHeaderCell>
              <StyledTableHeaderCell color="#000000A6">
                Physician Name
              </StyledTableHeaderCell>
              <StyledTableHeaderCell color="#000000A6">
                Speciality
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

export default IC_Completed_PatientTable;
