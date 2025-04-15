import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Button,
} from '@mui/material';
import formatDate from '../../../../../utils/FormatDate';
import { useTranslation } from 'react-i18next';
import { getlabel } from '../../../../../utils/language';


const LastApproveIncidentTable = ({ labels, columns, data }) => {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const { i18n, t } = useTranslation();

  const handleSort = (column) => {
    const isAsc = orderBy === column && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(column);
  };

  return (
    <Table id ='table'sx={{ width: '100%', border: '1px solid #ccc' }}>
    <TableHead sx={{ backgroundColor: '#3C8DBC' }}>
      <TableRow>
        <TableCell sx={{ color: '#fff', border: '1px solid #ccc' }}>
          <strong>{t('SNo')}</strong>
        </TableCell>
        {columns?.map((column) => (
          <TableCell
            key={column.name}
            sx={{ color: '#fff', border: '1px solid #ccc' }}
          >
            <TableSortLabel
              active={orderBy === column.name}
              direction={orderBy === column.name ? order : 'asc'}
              onClick={() => handleSort(column.name)}
            >
              {getlabel(column.translationId, labels, i18n.language)}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
    <TableBody>
      {data?.length && data?.length > 0 ? (
        data.map((row, index) => (
          <TableRow key={index}>
            <TableCell sx={{ border: '1px solid #ccc' }}>{index + 1}</TableCell>
            {columns.map((column) => (
              <TableCell key={column.name} sx={{ border: '1px solid #ccc' }}>
                {['ReportedDate', 'IncidentDate', 'AssignOn'].includes(column.name) && row[column.name]
                  ? formatDate(row[column.name])
                  : row[column.name] ?? ''}
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell
            colSpan={columns?.length + 1}
            sx={{
              textAlign: 'center',
              border: '1px solid #ccc',
              fontStyle: 'italic',
              color: '#888'
            }}
          >
            {t('NoDataAvailable')}
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
  
  );
};

export default LastApproveIncidentTable;
