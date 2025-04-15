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



const AttachmentTable = () => {


  const { i18n, t } = useTranslation();


  return (
    <FlexContainer flexDirection="column" width="100%" margin="0 0 10px 0">
      <TableContainer component={Paper}>
        <Table>
          <StyledTableHead backgroundColor="#3498db">
            <StyledTableRow>
              <StyledTableHeaderCell color="#000000A6">
                Attachment(s)
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

export default AttachmentTable;
