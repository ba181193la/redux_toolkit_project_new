import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledSearch,
  StyledTypography,
} from '../../../utils/StyledComponents';
import styled from 'styled-components';

import {
  Autocomplete,
  Badge,
  Checkbox,
  Collapse,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
} from '@mui/material';

import plusIcon from '../../../assets/Icons/AddSubMaster.png';
import FilterIcon from '../../../assets/Icons/FilterIcon.png';
import Search from '../../../assets/Icons/Search.png';
import FilterTable from '../../../assets/Icons/FilterTable.png';
import WhiteSearch from '../../../assets/Icons/WhiteSearch.png';
import LoadingGif from '../../../assets/Gifs/LoadingGif.gif';
import FilterCloseIcon from '../../../assets/Icons/FilterCloseIcon.png';
import Eraser from '../../../assets/Icons/Eraser.png';
import StaffDetailListModel from './StaffDetailListModel';
import PasswordManagementDataTable from './PasswordManagementDataTable';
import Label from '../../../components/Label/Label';
import EmailUserCrenditalsModal from './EmailUserCrenditalsModal';
import PasswordPolicyModal from './PasswordPolicyModal';
import {
  useGetFieldsQuery,
  useGetLabelsQuery,
} from '../../../redux/RTK/moduleDataApi';
import {
  useGetPageLoadDataQuery,
  useGetStaffDetailsQuery,
} from '../../../redux/RTK/passwordManagementApi';
import {
  resetFilters,
  setFilters,
  setIsFilterApplied,
} from '../../../redux/features/mainMaster/passwordManagementSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Formik } from 'formik';
import { getlabel } from '../../../utils/language';
import MultiSelectDropdown from '../../../components/Dropdown/MultiSelectDropdown';
import EditViewPasswordDetails from './EditViewPasswordDetails';
import { checkAccess } from '../../../utils/Auth';
import { Box } from '@mui/system';
import SearchDropdown from '../../../components/SearchDropdown/SearchDropdown';

export const StyledDivider = styled(Divider)`
  width: 0px !important;
  height: 30px !important;
  border-left: 1px solid #99cde6 !important;
  opacity: 1 !important;
  align-self: center;
`;

const StyledCollapse = styled(Collapse)`
  padding: ${(props) => (props.openFilter ? '0 0 20px 0' : '0')};
`;

const BorderBox = styled.div`
  border: 1px solid #0083c0;
  padding: 6px 8px 8px 8px;
  border-radius: 4px;
`;

