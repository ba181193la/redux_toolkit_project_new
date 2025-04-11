import React, { useEffect, useState } from 'react';
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
import formatDate from '../../../../utils/FormatDate';

// Styled Components
// const StyledGridContainer = styled(Grid)`
//   display: grid;
//   grid-template-columns: repeat(4, 1fr);
//   gap: 15px;
//   padding: 20px;
// `;

const NotificationHistory = ({ columns, labels, data }) => {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const { i18n, t } = useTranslation();

  return (
    <FlexContainer flexDirection="column" width="100%">
      <TableContainer component={Paper}>
        <Table>
          <StyledTableHead backgroundColor="#1ca775" borderLeft="none">
            <StyledTableRow>
              <StyledTableHeaderCell color="#fff">
                {t('SNo')}
              </StyledTableHeaderCell>
              {columns?.map((column) => (
                <StyledTableHeaderCell color="#fff" key={column.name}>
                  <TableSortLabel
                    active={orderBy === column.name}
                    direction={orderBy === column.name ? order : 'asc'}
                    // onClick={() => handleSort(column.name)}
                  >
                    {getlabel(column.translationId, labels, i18n.language)}
                  </TableSortLabel>
                </StyledTableHeaderCell>
              ))}
              <StyledTableHeaderCell color="#fff">
                Actions
              </StyledTableHeaderCell>
            </StyledTableRow>
          </StyledTableHead>
          <TableBody>
            {data?.length && data.length > 0 ? (
              data.map((row, index) => (
                <StyledTableRow key={index}>
                  <StyledTableBodyCell>{index + 1}</StyledTableBodyCell>
                  {columns.map((column) => (
                    <StyledTableBodyCell key={column.name}>
                      {['ReportedDate', 'IncidentDate', 'AssignOn'].includes(
                        column.name
                      ) && row[column.name]
                        ? formatDate(row[column.name])
                        : (row[column.name] ?? '')}
                    </StyledTableBodyCell>
                  ))}
                  <StyledTableBodyCell></StyledTableBodyCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <StyledTableBodyCell colSpan={columns.length + 1}>
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

export default NotificationHistory;
