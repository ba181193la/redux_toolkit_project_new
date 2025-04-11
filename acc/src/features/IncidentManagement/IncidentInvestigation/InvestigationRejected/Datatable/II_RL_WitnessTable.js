import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
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

const WitnessTable = ({columns, labels}) => {

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
                 <StyledTableHeaderCell color="#fff" key={column.name}>
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

export default WitnessTable;
