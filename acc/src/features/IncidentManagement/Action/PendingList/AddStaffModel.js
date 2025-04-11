import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
} from '@mui/material';
import CloseIcon from '../../../../assets/Icons/CloseIcon.png';
import {
  CommonStyledButton,
  FlexContainer,
  StyledImage,
  StyledTypography,
  StyledSearch,
} from '../../../../utils/StyledComponents';
import Label from '../../../../components/Label/Label';
import DoNotDisturbIcon from '../../../../assets/Icons/DoNotDisturbIcon.png';
import Dropdown from '../../../../components/Dropdown/Dropdown';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useUpdateRoleCategoryMappingMutation } from '../../../../redux/RTK/applicationRoleApi';
import {
  useGetAllFacilityQuery,
  useGetStaffUserDetailsQuery,
} from '../../../../redux/RTK/notificationMasterApi';
import { useGetLabelsQuery } from '../../../../redux/RTK/moduleDataApi';
import StaffPopupTable from './StaffPopupTable';
import SearchDropdown from '../../../../components/SearchDropdown/SearchDropdown';
import SearchIcon from '../../../../assets/Icons/Search.png';

const AddStaffModel = ({
  open,
  onClose,
  setIsStaffModel,
  setStaffFacilityId,
  onSelectRow,
}) => {
  const { t } = useTranslation();
  const [userSearchKeyword, setUserSearchKeyword] = useState('');
  const [filteredRecords, setFilteredRecords] = useState([]);

  const [selectedFacilityId, setSelectedFacilityId] = useState('');

  const initialValues = {
    facility: '',
    applicationRole: [],
    facility: '',
  };

  const validationSchema = Yup.object().shape({
    facility: Yup.string().required('Facility is required'),
    staffCategory: Yup.string().required('Staff Category is required'),
    applicationRole: Yup.array()
      .of(Yup.string())
      .min(1, 'At least one application role must be selected')
      .required('Application Role is required'),
  });

  const {
    selectedMenu,
    userDetails,
    selectedModuleId,
    selectedFacility,
    roleFacilities,
    isSuperAdmin,
  } = useSelector((state) => state.auth);

  const { pageSize, pageIndex } = useSelector(
    (state) => state?.notificationMaster?.filters
  );

  const { data: labelsData = [] } = useGetLabelsQuery({
    menuId: 27,
    moduleId: selectedModuleId,
  });

  const labels = (labelsData.Data || [])
    .filter((item) => item.MenuId === 27)
    .flatMap((item) =>
      (item.Regions || [])
        .filter((region) => region.RegionCode === 'ALL')
        .flatMap((region) => region.Labels || [])
    );

  const filterLabels = { Data: labels };




  const { data: facilityData = [], isFetching } = useGetAllFacilityQuery(
    {
      payload: {
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
    }
  );

  const handleFacilityChange = (facilityId, setFieldValue) => {
    setSelectedFacilityId(facilityId);
  };

  const [triggerUpdateRoleCategoryMapping] =
    useUpdateRoleCategoryMappingMutation();

  const {
    data: getStaffData = [],
    isFetching: staffFetching,
    refetch,
  } = useGetStaffUserDetailsQuery(
    {
      payload: {
        pageIndex: pageIndex + 1,
        pageSize: pageSize,
        headerFacility: selectedFacilityId,
        loginUserId: userDetails?.UserId,
        moduleId: selectedModuleId,
        menuId: selectedMenu?.id,
      },
    },
    {
      skip: !selectedFacilityId || !selectedModuleId || !selectedMenu?.id,
    }
  );

  const { totalRecords, records } = getStaffData || {
    totalRecords: 0,
    records: [],
  };
  const activeRecords = records?.filter((record) => record.Status === 'Active');

  useEffect(() => {
    setFilteredRecords([...(activeRecords || [])]);
  }, [records]);

  const handleSubmit = async (values, { resetForm }) => {
    const roleIdsString = Array.isArray(selectedIds)
      ? selectedIds.join(',')
      : '';

    await triggerUpdateRoleCategoryMapping({
      payload: {
        roleCategoryMappingId: 0,
        roleId: roleIdsString,
        staffCategoryId: selectedStaffCategoryId,
        facilityId: selectedFacility?.id,
        loginUserId: userDetails?.UserId,
        moduleId: selectedModuleId,
        menuId: selectedMenu?.id,
      },
    }).unwrap();

    resetForm();
    navigate(-1);
  };

  const handleOnClose = () => {};

  const columns = [
    {
      id: 'StaffName',
      translationId: 'IM_II_StaffName',
      isSelected: true,
    },
    {
      id: 'EmployeeId',
      translationId: 'IM_II_EmployeeId',
      isSelected: true,
    },
    {
      id: 'PrimaryDesignation',
      translationId: 'IM_II_Designation',
      isSelected: true,
    },
    {
      id: 'Department',
      translationId: 'IM_II_Department',
      isSelected: true,
    },
    // {
    //   id: 'Status',
    //   isSelected: true,
    // },
  ];
  const handleSelectRow = (row) => {
    onSelectRow(row);
  };

  return (
    <Dialog
      open={open}
      onClose={handleOnClose}
      PaperProps={{
        sx: {
          width: '900px',
          maxWidth: 'none',
          borderRadius: '8px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
        },
      }}
    >
      <Box>
        <DialogTitle
          sx={{
            backgroundColor: '#205475',
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            height: 40,
            alignItems: 'center',
            padding: '0 8px',
          }}
        >
          <StyledTypography
            fontSize="18px"
            fontWeight="300"
            lineHeight="18px"
            padding="0 12px"
            color="#fff"
          >
            {t('Staff')}
          </StyledTypography>
          <IconButton
            onClick={onClose}
            sx={{
              color: '#fff',
              '&:hover': {
                transform: 'scale(1.05)',
                transition: 'transform 0.3s ease',
                backgroundColor: 'rgba(15, 108, 189, 0.2)',
              },
            }}
          >
            <Tooltip title="Close" arrow>
              <StyledImage src={CloseIcon} alt="Close Icon" tooltip="Close" />
            </Tooltip>
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ border: '4px solid #205475' }}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue, errors, touched }) => (
              <Form>
                <Box
                  sx={{
                    marginBottom: 2,
                    display: 'block',
                    alignItems: 'center',
                  }}
                >
                  <FlexContainer
                    padding="20px 20px 20px 0"
                    alignItems="center"
                    display="flex"
                    justifyContent="space-between"
                  >
                    {/* Left: Facility Dropdown */}
                    <FlexContainer
                      width="50%"
                      gap="0px"
                      alignItems="center"
                      display="flex"
                    >
                      <Box>
                        <Label value="Facility" isRequired={true} />
                      </Box>
                      <Box sx={{ padding: '0 0 0 20px', width: '60%' }}>
                        <SearchDropdown
                          disableClearable={true}
                          name={'facility'}
                          options={[
                            { text: 'Select', value: '' },
                            ...(userDetails?.ApplicableFacilities?.filter(
                              (facility) => {
                                if (!facility.IsActive) return false;
                                if (isSuperAdmin) return true;
                                const facilityItem = roleFacilities
                                  ?.find(
                                    (role) =>
                                      role.FacilityId === facility.FacilityId
                                  )
                                  ?.Menu?.find(
                                    (MenuItem) =>
                                      MenuItem.MenuId === selectedMenu?.id
                                  );
                                return facilityItem?.IsAdd;
                              }
                            ).map((facility) => ({
                              text: facility.FacilityName,
                              value: facility.FacilityId,
                            })) || []),
                          ]}
                          getOptionLabel={(option) => option.text}
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
                                fontSize: '14px',
                                minHeight: '30px',
                                display: 'flex',
                                alignItems: 'center',
                              },
                            },
                          }}
                          value={
                            userDetails?.ApplicableFacilities?.map(
                              (facility) => ({
                                text: facility.FacilityName,
                                value: facility.FacilityId,
                              })
                            )?.find(
                              (option) => option.value === values['facility']
                            ) || null
                          }
                          onChange={(event, selectFiledValue) => {
                            setFieldValue('facility', selectFiledValue?.value);
                            handleFacilityChange(
                              selectFiledValue ? selectFiledValue.value : null
                            );
                          }}
                        />
                        {errors.facility && touched.facility && (
                          <FlexContainer
                            style={{ color: 'red', fontSize: '11px' }}
                          >
                            {errors.facility}
                          </FlexContainer>
                        )}
                      </Box>
                    </FlexContainer>

                    {/* Right: Search Input */}
                    <Box
                      sx={{
                        width: '40%',
                        display: 'flex',
                        justifyContent: 'flex-end',
                      }}
                    >
                      <StyledSearch
                        variant="outlined"
                        placeholder={t('SearchByKeywords')}
                        value={userSearchKeyword}
                        onChange={(event) => {
                          const searchTerm = event.target.value?.toLowerCase();
                          setUserSearchKeyword(event.target.value);
                          if (searchTerm?.length < 2) {
                            setFilteredRecords(activeRecords);
                            return;
                          }
                          setFilteredRecords(
                            activeRecords?.filter((item) => {
                              const staffName =
                                item.StaffName?.toLowerCase() || '';
                              const employeeID =
                                item.EmployeeId?.toLowerCase() || '';
                              const department =
                                item.Department?.toLowerCase() || '';
                              const designation =
                                item.PrimaryDesignation?.toLowerCase() || '';
                              const activeStatus = item.Status?.toLowerCase();
                              return (
                                staffName.includes(searchTerm) ||
                                employeeID.includes(searchTerm) ||
                                department.includes(searchTerm) ||
                                designation.includes(searchTerm) ||
                                activeStatus.includes(searchTerm)
                              );
                            }) || []
                          );
                        }}
                        fullWidth={false}
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
                    </Box>
                  </FlexContainer>

                  <StaffPopupTable
                    data={selectedFacilityId ? filteredRecords : []}
                    columns={columns}
                    staffFetching={staffFetching}
                    isEdit={true}
                    labels={filterLabels}
                    totalRecords={totalRecords}
                    setIsStaffModel={setIsStaffModel}
                    setSelectedFacilityId={setSelectedFacilityId}
                    selectedFacilityId={selectedFacilityId}
                    setStaffFacilityId={setStaffFacilityId}
                    onSelectRow={handleSelectRow}
                  />
                </Box>

                <FlexContainer
                  gap="16px"
                  justifyContent="center"
                  padding="0px 15px 15px 0px"
                >
                  <CommonStyledButton
                    gap="8px"
                    variant="outlined"
                    startIcon={<StyledImage src={DoNotDisturbIcon} />}
                    onClick={onClose}
                  >
                    <StyledTypography marginTop="1px">
                      {t('Cancel')}
                    </StyledTypography>
                  </CommonStyledButton>
                </FlexContainer>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default AddStaffModel;
