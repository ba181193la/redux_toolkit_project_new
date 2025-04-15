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
import CloseIcon from '../../../../assets/Icons/CloseIcon.png';
import {
  CommonStyledButton,
  FlexContainer,
  StyledImage,
  StyledSearch,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import Label from '../../../../components/Label/Label';
import DoNotDisturbIcon from '../../../../assets/Icons/DoNotDisturbIcon.png';
import Dropdown from '../../../../components/Dropdown/Dropdown';
import * as Yup from 'yup';
import {
  useGetFieldsQuery,
  useGetLabelsQuery,
} from '../../../../redux/RTK/moduleDataApi';
import { useDispatch, useSelector } from 'react-redux';
import { getlabel } from '../../../../utils/IncidentLabels';
import { useTranslation } from 'react-i18next';
import DataTable from './PopupTable';
import { useGetStaffUserDetailsQuery } from '../../../../redux/RTK/userAssignmentApi';
import SearchIcon from '../../../../assets/Icons/Search.png';
import LoadingGif from '../../../../assets/Gifs/LoadingGif.gif';
import useWindowDimension from '../../../../hooks/useWindowDimension';
import { resetFilters } from '../../../../redux/features/mainMaster/userStaffSlice';
import SearchDropdown from '../../../../components/SearchDropdown/SearchDropdown';

const EmployeeNameModel = ({
  open,
  onClose,
  allFacilities,
  setSelectedRowData,
  setIsEmployeeModel,
  selectedFacilityId,
  setSelectedFacilityId,
}) => {
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();
  // const [selectedFacilityId, setSelectedFacilityId] = useState('');
  const [userSearchKeyword, setUserSearchKeyword] = useState('');
  const [filteredRecords, setFilteredRecords] = useState([]);
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

  const { filters, isFilterApplied } = useSelector((state) => state.userStaff);

  const { selectedMenu, userDetails, selectedModuleId } = useSelector(
    (state) => state.auth
  );

  const { data: labels = [], isFetching: isLabelsFetching } = useGetLabelsQuery(
    {
      menuId: 28,
      moduleId: 2,
    }
  );

  const searchLabels = labels?.Data?.filter(
    (menu) => menu.MenuId === selectedMenu?.id
  )[0].Regions?.[0]?.Labels;

  const { data: fields = [], isFetching: isFieldsFetching } = useGetFieldsQuery(
    {
      menuId: 28,
      moduleId: 2,
    }
  );

  const searchFields = fields?.Data?.Menus?.find(
    (menu) => menu.MenuId === selectedMenu?.id
  )?.Sections?.find((sec) => sec.SectionName === 'Search')?.Regions?.[0]
    ?.Fields;

  const pageFields = fields?.Data?.Sections?.find(
    (section) => section.SectionName === 'Page'
  )?.Fields;

  const pagesConfigData = [
    {
      fieldId: 'O_S_Facility',
      translationId: 'IM_O_Facility',
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
        menuId: 8,
      },
    }
    // {
    //   skip: selectedFacilityId === '' || !selectedModuleId || !selectedMenu?.id,
    // }
  );

  useEffect(() => {
    if (selectedFacilityId && getStaffData.length > 0) {
      refetch();
    }
  }, [selectedFacilityId, getStaffData]);

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
      translationId: 'IM_O_StaffName',
      fieldId: 'O_P_StaffName',
    },
    {
      id: 'EmployeeId',
      translationId: 'IM_O_EmployeeId',
      fieldId: 'O_P_EmployeeId',
    },
    {
      id: 'PrimaryDesignation',
      translationId: 'IM_O_Designation',
      fieldId: 'O_P_Designation',
    },
    {
      id: 'Department',
      translationId: 'IM_O_Department',
      fieldId: 'O_P_Department',
    },
    {
      id: 'Status',
      translationId: 'IM_O_Status',
      fieldId: 'O_P_Status',
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
            {t('EmployeeList')}
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
            {({ values, setFieldValue }) => {
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
                      {searchFields?.map((field) => {
                        const fieldConfig = pagesConfigData?.find((config) => {
                          return config.fieldId === field.FieldId; // Perform the comparison
                        });

                        if (field.IsShow && fieldConfig) {
                          const translatedLabel = getlabel(
                            fieldConfig?.translationId,
                            searchLabels,
                            i18n.language
                          );

                          return (
                            <FlexContainer
                              width="100%" // Expand the container's width
                              maxWidth="100%" // Prevent it from being constrained                          gap="0px"
                              alignItems="center"
                              margin={isMobile ? '0 70px 0 0' : '0'}
                            >
                              <Box>
                                <Label
                                  value={translatedLabel}
                                  isRequired={true}
                                />
                              </Box>
                              <Box sx={{ padding: '0 0 0 20px', width: '60%' }}>
                                {' '}
                                {fieldConfig.component === 'Dropdown' && (
                                  <>
                                    <SearchDropdown
                                      name={fieldConfig.name}
                                      options={[
                                        { text: 'Select', value: '' },
                                        ...(fieldConfig.options || []),
                                      ]}
                                      onChange={(event, selectFiledValue) => {
                                        setFieldValue(
                                          fieldConfig.name,
                                          selectFiledValue?.value
                                        );
                                        handleFacilityChange(
                                          selectFiledValue
                                            ? selectFiledValue.value
                                            : null
                                        );
                                      }}
                                      value={
                                        fieldConfig?.options?.find(
                                          (option) =>
                                            option.value ===
                                            values[fieldConfig.name]
                                        ) || null
                                      }
                                    />
                                    {/* <SearchDropdown
                                      disableClearable={true}
                                      name={fieldConfig.name}
                                      options={[
                                        { text: 'Select', value: '' },
                                        ...(fieldConfig.options || []),
                                      ]}
                                     
                                      value={
                                        fieldConfig?.options?.find(
                                          (option) =>
                                            option.value ===
                                            values[fieldConfig.name]
                                        ) || null
                                      }
                                      onChange={(event, selectedValue) =>
                                        handleFacilityChange(selectedValue ? selectedValue.value : null)
                                      }
                                    /> */}
                                  </>
                                )}
                              </Box>
                            </FlexContainer>
                          );
                        }
                        return null;
                      })}
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
                    </FlexContainer>

                    {isStaffFetching || isLabelsFetching || isFieldsFetching ? (
                      <FlexContainer justifyContent="center">
                        <StyledImage src={LoadingGif} alt="LoadingGif" />
                      </FlexContainer>
                    ) : (
                      <DataTable
                        data={selectedFacilityId ? filteredRecords : []}
                        columns={columns}
                        isEdit={true}
                        labels={searchLabels}
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
                      onClick={() => {
                        onClose();
                        dispatch(resetFilters());
                      }}
                      gap="8px"
                      startIcon={<StyledImage src={DoNotDisturbIcon} />}
                    >
                      <StyledTypography marginTop="1px">
                        {t('Cancel')}
                      </StyledTypography>
                    </CommonStyledButton>
                  </FlexContainer>
                </Form>
              );
            }}
          </Formik>
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default EmployeeNameModel;
