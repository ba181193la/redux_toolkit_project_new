import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  TableSortLabel ,
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
import { getlabel } from '../../../../../utils/language'; 
import { useTranslation } from 'react-i18next';

const IC_Completed_ImmediateActionTable = ({columns, labels}) => {

   const [order, setOrder] = useState('asc');
   const [orderBy, setOrderBy] = useState('');
   const { i18n, t } = useTranslation();
   
  return (
    <FlexContainer flexDirection="column" width="100%">
      <TableContainer component={Paper}>
        <Table>
          <StyledTableHead backgroundColor="#3C8DBC">
            <StyledTableRow>
            <StyledTableHeaderCell color="#fff">{t('SNo')}</StyledTableHeaderCell>  
              {columns?.map((column) => (
                <StyledTableHeaderCell color="#fff" key={column.id}>
     <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
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

export default IC_Completed_ImmediateActionTable;
