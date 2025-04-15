import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
  Paper,
  TableCell,
  Button,
} from '@mui/material';

import { FlexContainer } from '../../../../../utils/StyledComponents';
import { getlabel } from '../../../../../utils/language';
import { useTranslation } from 'react-i18next';
import formatDate from '../../../../../utils/FormatDate';

const ApproveIncidentTable = ({ labels, columns, data, title }) => {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const { i18n, t } = useTranslation();

  return (
    <>
      <Table id="MainTitle" style={{ margin: '10px' }}>
        <TableHead>
          <TableRow>
            <TableCell align="left">
            { title && <Typography variant="h6">{title} :</Typography>}
            </TableCell>
          </TableRow>
        </TableHead>
      </Table>
      <Table id="table" component="table" sx={{ border: '1px solid #ccc' }}>
        <TableHead component="thead">
          <TableRow component="tr">
            <TableCell component="th" style={{ border: '1px solid #ccc' }}>
              <strong>{t('SNo')}</strong>
            </TableCell>
            {columns?.map((column) => (
              <TableCell
                component="th"
                key={column.name}
                style={{ border: '1px solid #ccc' }}
              >
                <strong>
                  {getlabel(column.translationId, labels, i18n.language)}
                </strong>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody component="tbody">
          {data?.length > 0 ? (
            data.map((row, index) => (
              <TableRow component="tr" key={index}>
                <TableCell component="td" style={{ border: '1px solid #ccc' }}>
                  {index + 1}
                </TableCell>
                {columns.map((column) => (
                  <TableCell
                    component="td"
                    key={column.name}
                    style={{ border: '1px solid #ccc' }}
                  >
                    {['ReportedDate', 'IncidentDate', 'AssignOn', 'TargetDate', 'EventDate','ResponseDate', 'RequestedDate'].includes(
                      column.name
                    )
                      ? row[column.name]
                        ? formatDate(row[column.name])
                        : ''
                      : (row[column.name] ?? '')}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow component="tr">
              <TableCell
                component="td"
                colSpan={columns?.length + 1}
                style={{ border: '1px solid #ccc', textAlign: 'center' }}
              >
                {t('NoDataAvailable')}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
};

export default ApproveIncidentTable;
