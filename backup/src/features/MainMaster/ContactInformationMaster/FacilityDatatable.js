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
import EditIcon from '../../../assets/Icons/EditIcon.png';
import DeleteIcon from '../../../assets/Icons/DeleteIcon.png';
import {
  StyledTableBodyCell,
  StyledTableHeaderCell,
  StyledTableRow,
  ActionCell,
  StyledTableHead,
} from '../../../utils/DataTable.styled';
import { FlexContainer, StyledImage } from '../../../utils/StyledComponents';
import CustomPagination from '../../../components/Pagination/CustomPagination';
import Scrollbars from 'react-custom-scrollbars-2';
import { useTranslation } from 'react-i18next';
import { getlabel } from '../../../utils/language';
import { useDispatch, useSelector } from 'react-redux';
import {
  setFacilityPageIndex,
  setFacilityPageSize,
} from '../../../redux/features/mainMaster/contactInformationSlice';
import { useNavigate } from 'react-router-dom';
import { useDeleteFacilityMutation } from '../../../redux/RTK/contactInformationApi';
import { showSweetAlert } from '../../../utils/SweetAlert';
import DeleteUserGif from '../../../assets/Gifs/DeleteuserGif.gif';
import SuccessGif from '../../../assets/Gifs/SuccessGif.gif';
import CustomScrollbars from '../../../components/CustomScrollbars/CustomScrollbars';
import { checkAccess } from '../../../utils/Auth';

const FacilityDataTable = ({
  columns = [],
  records,
  totalRecords,
  totalPages,
  isView = false,
  labels,
}) => {
  const { i18n, t } = useTranslation();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { facilityPageIndex, facilityPageSize } = useSelector(
    (state) => state.contactInformationMaster
  );
  const { userDetails, selectedMenu, isSuperAdmin, roleFacilities } =
    useSelector((state) => state.auth);
  const [deleteFacility] = useDeleteFacilityMutation();
  const handleOnPageChange = (event, newPage) => {
    dispatch(setFacilityPageIndex(newPage));
  };

  const handleOnPageSizeChange = (event) => {
    dispatch(setFacilityPageSize(parseInt(event.target.value, 10)));
    dispatch(setFacilityPageIndex(0));
  };

  const handleOnDelete = async (row) => {
    const callback = async () => {
      try {
        await deleteFacility({
          FacilityId: row.FacilityId,
          loginUserId: userDetails?.UserId,
          menuId: selectedMenu?.id,
        }).unwrap();

        showSweetAlert({
          type: 'success',
          title: 'Deleted!',
          text: 'Your facility has been deleted.',
          timer: 3000,
          gif: SuccessGif,
          height: 250,
          width: 250,
        });
      } catch (error) {}
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

  const handleOnEdit = async (row) => {
    navigate(`/MainMaster/AddNewContactInfo/${row.FacilityId}`);
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
        {facilityPageSize > 25 ? (
          <CustomScrollbars
            style={{ height: '1250px' }}
            rtl={i18n.language === 'ar'}
          >
            <Table stickyHeader style={{ borderCollapse: 'collapse' }}>
              <StyledTableHead>
                <TableRow>
                  <StyledTableHeaderCell>{t('SNo')}</StyledTableHeaderCell>
                  {columns
                    ?.filter((col) => col.isShow)
                    ?.map((column) => (
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
                    <StyledTableHeaderCell>
                      {t('Actions')}
                    </StyledTableHeaderCell>
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
                          {facilityPageIndex * facilityPageSize + rowIndex + 1}
                        </StyledTableBodyCell>
                        {columns
                          ?.filter((col) => col.isShow)
                          ?.map((column) => {
                            return (
                              <StyledTableBodyCell
                                key={column.id}
                                status={
                                  column.id === 'status' ? row[column.id] : ''
                                }
                              >
                                {row[column.id] !== undefined
                                  ? row[column.id]
                                  : null}
                              </StyledTableBodyCell>
                            );
                          })}
                        {checkAccess(
                          isSuperAdmin,
                          isView,
                          role?.IsEdit || role?.IsDelete
                        ) && (
                          <ActionCell>
                            <FlexContainer className="action-icons">
                              {checkAccess(
                                isSuperAdmin,
                                isView,
                                role?.IsEdit || false
                              ) &&
                                userDetails?.StaffCategoryId === 1 && (
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
                              {checkAccess(
                                isSuperAdmin,
                                isView,
                                role?.IsDelete || false
                              ) &&
                                userDetails?.StaffCategoryId === 1 && (
                                  <Tooltip title="Delete" arrow>
                                    <StyledImage
                                      cursor="pointer"
                                      height="12.5px"
                                      width="12.5px"
                                      src={DeleteIcon}
                                      alt="Delete"
                                      tooltip="Delete"
                                      onClick={() => handleOnDelete(row)}
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
                      colSpan={columns?.filter((col) => col.isShow).length + 2}
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
                {columns
                  ?.filter((col) => col.isShow)
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
                        {facilityPageIndex * facilityPageSize + rowIndex + 1}
                      </StyledTableBodyCell>
                      {columns
                        ?.filter((col) => col.isShow)
                        ?.map((column) => {
                          return (
                            <StyledTableBodyCell
                              key={column.id}
                              status={
                                column.id === 'status' ? row[column.id] : ''
                              }
                            >
                              {row[column.id] !== undefined
                                ? row[column.id]
                                : null}
                            </StyledTableBodyCell>
                          );
                        })}
                      {checkAccess(
                        isSuperAdmin,
                        isView,
                        role?.IsEdit || role?.IsDelete
                      ) && (
                        <ActionCell>
                          <FlexContainer className="action-icons">
                            {checkAccess(
                              isSuperAdmin,
                              isView,
                              role?.IsEdit || false
                            ) &&
                              userDetails?.StaffCategoryId === 1 && (
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
                            {checkAccess(
                              isSuperAdmin,
                              isView,
                              role?.IsDelete || false
                            ) &&
                              userDetails?.StaffCategoryId === 1 && (
                                <Tooltip title="Delete" arrow>
                                  <StyledImage
                                    cursor="pointer"
                                    height="12.5px"
                                    width="12.5px"
                                    src={DeleteIcon}
                                    alt="Delete"
                                    tooltip="Delete"
                                    onClick={() => handleOnDelete(row)}
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
                    colSpan={columns?.filter((col) => col.isShow).length + 2}
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
          totalPages={totalPages}
          page={facilityPageIndex}
          pageSize={facilityPageSize}
          handleOnPageChange={handleOnPageChange}
          handleOnPageSizeChange={handleOnPageSizeChange}
        />
      )}
    </FlexContainer>
  );
};

export default FacilityDataTable;
