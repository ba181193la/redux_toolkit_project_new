import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { getlabel } from '../../../../utils/language';
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
  ActionCell,
  StyledTableHead,
} from '../../../../utils/DataTable.styled';
import { FlexContainer, StyledImage } from '../../../../utils/StyledComponents';
import CustomPagination from '../../../../components/Pagination/CustomPagination';
import {
  setPendingPageIndex,
  setPendingPageSize,
} from '../../../../redux/features/IncidentManagement/incidentInvestigationApprovalSlice';
import formatDate from '../../../../utils/FormatDate';
import CustomScrollbars from '../../../../components/CustomScrollbars/CustomScrollbars';
import { checkAccess } from '../../../../utils/Auth';
import { Link } from 'react-router-dom';
import LikeIcon from '../../../../assets/Icons/LikeIcon.png';
import DislikeIcon from '../../../../assets/Icons/DislikeIcon.png';

const InvestigationPendingDataTable = ({
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
    (state) => state.investigationApproval.pendingFilters
  );
  const { userDetails, selectedMenu, isSuperAdmin } = useSelector(
    (state) => state.auth
  );

  //* State variables\
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');

  //* Handlers for pagination
  const handleOnPageChange = (event, newPage) => {
    dispatch(setPendingPageIndex(newPage));
  };

  const handleOnPageSizeChange = (event) => {
    dispatch(setPendingPageSize(parseInt(event.target.value, 10)));
    dispatch(setPendingPageIndex(0));
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
                    ?.filter((col) => col.isSelected && col.isShow)
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
                  {checkAccess(isSuperAdmin, isView, isEdit) && (
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
                        ?.filter((col) => col.isSelected && col.isShow)
                        .map((column) => (
                          <StyledTableBodyCell
                            key={column.id}
                            status={
                              column.id === 'Status' ? row[column.id] : ''
                            }
                          >
                            {(column.id === 'RequestReceivedDate' ||
                              column.id === 'IncidentDate' ||
                              column.id === 'ReportedDate') &&
                            row[column.id]
                              ? formatDate(row[column.id])
                              : (row[column.id] ?? null)}
                          </StyledTableBodyCell>
                        ))}
                      {checkAccess(isSuperAdmin, isView, isEdit) && (
                        <ActionCell>
                          <FlexContainer
                            style={{ gap: '10px' }}
                            className="action-icons"
                          >
                            <Tooltip title="Approve / Reject" arrow>
                              {' '}
                              <Link
                                to={`/IncidentManagement/InvestigationApproval/PendingDetails/${row.IncidentId}`}
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
                                  src={LikeIcon}
                                  alt="Like Icon"
                                />
                                {' / '}
                                <StyledImage
                                  cursor="pointer"
                                  height="12.5px"
                                  width="12.5px"
                                  src={DislikeIcon}
                                  alt="Dis like icon"
                                />
                              </Link>
                            </Tooltip>
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
                        columns?.filter((col) => col.isSelected && col.isShow)
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
                  ?.filter((col) => col.isSelected && col.isShow)
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
                {checkAccess(isSuperAdmin, isView, isEdit) && (
                  <StyledTableHeaderCell>{t('Actions')}</StyledTableHeaderCell>
                )}
              </TableRow>
            </StyledTableHead>

            {sortedRecords?.length > 0 ? (
              <TableBody>
                {sortedRecords?.map((row, rowIndex) => (
                  <StyledTableRow key={rowIndex}>
                    <StyledTableBodyCell>
                      {pageIndex * pageSize + rowIndex + 1}
                    </StyledTableBodyCell>
                    {columns
                      ?.filter((col) => col.isSelected && col.isShow)
                      .map((column) => (
                        <StyledTableBodyCell
                          key={column.id}
                          status={column.id === 'Status' ? row[column.id] : ''}
                        >
                          {(column.id === 'RequestReceivedDate' ||
                            column.id === 'IncidentDate' ||
                            column.id === 'ReportedDate') &&
                          row[column.id]
                            ? formatDate(row[column.id])
                            : (row[column.id] ?? null)}
                        </StyledTableBodyCell>
                      ))}
                    {checkAccess(isSuperAdmin, isView, isEdit) && (
                      <ActionCell>
                        <FlexContainer className="action-icons">
                          {checkAccess(isSuperAdmin, isView, isEdit) && (
                            <FlexContainer
                              style={{ gap: '10px' }}
                              className="action-icons"
                            >
                              <Tooltip title="Approve / Reject" arrow>
                                <Link
                                  to={`/IncidentManagement/InvestigationApproval/PendingDetails/${row.IncidentId}`}
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
                                    src={LikeIcon}
                                    alt="Like Icon"
                                  />
                                  {' / '}
                                  <StyledImage
                                    cursor="pointer"
                                    height="12.5px"
                                    width="12.5px"
                                    src={DislikeIcon}
                                    alt="Dis like icon"
                                  />
                                </Link>
                              </Tooltip>
                            </FlexContainer>
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
                      columns?.filter((col) => col.isSelected && col.isShow)
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

export default InvestigationPendingDataTable;
