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
  StyledTableHead,
} from '../../../../../utils/DataTable.styled';
import { FlexContainer } from '../../../../../utils/StyledComponents';
import * as language from '../../../../../utils/language'; 
import { useTranslation } from 'react-i18next';


const SingleTable = ({columns, labels, backgroundColor}) => {
  
     const [order, setOrder] = useState('asc');
     const [orderBy, setOrderBy] = useState('');
    const { i18n, t } = useTranslation();
  
  return (
    <FlexContainer flexDirection="column" width="100%">
       <TableContainer component={Paper}>
         <Table>
           <StyledTableHead backgroundColor={backgroundColor} style={{borderLeft: 'none'}}>
             <StyledTableRow>
               {columns?.map((column) => (
                 <StyledTableHeaderCell color="#fff" key={column.name} style={{textAlign: 'center'}}>
      <TableSortLabel
                       active={orderBy === column.name}
                       direction={orderBy === column.name ? order : 'asc'}
                     >
                       {language.getlabel(column.translationId, labels, i18n.language)}
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

export default SingleTable;
