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
} from '../../../../utils/DataTable.styled';
import { FlexContainer } from '../../../../utils/StyledComponents';
import styled from 'styled-components';

const StyledTableHead = styled(TableHead)`
  th {
    background-color: ${(props) =>
      props.backgroundColor || '#0083c0'} !important;
  }
`;

const PatientTable = () => {
  return (
    <FlexContainer flexDirection="column" width="100%" margin="0 0 10px 0">
      <TableContainer component={Paper}>
        <Table>
          <StyledTableHead backgroundColor="#3498db">
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
              <StyledTableHeaderCell color="#000000A6">
              Diagnosis
              </StyledTableHeaderCell>
              <StyledTableHeaderCell color="#000000A6">
              Visit Id
              </StyledTableHeaderCell>
              <StyledTableHeaderCell color="#000000A6">
              Physician Notified
              </StyledTableHeaderCell>
              <StyledTableHeaderCell color="#000000A6">
              Notified Physician
              </StyledTableHeaderCell>
              <StyledTableHeaderCell color="#000000A6">
              Speciality
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

export default PatientTable;
