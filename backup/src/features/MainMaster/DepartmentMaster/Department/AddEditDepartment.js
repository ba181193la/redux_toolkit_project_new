import {
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Tooltip,
  Autocomplete,
} from '@mui/material';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import CloseIcon from '../../../../assets/Icons/CloseIcon.png';
import DoneIcon from '../../../../assets/Icons/DoneIcon.png';
import DndIcon from '../../../../assets/Icons/DoNotDisturbIcon.png';
import Label from '../../../../components/Label/Label';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ReactFormGenerator } from 'react-form-builder2';
import {
  useAddDepartmentMutation,
  useGetDepartmentDataByIdQuery,
  useLazyGetLocationTypeByFacilityQuery,
  useUpdateDepartmentMutation,
} from '../../../../redux/RTK/departmentMasterApi';
import {
  useGetStaffByIdQuery,
} from '../../../../redux/RTK/staffMasterApi';
import { useGetFormBuilderByIdQuery } from '../../../../redux/RTK/formBuilderApi';

import { getlabel } from '../../../../utils/language';
import { useTranslation } from 'react-i18next';
import { showToastAlert } from '../../../../utils/SweetAlert';
import SearchDropdown from '../../../../components/SearchDropdown/SearchDropdown';

const AddEditDepartment = ({
  showDepartmentModal,
  selectedDepartmentId,
  setSelectedDepartmentId,
  setShowDepartmentModal,
  labels,
  refetch,
  fieldAccess,
  facilityList,
  tabs
}) => {
  const { i18n, t } = useTranslation();

  const [locationList, setLocationList] = useState([]);

  const { selectedMenu, selectedModuleId, userDetails,selectedFacility,
  } = useSelector(
    (state) => state.auth
  );

  const pageFields = fieldAccess?.Data?.Sections?.find(
    (section) => section?.SectionName === 'Page'
  )?.Fields;

  const [newDepartment, setNewDepartment] = useState({
    departmentName: '',
    departmentId: 0,
    locationId: 0,
    locationType: '',
    facility: '',
    formBuilderData:null
  });

  const [triggerAddDepartment, { isLoading: isAdding }] =
    useAddDepartmentMutation();
  const [triggerUpdateDepartment, { isLoading: isUpdating }] =
    useUpdateDepartmentMutation();
  const [triggerGetLocationTypeList, { isFetching: fetchingLT }] =
    useLazyGetLocationTypeByFacilityQuery();

  const departmentValidation = Yup.object().shape({
    facility: Yup.number().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'DM_P_Facility')?.IsMandatory ===
        true,
      then: (schema) =>
        schema
          .required(
            `${getlabel('MM_DM_Facility', labels, i18n.language)} ${t('IsRequired')}`
          )
          .test(
            'is-zero',
            `${getlabel('MM_DM_Facility', labels, i18n.language)} ${t('IsRequired')}`,
            (value) => {
              return value !== 0;
            }
          ),
      otherwise: (schema) => schema.notRequired(),
    }),
    departmentName: Yup.string().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'DM_P_DepartmentUnit')
          ?.IsMandatory === true,
      then: (schema) =>
        schema.required(
          `${getlabel('MM_DM_Department', labels, i18n.language)} ${t('IsRequired')}`
        ),
      otherwise: (schema) => schema.notRequired(),
    }),

    locationId: Yup.number().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'DM_P_LocationType')
          ?.IsMandatory === true,
      then: (schema) =>
        schema
          .required(
            `${getlabel('MM_DM_LocationType', labels, i18n.language)} ${t('IsRequired')}`
          )
          .test(
            'is-zero',
            `${getlabel('MM_DM_LocationType', labels, i18n.language)} ${t('IsRequired')}`,
            (value) => {
              return value !== 0;
            }
          ),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const { data: dynamicFormData } = useGetFormBuilderByIdQuery(
    {
      menuId: selectedMenu?.id,
      loginUserId: userDetails?.UserId,
      moduleId: selectedModuleId,
      headerFacilityId: selectedFacility?.id,
      tabs:tabs?tabs:0
    },
    { skip: !selectedMenu?.id || !userDetails?.UserId || !selectedModuleId }
  );
  const { data: deptRecords, refetch: refetchDepartmentData } =
    useGetDepartmentDataByIdQuery(
      {
        departmentId: selectedDepartmentId,
        loginUserId: userDetails?.UserId,
        menuId: selectedMenu?.id,
      },
      { skip: !selectedDepartmentId }
    );

  useEffect(() => {
    if (deptRecords?.Data && selectedDepartmentId) {
      setNewDepartment({
        departmentName: deptRecords?.Data?.DepartmentName,
        departmentId: deptRecords?.Data?.DepartmentId,
        locationId: deptRecords?.Data?.LocationId,
        locationType: deptRecords?.Data?.LocationType,
        facility: deptRecords?.Data?.FacilityId,
      });
      getLocationTypeList(deptRecords?.Data?.FacilityId);
    }
  }, [deptRecords]);

  const getLocationTypeList = async (facilityId) => {
    let locationTypes = await triggerGetLocationTypeList({
      facilityId: facilityId,
      loginUserId: userDetails?.UserId,
      moduleId: selectedModuleId,
      menuId: selectedMenu?.id,
    });
    if (locationTypes) {
      setLocationList(
        locationTypes?.data?.Data?.map((x) => ({
          text: x.LocationName,
          value: x.LocationId,
        }))
      );
    } else {
      setLocationList([]);
    }
  };

  const submitDepartment = async (values) => {
    try {
      let response;
      if (newDepartment?.departmentId === 0) {
        response = await triggerAddDepartment({
          payload: {
            departmentName: values?.departmentName,
            departmentId: 0,
            facilityId: values?.facility,
            locationId: values?.locationId,
            moduleId: selectedModuleId,
            menuId: selectedMenu?.id,
            loginUserId: userDetails?.UserId,
            formBuilderData:values?.formBuilderData
          },
        }).unwrap();
      } else if (newDepartment?.departmentId) {
        response = await triggerUpdateDepartment({
          payload: {
            departmentName: values?.departmentName,
            departmentId: values?.departmentId,
            facilityId: values?.facility,
            locationId: values?.locationId,
            moduleId: selectedModuleId,
            menuId: selectedMenu?.id,
            loginUserId: userDetails?.UserId,
            formBuilderData:values?.formBuilderData
          },
        }).unwrap();
        refetchDepartmentData();
      }

      if (response && response.Message !== 'Record Already Exist') {
        showToastAlert({
          type: 'custom_success',
          text: response.Message,
          gif: 'SuccessGif',
        });
      }
      if (response && response.Message === 'Record Already Exist') {
        showToastAlert({
          type: 'custom_info',
          text: response.Message,
          gif: 'InfoGif',
        });
      }
      setNewDepartment({
        departmentName: '',
        departmentId: 0,
        locationId: 0,
        locationType: '',
      });
      setSelectedDepartmentId(null);
      setShowDepartmentModal(false);
      refetch();
    } catch (error) {
      console.error('Failed to add/update deparment', error);
    }
  };

  const handleOnCancel = () => {
    setNewDepartment({
      departmentName: '',
      departmentId: 0,
      locationId: 0,
      locationType: '',
    });
    setSelectedDepartmentId(null);
    setShowDepartmentModal(false);
  };
  return (
    <Dialog
      open={showDepartmentModal}
      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
      maxWidth={'sm'}
      fullWidth={true}
      PaperProps={{
        sx: {
          borderRadius: '8px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
        },
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: '#205475',
          color: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 20px',
        }}
      >
        <StyledTypography
          fontSize="20px"
          fontWeight="300"
          lineHeight="18px"
          color="#fff"
        >
          {getlabel('MM_DM_Department', labels, i18n.language)}
        </StyledTypography>

        <IconButton
          onClick={handleOnCancel}
          style={{
            padding: '0.7rem',
          }}
          sx={{
            color: '#fff',
            '&:hover': {
              transform: 'scale(1.05)',
              backgroundColor: 'color(srgb 0.75 0.74 0.74 / 0.15)',
            },
          }}
        >
          <Tooltip title="Close" arrow>
            <StyledImage src={CloseIcon} alt="Close Icon" tooltip="Close" />
          </Tooltip>
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <FlexContainer flexWrap="wrap">
          <Formik
            enableReinitialize={true}
            initialValues={newDepartment}
            validateOnBlur={false}
            validationSchema={departmentValidation}
            onSubmit={(values) => {
              submitDepartment(values);
            }}
          >
            {({ values, errors, handleSubmit, resetForm, setFieldValue }) => (
              <Form style={{ width: '100%' }}>
                {pageFields?.find((x) => x.FieldId === 'DM_P_Facility')
                  ?.IsShow && (
                    <Grid
                      container
                      display={'flex'}
                      width="100%"
                      flexWrap={'wrap'}
                      justifyContent={'space-between'}
                      item
                      xs={12}
                      spacing={2}
                      alignItems={'center'}
                      marginTop={'1rem'}
                    >
                      <Grid item xs={12} sm={12} md={6} lg={4}>
                        <Label
                          value={getlabel(
                            'MM_DM_Facility',
                            labels,
                            i18n.language
                          )}
                          isRequired={
                            pageFields?.find((x) => x.FieldId === 'DM_P_Facility')
                              ?.IsMandatory
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={8}>
                        <SearchDropdown
                          disableClearable={true}
                          name={'facility'}
                          options={[
                            { text: 'Select', value: '' },
                            ...(facilityList || []),
                          ]}
                          disabled={selectedDepartmentId}
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
                                fontSize: '13px',
                                minHeight: '30px',
                                display: 'flex',
                                alignItems: 'center',
                              },
                            },
                          }}
                          value={
                            facilityList?.find(
                              (option) => option.value === values['facility']
                            ) || null
                          }
                          onChange={(event, value) => {
                            setFieldValue('facility', value?.value);
                            if (value?.value) {
                              getLocationTypeList(value?.value);
                            } else if (!value?.value) {
                              setLocationList([]);
                            }
                          }}
                        />
                        <ErrorMessage
                          name="facility"
                          component="div"
                          style={{
                            color: 'red',
                            fontSize: '12px',
                            marginTop: '4px',
                          }}
                        />
                      </Grid>
                    </Grid>
                  )}
                {pageFields?.find((x) => x.FieldId === 'DM_P_DepartmentUnit')
                  ?.IsShow && (
                    <Grid
                      container
                      display={'flex'}
                      width="100%"
                      flexWrap={'wrap'}
                      justifyContent={'space-between'}
                      item
                      xs={12}
                      spacing={2}
                      alignItems={'center'}
                      marginTop={'0.5rem'}
                    >
                      <Grid item xs={12} sm={12} md={6} lg={4}>
                        <Label
                          value={getlabel(
                            'MM_DM_Department',
                            labels,
                            i18n.language
                          )}
                          isRequired={
                            pageFields?.find(
                              (x) => x.FieldId === 'DM_P_DepartmentUnit'
                            )?.IsMandatory
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={8}>
                        <Field name="departmentName">
                          {({ field }) => (
                            <TextField
                              {...field}
                              id="departmentName"
                              autoComplete="off"
                              values={values?.departmentName}
                              fullWidth={true}
                              slotProps={{
                                htmlInput: { maxLength: 100 },
                              }}
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          name="departmentName"
                          component="div"
                          style={{
                            color: 'red',
                            fontSize: '12px',
                            marginTop: '4px',
                          }}
                        />
                      </Grid>
                    </Grid>
                  )}
                 
                {pageFields?.find((x) => x.FieldId === 'DM_P_LocationType')
                  ?.IsShow && (
                    <Grid
                      container
                      display={'flex'}
                      width="100%"
                      flexWrap={'wrap'}
                      justifyContent={'space-between'}
                      item
                      xs={12}
                      spacing={2}
                      alignItems={'center'}
                      marginTop={'0.2rem'}
                    >
                      <Grid item xs={12} sm={12} md={6} lg={4}>
                        <Label
                          value={getlabel(
                            'MM_DM_LocationType',
                            labels,
                            i18n.language
                          )}
                          isRequired={
                            pageFields?.find(
                              (x) => x.FieldId === 'DM_P_LocationType'
                            )?.IsMandatory
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={8}>
                        <SearchDropdown
                          disableClearable={true}
                          disabled={locationList?.length === 0}
                          name={'locationId'}
                          options={[
                            { text: 'Select', value: '' },
                            ...(locationList || []),
                          ]}
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
                                fontSize: '13px',
                                minHeight: '30px',
                                display: 'flex',
                                alignItems: 'center',
                              },
                            },
                          }}
                          value={
                            locationList?.find(
                              (option) => option.value === values['locationId']
                            ) || null
                          }
                          onChange={(event, value) => {
                            setFieldValue('locationId', value?.value);
                          }}
                        />
                        <ErrorMessage
                          name="locationId"
                          component="div"
                          style={{
                            color: 'red',
                            fontSize: '12px',
                            marginTop: '4px',
                          }}
                        />
                      </Grid>
                    </Grid>
                  )}
                {dynamicFormData?.Data &&
                  Array.isArray(dynamicFormData.Data) &&
                  dynamicFormData.Data.length > 0 && (
                    <Grid item xs={12} sm={12} md={12} padding={'0px'} marginTop={"30px"}>
                      <FlexContainer
                        className="staffmaster-wrapper"
                        flexDirection="column"
                      >
                        {/* <Label bold marginBottom={"10px"} value={'Custom fields:'} /> */}
                        <ReactFormGenerator
                          key={JSON.stringify(
                            deptRecords?.Data?.FormBuilderData || []
                          )}
                          width="100%"
                          className="custom-width"
                          data={dynamicFormData?.Data || []}
                          onChange={(event) => {                            
                            setFieldValue('formBuilderData',event?event:null);
                          }}
                          answer_data={
                            deptRecords?.Data?.FormBuilderData
                              ? deptRecords?.Data?.FormBuilderData
                              : null
                          }
                        />
                      </FlexContainer>
                    </Grid>
                  )}
                <Grid
                  display={'flex'}
                  width="100%"
                  justifyContent={'center'}
                  gap={'10px'}
                  marginTop={'1rem'}
                >
                  <StyledButton
                    borderRadius="6px"
                    gap="4px"
                    padding="6px 10px"
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    type="submit"
                    disabled={isAdding || isUpdating}
                    style={{ display: 'inline-flex', gap: '5px' }}
                    startIcon={
                      <StyledImage
                        height="16px"
                        width="16px"
                        src={DoneIcon}
                        alt="WhiteSearch"
                      />
                    }
                  >
                    {t('Submit')}
                  </StyledButton>
                  <StyledButton
                    variant="outlined"
                    border="1px solid #0083c0"
                    backgroundColor="#ffffff"
                    type="button"
                    colour="#0083c0"
                    borderRadius="6px"
                    disabled={isAdding || isUpdating}
                    sx={{ marginLeft: '10px' }}
                    style={{ display: 'inline-flex', gap: '5px' }}
                    onClick={handleOnCancel}
                    startIcon={
                      <StyledImage
                        height="16px"
                        width="16px"
                        src={DndIcon}
                        alt="WhiteSearch"
                      />
                    }
                  >
                    {t('Cancel')}
                  </StyledButton>
                </Grid>
              </Form>
            )}
          </Formik>
        </FlexContainer>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditDepartment;
