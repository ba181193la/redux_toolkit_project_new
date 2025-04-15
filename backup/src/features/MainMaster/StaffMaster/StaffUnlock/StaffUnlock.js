import React, { useEffect, useState } from 'react';
import {
  TableBody,
  TableContainer,
  TableRow,
  Paper,
  InputAdornment,
  CircularProgress,
  TableSortLabel,
} from '@mui/material';
import Search from '../../../../assets/Icons/Search.png';
import {
  FlexContainer,
  StyledImage,
  StyledSearch,
} from '../../../../utils/StyledComponents.js';
import {
  StyledTableBodyCell,
  StyledTableHeaderCell,
  StyledTableHead,
  ActionCell,
  StyledTableRow,
} from '../../../../utils/DataTable.styled';
import UnlockIcon from '../../../../assets/Icons/UnlockIcon.png';
import {
  useGetStaffUnlockQuery,
  useUnlockStaffMutation,
} from '../../../../redux/RTK/staffMasterApi';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { unlockColumnsMapping } from '../StaffList/ColumnsMapping';
import {
  useGetFieldsQuery,
  useGetLabelsQuery,
} from '../../../../redux/RTK/moduleDataApi';
import { getlabel } from '../../../../utils/language';
import { checkAccess } from '../../../../utils/Auth';
import useWindowDimension from '../../../../hooks/useWindowDimension';
import SearchIcon from '../../../../assets/Icons/Search.png';
import Swal from 'sweetalert2';
import { showToastAlert } from '../../../../utils/SweetAlert';
import { reset } from '../../../../redux/features/auth/wrongLoginAttemptsSlice';

