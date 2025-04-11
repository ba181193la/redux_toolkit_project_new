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
import DeleteIcon from '../../../../assets/Icons/DeleteIcon.png';
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
import { setFilters } from '../../../../redux/features/mainMaster/incidentApprovalSlice';
import { useDeleteStaffMutation } from '../../../../redux/RTK/staffMasterApi';
import formatDate from '../../../../utils/FormatDate';
import { Link } from 'react-router-dom';
import { checkAccess } from '../../../../utils/Auth';
import { showSweetAlert } from '../../../../utils/SweetAlert';
import DeleteUserGif from '../../../../assets/Gifs/DeleteuserGif.gif';
import SuccessGif from '../../../../assets/Gifs/SuccessGif.gif';
import { useNavigate } from 'react-router-dom';
import ViewOnlyIcon from '../../../../assets/Icons/ViewOnlyIcon.png';

const styles = {
  wrapText: {
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    whiteSpace: 'normal',
  },
};

const DataTable = ({
  columns = [],
  records,
  totalRecords,
  labels,
  isView = false,
}) => {
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');

  const navigate = useNavigate();

  const { pageSize, pageIndex } = useSelector(
    (state) => state.incidentApproval.filters
  );
  const { userDetails, selectedMenu, roleFacilities, isSuperAdmin } =
    useSelector((state) => state.auth);
  const filters = useSelector((state) => state.incidentApproval.filters);

  const [deleteStaff, { isLoading: isDeleting }] = useDeleteStaffMutation();


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


  const handleOnDelete = async (row) => {
    const callback = async () => {
      try {
        await deleteStaff({
          userId: row.UserId,
          loginUserId: userDetails?.UserId,
          menuId: selectedMenu?.id,
        }).unwrap();

        showSweetAlert({
          type: 'success',
          title: 'Deleted!',
          text: 'Your staff has been deleted.',
          timer: 3000,
          gif: SuccessGif,
          height: 250,
          width: 250,
        });
      } catch (error) {
        console.log({ error });
      }
    };
    showSweetAlert({
      type: 'delete',
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      gif: DeleteUserGif,
      callback,
      cancelButtonText: 'No, Keep it',
      confirmButtonText: 'Yes, delete it!',
    });
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


  const handleClick = (incidentId) => {
    window.open(`/IncidentManagement/IncidentApprovalCompleted/${incidentId}`, '_blank');
  };

  return (
    <FlexContainer flexDirection="column">
      <TableContainer component={Paper}>
      
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
                <StyledTableHeaderCell>Actions</StyledTableHeaderCell>
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
                            {column.id === 'IncidentDateTime' || column.id ==='ReportedDate' || column.id ==='CompletedDate' &&
                            row[column.id] ? (
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
                       <ActionCell style={{ textAlign: 'center' }}>
                          <StyledImage
                            cursor="pointer"
                            height="15px"
                            width="20px"
                            src={ViewOnlyIcon}
                            onClick={() => handleClick(row.IncidentId)}
                            alt="View"
                          />
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

export default DataTable;
