import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Formik, Form } from 'formik';
import debounce from 'lodash/debounce';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  IconButton,
  InputAdornment,
  Tooltip,
  TextField,
} from '@mui/material';
import CloseIcon from '../../assets/Icons/CloseIcon.png';
import {
  CommonStyledButton,
  FlexContainer,
  StyledImage,
  StyledSearch,
  StyledTypography,
} from '../../utils/StyledComponents';
import Label from '../../components/Label/Label';
import DoNotDisturbIcon from '../../assets/Icons/DoNotDisturbIcon.png';
import * as Yup from 'yup';
import {
  useGetFieldsQuery,
  useGetLabelsQuery,
} from '../../redux/RTK/moduleDataApi';
import { useSelector } from 'react-redux';
import { getlabel } from '../../utils/language';
import { useTranslation } from 'react-i18next';
import DataTable from './SwitchUserTable';
import { useGetStaffUserDetailsQuery, useLazyGetUserAssignmentStaffSearchQuery } from '../../redux/RTK/userAssignmentApi';
import SearchIcon from '../../assets/Icons/Search.png';
import LoadingGif from '../../assets/Gifs/LoadingGif.gif';
import useWindowDimension from '../../hooks/useWindowDimension';
import SearchDropdown from '../SearchDropdown/SearchDropdown';
import { useDispatch } from 'react-redux';
import { resetFilters } from '../../redux/features/mainMaster/userStaffSlice';
const   SwitchUserModal = ({
  open,
  onClose,
  allFacilities,
  setIsSwitching,
  handleUserProfileClose,
  setShowSwitchUserModal,
  setSelectedEditRow,
  showSwitchUserModal,
  setSelectedRowData,
  setIsEmployeeModel,
  selectedFacilityId,
  setSelectedFacilityId,
}) => {
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch()
  const [userSearchKeyword, setUserSearchKeyword] = useState('');
  const [isSearchApplied, setIsSearchApplied] = useState(false)
  const [isSearch, setIsSearch] = useState(false)
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0)
  const { filters } = useSelector((state) => state.userStaff);
  const { isMobile } = useWindowDimension();
  const [triggerGetUserAssignmentStaffSearch] = useLazyGetUserAssignmentStaffSearchQuery();
  const initialValues = {
    staffCategory: '',
    applicationRole: [],
    facility: '',
  };
  const validationSchema = Yup.object().shape({
    staffCategory: Yup.string().required('Staff Category is required'),
    applicationRole: Yup.array()
      .of(Yup.string())
      .min(1, 'At least one application role must be selected')
      .required('Application Role is required'),
  });
  const { selectedMenu, userDetails, roleFacilities, isSuperAdmin, selectedModuleId } = useSelector(
    (state) => state.auth
  );
  const { data: labels = [], isFetching: isLabelsFetching } = useGetLabelsQuery(
    {
      menuId: 8,
      moduleId: 1,
    }
  );
  const { data: fields = [], isFetching: isFieldsFetching } = useGetFieldsQuery(
    {
      menuId: 8,
      moduleId: 1,
    }
  );
  const pageFields = fields?.Data?.Sections?.find(
    (section) => section.SectionName === 'Page'
  )?.Fields;
  const pagesConfigData = [
    {
      fieldId: 'UA_P_Facility',
      translationId: 'MM_SM_Facility',
      component: 'Dropdown',
      name: 'facility',
      options: userDetails?.ApplicableFacilities?.filter((facility) => {
        if (!facility.IsActive) return false;
        if (isSuperAdmin) return true;
        const facilityItem = roleFacilities?.find(
          (role) => role.FacilityId === facility.FacilityId
        )?.Menu?.find(MenuItem => MenuItem.MenuId === selectedMenu?.id)
        return facilityItem?.IsAdd;
      }).map((facility) => ({
        text: facility.FacilityName,
        value: facility.FacilityId,
      })) || []
    },
  ];
  useEffect(() => {
    if (!open) {
      setFilteredRecords([]);
    }
  }, [open]);
  const handleFacilityChange = (facilityId) => {
    setSelectedFacilityId(facilityId);
  };
  const {
    data: getStaffData = [],
    refetch,
    isFetching: isStaffFetching,
  } = useGetStaffUserDetailsQuery(
    {
      payload: {
        ...filters,
        pageIndex: filters?.pageIndex + 1,
        headerFacility: selectedFacilityId,
        loginUserId: userDetails?.UserId,
        moduleId: 1,
        menuId: 10,
      },
    },
    {
      skip: selectedFacilityId === '' || userSearchKeyword !== '',
    }
  );
 
  useEffect(() => {
    if (selectedFacilityId && getStaffData?.records?.length > 0) {
      refetch();
    }
  }, [selectedFacilityId]);


  // useEffect(() => {
  //     if (selectedFacilityId && getStaffData.length > 0) {
  //       refetch();
  //     }
  //   }, [selectedFacilityId, getStaffData]);

  let { records } = getStaffData || {
    records: [],
  };

  useEffect(() => {
    if (selectedFacilityId&&!isSearchApplied) {
      const activeRecords = records?.filter((record) => record.Status === 'Active');
      const { totalRecords } = getStaffData || { totalRecords: 0 }
      setTotalRecords(totalRecords)
      setFilteredRecords([...(activeRecords || [])]);
    }
  }, [records,selectedFacilityId, isSearchApplied]);
  const searchByKeyWords = useCallback(
    async (keyword) => {
      setIsSearch(true)
      try {
        if (keyword == "" && isSearchApplied) {
          setIsSearchApplied(false)
          refetch()
          return
        }
        const response = await triggerGetUserAssignmentStaffSearch({
          pageIndex: filters?.pageIndex + 1,
          pageSize: filters?.pageSize,
          headerFacility: selectedFacilityId,
          loginUserId: userDetails?.UserId,
          moduleId: 1,
          menuId: 10,
          keyword: keyword,
        });
        if (response?.data?.records.length > 0) {
          const activeRecords = response?.data?.records?.filter((record) => record.Status === 'Active');
          setIsSearch(false)
          setTotalRecords(response?.data?.totalRecords)
          setFilteredRecords([...(activeRecords || [])]);
        } else {
          setTotalRecords(0)
          setFilteredRecords([]);
        }
      } catch (err) { } finally {
        setIsSearch(false)
      }

    },
    [filters, selectedFacilityId, isSearchApplied, userDetails, selectedModuleId, selectedMenu]
  );


  const debouncedSearch = useMemo(
    () =>
      debounce((keyword) => {
        searchByKeyWords(keyword);
      }, 800),
    [searchByKeyWords]
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  useEffect(() => {

    if (userSearchKeyword) {
      debouncedSearch(userSearchKeyword)
    }
  }, [filters])

  useEffect(() => {
    //when clear userSearchKeyword then  call refetch
    if (!userSearchKeyword && isSearchApplied) {
      debouncedSearch(userSearchKeyword)
    }
  }, [userSearchKeyword, isSearchApplied])

  const columns = [
    {
      id: 'StaffName',
      translationId: 'MM_SM_StaffName',
    },
    {
      id: 'EmployeeId',
      translationId: 'MM_SM_EmployeeID',
    },
    {
      id: 'PrimaryDesignation',
      translationId: 'MM_SM_Designation',
    },
    {
      id: 'Department',
      translationId: 'MM_SM_Department',
    },
    {
      id: 'Status',
      translationId: 'MM_SM_Status',
    }, 
  ];
  return (
    <Dialog
      open={open}
      onClose={onClose}
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
            {'Switch Users'}
          </StyledTypography>
          <Tooltip title="Close" arrow>
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
              <StyledImage src={CloseIcon} alt="Close Icon" />
            </IconButton>
          </Tooltip>
        </DialogTitle>
        <DialogContent sx={{ border: '4px solid #205475' }}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
          >
            {({
              values, setFieldValue
            }) => {
              return (
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
                      flexDirection={isMobile ? 'column' : 'row'}
                    >
                      <FlexContainer
                        width="50%"
                        gap="0px"
                        alignItems="center"
                        margin={isMobile ? '0 70px 0 0' : '0'}
                      >
                        <Box>
                          <Label value="Facility" isRequired={true} />
                        </Box>
                        <Box sx={{ padding: '0 0 0 20px', }}>
                          <div style={{ width: '300px' }}>
                            <SearchDropdown
                              disableClearable={true}
                              name="facility"
                              options={userDetails?.ApplicableFacilities?.filter((facility) => {
                                if (!facility.IsActive) return false;
                                if (isSuperAdmin) return true;
                                const facilityItem = roleFacilities?.find(
                                  (role) => role.FacilityId === facility.FacilityId
                                )?.Menu?.find(MenuItem => MenuItem.MenuId === selectedMenu?.id)
                                return facilityItem?.IsAdd;
                              }).map((facility) => ({
                                text: facility.FacilityName,
                                value: facility.FacilityId,
                              })) || []}
                              getOptionLabel={(option) => option.text}
                              dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
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
                              onChange={(event, selectFiledValue) => {
                                setFieldValue("facility", selectFiledValue?.value);
                                setUserSearchKeyword('')
                                dispatch(resetFilters())
                                handleFacilityChange(selectFiledValue ? selectFiledValue.value : null)
                              }}
                            />
                          </div>
                        </Box>
                      </FlexContainer>

                      <StyledSearch
                        variant="outlined"
                        placeholder={t('SearchByKeywords')}
                        value={userSearchKeyword}
                        onChange={(event) => {
                          const searchTerm = event.target.value?.toLowerCase();
                          setUserSearchKeyword(searchTerm)
                          dispatch(resetFilters())
                          setIsSearchApplied(true)

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
                    {isStaffFetching || isLabelsFetching || isFieldsFetching||isSearch ? (
                      <FlexContainer justifyContent="center">
                        <StyledImage src={LoadingGif} alt="LoadingGif" />
                      </FlexContainer>
                    ) : (
                      <DataTable
                        data={filteredRecords}
                        onClose={onClose}
                        setIsSwitching={setIsSwitching}
                        handleUserProfileClose={handleUserProfileClose}
                        columns={columns}
                        setSelectedEditRow={setSelectedEditRow}
                        isEdit={true}
                        labels={labels}
                        setShowSwitchUserModal={setShowSwitchUserModal}
                        setSelectedRowData={setSelectedRowData}
                        setIsEmployeeModel={setIsEmployeeModel}
                        totalRecords={totalRecords}
                        setSelectedFacilityId={setSelectedFacilityId}
                      />
                    )}
                  </Box>

                  <FlexContainer
                    gap="16px"
                    justifyContent="center"
                    padding="0px 15px 15px 0px"
                  >
                    <CommonStyledButton
                      variant="outlined"
                      gap="8px"
                      startIcon={<StyledImage src={DoNotDisturbIcon} />}
                      onClick={() => {
                        onClose();
                        setUserSearchKeyword('')
                        setFilteredRecords([])
                        setTotalRecords(0)
                        dispatch(resetFilters())
                      }}
                    >
                      <StyledTypography marginTop="1px">
                        {t('Cancel')}
                      </StyledTypography>
                    </CommonStyledButton>
                  </FlexContainer>
                </Form>)
            }}
          </Formik>
        </DialogContent>
      </Box>
    </Dialog>
  );
};
export default SwitchUserModal;