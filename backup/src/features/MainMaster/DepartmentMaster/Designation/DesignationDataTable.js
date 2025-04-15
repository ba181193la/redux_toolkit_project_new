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
import {
  setDesignationPageIndex,
  setDesignationPageSize,
} from '../../../../redux/features/mainMaster/departmentMasterSlice';
import { useDeleteDesignationMutation } from '../../../../redux/RTK/departmentMasterApi';
import formatDate from '../../../../utils/FormatDate';
import AddEditDesignation from './AddEditDesignation';
import DeleteUserGif from '../../../../assets/Gifs/DeleteuserGif.gif';
import SuccessGif from '../../../../assets/Gifs/SuccessGif.gif';
import { showSweetAlert } from '../../../../utils/SweetAlert';
import CustomScrollbars from '../../../../components/CustomScrollbars/CustomScrollbars';
import { checkAccess } from '../../../../utils/Auth';

const DesignationDataTable = ({
  columns = [],
  records,
  totalRecords,
  isEdit,
  isDelete,
  isView,
  labels,
  showDesignationModal,
  setShowDesignationModal,
  departmentList,
  refetch,
  fieldAccess,
  facilityList,
  tabs,
}) => {
  // * Hooks declaration
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();
  //* Selectors
  const { pageIndex, pageSize } = useSelector(
    (state) => state.departmentMaster.designationFilters
  );
  const { userDetails, selectedMenu, isSuperAdmin } = useSelector(
    (state) => state.auth
  );

  //* State Variables
  const [selectedDesignationId, setSelectedDesignationId] = useState(null);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');

  //* RTK Queries
  const [triggerDeleteDesignation] = useDeleteDesignationMutation();

  //* Handlers for pagination
  const handleOnPageChange = (event, newPage) => {
    dispatch(setDesignationPageIndex(newPage));
  };

  const handleOnPageSizeChange = (event) => {
    dispatch(setDesignationPageSize(parseInt(event.target.value, 10)));
    dispatch(setDesignationPageIndex(0));
  };

  //* Edit designation
  const editDesignation = (deptId) => {
    setSelectedDesignationId(deptId);
    setShowDesignationModal(true);
  };

  //* Delete designation
  const deleteDesignation = async (designationDetails) => {
    const callback = async () => {
      try {
        await triggerDeleteDesignation({
          designationId: designationDetails?.DesignationId,
          loginUserId: userDetails?.UserId,
          menuId: selectedMenu?.id,
        }).unwrap();

        showSweetAlert({
          type: 'success',
          title: 'Deleted!',
          text: `${getlabel('MM_DM_DesignationName', labels, i18n.language)} has been deleted.`,
          timer: 3000,
          gif: SuccessGif,
          height: 250,
          width: 250,
        });
        refetch();
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
                            column?.translationId,
                            labels,
                            i18n.language
                          )}
                        </TableSortLabel>
                      </StyledTableHeaderCell>
                    ))}
                  {checkAccess(
                    isSuperAdmin,
                    roleMenu?.IsView,
                    roleMenu?.IsEdit || roleMenu?.IsDelete
                  ) && (
                    <StyledTableHeaderCell>
                      {t('Actions')}
                    </StyledTableHeaderCell>
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
                            {checkAccess(isSuperAdmin, isView, isEdit) && (
                              <Tooltip title="Edit" arrow>
                                <StyledImage
                                  cursor="pointer"
                                  height="12.5px"
                                  width="12.5px"
                                  src={EditIcon}
                                  alt="Edit"
                                  onClick={() =>
                                    editDesignation(row.DesignationId)
                                  }
                                />
                              </Tooltip>
                            )}
                            {checkAccess(isSuperAdmin, isView, isDelete) && (
                              <Tooltip title="Delete" arrow>
                                <StyledImage
                                  cursor="pointer"
                                  height="12.5px"
                                  width="12.5px"
                                  src={DeleteIcon}
                                  alt="Delete"
                                  onClick={() => deleteDesignation(row)}
                                />
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
                        {getlabel(column?.translationId, labels, i18n.language)}
                      </TableSortLabel>
                    </StyledTableHeaderCell>
                  ))}
                {checkAccess(isSuperAdmin, isView, isEdit || isDelete) && (
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
                      .map((column) => {
                        return (
                          <StyledTableBodyCell
                            key={column.id}
                            status={
                              column.id === 'Status' ? row[column.id] : ''
                            }
                          >
                            {column.id === 'Added_EditedDate' && row[column.id]
                              ? formatDate(row[column.id])
                              : (row[column.id] ?? null)}
                          </StyledTableBodyCell>
                        );
                      })}
                    {checkAccess(isSuperAdmin, isView, isEdit || isDelete) && (
                      <ActionCell>
                        <FlexContainer className="action-icons">
                          {checkAccess(isSuperAdmin, isView, isEdit) && (
                            <Tooltip title="Edit" arrow>
                              <StyledImage
                                cursor="pointer"
                                height="12.5px"
                                width="12.5px"
                                src={EditIcon}
                                alt="Edit"
                                onClick={() =>
                                  editDesignation(row.DesignationId)
                                }
                              />
                            </Tooltip>
                          )}
                          {checkAccess(isSuperAdmin, isView, isDelete) && (
                            <Tooltip title="Delete" arrow>
                              <StyledImage
                                cursor="pointer"
                                height="12.5px"
                                width="12.5px"
                                src={DeleteIcon}
                                alt="Delete"
                                onClick={() => deleteDesignation(row)}
                              />
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
      {showDesignationModal && (
        <AddEditDesignation
          tabs={tabs}
          showDesignationModal={showDesignationModal}
          selectedDesignationId={selectedDesignationId}
          setSelectedDesignationId={setSelectedDesignationId}
          setShowDesignationModal={setShowDesignationModal}
          departmentList={departmentList}
          labels={labels}
          refetch={refetch}
          fieldAccess={fieldAccess}
          facilityList={facilityList}
        />
      )}
    </FlexContainer>
  );
};

export default DesignationDataTable;
