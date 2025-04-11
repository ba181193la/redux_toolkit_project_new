import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  TableRow,
  Paper,
  Tooltip,
  TableSortLabel,
} from '@mui/material';
import EditIcon from '../../../assets/Icons/EditIcon.png';
import EyeIcon from '../../../assets/Icons/EyeIcon.png';
import {
  StyledTableBodyCell,
  StyledTableHeaderCell,
  StyledTableRow,
  ActionCell,
  StyledTableHead,
} from '../../../utils/DataTable.styled';
import {
  setPageIndex,
  setPageSize,
} from '../../../redux/features/mainMaster/passwordManagementSlice';
import { FlexContainer, StyledImage } from '../../../utils/StyledComponents';
import CustomPagination from '../../../components/Pagination/CustomPagination';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getlabel } from '../../../utils/language';
import { checkAccess } from '../../../utils/Auth';
import CustomScrollbars from '../../../components/CustomScrollbars/CustomScrollbars';

const PasswordManagementDataTable = ({
  columns = [],
  records,
  totalRecords,
  isEdit,
  isView,
  isDelete,
  labels,
  setSelectedStaffDetails,
  setShowPasswordDetailsModal,
  setTableActionType,
  pageFields,
}) => {
  // * Hooks declaration
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();

  //* Selectors
  const { isSuperAdmin,roleFacilities,selectedMenu } = useSelector((state) => state.auth);
  const { pageIndex, pageSize } = useSelector(
    (state) => state.passwordManagement.filters
  );

  //* State Variables
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [tableColumn, setTableColumn] = useState([columns]);

  //* Handlers for pagination
  const handleOnPageChange = (event, newPage) => {
    dispatch(setPageIndex(newPage));
  };

  const handleOnPageSizeChange = (event) => {
    dispatch(setPageSize(parseInt(event.target.value, 10)));
    dispatch(setPageIndex(0));
  };

  //* Edit Password Details
  const editPasswordDetails = (staffDetails) => {
    setTableActionType('Edit');
    setSelectedStaffDetails(staffDetails);
    setShowPasswordDetailsModal(true);
  };
  //* View Password Details
  const viewPasswordDetails = (staffDetails) => {
    setTableActionType('View');
    setSelectedStaffDetails(staffDetails);
    setShowPasswordDetailsModal(true);
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

  useEffect(() => {
    setTableColumn(
      columns.map((col) => ({
        ...col,
        isShow: pageFields?.find((x) => x.FieldId === col.fieldId)?.IsShow,
      }))
    );
  }, [columns, pageFields]);

  return (
    <>
      <TableContainer component={Paper} className="table-container">
      {pageSize>25? (
      <CustomScrollbars
          style={{ height: '1250px' }}
          rtl={i18n.language === 'ar'}
        >
        <Table stickyHeader style={{ borderCollapse: 'collapse' }}>
          <StyledTableHead>
            <TableRow>
              <StyledTableHeaderCell>S.No</StyledTableHeaderCell>
              {tableColumn
                ?.filter((col) => col.isShow && col.isSelected)
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
                <StyledTableHeaderCell>Action</StyledTableHeaderCell>
              )}
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {sortedRecords?.length >0 ? (
              sortedRecords?.map((row, rowIndex) =>
                {                  
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
                  {tableColumn
                    ?.filter((col) => col.isShow && col.isSelected)
                    .map((column) => {
                      return (
                        <StyledTableBodyCell
                          key={column.id}
                          status={column.id === 'Status' ? row[column.id] : ''}
                        >
                          {column.id === 'Added_EditedDate' && row[column.id]
                            ? formatDate(row[column.id])
                            : (row[column.id] ?? null)}
                        </StyledTableBodyCell>
                      );
                    })}
                   {checkAccess(isSuperAdmin, role?.IsView, role?.IsEdit || role?.IsView) ? (
                    <ActionCell>
                      <FlexContainer className="action-icons">
                        {checkAccess(isSuperAdmin, role?.IsView, role?.IsEdit) && (
                          <Tooltip title="Edit" arrow>
                            <StyledImage
                              cursor="pointer"
                              height="12.5px"
                              width="12.5px"
                              src={EditIcon}
                              tooltip="Edit"
                              alt="Edit"
                              onClick={() => {
                                editPasswordDetails(row);
                              }}
                            />
                          </Tooltip>
                        )}
                        {checkAccess(isSuperAdmin, role?.IsView,role?.IsView) && (
                          <Tooltip title="View" arrow>
                            <StyledImage
                              cursor="pointer"
                              height="11.5px"
                              width="14.5px"
                              src={EyeIcon}
                              alt="Delete"
                              onClick={() => {
                                viewPasswordDetails(row);
                              }}
                            />
                          </Tooltip>
                        )}
                      </FlexContainer>
                    </ActionCell>
                  ):(<ActionCell></ActionCell>)
                  }
                </StyledTableRow>
              )})
            ) : (
              <TableRow>
                <StyledTableBodyCell colSpan={columns.length+2} align='center'>
                  {t('NoDataAvailable')}
                </StyledTableBodyCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        </CustomScrollbars>):(
           <Table stickyHeader style={{ borderCollapse: 'collapse' }}>
           <StyledTableHead>
             <TableRow>
               <StyledTableHeaderCell>S.No</StyledTableHeaderCell>
               {tableColumn
                 ?.filter((col) => col.isShow && col.isSelected)
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
               {checkAccess(isSuperAdmin, isView, isView || isEdit) && (
                 <StyledTableHeaderCell>Action</StyledTableHeaderCell>
               )}
             </TableRow>
           </StyledTableHead>
           <TableBody>
             {sortedRecords?.length > 0 ? (
               sortedRecords?.map((row, rowIndex) => (
                 <StyledTableRow key={rowIndex}>
                   <StyledTableBodyCell>
                     {pageIndex * pageSize + rowIndex + 1}
                   </StyledTableBodyCell>
                   {tableColumn
                     ?.filter((col) => col.isShow && col.isSelected)
                     .map((column) => {
                       return (
                         <StyledTableBodyCell
                           key={column.id}
                           status={column.id === 'Status' ? row[column.id] : ''}
                         >
                           {column.id === 'Added_EditedDate' && row[column.id]
                             ? formatDate(row[column.id])
                             : (row[column.id] ?? null)}
                         </StyledTableBodyCell>
                       );
                     })}
                   {checkAccess(isSuperAdmin, isView, isEdit || isView) && (
                     <ActionCell>
                       <FlexContainer className="action-icons">
                         {checkAccess(isSuperAdmin, isView, isEdit) && (
                           <Tooltip title="Edit" arrow>
                             <StyledImage
                               cursor="pointer"
                               height="12.5px"
                               width="12.5px"
                               src={EditIcon}
                               tooltip="Edit"
                               alt="Edit"
                               onClick={() => {
                                 editPasswordDetails(row);
                               }}
                             />
                           </Tooltip>
                         )}
                         {checkAccess(isSuperAdmin, isView, isView) && (
                           <Tooltip title="View" arrow>
                             <StyledImage
                               cursor="pointer"
                               height="11.5px"
                               width="14.5px"
                               src={EyeIcon}
                               alt="Delete"
                               onClick={() => {
                                 viewPasswordDetails(row);
                               }}
                             />
                           </Tooltip>
                         )}
                       </FlexContainer>
                     </ActionCell>
                   )}
                 </StyledTableRow>
               ))
             ) : (
              <TableRow>
              <StyledTableBodyCell colSpan={columns.length+2} align="center">
                {t('NoDataAvailable')}
              </StyledTableBodyCell>
            </TableRow>
             )}
           </TableBody>
         </Table>
        )}
      </TableContainer>
      {
        totalRecords>0&&
        <CustomPagination
        totalRecords={totalRecords}
        page={pageIndex}
        pageSize={pageSize}
        handleOnPageChange={handleOnPageChange}
        handleOnPageSizeChange={handleOnPageSizeChange}
      />
      }
     
    </>
  );
};

export default PasswordManagementDataTable;
