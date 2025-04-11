import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

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
  StyledTableHeaderCell,
  StyledTableRow,
  ActionCell,
  StyledTableHead,
  StyledTableBodyCell,
} from '../../../../utils/DataTable.styled';
import { FlexContainer, StyledImage } from '../../../../utils/StyledComponents';
import CustomPagination from '../../../../components/Pagination/CustomPagination';
import {
  setCompletedPageIndex,
  setCompletedPageSize,
} from '../../../../redux/features/IncidentManagement/incidentInvestigationApprovalSlice';
import formatDate from '../../../../utils/FormatDate';
import ViewIcon from '../../../../assets/Icons/ViewOnlyIcon.png';
import CustomScrollbars from '../../../../components/CustomScrollbars/CustomScrollbars';
import { checkAccess } from '../../../../utils/Auth';
import { getlabel } from '../../../../utils/language';
import { Link } from 'react-router-dom';

const InvestigationCompletedDataTable = ({
  columns = [],
  records,
  totalRecords,
  fieldLabels,
  isEdit,
  isView,
  refetch,
}) => {
  //* Hooks Declation
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();

  //* Selectors
  const { pageIndex, pageSize } = useSelector(
    (state) => state.investigationApproval.completedFilters
  );
  const { userDetails, selectedMenu, isSuperAdmin } = useSelector(
    (state) => state.auth
  );

  //* State variables
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');

  //* Handlers for pagination
  const handleOnPageChange = (event, newPage) => {
    dispatch(setCompletedPageIndex(newPage));
  };

  const handleOnPageSizeChange = (event) => {
    dispatch(setCompletedPageSize(parseInt(event.target.value, 10)));
    dispatch(setCompletedPageIndex(0));
  };

  //* Sorting table columns
  const handleSortRequest = (column) => {
    const isAsc = orderBy === column && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(column);
  };

  const sortedRecords = [...records].sort((a, b) => {
    const aValue = a[orderBy]?.toString().toLowerCase();
    const bValue = b[orderBy]?.toString().toLowerCase();

    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <FlexContainer flexDirection="column" width="100%">
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
                  {columns
                    ?.filter((col) => col.isSelected && col?.isShow)
                    ?.map((column) => (
                      <StyledTableHeaderCell key={column.id}>
                        <TableSortLabel
                          active={orderBy === column.id}
                          direction={orderBy === column.id ? order : 'asc'}
                          onClick={() => handleSortRequest(column.id)}
                        >
                          {getlabel(
                            column.translationId,
                            fieldLabels,
                            i18n.language
                          )}
                        </TableSortLabel>
                      </StyledTableHeaderCell>
                    ))}
                  {checkAccess(isSuperAdmin, isView, false) && (
                    <StyledTableHeaderCell>
                      {t('Actions')}
                    </StyledTableHeaderCell>
                  )}
                </TableRow>
              </StyledTableHead>

              {sortedRecords?.length > 0 ? (
                <TableBody>
                  {sortedRecords.map((row, rowIndex) => (
                    <StyledTableRow key={rowIndex}>
                      <StyledTableBodyCell>
                        {pageIndex * pageSize + rowIndex + 1}
                      </StyledTableBodyCell>
                      {columns
                        ?.filter((col) => col.isSelected && col?.isShow)
                        .map((column) => (
                          <StyledTableBodyCell
                            key={column.id}
                            status={
                              column.id === 'Status' ? row[column.id] : ''
                            }
                          >
                            {(column.id === 'IncidentDate' ||
                              column.id === 'ReportedDate' ||
                              column.id === 'RequestReceivedDate' ||
                              column.id === 'SubmittedDate') &&
                            row[column.id]
                              ? formatDate(row[column.id])
                              : (row[column.id] ?? null)}
                          </StyledTableBodyCell>
                        ))}
                      {checkAccess(isSuperAdmin, isView, false) && (
                        <ActionCell>
                          <FlexContainer className="action-icons">
                            {checkAccess(isSuperAdmin, isView, false) && (
                              <Tooltip title="View" arrow>
                                <Link
                                  to={`/IncidentManagement/InvestigationApproval/CompletedDetails/${row?.IncidentId}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    textDecoration: 'none',
                                  }}
                                >
                                  <StyledImage
                                    cursor="pointer"
                                    height="12.5px"
                                    width="12.5px"
                                    src={ViewIcon}
                                    alt="View"
                                  />
                                </Link>
                              </Tooltip>
                            )}
                          </FlexContainer>
                        </ActionCell>
                      )}
                    </StyledTableRow>
                  ))}
                </TableBody>
              ) : (
                <TableBody>
                  <StyledTableRow>
                    <StyledTableBodyCell
                      colSpan={
                        columns?.filter((col) => col.isSelected && col?.isShow)
                          .length + 2
                      }
                      style={{ textAlign: 'center' }}
                    >
                      {t('NoDataAvailable')}
                    </StyledTableBodyCell>
                  </StyledTableRow>
                </TableBody>
              )}
            </Table>
          </CustomScrollbars>
        ) : (
          <Table stickyHeader style={{ borderCollapse: 'collapse' }}>
            <StyledTableHead>
              <TableRow>
                <StyledTableHeaderCell>{t('SNo')}</StyledTableHeaderCell>
                {columns
                  ?.filter((col) => col.isSelected && col?.isShow)
                  ?.map((column) => (
                    <StyledTableHeaderCell key={column.id}>
                      <TableSortLabel
                        active={orderBy === column.id}
                        direction={orderBy === column.id ? order : 'asc'}
                        onClick={() => handleSortRequest(column.id)}
                      >
                        {getlabel(
                          column.translationId,
                          fieldLabels,
                          i18n.language
                        )}
                      </TableSortLabel>
                    </StyledTableHeaderCell>
                  ))}
                {checkAccess(isSuperAdmin, isView, false) && (
                  <StyledTableHeaderCell>{t('Actions')}</StyledTableHeaderCell>
                )}
              </TableRow>
            </StyledTableHead>

            {sortedRecords?.length > 0 ? (
              <TableBody>
                {sortedRecords.map((row, rowIndex) => (
                  <StyledTableRow key={rowIndex}>
                    <StyledTableBodyCell>
                      {pageIndex * pageSize + rowIndex + 1}
                    </StyledTableBodyCell>
                    {columns
                      ?.filter((col) => col.isSelected && col?.isShow)
                      .map((column) => (
                        <StyledTableBodyCell
                          key={column.id}
                          status={column.id === 'Status' ? row[column.id] : ''}
                        >
                          {(column.id === 'IncidentDate' ||
                            column.id === 'ReportedDate' ||
                            column.id === 'RequestReceivedDate' ||
                            column.id === 'SubmittedDate') &&
                          row[column.id]
                            ? formatDate(row[column.id])
                            : (row[column.id] ?? null)}
                        </StyledTableBodyCell>
                      ))}
                    {checkAccess(isSuperAdmin, isView, false) && (
                      <ActionCell>
                        {checkAccess(isSuperAdmin, isView, false) && (
                          <Tooltip title="View" arrow>
                            <Link
                              to={`/IncidentManagement/InvestigationApproval/CompletedDetails/${row?.IncidentId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                textDecoration: 'none',
                              }}
                            >
                              <StyledImage
                                cursor="pointer"
                                height="14px"
                                width="18px"
                                src={ViewIcon}
                                alt="View"
                              />
                            </Link>
                          </Tooltip>
                        )}
                      </ActionCell>
                    )}
                  </StyledTableRow>
                ))}
              </TableBody>
            ) : (
              <TableBody>
                <StyledTableRow>
                  <StyledTableBodyCell
                    colSpan={
                      columns?.filter((col) => col.isSelected && col?.isShow)
                        .length + 2
                    }
                    style={{ textAlign: 'center' }}
                  >
                    {t('NoDataAvailable')}
                  </StyledTableBodyCell>
                </StyledTableRow>
              </TableBody>
            )}
          </Table>
        )}
      </TableContainer>
      <CustomPagination
        totalRecords={totalRecords}
        page={pageIndex}
        pageSize={pageSize}
        handleOnPageChange={handleOnPageChange}
        handleOnPageSizeChange={handleOnPageSizeChange}
      />
    </FlexContainer>
  );
};

export default InvestigationCompletedDataTable;
