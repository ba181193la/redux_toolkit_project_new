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

const ReoccurrenceTable = ({ columns, labels, backgroundColor, data }) => {
  const { i18n, t } = useTranslation();

  return (
    <FlexContainer flexDirection="column" width="100%">
      <TableContainer component={Paper}>
        <Table>
          {/* Table Header */}
          <StyledTableHead backgroundColor={backgroundColor} style={{ borderLeft: 'none' }}>
            <StyledTableRow>
              <StyledTableHeaderCell color="#fff" align="left">{t('SNo')}</StyledTableHeaderCell>
              {columns?.map((column) => (
                <StyledTableHeaderCell key={column.name} color="#fff" align="left">
                  {getlabel(column.translationId, labels, i18n.language)}
                </StyledTableHeaderCell>
              ))}
            </StyledTableRow>
          </StyledTableHead>

          {/* Table Body */}
          <TableBody>
            {data?.length && data.length > 0 ? (
              data.map((row, index) => (
                <StyledTableRow key={index}>
                  {/* Serial Number */}
                  <StyledTableBodyCell style={{ textAlign: 'left' }}>{index + 1}</StyledTableBodyCell>

                  {columns?.map((column) => (
                    <StyledTableBodyCell key={column.name} style={{ textAlign: 'left' }}>
                      {column.name === 'Consequence' ? (
                        <div style={{ textAlign: 'left' }}>
                          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                            {row.ConsequenceLevel || '-'}
                          </div>
                          <ul style={{ paddingLeft: '18px', margin: '0' }}>
                            <li>{row.Consequence || '-'}</li>
                          </ul>
                        </div>
                      ) : (
                        <span style={{ textAlign: 'left', display: 'block' }}>
                          {row[column.name] || '-'}
                        </span>
                      )}
                    </StyledTableBodyCell>
                  ))}
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <StyledTableBodyCell colSpan={columns?.length + 1} style={{ textAlign: 'center' }}>
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
