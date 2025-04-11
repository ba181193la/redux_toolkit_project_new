import React, { useState, useEffect } from 'react';
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
import { useGetIncidentLevelDataQuery } from '../../../../../redux/RTK/incidentClosureApi'


const InvestigationTable = ({columns, labels, data}) => {

   const [order, setOrder] = useState('asc');
       const [orderBy, setOrderBy] = useState('');
       const { i18n, t } = useTranslation();
   
  return (
        <FlexContainer flexDirection="column" width="100%">
        <TableContainer component={Paper}>
          <Table>
            <StyledTableHead backgroundColor="#3C8DBC" style={{borderLeft: 'none'}}>
              <StyledTableRow>
              <StyledTableHeaderCell>{t('SNo')}</StyledTableHeaderCell>
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
                  {data ? (
                    <StyledTableRow key={data.IncidentRiskLevelId}>
                      {columns.map((column) => (
                        <StyledTableBodyCell key={column.name}>
                          {column.name === 'IsRCARequired' ? (
                            data[column.name] ? 'Yes' : 'No' 
                          ) : (
                            data[column.name] || 'N/A'
                          )}
                        </StyledTableBodyCell>
                      ))}
                    </StyledTableRow>
                  ) : (
                    <StyledTableRow>
                      <StyledTableBodyCell colSpan={columns.length}>
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

export default InvestigationTable;
