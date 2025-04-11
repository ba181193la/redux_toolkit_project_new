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
import EditIcon from '../../../../assets/Icons/EditIcon.png';
import {
  StyledTableBodyCell,
  StyledTableHeaderCell,
  StyledTableRow,
  ActionCell,
  StyledTableHead,
} from '../../../../utils/DataTable.styled';
import { FlexContainer, StyledImage } from '../../../../utils/StyledComponents';
import CustomPagination from '../../../../components/Pagination/CustomPagination';
import CustomScrollbars from '../../../../components/CustomScrollbars/CustomScrollbars';
import { useTranslation } from 'react-i18next';
import { getlabel } from '../../../../utils/language';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import formatDate from '../../../../utils/FormatDate';
import { setFilters } from '../../../../redux/features/mainMaster/userAssignmentSlice';
import { checkAccess } from '../../../../utils/Auth';

const DataTable = ({
  columns = [],
  data = [],
  isView = false,
  isEdit = false,
  isDelete = false,
  labels,
  TotalRecords,
}) => {
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');

  const { pageSize, pageIndex } = useSelector(
    (state) => state?.userAssignment?.filters || {}
  );

  const filters = useSelector((state) => state?.userAssignment?.filters || {});
  const { selectedMenu, roleFacilities, isSuperAdmin } = useSelector(
    (state) => state.auth
  );

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

  const handleOnEdit = async (row) => {
    navigate(`/MainMaster/NewUserAssignment/${row?.UserId}`);
  };

  const styles = {
    wrapText: {
      wordWrap: 'break-word',
      overflowWrap: 'break-word',
      whiteSpace: 'normal',
      maxWidth: '100%',
      width: '300px',
    },
  };

  const handleSortRequest = (column) => {
    const isAsc = orderBy === column && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(column);
  };

  const sortedRecords = [...data].sort((a, b) => {
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
                  {columns
                    ?.filter((col) => col.isSelected)
                    .map((column) => (
                      <StyledTableHeaderCell key={column.id}>
                        <TableSortLabel
                          active={orderBy === column.id}
                          direction={orderBy === column.id ? order : 'asc'}
                          onClick={() => handleSortRequest(column.id)}
                        >
                          {getlabel(
                            column.translationId,
                            labels,
                            i18n.language
                          )}
                        </TableSortLabel>
                      </StyledTableHeaderCell>
                    ))}
                  {checkAccess(isSuperAdmin, isView, true) && (
                    <StyledTableHeaderCell>Actions</StyledTableHeaderCell>
                  )}
                </TableRow>
              </StyledTableHead>
              <TableBody>
                {sortedRecords?.length > 0 ? (
                  sortedRecords?.map((row, rowIndex) => {
                    return (
                      <StyledTableRow key={rowIndex}>
                        <StyledTableBodyCell>
                          {rowIndex + 1}
                        </StyledTableBodyCell>
                        {columns
                          ?.filter((col) => col.isSelected)
                          .map((column) => {
                            return (
                              <StyledTableBodyCell
                                key={column.id}
                                status={
                                  column.id === 'ActiveStatus'
                                    ? row[column.id]
                                    : ''
                                }
                                width={
                                  column.id === 'FacilityName'
                                    ? '500px'
                                    : '350px'
                                }
                              >
                                {column.id === 'ModifiedDate' &&
                                row[column.id] ? (
                                  formatDate(row[column.id])
                                ) : column.id === 'FacilityName' ? (
                                  row?.Facilities &&
                                  row.Facilities.length > 0 ? (
                                    <div style={styles.wrapText}>
                                      {row.Facilities.map(
                                        (facility) => facility.FacilityName
                                      ).join(', ')}
                                    </div>
                                  ) : (
                                    row.DefaultFacility
                                  )
                                ) : column.id === 'AssignedRoles' ? (
                                  <div style={styles.wrapText}>
                                    {row[column.id] ?? null}
                                  </div>
                                ) : (
                                  <div style={{ whiteSpace: 'nowrap' }}>
                                    {row[column.id] ?? null}
                                  </div>
                                )}
                              </StyledTableBodyCell>
                            );
                          })}

                        {checkAccess(
                          isSuperAdmin,
                          isView,
                          isEdit || isDelete
                        ) ? (
                          <ActionCell>
                            <FlexContainer className="action-icons">
                              {checkAccess(
                                isSuperAdmin,
                                isView,
                                isEdit || false
                              ) && (
                                <Tooltip title="Edit" arrow>
                                  <StyledImage
                                    cursor="pointer"
                                    height="12.5px"
                                    width="12.5px"
                                    src={EditIcon}
                                    alt="Edit"
                                    onClick={() => handleOnEdit(row)}
                                  />
                                </Tooltip>
                              )}
                            </FlexContainer>
                          </ActionCell>
                        ) : (
                          <ActionCell></ActionCell>
                        )}
                      </StyledTableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <StyledTableBodyCell
                      colSpan={columns.length}
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
                {checkAccess(isSuperAdmin, isView, true) && (
                  <StyledTableHeaderCell>Actions</StyledTableHeaderCell>
                )}
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {sortedRecords?.length > 0 ? (
                sortedRecords?.map((row, rowIndex) => {
                  return (
                    <StyledTableRow key={rowIndex}>
                      <StyledTableBodyCell>{rowIndex + 1}</StyledTableBodyCell>
                      {columns?.map((column) => {
                        return (
                          <StyledTableBodyCell
                            key={column.id}
                            status={
                              column.id === 'ActiveStatus' ? row[column.id] : ''
                            }
                            width={
                              column.id === 'FacilityName' ? '500px' : '350px'
                            }
                          >
                            {column.id === 'ModifiedDate' && row[column.id] ? (
                              formatDate(row[column.id])
                            ) : column.id === 'FacilityName' ? (
                              row?.Facilities && row.Facilities.length > 0 ? (
                                <div style={styles.wrapText}>
                                  {row.Facilities.map(
                                    (facility) => facility.FacilityName
                                  ).join(', ')}
                                </div>
                              ) : (
                                row.DefaultFacility
                              )
                            ) : column.id === 'AssignedRoles' ? (
                              <div style={styles.wrapText}>
                                {row[column.id] ?? null}
                              </div>
                            ) : (
                              <div style={{ whiteSpace: 'nowrap' }}>
                                {row[column.id] ?? null}
                              </div>
                            )}
                          </StyledTableBodyCell>
                        );
                      })}
                      {checkAccess(
                        isSuperAdmin,
                        isView,
                        isEdit || isDelete
                      ) && (
                        <ActionCell>
                          <FlexContainer className="action-icons">
                            {checkAccess(
                              isSuperAdmin,
                              isView,
                              isEdit || false
                            ) && (
                              <Tooltip title="Edit" arrow>
                                <StyledImage
                                  cursor="pointer"
                                  height="12.5px"
                                  width="12.5px"
                                  src={EditIcon}
                                  alt="Edit"
                                  onClick={() => handleOnEdit(row)}
                                />
                              </Tooltip>
                            )}
                          </FlexContainer>
                        </ActionCell>
                      )}
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

      {TotalRecords > 0 && (
        <CustomPagination
          totalRecords={TotalRecords}
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
