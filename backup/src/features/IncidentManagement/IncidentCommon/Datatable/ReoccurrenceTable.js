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
} from '../../../../utils/DataTable.styled';


import { FlexContainer } from '../../../../utils/StyledComponents';
import { getlabel } from '../../../../utils/language'; 
import { useTranslation } from 'react-i18next';

const ReoccurrenceTable = ({columns, labels, backgroundColor, data}) => {

   const [order, setOrder] = useState('asc');
   const [orderBy, setOrderBy] = useState('');
  const { i18n, t } = useTranslation();

  return (
    <FlexContainer flexDirection="column" width="100%">
       <TableContainer component={Paper}>
         <Table>
           <StyledTableHead backgroundColor={backgroundColor} style={{borderLeft: 'none'}}>
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
           {data?.length && data.length > 0 ? (
              data.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableBodyCell>{index + 1}</StyledTableBodyCell>
                 
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <StyledTableBodyCell colSpan={columns?.length + 1}>
                  {t('NoDataAvailable')}
                </StyledTableBodyCell>
              </StyledTableRow>
            )}
           </TableBody>
         </Table>
       </TableContainer>
     </FlexContainer>
  );
};

export default ReoccurrenceTable;
