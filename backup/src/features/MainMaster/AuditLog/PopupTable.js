import React from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  TableRow,
  Paper,
} from '@mui/material';
import {
  StyledTableBodyCell,
  StyledTableHeaderCell,
  StyledTableRow,
  StyledTableHead,
} from '../../../utils/DataTable.styled';
import { FlexContainer, StyledImage } from '../../../utils/StyledComponents';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import CustomScrollbars from '../../../components/CustomScrollbars/CustomScrollbars';
import LoadingGif from '../../../assets/Gifs/LoadingGif.gif';

const PopupTable = ({ columns = [], data = [] , isFetchingAuditLogData}) => {
  const { i18n, t } = useTranslation();

  const { pageSize, pageIndex } = useSelector(
    (state) => state?.auditLog?.filters
  );

  return (
    <FlexContainer flexDirection="column">
      <TableContainer component={Paper} style={{ border: '1px solid #99cde6' }}>
        <CustomScrollbars
          style={{ height:`${data?.length >0?'350px':'150px'}`}}
          rtl={i18n.language === 'ar'}
        >
          <Table stickyHeader style={{ borderCollapse: 'collapse' }}>
            <StyledTableHead>
              <TableRow>
                <StyledTableHeaderCell>{t('SNo')}</StyledTableHeaderCell>
                {columns.map((column) => (
                  <StyledTableHeaderCell key={column.id}>
                    {t(column.translationId)}
                  </StyledTableHeaderCell>
                ))}
              </TableRow>
            </StyledTableHead>
            {isFetchingAuditLogData ? (
          <FlexContainer justifyContent="center" alignItems="center">
            <StyledImage src={LoadingGif} alt="LoadingGif" />
          </FlexContainer>
        ) : (
            <TableBody>
              {data && data?.length > 0 ? (
                data.map((row, rowIndex) => (
                  <StyledTableRow key={rowIndex} style={{ cursor: 'pointer' }}>
                    <StyledTableBodyCell>
                      {rowIndex + 1}
                    </StyledTableBodyCell>
                    {columns.map((column) => (
                      <StyledTableBodyCell key={column.id}>
                        {row[column.id] !== undefined ? row[column.id] : null}
                      </StyledTableBodyCell>
                    ))}
                  </StyledTableRow>
                ))
              ) : (
                <TableRow>
                <StyledTableBodyCell colSpan={columns.length+2} align='center'>
                  {t('NoDataAvailable')}
                </StyledTableBodyCell>
              </TableRow>
              )}
            </TableBody>)}
          </Table>
        </CustomScrollbars>
      </TableContainer>
    </FlexContainer>
  );
};

export default PopupTable;
