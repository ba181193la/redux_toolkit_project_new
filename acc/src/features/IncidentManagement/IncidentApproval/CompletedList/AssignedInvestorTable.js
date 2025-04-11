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
import { useTranslation } from 'react-i18next';

const StyledTableHead = styled(TableHead)`
  th {
    background-color: ${(props) =>
      props.backgroundColor || '#0083c0'} !important;
  }
`;

const AssignedInvestorTable = () => {


  const { i18n, t } = useTranslation();


  return (
    <FlexContainer flexDirection="column" width="100%" margin="0 0 10px 0">
      <TableContainer component={Paper}>
        <Table>
          <StyledTableHead backgroundColor="#406883">
            <StyledTableRow>
              <StyledTableHeaderCell color="#000000A6">
                S.No
              </StyledTableHeaderCell>
              <StyledTableHeaderCell color="#000000A6">
                Employee Name
              </StyledTableHeaderCell>
              <StyledTableHeaderCell color="#000000A6">
                Department / Speciality
              </StyledTableHeaderCell>
              <StyledTableHeaderCell color="#000000A6">
                Designation
              </StyledTableHeaderCell>
              <StyledTableHeaderCell color="#000000A6">
                Comments
              </StyledTableHeaderCell>
              <StyledTableHeaderCell color="#000000A6">
                Assigned By
              </StyledTableHeaderCell>
              <StyledTableHeaderCell color="#000000A6">
                Assigned On
              </StyledTableHeaderCell>
            </StyledTableRow>
          </StyledTableHead>
          <TableBody>
            <StyledTableRow>
              <StyledTableBodyCell>{t('NoDataAvailable')}</StyledTableBodyCell>
            </StyledTableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </FlexContainer>
  );
};

export default AssignedInvestorTable;