const StaffUnlock = () => {
  const { isMobile, isTablet } = useWindowDimension();
  const { i18n, t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColumns, setSelectedColumns] = useState(unlockColumnsMapping);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [roleMenu, setRoleMenu] = useState();
  const [userSearchKeyword, setUserSearchKeyword] = useState('');
  const [filteredRecords, setFilteredRecords] = useState([]);

  const {
    selectedMenu,
    userDetails,
    selectedModuleId,
    isSuperAdmin,
    selectedRoleFacility,
  } = useSelector((state) => state.auth);

  const { data: fields = [], isFetching: isFieldsFetching } = useGetFieldsQuery(
    {
      menuId: selectedMenu?.id,
      moduleId: selectedModuleId,
    }
  );

  const { data: labels = [], isFetching: isLabelsFetching } = useGetLabelsQuery(
    {
      menuId: selectedMenu?.id,
      moduleId: selectedModuleId,
    }
  );

  const {
    data: staffUnlockdata = [],
    isFetching,
    refetch,
  } = useGetStaffUnlockQuery({
    menuId: selectedMenu?.id,
    loginUserId: userDetails?.UserId,
  });
  const [triggerUnlock] = useUnlockStaffMutation();
  const { Data } = staffUnlockdata || {
    Data: [],
  };

  useEffect(() => {
    setFilteredRecords([...(Data || [])]);
  }, [Data]);
  useEffect(() => {
    const pageFields = fields?.Data?.Sections?.find(
      (section) => section.SectionName === 'Page'
    )?.Fields;
    setSelectedColumns((prevColumns) =>
      prevColumns?.map((column) => {
        return {
          ...column,
          isShow: pageFields?.find((col) => col.FieldId === column.fieldId)
            ?.IsShow,
        };
      })
    );
  }, [fields]);

  useEffect(() => {
    const roleMenu = selectedRoleFacility?.Menu.find(
      (item) => item.MenuId === selectedMenu?.id
    );
    setRoleMenu(roleMenu);
  }, [selectedRoleFacility, selectedMenu]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const handleOnUnlock = async (row) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to unlock this user?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Unlock!',
      cancelButtonText: 'No',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await triggerUnlock({
            payload: {
              userId: row.UserId,
              moduleId: selectedModuleId,
              menuId: selectedMenu?.id,
              loginUserId: userDetails?.UserId,
            },
          }).unwrap();

          showToastAlert({
            type: 'custom_success',
            text: 'Unlocked successfully',
            gif: 'SuccessGif',
          });

          refetch();

          dispatch(reset(userDetails?.EmployeeID));
        } catch (error) {
          console.log('Error!', error);
        }
      }
    });
  };

  const handleSortRequest = (column) => {
    const isAsc = orderBy === column && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(column);
  };

  const normalizeString = (str) => {
    return str
      .split('-')
      .map((part) => part.trim())
      .join('-');
  };

  return (
    <>
      {isFetching ? (
        <FlexContainer
          alignItems="center"
          justifyContent="center"
          height="100%"
        >
          <CircularProgress size={25} color="primary" />
        </FlexContainer>
      ) : (
        <FlexContainer flexDirection="column">
          {/* <StyledSearch
            variant="outlined"
            placeholder={
              i18n.language === 'ar'
                ? t('SearchByKeywords')
                : 'Search by keywords'
            }
            value={searchQuery}
            onChange={handleSearchChange}
            fullWidth
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <StyledImage src={Search} alt="Search Icon" />
                </InputAdornment>
              ),
            }}
          /> */}
          <StyledSearch
            variant="outlined"
            placeholder={
              i18n.language === 'ar'
                ? t('SearchByKeywords')
                : 'Search by keywords'
            }
            value={userSearchKeyword}
            onChange={(event) => {
              const searchTerm = event.target.value?.toLowerCase();
              setUserSearchKeyword(event.target.value);
              // if (searchTerm?.length < 2) {
              //   setFilteredRecords(Records);
              //   return;
              // }

              setFilteredRecords(
                staffUnlockdata?.Data?.filter((item) => {
                  const staffName = item.UserName?.toLowerCase() || '';
                  const employeeID = item.EmployeeID?.toLowerCase() || '';
                  const facility = item.FacilityName?.toLowerCase() || '';
                  const department = item.DepartmentName?.toLowerCase() || '';
                  return (
                    staffName.includes(searchTerm) ||
                    employeeID.includes(searchTerm) ||
                    department.includes(searchTerm) ||
                    facility.includes(searchTerm)
                  );
                }) || []
              );
            }}
            width={isMobile ? '100%' : '250px'}
            fullWidth={isMobile}
            margin="normal"
            autoComplete="off"
            InputProps={{
              startAdornment: (
                <InputAdornment
                  position="start"
                  style={{ paddingInlineStart: '10px' }}
                >
                  <StyledImage src={SearchIcon} alt="Search Icon" />
                </InputAdornment>
              ),
            }}
          />
          <TableContainer
            component={Paper}
            className="table-container"
            alignItems="start"
          >
            <StyledTableHead style={{ background: '#0083C0' }}>
              <TableRow>
                <StyledTableHeaderCell>{t('SNo')}</StyledTableHeaderCell>
                {selectedColumns
                  ?.filter((col) => col.isSelected)
                  ?.map((column) => (
                    <StyledTableHeaderCell key={column.id} width={'25%'}>
                      <TableSortLabel
                        active={orderBy === column.id}
                        direction={orderBy === column.id ? order : 'asc'}
                        onClick={() => handleSortRequest(column.id)}
                      >
                        {getlabel(column.translationId, labels, i18n.language)}
                      </TableSortLabel>
                    </StyledTableHeaderCell>
                  ))}
                {checkAccess(isSuperAdmin, roleMenu?.isView, true) && (
                  <StyledTableHeaderCell>Actions</StyledTableHeaderCell>
                )}
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {filteredRecords.length > 0 ? (
                filteredRecords
                  ?.filter(
                    (row) =>
                      normalizeString(selectedRoleFacility?.FacilityName) ===
                      normalizeString(row?.FacilityName)
                  )
                  ?.map((row, index) => {
                    return (
                      <StyledTableRow key={row.UserId}>
                        <StyledTableBodyCell>{index + 1}</StyledTableBodyCell>
                        <StyledTableBodyCell>
                          {row.UserName}
                        </StyledTableBodyCell>
                        <StyledTableBodyCell>
                          {row.EmployeeID}
                        </StyledTableBodyCell>
                        <StyledTableBodyCell>
                          {row.FacilityName}
                        </StyledTableBodyCell>
                        <StyledTableBodyCell>
                          {row.DepartmentName}
                        </StyledTableBodyCell>
                        <ActionCell>
                          <FlexContainer className="action-icons">
                            <StyledImage
                              src={UnlockIcon}
                              alt="Unlock"
                              width="24px"
                              height="24px"
                              cursor="pointer"
                              onClick={() => handleOnUnlock(row)}
                            />
                          </FlexContainer>
                        </ActionCell>
                      </StyledTableRow>
                    );
                  })
              ) : (
                <TableRow>
                  <StyledTableBodyCell
                    colSpan={selectedColumns.length + 2}
                    align="center"
                  >
                    {t('NoDataAvailable')}
                  </StyledTableBodyCell>
                </TableRow>
              )}
            </TableBody>
          </TableContainer>
        </FlexContainer>
      )}
    </>
  );
};

export default StaffUnlock;
