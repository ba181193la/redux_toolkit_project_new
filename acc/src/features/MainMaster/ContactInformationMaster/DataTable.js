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
import AddLicenseIcon from '../../../assets/Icons/AddLicense.png';
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
import AddLicense from './AddLicense';
import AddCompany from './AddCompany';
import { useDispatch, useSelector } from 'react-redux';
import {
  setPageIndex,
  setPageSize,
} from '../../../redux/features/mainMaster/contactInformationSlice';
import { useDeleteCompanyMutation } from '../../../redux/RTK/contactInformationApi.js';
import { showSweetAlert } from '../../../utils/SweetAlert';
import DeleteUserGif from '../../../assets/Gifs/DeleteuserGif.gif';
import SuccessGif from '../../../assets/Gifs/SuccessGif.gif';
import { checkAccess } from '../../../utils/Auth';
import CustomScrollbars from '../../../components/CustomScrollbars/CustomScrollbars';

const DataTable = ({
  columns = [],
  records,
  totalRecords,
  totalPages,
  isEdit,
  isDelete,
  isView = false,
  // isView,
  labels,
  refetch,
  fieldAccess,
  isMobile,
  isTablet,
  staffCategoryId,
}) => {
  const { i18n } = useTranslation();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { pageSize, pageIndex } = useSelector(
    (state) => state.contactInformationMaster
  );
  const { userDetails, selectedMenu, isSuperAdmin, roleFacilities } =
    useSelector((state) => state.auth);
  const [showLicenseModal, setShowLicenseModal] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [deleteCompany] = useDeleteCompanyMutation();
  const [selectedRow, setSelectedRow] = useState('');
  const [isEditCompany, setIsEditCompany] = useState(false);

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
        await deleteCompany({
          companyId: row.CompanyId,
          loginUserId: userDetails?.UserId,
          menuId: selectedMenu?.id,
        }).unwrap();

        showSweetAlert({
          type: 'success',
          title: 'Deleted!',
          text: 'Company has been deleted.',
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

  const handleOnEdit = async (CompanyId) => {
    setSelectedCompanyId(CompanyId);
    setShowCompanyModal(true);
    setIsEditCompany(true);
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
        {pageSize>25 ? (
      <CustomScrollbars
          style={{ height: '1250px' }}
          rtl={i18n.language === 'ar'}
        >
          <Table stickyHeader style={{ borderCollapse: 'collapse' }}>
            <StyledTableHead>
              <TableRow>
                <StyledTableHeaderCell>{t('SNo')}</StyledTableHeaderCell>
                {columns.map((column) => (
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
                sortedRecords.map((row, rowIndex) => {
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
                      {columns.map((column) => (
                        <StyledTableBodyCell
                          key={column.id}
                          status={
                            column.id === 'LicenseStatus'
                              ? row.IsActive
                                ? 'Active'
                                : 'Expired'
                              : ''
                          }
                        >
                          {column.id === 'LicenseStatus'
                            ? row.IsActive
                              ? 'Active'
                              : row.RenewalDate === null
                                  ? 'Not Created'
                              : 'Expired'
                            : row[column.id] !== undefined
                              ? row[column.id]
                              : null}
                        </StyledTableBodyCell>
                      ))}
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
                                    tooltip="Edit"
                                    src={EditIcon}
                                    alt="Edit"
                                    onClick={() => handleOnEdit(row?.CompanyId)}
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
                            {userDetails?.StaffCategoryId === 2 ||
                              (userDetails?.StaffCategoryId === 1 && (
                                <Tooltip title="Add/Renew License" arrow>
                                  <StyledImage
                                    cursor="pointer"
                                    height="12.5px"
                                    width="12.5px"
                                    src={AddLicenseIcon}
                                    alt="AddLicense"
                                    onClick={() => {
                                      setShowLicenseModal(true);
                                      setSelectedRow(row);
                                    }}
                                  />
                                </Tooltip>
                              ))}
                          </FlexContainer>
                        </ActionCell>
                      )}
                    </StyledTableRow>
                  );
                })
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
                  <StyledTableHeaderCell>{t('SNo')}</StyledTableHeaderCell>
                  {columns.map((column) => (
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
                  sortedRecords.map((row, rowIndex) => {
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
                        {columns.map((column) => (
                          <StyledTableBodyCell
                            key={column.id}
                            status={
                              column.id === 'LicenseStatus'
                                ? row.IsActive
                                  ? 'Active'
                                  : 'Expired'
                                : ''
                            }
                          >
                            {column.id === 'LicenseStatus'
                              ? row.IsActive
                                ? 'Active'
                                : row.RenewalDate === null
                                ? 'Not Created'
                                : 'Expired'
                              : row[column.id] !== undefined
                                ? row[column.id]
                                : null}
                          </StyledTableBodyCell>
                        ))}
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
                                      tooltip="Edit"
                                      src={EditIcon}
                                      alt="Edit"
                                      onClick={() => handleOnEdit(row?.CompanyId)}
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
                              {userDetails?.StaffCategoryId === 2 ||
                                (userDetails?.StaffCategoryId === 1 && (
                                  <Tooltip title="Add/Renew License" arrow>
                                    <StyledImage
                                      cursor="pointer"
                                      height="12.5px"
                                      width="12.5px"
                                      src={AddLicenseIcon}
                                      alt="AddLicense"
                                      onClick={() => {
                                        setShowLicenseModal(true);
                                        setSelectedRow(row);
                                      }}
                                    />
                                  </Tooltip>
                                ))}
                            </FlexContainer>
                          </ActionCell>
                        )}
                      </StyledTableRow>
                    );
                  })
                ) : (
                  <TableRow>
                  <StyledTableBodyCell colSpan={columns.length+2} align='center'>
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
          totalPages={totalPages}
          page={pageIndex}
          pageSize={pageSize}
          handleOnPageChange={handleOnPageChange}
          handleOnPageSizeChange={handleOnPageSizeChange}
        />
      )}

      <AddLicense
        open={showLicenseModal}
        onClose={() => setShowLicenseModal(false)}
        selectedRow={selectedRow}
        refetch={refetch}
        isMobile={isMobile}
        isTablet={isTablet}
        labels={labels}
      />

      <AddCompany
        open={showCompanyModal}
        selectedCompanyId={selectedCompanyId}
        records={records}
        isEditCompany={isEditCompany}
        setShowCompanyModal={setShowCompanyModal}
        labels={labels}
        refetch={refetch}
        fieldAccess={fieldAccess}
      />
    </FlexContainer>
  );
};

export default DataTable;
