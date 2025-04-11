import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  TableSortLabel,
  TableRow,
  Paper,
  Tooltip,
} from '@mui/material';
import { FlexContainer, StyledImage } from '../../../../utils/StyledComponents';
import {
  StyledTableBodyCell,
  StyledTableHeaderCell,
  StyledTableRow,
  ActionCell,
  StyledTableHead,
} from '../../../../utils/DataTable.styled';
import CustomPagination from '../../../../components/Pagination/CustomPagination';
import CustomScrollbars from '../../../../components/CustomScrollbars/CustomScrollbars';
import EditIcon from '../../../../assets/Icons/EditIcon.png';
import ViewOnlyIcon from '../../../../assets/Icons/ViewOnlyIcon.png';
import DeleteIcon from '../../../../assets/Icons/DeleteIcon.png';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getlabel } from '../../../../utils/language';
import { useDispatch, useSelector } from 'react-redux';
import { checkAccess } from '../../../../utils/Auth';
import { Link } from 'react-router-dom';
import formatDate from '../../../../utils/FormatDate';
import { setFilters } from '../../../../redux/features/mainMaster/incidentClosureSlice';

const DataTableCompleted = ({
  columns,
  rows,
  labels,
  records,
  totalRecords,
  isView,
}) => {
  const { pageSize, pageIndex } = useSelector(
    (state) => state.incidentClosure.filters
  );
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();

  const { userDetails, selectedMenu, roleFacilities, isSuperAdmin } =
    useSelector((state) => state.auth);

  const filters = useSelector((state) => state.incidentClosure.filters);

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

  const handleClick = (incidentId, IncidentClosureId) => {
    window.open(
      `/IncidentManagement/IncidentClosureCompleted/${incidentId}/${IncidentClosureId}`,
      '_blank'
    );
  };

  const handleClickEdit = (incidentId, IncidentClosureId) => {
    window.open(
      `/IncidentManagement/IncidentClosureCompletedEdit/${incidentId}/${IncidentClosureId}`,
      '_blank'
    );
  };

  return (
    <FlexContainer flexDirection="column">
      <TableContainer component={Paper} style={{ border: '1px solid #99cde6' }}>
        <Table stickyHeader style={{ borderCollapse: 'collapse' }}>
          <StyledTableHead>
            <TableRow>
              <StyledTableHeaderCell>{t('SNo')}</StyledTableHeaderCell>
              {columns
                ?.filter((column) => column.isSelected)

                ?.map(
                  (column) =>
                    column.isShow && (
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
                    )
                )}

              <StyledTableHeaderCell>New Actions</StyledTableHeaderCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {sortedRecords?.length > 0 ? (
              sortedRecords?.map((row, rowIndex) => {
                const menu = roleFacilities?.find(
                  (role) => role.FacilityName === row.Facility
                )?.Menu;
                const role = menu?.find(
                  (item) => item.MenuId === selectedMenu?.id
                );
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
                            style={{
                              maxWidth:
                                column.id === 'SecondaryDesignation'
                                  ? '150px'
                                  : 'auto',
                              wordWrap: 'break-word',
                              overflowWrap: 'break-word',
                              whiteSpace: 'normal',
                            }}
                            status={
                              column.id === 'Status' ? row[column.id] : ''
                            }
                          >
                            {[
                              'ReportedDate',
                              'IncidentDate',
                              'AssignedOn',
                              'RequestReceivedDate',
                              'IncidentDateTime',
                              'CompletedDate',
                            ].includes(column.id) && row[column.id] ? (
                              formatDate(row[column.id])
                            ) : column.id === 'SecondaryDesignation' ? (
                              <div style={styles.wrapText}>
                                {row[column.id] ?? null}
                              </div>
                            ) : (
                              (row[column.id] ?? null)
                            )}
                          </StyledTableBodyCell>
                        );
                      })}
                    {checkAccess(
                      isSuperAdmin,
                      isView,
                      role?.IsEdit || role?.IsDelete
                    ) && (
                      <ActionCell>
                        <FlexContainer
                          style={{ gap: '10px' }}
                          className="action-icons"
                        >
                          <StyledImage
                            cursor="pointer"
                            height="12.5px"
                            width="12.5px"
                            src={EditIcon}
                            onClick={() =>
                              handleClickEdit(
                                row.IncidentId,
                                row.IncidentClosureId
                              )
                            }
                            alt="Edit"
                          />
                          <StyledImage
                            cursor="pointer"
                            height="12.5px"
                            width="14.5px"
                            src={ViewOnlyIcon}
                            onClick={() =>
                              handleClick(row.IncidentId, row.IncidentClosureId)
                            }
                            alt="View"
                          />
                        </FlexContainer>
                      </ActionCell>
                    )}
                  </StyledTableRow>
                );
              })
            ) : (
              <TableRow>
                <StyledTableBodyCell colSpan={columns.length} align="center">
                  {t('NoDataAvailable')}
                </StyledTableBodyCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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

export default DataTableCompleted;
