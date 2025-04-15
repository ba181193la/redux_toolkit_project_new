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
import { getlabel } from '../../../../utils/IncidentLabels';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters } from '../../../../redux/features/mainMaster/notificationMasterSlice';
import formatDate from '../../../../utils/FormatDate';
import { useNavigate } from 'react-router-dom';
import { checkAccess } from '../../../../utils/Auth';

import {
  setPageName,
  setTask,
  setMailTaskId,
} from '../../../../redux/features/mainMaster/notificationMasterSlice';

const DataTable = ({
  columns = [],
  records,
  totalRecords,
  labels,
  isView = false,
  isEdit = false,
  isDelete = false,
}) => {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');

  const { pageSize, pageIndex } = useSelector(
    (state) => state?.notificationMaster?.filters
  );
  const { selectedMenu, roleFacilities, isSuperAdmin } = useSelector(
    (state) => state.auth
  );

  const filters = useSelector(
    (state) => state?.notificationMaster?.filters || {}
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
    dispatch(setPageName(row?.PageName));
    dispatch(setTask(row?.MailTask));
    dispatch(setMailTaskId(row?.MailTaskId));
    navigate(`/incidentManagement/EditNotificationMaster/${row.MailTaskId}`);
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

  return (
    <FlexContainer flexDirection="column">
      <TableContainer component={Paper} style={{ border: '1px solid #99cde6' }}>
        <CustomScrollbars
          style={{ height: '350px' }}
          rtl={i18n.language === 'ar'}
        >
          <Table stickyHeader style={{ borderCollapse: 'collapse' }}>
            <StyledTableHead>
              <TableRow>
                <StyledTableHeaderCell>{t('SNo')}</StyledTableHeaderCell>
                {columns
                  ?.filter((col) => col.isSelected)
                  ?.map((column) => (
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
                  <StyledTableHeaderCell>{t('Actions')}</StyledTableHeaderCell>
                )}
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
                              status={
                                column.id === 'Status' ? row[column.id] : ''
                              }
                            >
                              {column.id === 'Added_EditedDate' &&
                              row[column.id]
                                ? formatDate(row[column.id])
                                : (row[column.id] ?? null)}
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
                <FlexContainer
                  position="absolute"
                  style={{ top: '50%', left: '50%' }}
                >
                  {t('NoDataAvailable')}
                </FlexContainer>
              )}
            </TableBody>
          </Table>
        </CustomScrollbars>
      </TableContainer>

      {totalRecords > 0 ? (
        <CustomPagination
          totalRecords={totalRecords}
          page={pageIndex}
          pageSize={pageSize}
          handleOnPageChange={handleOnPageChange}
          handleOnPageSizeChange={handleOnPageSizeChange}
        />
      ) : (
        <CustomPagination
          totalRecords={0}
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
