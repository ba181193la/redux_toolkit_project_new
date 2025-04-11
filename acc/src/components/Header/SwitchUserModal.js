import React, { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
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
import { useGetStaffUserDetailsQuery } from '../../redux/RTK/userAssignmentApi';
import SearchIcon from '../../assets/Icons/Search.png';
import LoadingGif from '../../assets/Gifs/LoadingGif.gif';
import useWindowDimension from '../../hooks/useWindowDimension';
import SearchDropdown from '../SearchDropdown/SearchDropdown';

const SwitchUserModal = ({
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
  const [userSearchKeyword, setUserSearchKeyword] = useState('');
  const [filteredRecords, setFilteredRecords] = useState([]);
  const { filters } = useSelector((state) => state.userStaff);
  const { isMobile } = useWindowDimension();

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

  const { selectedMenu, userDetails } = useSelector(
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
      options: allFacilities?.map((facility) => ({
        text: facility.FacilityName,
        value: facility.FacilityId,
      })),
    },
  ];

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
      skip: selectedFacilityId === '',
    }
  );

  useEffect(() => {
    if (selectedFacilityId && getStaffData.length > 0) {
      refetch();
    }
  }, [selectedFacilityId, getStaffData]);

  useEffect(() => {
    setFilteredRecords([...(activeRecords || [])]);
  }, [activeRecords]);

  const { totalRecords, records } = getStaffData || {
    totalRecords: 0,
    records: [],
  };

  const activeRecords = records?.filter((record) => record.Status === 'Active');

  useEffect(() => {
    setFilteredRecords([...(activeRecords || [])]);
  }, [records]);

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
              onClick={() => {
                setShowSwitchUserModal(false);
              }}
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
                    <Box sx={{ padding: '0 0 0 20px' }}>
                      <div style={{ width: '200px' }}>
                      <SearchDropdown
                        disableClearable={true}
                        name="facility"
                        options={allFacilities?.map((facility) => ({
                          text: facility.FacilityDetail,
                          value: facility.FacilityId,
                        }))}
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
                        onChange={(event, selectedValue) =>
                          handleFacilityChange(
                            selectedValue ? selectedValue.value : null
                          )
                        }
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
                      setUserSearchKeyword(event.target.value);
                      if (searchTerm?.length < 2) {
                        setFilteredRecords(activeRecords);
                        return;
                      }

                      setFilteredRecords(
                        activeRecords?.filter((item) => {
                          const staffName = item.StaffName?.toLowerCase() || '';

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
                </FlexContainer>
                {isStaffFetching || isLabelsFetching || isFieldsFetching ? (
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
                >
                  <StyledTypography marginTop="1px">
                    {t('Cancel')}
                  </StyledTypography>
                </CommonStyledButton>
              </FlexContainer>
            </Form>
          </Formik>
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default SwitchUserModal;
