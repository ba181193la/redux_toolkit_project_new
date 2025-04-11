import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  Button,
} from '@mui/material';
import {
  StyledTableBodyCell,
  StyledTableHeaderCell,
  StyledTableRow,
} from '../../../../utils/DataTable.styled';
import { FlexContainer } from '../../../../utils/StyledComponents';
import styled from 'styled-components';
import { getlabel } from '../../../../utils/language'; 
import { useTranslation } from 'react-i18next';

const StyledTableHead = styled(TableHead)`
  th {
    background-color: ${(props) =>
      props.backgroundColor || '#0083c0'} !important;
  }
       .hdQAcd
  {
      color: #fff !important;
  }
`;

const IncidentDetailTable = ({columns, labels}) => {

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('');
    const { i18n, t } = useTranslation();

  return (
    <FlexContainer flexDirection="column" width="100%">
    <TableContainer component={Paper}>
      <Table>
        <StyledTableHead backgroundColor="#3C8DBC" color='#fff'>
          <StyledTableRow>
          <StyledTableHeaderCell color="#000000A6">{t('SNo')}</StyledTableHeaderCell>  
            {columns?.map((column) => (
              <StyledTableHeaderCell color="#000000A6" key={column.name}>
   <TableSortLabel
                    active={orderBy === column.name}
                    direction={orderBy === column.name ? order : 'asc'}
                  >
                    {getlabel(column.translationId, labels, i18n.language)}
                  </TableSortLabel>   
             </StyledTableHeaderCell>
            ))}
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

export default IncidentDetailTable;
