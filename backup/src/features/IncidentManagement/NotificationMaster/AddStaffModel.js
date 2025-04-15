import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Formik, Form } from 'formik';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  IconButton,
  Tooltip,
  InputAdornment,
} from '@mui/material';
import CloseIcon from '../../../assets/Icons/CloseIcon.png';
import {
  CommonStyledButton,
  FlexContainer,
  StyledImage,
  StyledSearch,
  StyledTypography,
} from '../../../utils/StyledComponents';
import Label from '../../../components/Label/Label';
import DoNotDisturbIcon from '../../../assets/Icons/DoNotDisturbIcon.png';
import Dropdown from '../../../components/Dropdown/Dropdown';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useUpdateRoleCategoryMappingMutation } from '../../../redux/RTK/applicationRoleApi';
import {
  useGetAllFacilityQuery,
  useGetStaffUserDetailsQuery,
} from '../../../redux/RTK/notificationMasterApi';
import { useGetLabelsQuery } from '../../../redux/RTK/moduleDataApi';
import StaffPopupTable from './StaffPopupTable';
import SearchDropdown from '../../../components/SearchDropdown/SearchDropdown';
import useWindowDimension from '../../../hooks/useWindowDimension';
import debounce from 'lodash/debounce';
import SearchIcon from '../../../assets/Icons/Search.png';
import { getlabel } from '../../../utils/IncidentLabels';