const PasswordManagement = () => {
  //* Hooks Declaration
  const { i18n } = useTranslation();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  //* Selectors
  const { pageIndex, pageSize } = useSelector(
    (state) => state.passwordManagement.filters
  );
  const { filters, isFilterApplied } = useSelector(
    (state) => state.passwordManagement
  );
  const {
    selectedRoleFacility,
    selectedMenu,
    selectedModuleId,
    userDetails,
    selectedFacility,
    isSuperAdmin,
    roleFacilities,
  } = useSelector((state) => state.auth);

  //* RTK Queries
  const { data: labels = [], isFetching: isFetchingLabels } = useGetLabelsQuery(
    {
      menuId: selectedMenu?.id,
      moduleId: selectedModuleId,
    }
  );

  const { data: pageLoadData } = useGetPageLoadDataQuery({
    menuId: selectedMenu?.id,
    loginUserId: userDetails?.UserId,
    headerFacilityId: selectedFacility?.id,
  });

  const { data: fields = [], isFetching: isFetchingFields } = useGetFieldsQuery(
    {
      menuId: selectedMenu?.id,
      moduleId: selectedModuleId,
    }
  );

  const searchFields = fields?.Data?.Sections?.find(
    (section) => section?.SectionName === 'Search'
  )?.Fields;

  const pageFields = fields?.Data?.Sections?.find(
    (section) => section?.SectionName === 'Page'
  )?.Fields;

  //* Variables Declaration
  const passwordManagementFilterFields = [
    {
      fieldId: 'FacilityName',
      translationId: 'MM_PM_Facility',
      label: 'Facility',
      component: 'MultiSelect',
      name: 'facilityId',
      isShow: searchFields?.find((x) => x.FieldId === 'PM_S_Facility')?.IsShow,
      options: userDetails?.ApplicableFacilities?.filter((facility) => {
        if (!facility.IsActive) return false;   
        if (isSuperAdmin) return true;
        const facilityItem = roleFacilities?.find(
          (role) => role.FacilityId === facility.FacilityId
        )?.Menu?.find(MenuItem=>MenuItem.MenuId===selectedMenu?.id)             
        return facilityItem?.IsView;
      }).map((facility) => ({
        text: facility.FacilityName,
        value: facility.FacilityId,
      })),
    },
    {
      fieldId: 'StaffName',
      translationId: 'MM_PM_StaffName',
      label: 'Staff Name',
      component: 'Dropdown',
      name: 'searchStaffId',
      isShow: searchFields?.find((x) => x.FieldId === 'PM_S_StaffName')?.IsShow,
      options: pageLoadData?.Data.StaffList?.map((staff) => ({
        text: staff.UserName,
        value: staff.UserId,
      })),
    },
    {
      fieldId: 'Department',
      translationId: 'MM_PM_Department',
      label: 'Department',
      component: 'Dropdown',
      name: 'departmentId',
      isShow: searchFields?.find((x) => x.FieldId === 'PM_S_DepartmentUnit')
        ?.IsShow,
      options: pageLoadData?.Data.DepartmentList?.map((department) => ({
        text: department.DepartmentName,
        value: department.DepartmentId,
      })),
    },
    {
      fieldId: 'EmployeeID',
      translationId: 'MM_PM_EmployeeID',
      label: 'Employee ID',
      component: 'Dropdown',
      name: 'employeeId',
      isShow: searchFields?.find((x) => x.FieldId === 'PM_S_EmployeeID')
        ?.IsShow,
      options: pageLoadData?.Data.StaffList?.map((employeeId) => ({
        text: employeeId.EmployeeID,
        value: employeeId.EmployeeID,
      })),
    },
    {
      fieldId: 'Status',
      translationId: 'MM_PM_Status',
      label: 'Status',
      component: 'Dropdown',
      name: 'activeStatus',
      isShow: searchFields?.find((x) => x.FieldId === 'PM_S_Status')?.IsShow,
      options: pageLoadData?.Data.StatusList?.map((status) => ({
        text: status.Status,
        value: status.Status,
      })),
    },
  ];

  const passwordManagementColumnsList = [
    {
      id: 'Facility',
      translationId: 'MM_PM_Facility',
      fieldId: 'PM_P_Facility',
      isSelected: true,
      orderNo: 1,
    },
    {
      id: 'EmployeeId',
      translationId: 'MM_PM_EmployeeID',
      fieldId: 'PM_P_EmployeeID',
      isSelected: true,
      orderNo: 2,
    },
    {
      id: 'StaffName',
      translationId: 'MM_PM_StaffName',
      fieldId: 'PM_P_StaffName',
      isSelected: true,
      orderNo: 3,
    },
    {
      id: 'Department',
      translationId: 'MM_PM_Department',
      isSelected: true,
      fieldId: 'PM_P_DepartmentUnit',
      orderNo: 4,
    },
    {
      id: 'Status',
      translationId: 'MM_PM_Status',
      fieldId: 'PM_P_Status',
      isSelected: true,
      orderNo: 5,
    },
  ];

  //* State Variables
  const formikRef = useRef(null);
  const [passwordManagmentSearchKeyword, setPasswordManagmentSearchKeyword] =
    useState('');
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [openPasswordManagementFilter, setOpenPasswordManagementFilter] =
    useState(false);
  const [roleMenu, setRoleMenu] = useState();
  const [showEmailCredentialModal, setShowEmailCredentialModal] =
    useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [showPasswordPolicyModal, setShowPasswordPolicyModal] = useState(false);
  const [showPasswordDetailsModal, setShowPasswordDetailsModal] =
    useState(false);
  const [passwordManagementColumnEl, setPasswordManagementColumnEl] =
    useState(null);
  const [selectedColumns, setSelectedColumns] = useState(
    passwordManagementColumnsList
  );
  const [selectedStaffDetails, setSelectedStaffDetails] = useState({});
  const [tableActionType, setTableActionType] = useState(null);
  const [isColumnToggled, setIsColumnToggled] = useState(false);
  const [facilityId, setFacilityId] = useState('');

  //* Fetch password management details
  const {
    data: getPasswordManagementData = [],
    isFetching,
    refetch,
  } = useGetStaffDetailsQuery(
    {
      payload: {
        ...filters,
        pageIndex: pageIndex + 1,
        pageSize: pageSize,
        headerFacility: selectedFacility?.id,
        loginUserId: userDetails?.UserId,
        moduleId: selectedModuleId,
        menuId: selectedMenu?.id,
      },
    },
    {
      skip: !selectedFacility?.id || !selectedModuleId || !selectedMenu?.id,
      refetchOnMountOrArgChange: true,
    }
  );

  const { totalRecords, records } = getPasswordManagementData || {
    totalRecords: 0,
    records: [],
  };

  useEffect(() => {
    setFilteredRecords([...(records || [])]);
  }, [records]);

  //* Effect to set role menu
  useEffect(() => {
    const roleMenu = selectedRoleFacility?.Menu.find(
      (item) => item.MenuId === selectedMenu?.id
    );
    setRoleMenu(roleMenu);
  }, [selectedRoleFacility, selectedMenu]);

  const togglePasswordManagementFilter = () => {
    setOpenPasswordManagementFilter(!openPasswordManagementFilter);
  };

  //* Table columns toggle
  const handleSelectColumns = (event, column) => {
    const columnId = event.target.name;
    setSelectedColumns((prevSelectedColumns) => {
      const newSelectedColumns = prevSelectedColumns?.some(
        (col) => col.id === columnId
      )
        ? prevSelectedColumns.filter((col) => col.id !== columnId)
        : [...prevSelectedColumns, column];
      return newSelectedColumns.sort((a, b) => a.orderNo - b.orderNo);
    });
  };

  useEffect(() => {
    if (selectedColumns?.length !== passwordManagementColumnsList?.length) {
      setIsColumnToggled(true);
    } else {
      setIsColumnToggled(false);
    }
  }, [selectedColumns]);

  return (
    <FlexContainer width="100%" height="100%" flexDirection="column">
      <FlexContainer
        style={{ paddingBottom: '15px' }}
      >
        <StyledTypography
          sx={{
            fontSize: {
              xs: '1.5rem',
              sm: '1.75rem',
              md: '2rem',
              lg: '2.25rem',
            },
          }}
          fontWeight="900"
          lineHeight="44px"
          color="#0083C0"
          whiteSpace={'nowrap'}
        >
          {t('MM_PasswordManagement')}
        </StyledTypography>
      </FlexContainer>
      <Box
        width="100%"
        height="auto"
        backgroundColor="#fff"
        flexWrap="wrap"
        flex="1"
        borderRadius="10px"
        flexDirection="column"
        sx={{
          padding: { xs: '1rem', sm: '1rem', md: '2rem', lg: '2rem' },
        }}
      >
        {isFetching || isFetchingLabels || isFetchingFields ? (
          <FlexContainer
            justifyContent="center"
            alignItems="center"
            height="100%"
            width="100%"
            position="absolute"
            style={{ top: '0', left: '0' }}
          >
            <StyledImage src={LoadingGif} alt="LoadingGif" />
          </FlexContainer>
        ) : (
          <>
            {checkAccess(isSuperAdmin, roleMenu?.IsView, roleMenu?.IsAdd) && (
              <FlexContainer
                justifyContent="flex-end"
                width="100%"
                gap="10px"
                flexWrap="wrap"
                alignItems="center"
                display="flex"
              >
                {checkAccess(
                  isSuperAdmin,
                  roleMenu?.IsView,
                  roleMenu?.IsAdd
                ) && (
                  <>
                    <StyledButton
                      variant="contained"
                      style={{ display: 'inline-flex', gap: '10px' }}
                      startIcon={
                        <StyledImage
                          height="18px"
                          width="18x"
                          src={plusIcon}
                          alt="Plus Icon"
                        />
                      }
                      onClick={() => {
                        setShowPasswordPolicyModal(true);
                      }}
                    >
                      {t('PasswordPolicy')}
                    </StyledButton>
                    <StyledButton
                      variant="contained"
                      style={{ display: 'inline-flex', gap: '10px' }}
                      startIcon={
                        <StyledImage
                          height="18px"
                          width="18x"
                          src={plusIcon}
                          alt="Plus Icon"
                        />
                      }
                      onClick={() => {
                        setShowEmailCredentialModal(true);
                      }}
                    >
                      {t('EmailUserCredentials')}
                    </StyledButton>
                  </>
                )}
              </FlexContainer>
            )}
            <FlexContainer
              display="flex"
              justifyContent="flex-end"
              flexWrap="wrap"
              width="100%"
              margin="10px 0px !important"
            >
              {/* <StyledSearch
                variant="outlined"
                placeholder={t('SearchByKeywords')}
                value={passwordManagmentSearchKeyword}
                onChange={(event) => {
                  const searchTerm = event.target.value?.toLowerCase();
                  setPasswordManagmentSearchKeyword(event.target.value);

                  if (searchTerm?.length < 1) {
                    setFilteredRecords(records);
                    return;
                  }
                  setFilteredRecords(
                    records?.filter(
                      (item) =>
                        item.Facility?.toLowerCase().includes(searchTerm) ||
                        item.EmployeeId?.toLowerCase().includes(searchTerm) ||
                        item.StaffName?.toLowerCase().includes(searchTerm) ||
                        item.Department?.toLowerCase().includes(searchTerm) ||
                        item.Status?.toLowerCase().includes(searchTerm)
                    ) || []
                  );
                }}
                fullWidth
                margin="normal"
                InputProps={{
                  startAdornment: (
                    <InputAdornment
                      position="start"
                      style={{ paddingInlineStart: '10px' }}
                    >
                      <img src={Search} alt="Search Icon" />
                    </InputAdornment>
                  ),
                }}
              /> */}
              <FlexContainer
                gap="10px"
                flexWrap="wrap"
                display="flex"
                alignItems="center"
              >
                <StyledButton
                  fontSize="12px"
                  backgroundColor="#fff"
                  colour="#000"
                  animate={false}
                  onClick={() => {
                    setOpenPasswordManagementFilter(false);
                    setIsFilterApplied(false);
                    formikRef.current.resetForm();
                    dispatch(resetFilters());
                  }}
                >
                  {t('ClearAll')}
                </StyledButton>
                <Badge
                  color="primary"
                  overlap="circular"
                  variant="dot"
                  invisible={!isFilterApplied}
                >
                  <Tooltip title="Filter" arrow>
                    <StyledImage
                      height="40px"
                      width="40px"
                      gap="10px"
                      borderRadius="40px"
                      cursor="pointer"
                      src={FilterIcon}
                      alt="Filter"
                      animate={true}
                      onClick={togglePasswordManagementFilter}
                    />
                  </Tooltip>
                </Badge>
                <StyledDivider />
                <StyledButton
                  fontSize="12px"
                  backgroundColor="#fff"
                  colour="#000"
                  onClick={() =>
                    setSelectedColumns(passwordManagementColumnsList)
                  }
                >
                  {t('ClearAll')}
                </StyledButton>
                <Badge
                  color="primary"
                  overlap="circular"
                  variant="dot"
                  invisible={!isColumnToggled}
                >
                  <Tooltip title="Configure Columns" arrow>
                    <StyledImage
                      height="40px"
                      width="40px"
                      gap="10px"
                      borderRadius="40px"
                      cursor="pointer"
                      src={FilterTable}
                      alt="Filter"
                      animate={true}
                      onClick={(event) =>
                        setPasswordManagementColumnEl(event.currentTarget)
                      }
                    />
                  </Tooltip>
                </Badge>
                <Menu
                  anchorEl={passwordManagementColumnEl}
                  open={Boolean(passwordManagementColumnEl)}
                  onClose={() => setPasswordManagementColumnEl(null)}
                  sx={{
                    '& .MuiPaper-root': {
                      width: '220px',
                    },
                  }}
                >
                  {passwordManagementColumnsList?.map((column) => {
                    if (
                      pageFields?.find((x) => x.FieldId === column.fieldId)
                        ?.IsShow
                    ) {
                      return (
                        <MenuItem key={column.id}>
                          <FormControlLabel
                            style={{ padding: '0px 0px 0px 10px' }}
                            control={
                              <Checkbox
                                style={{ padding: '2px 5px 2px 2px' }}
                                checked={selectedColumns?.some(
                                  (col) => col.id === column.id
                                )}
                                onChange={(e) => handleSelectColumns(e, column)}
                                name={column.id}
                              />
                            }
                            label={getlabel(
                              column.translationId,
                              labels,
                              i18n.language
                            )}
                          />
                        </MenuItem>
                      );
                    }
                    return null;
                  })}
                </Menu>
              </FlexContainer>
            </FlexContainer>

            <StyledCollapse
              in={openPasswordManagementFilter}
              openFilter={openPasswordManagementFilter}
              style={{ width: '100%' }}
            >
              <BorderBox>
                <FlexContainer
                  flexDirection="column"
                  style={{ padding: '10px' }}
                >
                  <FlexContainer
                    style={{
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <StyledTypography
                      fontSize={'18px'}
                      color="#205475"
                      padding="2px 0 2px 0"
                      fontWeight="700"
                      lineHeight="21.6px"
                    >
                      {t('SearchFilter')}
                    </StyledTypography>

                    <Tooltip title="Close" arrow>
                      <IconButton
                        onClick={togglePasswordManagementFilter}
                        sx={{
                          color: '#205475',
                          '&:hover': {
                            transform: 'scale(1.05)',
                            transition: 'transform 0.3s ease',
                            backgroundColor: 'rgba(15, 108, 189, 0.2)',
                          },
                        }}
                      >
                        <StyledImage
                          src={FilterCloseIcon}
                          alt="Filter Close Icon"
                        />
                      </IconButton>
                    </Tooltip>
                  </FlexContainer>
                  <Divider
                    sx={{
                      marginY: '15px',
                      borderColor: '#0083C0',
                      width: 'calc(100% - 10px)',
                    }}
                  />
                  <FlexContainer>
                    <Formik
                      innerRef={formikRef}
                      enableReinitialize={true}
                      initialValues={filters}
                      onSubmit={async (values) => {
                        dispatch(
                          setFilters({
                            pageIndex: pageIndex,
                            pageSize: pageSize,
                            headerFacilityId: selectedFacility?.id,
                            loginUserId: userDetails?.UserId,
                            moduleId: selectedModuleId,
                            menuId: selectedMenu?.id,
                            facilityId: Array.isArray(values?.facilityId)
                              ? values?.facilityId.join(',')
                              : (values?.facilityId ?? ''),
                            searchStaffId: values?.searchStaffId || 0,
                            departmentId: values?.departmentId || 0,
                            employeeId: values?.employeeId || '',
                            activeStatus: values?.activeStatus || '',
                          })
                        );
                        dispatch(setIsFilterApplied(true));
                        setOpenPasswordManagementFilter(false);
                      }}
                    >
                      {({ values, handleSubmit, resetForm, setFieldValue }) => (
                        <Form style={{ width: '100%' }}>
                          <Grid container spacing={2} display={'flex'}>
                            {passwordManagementFilterFields.map((field) => {
                              const translatedLabel = getlabel(
                                field?.translationId,
                                labels,
                                i18n.language
                              );
                              return (
                                field?.isShow && (
                                  <Grid
                                    item
                                    xs={12}
                                    sm={4}
                                    padding={'10px'}
                                    md={3}
                                    key={field.fieldId}
                                  >
                                    <Label value={translatedLabel} />
                                    {field.component === 'Dropdown' && (
                                      <SearchDropdown
                                        disableClearable={true}
                                        name={field.name}
                                        options={[
                                          { text: 'Select', value: '' },
                                          ...(field.options || []),
                                        ]}
                                        getOptionLabel={(option) => option.text}
                                        dir={
                                          i18n.language === 'ar' ? 'rtl' : 'ltr'
                                        }
                                        sx={{
                                          '& .MuiAutocomplete-inputRoot': {
                                            fontSize: '13px',
                                            height: '100%',
                                          },
                                          '& .MuiOutlinedInput-root': {
                                            height: '34px',
                                            '& .MuiAutocomplete-input': {
                                              height: '34px',
                                              fontSize: '13px',
                                            },
                                          },
                                        }}
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            variant="outlined"
                                            placeholder="Select"
                                          />
                                        )}
                                        ListboxProps={{
                                          sx: {
                                            '& .MuiAutocomplete-option': {
                                              fontSize: '13px',
                                              minHeight: '30px',
                                              display: 'flex',
                                              alignItems: 'center',
                                            },
                                          },
                                        }}
                                        value={
                                          field?.options?.find(
                                            (option) =>
                                              option.value ===
                                              values[field.name]
                                          ) || null
                                        }
                                        onChange={(event, value) => {
                                          setFieldValue(
                                            field.name,
                                            value?.value
                                          );
                                        }}
                                      />
                                    )}
                                    {field.component === 'MultiSelect' && (
                                      <MultiSelectDropdown
                                        name={field.name}
                                        options={field.options}
                                        required={field.IsMandatory}
                                      />
                                    )}
                                  </Grid>
                                )
                              );
                            })}
                            <Grid
                              padding="10px"
                              item
                              xs={12}
                              display="flex"
                              justifyContent="flex-end"
                              gap="10px"
                            >
                              <StyledButton
                                borderRadius="6px"
                                gap="4px"
                                padding="6px 10px"
                                variant="contained"
                                color="primary"
                                type="submit"
                                style={{ display: 'inline-flex', gap: '5px' }}
                                startIcon={
                                  <StyledImage
                                    height="16px"
                                    width="16px"
                                    src={WhiteSearch}
                                    alt="WhiteSearch"
                                  />
                                }
                              >
                                {t('Search')}
                              </StyledButton>
                              <StyledButton
                                variant="outlined"
                                border="1px solid #0083c0"
                                backgroundColor="#ffffff"
                                colour="#0083c0"
                                borderRadius="6px"
                                type="button"
                                sx={{ marginLeft: '10px' }}
                                style={{ display: 'inline-flex', gap: '5px' }}
                                startIcon={
                                  <StyledImage
                                    height="16px"
                                    width="16px"
                                    src={Eraser}
                                    alt="Eraser"
                                  />
                                }
                                onClick={() => {
                                  dispatch(resetFilters());
                                  resetForm();
                                }}
                              >
                                {t('ClearAll')}
                              </StyledButton>
                            </Grid>
                          </Grid>
                        </Form>
                      )}
                    </Formik>
                  </FlexContainer>
                </FlexContainer>
              </BorderBox>
            </StyledCollapse>

            <PasswordManagementDataTable
              columns={selectedColumns}
              records={filteredRecords}
              totalRecords={totalRecords}
              labels={labels}
              isEdit={checkAccess(
                isSuperAdmin,
                roleMenu?.IsView,
                roleMenu?.IsEdit
              )}
              isDelete={checkAccess(
                isSuperAdmin,
                roleMenu?.IsView,
                roleMenu?.IsDelete
              )}
              isView={checkAccess(
                isSuperAdmin,
                roleMenu?.IsView,
                roleMenu?.IsView
              )}
              refetch={refetch}
              setSelectedStaffDetails={setSelectedStaffDetails}
              setShowPasswordDetailsModal={setShowPasswordDetailsModal}
              setTableActionType={setTableActionType}
              pageFields={pageFields}
            />

            {showEmailCredentialModal && (
              <EmailUserCrenditalsModal
                showEmailCredentialModal={showEmailCredentialModal}
                setShowEmailCredentialModal={setShowEmailCredentialModal}
                showStaffModal={showStaffModal}
                setShowStaffModal={setShowStaffModal}
                labels={labels}
                facilityId={facilityId}
                setFacilityId={setFacilityId}
                pageFields={pageFields}
              />
            )}
            {showPasswordPolicyModal && (
              <PasswordPolicyModal
                showPasswordPolicyModal={showPasswordPolicyModal}
                setShowPasswordPolicyModal={setShowPasswordPolicyModal}
                labels={labels}
              />
            )}
            {showPasswordDetailsModal && (
              <EditViewPasswordDetails
                labels={labels}
                selectedStaffDetails={selectedStaffDetails}
                showPasswordDetailsModal={showPasswordDetailsModal}
                setShowPasswordDetailsModal={setShowPasswordDetailsModal}
                tableActionType={tableActionType}
                refetch={refetch}
                pageFields={pageFields}
              />
            )}

            {showStaffModal && (
              <StaffDetailListModel
                showStaffModal={showStaffModal}
                setShowStaffModal={setShowStaffModal}
                facilityId={facilityId}
                setFacilityId={setFacilityId}
                pageFields={pageFields}
              />
            )}
          </>
        )}
      </Box>
    </FlexContainer>
  );
};

export default PasswordManagement;
