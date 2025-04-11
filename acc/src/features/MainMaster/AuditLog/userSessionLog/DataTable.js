import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  TableRow,
  Paper,
  Tooltip,
  TableSortLabel,
} from '@mui/material';
import {
  StyledTableBodyCell,
  StyledTableHeaderCell,
  StyledTableRow,
  StyledTableHead,
} from '../../../../utils/DataTable.styled';
import { FlexContainer, StyledImage } from '../../../../utils/StyledComponents';
import CustomPagination from '../../../../components/Pagination/CustomPagination';
import CustomScrollbars from '../../../../components/CustomScrollbars/CustomScrollbars';
import { useTranslation } from 'react-i18next';
import { getlabel } from '../../../../utils/language';
import { useDispatch, useSelector } from 'react-redux';
import { setUserSeesionFilters } from '../../../../redux/features/mainMaster/auditLogSlice';
import formatDate from '../../../../utils/FormatDate';
import formatTime from '../../../../utils/FormatTime';
import format24HrTime from '../../../../utils/Format24HrTime';

const DataTable = ({
  columns = [],
  userSessionLogData,
  totalRecords,
  labels,
  setIsViewModal,
  setEventId,
}) => {
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();

  const { pageSize, pageIndex } = useSelector(
    (state) => state.auditLog.userSessionFilters
  );

  const { selectedMenu, roleFacilities } = useSelector((state) => state.auth);
  const filters= useSelector((state) => state.auditLog.userSessionFilters);
  
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');

  const handleOnPageChange = (event, newPage) => {
    dispatch(
      setUserSeesionFilters({
        ...filters,
        pageIndex: newPage,
      })
    );
  };

  const handleOnPageSizeChange = (event) => {
    dispatch(
      setUserSeesionFilters({
        ...filters,
        pageIndex: 0,
        pageSize: parseInt(event.target.value, 10),
      })
    );
  };

  const handleOnView = (row) => {
    setIsViewModal(true);
    setEventId(row?.Id);
  };

  const handleSortRequest = (column) => {
    const isAsc = orderBy === column && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(column);
  };

  const sortedRecords = [...userSessionLogData].sort((a, b) => {
    const aValue = a[orderBy]?.toString().toLowerCase();
    const bValue = b[orderBy]?.toString().toLowerCase();

    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <FlexContainer flexDirection="column">
      <TableContainer component={Paper} style={{ border: '1px solid #99cde6' }}>
        <Table stickyHeader style={{ borderCollapse: 'collapse' }}>
          <StyledTableHead>
            <TableRow>
              <StyledTableHeaderCell>{t('SNo')}</StyledTableHeaderCell>
              {columns
                ?.filter((col) => col.isSelected)
                ?.map((column) => {
                  return (
                    <StyledTableHeaderCell key={column.id}>
                      <TableSortLabel
                        active={orderBy === column.id}
                        direction={orderBy === column.id ? order : 'asc'}
                        onClick={() => handleSortRequest(column.id)}
                      >
                        {t(column.translationId)}
                        {/* {getlabel(column.translationId, labels, i18n.language)} */}
                      </TableSortLabel>
                    </StyledTableHeaderCell>
                  )
                }
                )}
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {sortedRecords?.length > 0 ? (
              sortedRecords?.map((row, rowIndex) => {
                return (
                  <StyledTableRow key={rowIndex}>
                    <StyledTableBodyCell>
                      {pageIndex * pageSize + rowIndex + 1}
                    </StyledTableBodyCell>
                    {columns
                      ?.filter((col) => col.isSelected)
                      .map((column) => {
                        return (
                          <StyledTableBodyCell
                            key={column.id}
                            status={
                              column.id === 'Status' ? row[column.id] : ''
                            }
                          >
                            {column.id === 'LoginDateTime' && row[column.id]
                              ? formatDate(row[column.id]) + " " + format24HrTime(row[column.id])
                              : (row[column.id] ?? null)}
                          </StyledTableBodyCell>
                        );
                      })}

                  </StyledTableRow>
                );
              })
            ) : (
              <TableRow>
              <StyledTableBodyCell colSpan={columns.length+2} align="center">
                {t('NoDataAvailable')}
              </StyledTableBodyCell>
            </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {totalRecords>0 && (
        <CustomPagination
          totalRecords={totalRecords}
          page={pageIndex}
          pageSize={pageSize}
          handleOnPageChange={handleOnPageChange}
          handleOnPageSizeChange={handleOnPageSizeChange}
        />
      )}
    </FlexContainer>
  );
};

export default DataTable;