const AddStaffModel = ({
  open,
  onClose,
  setIsStaffModel,
  setStaffFacilityId,
}) => {
  const { t , i18n} = useTranslation();
  const { isMobile } = useWindowDimension();

  const [selectedFacilityId, setSelectedFacilityId] = useState('');
  const [totalRecords, setTotalRecords] = useState(0);
  const [records, setrecords] = useState([]);
  const [isSearchApplied, setIsSearchApplied] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  
  const initialValues = {
    facility: '',
    applicationRole: [],
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

  const { data: labels = [] } = useGetLabelsQuery({
    menuId: selectedMenu?.id,
    moduleId: selectedModuleId,
  });

  const fieldConfig =  
    {
      fieldId: 'NM_P_Facility',
      translationId: 'IM_NM_Facility',
      component: 'Dropdown',
      name: 'facility',
      options: [
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
      ]
    }

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

  useEffect(() => {
      if (getStaffData?.records) {
        const { totalRecords, records } = getStaffData || {
          records: [],
          totalRecords: 0,
        };
        setTotalRecords(totalRecords);
        setrecords([...(records || [])]);
      }
    }, [getStaffData]);

    const searchByKeyWords = useCallback(
      async (keyword) => {
        setIsSearch(true);
        try {
          if (keyword == '' && isSearchApplied) {
            setIsSearchApplied(false);
            refetch();
            return;
          }
          const response = await triggerGetNotificationStaffSearchQuery({
            pageIndex: pageIndex + 1,
            pageSize: pageSize,
            headerFacility: selectedFacilityId,
            loginUserId: userDetails?.UserId,
            moduleId: selectedModuleId,
            menuId: selectedMenu?.id,
            keyword: keyword,
          });
          if (response?.data?.records.length > 0) {
            const activeRecords = response?.data?.records?.filter(
              (record) => record.Status === 'Active'
            );
            setIsSearch(false);
            setTotalRecords(response?.data?.totalRecords);
            setrecords([...(activeRecords || [])]);
          } else {
            setTotalRecords(0);
            setrecords([]);
          }
        } catch (err) {
        } finally {
          setIsSearch(false);
        }
      },
      [
        pageIndex,
        pageSize,
        selectedFacilityId,
        isSearchApplied,
        userDetails,
        selectedModuleId,
        selectedMenu,
      ]
    );
      // Memoize the debounced version of searchByKeyWords
      const debouncedSearch = useMemo(
        () =>
          debounce((keyword) => {
            searchByKeyWords(keyword); // Call the search function
          }, 800), // Debounce delay in ms
        [searchByKeyWords]
      );
    
      // Cleanup debouncedSearch on unmount
      useEffect(() => {
        return () => {
          debouncedSearch.cancel(); // Cancel pending debounced calls
        };
      }, [debouncedSearch]);
    
      useEffect(() => {
        //when filters change with searchKeyword
        if (searchKeyword) {
          debouncedSearch(searchKeyword);
        }
      }, [pageIndex, pageSize]);
    
      useEffect(() => {
        //when clear searchKeyword then  call refetch
        if (!searchKeyword && isSearchApplied) {
          debouncedSearch(searchKeyword);
        }
      }, [searchKeyword, isSearchApplied]);
      
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

  const handleOnClose = () => {
    onClose()
    setTotalRecords(0);
    setrecords([]);
    setSearchKeyword('');
  };

  const columns = [
    {
      id: 'StaffName',
      translationId: 'IM_NM_Staff',
      fieldId: 'NM_P_Staff',
      isSelected: true,
    },
    {
      id: 'EmployeeId',
      translationId: 'IM_NM_EmployeeID',
      fieldId: 'SM_P_EmployeeID',
      isSelected: true,
    },
    {
      id: 'PrimaryDesignation',
      translationId: 'IM_NM_Designation',
      fieldId: 'NM_P_Designation',
      isSelected: true,
    },
    {
      id: 'Department',
      translationId: 'IM_NM_Department',
      fieldId: 'NM_P_Department',
      isSelected: true,
    },
    {
      id: 'Status',
      translationId: 'IM_NM_Status',
      fieldId: 'SM_P_Status',
      isSelected: true,
    },
  ];
  const notificationMasterLabels =
    labels?.Data?.[0]?.Regions?.[0]?.Labels || [];

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
            onClick={handleOnClose}
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
                  <FlexContainer padding="20px 20px 20px 0" alignItems="center">
                    <FlexContainer width="50%" gap="0px" alignItems="center">
                      <Box>
                        <Label
                          value={getlabel(
                            fieldConfig?.translationId,
                            notificationMasterLabels,
                            i18n.language
                          )}
                          isRequired={true}
                        />
                      </Box>
                      <Box sx={{ padding: '0 0 0 20px', width: '60%' }}>
                      {fieldConfig.component === 'Dropdown' && (
                          <SearchDropdown
                            disableClearable={true}
                            name={fieldConfig.name}
                            options={[
                              { text: 'Select', value: '' },
                              ...(fieldConfig.options || []),
                            ]}
                            required={true}
                            getOptionLabel={(option) => option.text}
                            // dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
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
                              setFieldValue(
                                'facility',
                                selectFiledValue?.value
                              );
                              handleFacilityChange(
                                selectFiledValue ? selectFiledValue.value : null
                              );
                            }}
                          />
                        )}
                        {errors.facility && touched.facility && (
                          <FlexContainer
                            style={{ color: 'red', fontSize: '11px' }}
                          >
                            {errors.facility}
                          </FlexContainer>
                        )}
                      </Box>
                    </FlexContainer>
                    <FlexContainer display="flex" gap={3} alignItems="center">
                      <StyledSearch
                        variant="outlined"
                        placeholder={t('SearchByKeywords')}
                        value={searchKeyword}
                        onChange={(event) => {
                          const searchTerm = event.target.value?.toLowerCase();
                          setSearchKeyword(searchTerm);
                          dispatch(resetFilters());
                          setIsSearchApplied(true);
                          debouncedSearch(searchTerm);
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
                    </FlexContainer>
                  </FlexContainer>

                  <StaffPopupTable
                    data={records}
                    columns={columns}
                    staffFetching={staffFetching}
                    isEdit={true}
                    labels={notificationMasterLabels}
                    totalRecords={totalRecords}
                    setIsStaffModel={setIsStaffModel}
                    setSelectedFacilityId={setSelectedFacilityId}
                    selectedFacilityId={selectedFacilityId}
                    setStaffFacilityId={setStaffFacilityId}
                    handleOnClose={handleOnClose}
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
                    onClick={handleOnClose}
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
