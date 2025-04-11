import React, { useState } from 'react';
import { Table, TableBody, TableContainer, Paper } from '@mui/material';
import {
  StyledTableBodyCell,
  StyledTableHeaderCell,
  StyledTableRow,
  StyledTableHead,
} from '../../../../../utils/DataTable.styled';
import { FlexContainer } from '../../../../../utils/StyledComponents';

const FurtherActionTable = () => {
  return (
    <FlexContainer flexDirection="column" width="100%">
      <TableContainer component={Paper}>
        <Table>
          <StyledTableHead backgroundColor="#BE86FF73">
            <StyledTableRow>
              <StyledTableHeaderCell color="#000000A6">
                S.No
              </StyledTableHeaderCell>
              <StyledTableHeaderCell color="#000000A6">
              Task Assigned	
              </StyledTableHeaderCell>
              <StyledTableHeaderCell color="#000000A6">
              Responsible Staff	
              </StyledTableHeaderCell>
              <StyledTableHeaderCell color="#000000A6">
              Department/Speciality	
              </StyledTableHeaderCell>
              <StyledTableHeaderCell color="#000000A6">
              Target Date	
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

export default FurtherActionTable;
