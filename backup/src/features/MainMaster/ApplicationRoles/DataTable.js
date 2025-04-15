import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  TableRow,
  Paper,
  Divider,
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
import CustomScrollbars from '../../../components/CustomScrollbars/CustomScrollbars';
import { getlabel } from '../../../utils/language';
import { useDispatch, useSelector } from 'react-redux';
import {
  setPageIndex,
  setPageSize,
} from '../../../redux/features/mainMaster/applicationRoleSlice';
import { useDeleteApplicationRoleMutation } from '../../../redux/RTK/applicationRoleApi';
import { useNavigate } from 'react-router-dom';
import formatDate from '../../../utils/FormatDate';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { showSweetAlert } from '../../../utils/SweetAlert';
import DeleteUserGif from '../../../assets/Gifs/DeleteuserGif.gif';
import SuccessGif from '../../../assets/Gifs/SuccessGif.gif';
import { checkAccess } from '../../../utils/Auth';

export const StyledDivider = styled(Divider)`
  width: 0px !important;
  height: 30px !important;
  border-left: 1px solid #fff !important;
`;

const DataTable = ({
  columns = [],
  data = [],
  labels,
  totalRecords,
  isView = false,
  isEdit = false,
  isDelete = false,
  TotalPages,
}) => {
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pageSize, pageIndex } = useSelector((state) => state.applicationRole);
  const { userDetails, selectedMenu, roleFacilities, isSuperAdmin } =
    useSelector((state) => state.auth);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');

  const [deleteApplicationRole] = useDeleteApplicationRoleMutation();

  const handleOnPageChange = (event, newPage) => {
    dispatch(setPageIndex(newPage));
  };

  const handleOnPageSizeChange = (event) => {
    dispatch(setPageSize(parseInt(event.target.value, 10)));
    dispatch(setPageIndex(0));
  };

  const handleOnDelete = async (row) => {
    const callback = async () => {
      try {
        await deleteApplicationRole({
          roleId: row.RoleId,
          loginUserId: userDetails?.UserId,
          menuId: selectedMenu?.id,
        }).unwrap();

        showSweetAlert({
          type: 'success',
          title: 'Deleted!',
          text: 'Your Role has been deleted.',
          timer: 3000,
          gif: SuccessGif,
          height: 250,
          width: 250,
        });
      } catch (error) {
        console.error({ error });
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

  const handleOnEdit = async (row) => {
    navigate(`/MainMaster/AddNewRole/${row.RoleId}`);
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
      {pageSize>25? (
      <CustomScrollbars
          style={{ height: '1250px' }}
          rtl={i18n.language === 'ar'}
        >
        <Table stickyHeader style={{ borderCollapse: 'collapse' }}>
          <StyledTableHead>
            <TableRow>
              <StyledTableHeaderCell>{t('SNo')}</StyledTableHeaderCell>
              {columns.map((column) => {
                return (
                  <StyledTableHeaderCell key={column.id}>
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleSortRequest(column.id)}
                    >
                      {getlabel(column.translationId, labels, i18n.language)}
                    </TableSortLabel>
                  </StyledTableHeaderCell>
                );
              })}
              {checkAccess(isSuperAdmin, isView, true) && (
                <StyledTableHeaderCell>{t('Actions')}</StyledTableHeaderCell>
              )}
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {sortedRecords?.length >0 ? (
              sortedRecords?.map((row, rowIndex) => {
                return (
                  <StyledTableRow key={rowIndex}>
                    <StyledTableBodyCell>
                      {pageIndex * pageSize + rowIndex + 1}
                    </StyledTableBodyCell>
                    {columns.map((column) => (
                      <StyledTableBodyCell
                        key={column.id}
                        status={
                          column.id === 'ActiveStatus' ? row[column.id] : ''
                        }
                      >
                        {column.id === 'ModifiedDate' && row[column.id]
                          ? formatDate(row[column.id])
                          : (row[column.id] ?? null)}
                      </StyledTableBodyCell>
                    ))}
                        {checkAccess(isSuperAdmin, isView, isEdit || isDelete) ? (
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
                                tooltip="Edit"
                                alt="Edit"
                                onClick={() => handleOnEdit(row)}
                              />
                            </Tooltip>
                          )}
                          {checkAccess(
                            isSuperAdmin,
                            isView,
                            isDelete || false
                          ) && (
                            <Tooltip title="Delete" arrow>
                              <StyledImage
                                cursor="pointer"
                                height="12.5px"
                                width="12.5px"
                                src={DeleteIcon}
                                alt="Delete"
                                onClick={() => handleOnDelete(row)}
                              />
                            </Tooltip>
                          )}
                        </FlexContainer>
                      </ActionCell>
                    ):
                    (<ActionCell> </ActionCell>)}
                  </StyledTableRow>
                );
              })
            ) : (
             <TableRow>
                <StyledTableBodyCell  colSpan={columns.length+2} align="center">
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
                <StyledTableHeaderCell>{t('SNo')}</StyledTableHeaderCell>
                {columns.map((column) => {
                  return (
                    <StyledTableHeaderCell key={column.id}>
                      <TableSortLabel
                        active={orderBy === column.id}
                        direction={orderBy === column.id ? order : 'asc'}
                        onClick={() => handleSortRequest(column.id)}
                      >
                        {getlabel(column.translationId, labels, i18n.language)}
                      </TableSortLabel>
                    </StyledTableHeaderCell>
                  );
                })}
                {checkAccess(isSuperAdmin, isView, true) && (
                  <StyledTableHeaderCell>{t('Actions')}</StyledTableHeaderCell>
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
                      {columns.map((column) => (
                        <StyledTableBodyCell
                          key={column.id}
                          status={
                            column.id === 'ActiveStatus' ? row[column.id] : ''
                          }
                        >
                          {column.id === 'ModifiedDate' && row[column.id]
                            ? formatDate(row[column.id])
                            : (row[column.id] ?? null)}
                        </StyledTableBodyCell>
                      ))}
  
                      {checkAccess(isSuperAdmin, isView, isEdit || isDelete) && (
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
                                  tooltip="Edit"
                                  alt="Edit"
                                  onClick={() => handleOnEdit(row)}
                                />
                              </Tooltip>
                            )}
                            {checkAccess(
                              isSuperAdmin,
                              isView,
                              isDelete || false
                            ) && (
                              <Tooltip title="Delete" arrow>
                                <StyledImage
                                  cursor="pointer"
                                  height="12.5px"
                                  width="12.5px"
                                  src={DeleteIcon}
                                  alt="Delete"
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
                <StyledTableBodyCell colSpan={columns.length+2} align="center">
                  {t('NoDataAvailable')}
                </StyledTableBodyCell>
              </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {totalRecords>0 && (
        <CustomPagination
          totalRecords={totalRecords}
          TotalPages={TotalPages}
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
