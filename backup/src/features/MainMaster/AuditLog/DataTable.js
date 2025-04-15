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
  ActionCell,
} from '../../../utils/DataTable.styled';
import { FlexContainer, StyledImage } from '../../../utils/StyledComponents';
import CustomPagination from '../../../components/Pagination/CustomPagination';
import CustomScrollbars from '../../../components/CustomScrollbars/CustomScrollbars';
import { useTranslation } from 'react-i18next';
import { getlabel } from '../../../utils/language';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters } from '../../../redux/features/mainMaster/auditLogSlice';
import formatDate from '../../../utils/FormatDate';
import EyeIcon from '../../../assets/Icons/EyeIcon.png';
import formatTime from '../../../utils/FormatTime';
import format24HrTime from '../../../utils/Format24HrTime';

const DataTable = ({
  columns = [],
  auditLogData,
  totalRecords,
  labels,
  setIsViewModal,
  setEventId,
  isView,
}) => {
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();

  const { pageSize, pageIndex } = useSelector(
    (state) => state.auditLog.filters
  );

  const { selectedMenu, roleFacilities } = useSelector((state) => state.auth);

  const filters = useSelector((state) => state.auditLog.filters);

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');

  const handleOnPageChange = (event, newPage) => {
    dispatch(
      setFilters({
        ...filters,
        pageIndex: newPage,
      })
    );
  };

  const handleOnPageSizeChange = (event) => {
    dispatch(
      setFilters({
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

  const sortedRecords = [...auditLogData].sort((a, b) => {
    const aValue = a[orderBy]?.toString().toLowerCase();
    const bValue = b[orderBy]?.toString().toLowerCase();

    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <FlexContainer flexDirection="column">
      <TableContainer component={Paper} style={{ border: '1px solid #99cde6' }}>
        {pageSize > 25 ? (
          <CustomScrollbars
            style={{ height: '1250px' }}
            rtl={i18n.language === 'ar'}
          >
            <Table stickyHeader style={{ borderCollapse: 'collapse' }}>
              <StyledTableHead>
                <TableRow>
                  <StyledTableHeaderCell>{t('SNo')}</StyledTableHeaderCell>
                  {columns?.map((column) => (
                    <StyledTableHeaderCell key={column.id}>
                      <TableSortLabel
                        active={orderBy === column.id}
                        direction={orderBy === column.id ? order : 'asc'}
                        onClick={() => handleSortRequest(column.id)}
                      >
                        {getlabel(column.translationId, labels, i18n.language)}
                      </TableSortLabel>
                    </StyledTableHeaderCell>
                  ))}
                  <StyledTableHeaderCell>{t('Actions')}</StyledTableHeaderCell>
                </TableRow>
              </StyledTableHead>
              <TableBody>
                {sortedRecords?.length > 0 ? (
                  sortedRecords?.map((row, rowIndex) => {
                    const isViewAction =
                      typeof row?.Activity === 'string' &&
                      row.Activity.toLowerCase().includes('update');

                    return (
                      <StyledTableRow key={rowIndex}>
                        <StyledTableBodyCell>
                          {pageIndex * pageSize + rowIndex + 1}
                        </StyledTableBodyCell>
                        {columns?.map((column) => {
                          return (
                            <StyledTableBodyCell
                              key={column.id}
                              status={
                                column.id === 'Status' ? row[column.id] : ''
                              }
                            >
                              {column.id === 'DateTime' && row[column.id]
                                ? formatDate(row[column.id]) +
                                  ' ' +
                                  formatTime(row[column.id])
                                : (row[column.id] ?? null)}
                            </StyledTableBodyCell>
                          );
                        })}
                        <ActionCell>
                          <FlexContainer className="action-icons">
                            {isViewAction && isView ? (
                              <Tooltip title="View" arrow>
                                <StyledImage
                                  cursor="pointer"
                                  height="12.5px"
                                  src={EyeIcon}
                                  alt="EyeIcon"
                                  onClick={() => handleOnView(row)}
                                />
                              </Tooltip>
                            ) : (
                              ''
                            )}
                          </FlexContainer>
                        </ActionCell>
                      </StyledTableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <StyledTableBodyCell
                      colSpan={columns.length + 2}
                      align="center"
                    >
                      {t('NoDataAvailable')}
                    </StyledTableBodyCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CustomScrollbars>
        ) : (
          <Table stickyHeader style={{ borderCollapse: 'collapse' }}>
            <StyledTableHead>
              <TableRow>
                <StyledTableHeaderCell>{t('SNo')}</StyledTableHeaderCell>
                {columns?.map((column) => (
                  <StyledTableHeaderCell key={column.id}>
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleSortRequest(column.id)}
                    >
                      {getlabel(column.translationId, labels, i18n.language)}
                    </TableSortLabel>
                  </StyledTableHeaderCell>
                ))}
                <StyledTableHeaderCell>{t('Actions')}</StyledTableHeaderCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {sortedRecords?.length > 0 ? (
                sortedRecords?.map((row, rowIndex) => {
                  const isViewAction =
                    typeof row?.Activity === 'string' &&
                    row.Activity.toLowerCase().includes('update');

                  return (
                    <StyledTableRow key={rowIndex}>
                      <StyledTableBodyCell>
                        {pageIndex * pageSize + rowIndex + 1}
                      </StyledTableBodyCell>
                      {columns?.map((column) => {
                        return (
                          <StyledTableBodyCell
                            key={column.id}
                            status={
                              column.id === 'Status' ? row[column.id] : ''
                            }
                          >
                            {column.id === 'DateTime' && row[column.id]
                              ? formatDate(row[column.id]) +
                                ' ' +
                                format24HrTime(row[column.id])
                              : (row[column.id] ?? null)}
                          </StyledTableBodyCell>
                        );
                      })}
                      <ActionCell>
                        <FlexContainer className="action-icons">
                          <Tooltip title="View" arrow>
                            {isViewAction && (
                              <StyledImage
                                cursor="pointer"
                                height="12.5px"
                                src={EyeIcon}
                                alt="EyeIcon"
                                onClick={() => handleOnView(row)}
                              />
                            )}
                          </Tooltip>
                        </FlexContainer>
                      </ActionCell>
                    </StyledTableRow>
                  );
                })
              ) : (
                <TableRow>
                  <StyledTableBodyCell
                    colSpan={columns.length + 2}
                    align="center"
                  >
                    {t('NoDataAvailable')}
                  </StyledTableBodyCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {totalRecords > 0 && (
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
