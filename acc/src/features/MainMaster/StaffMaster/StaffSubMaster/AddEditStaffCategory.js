import { useSelector } from 'react-redux';
import {
  useAddStaffCategoryMutation,
  useGetStaffCategoryByIdQuery,
  useUpdateStaffCategoryMutation,
} from '../../../../redux/RTK/staffSubMasterApi';
import { ReactFormGenerator } from 'react-form-builder2';
import { useEffect, useState } from 'react';
import {
  Autocomplete,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
} from '@mui/material';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import Label from '../../../../components/Label/Label';
import * as Yup from 'yup';
import CloseIcon from '../../../../assets/Icons/CloseIcon.png';
import DoneIcon from '../../../../assets/Icons/DoneIcon.png';
import DndIcon from '../../../../assets/Icons/DoNotDisturbIcon.png';
import { getlabel } from '../../../../utils/language';
import { useTranslation } from 'react-i18next';
import { showToastAlert } from '../../../../utils/SweetAlert';
import { useGetFieldsQuery } from '../../../../redux/RTK/moduleDataApi';
import SearchDropdown from '../../../../components/SearchDropdown/SearchDropdown';
import { useGetFormBuilderByIdQuery } from '../../../../redux/RTK/formBuilderApi';
import MultiSelectDropdown from '../../../../components/Dropdown/MultiSelectDropdown';

const AddEditStaffCategory = ({
  showStaffCategoryeModal,
  setShowStaffCategoryModal,
  selectedStaffCategoryId,
  setSelectedStaffCategoryId,
  facilityList,
  labels,
  refetch,
  fields,
  tabs
}) => {
  //* Hooks declaration
  const { i18n, t } = useTranslation();

  //* Selectors
  const { selectedMenu, selectedModuleId, userDetails, selectedFacility } =
    useSelector((state) => state.auth);

  //* State Variables declaration
  const [newStaffCategory, setNewStaffCategory] = useState({
    facility: 0,
    staffCategoryName: '',
    staffCategoryId: 0,
    isPhysician: '',
    formBuilderData:null

  });

  //* RTK queries
  const [triggerAddStaffCategory] = useAddStaffCategoryMutation();
  const [triggerUpdateStaffCategory] = useUpdateStaffCategoryMutation();

  const { data: dynamicFormData } = useGetFormBuilderByIdQuery(
    {
      menuId: selectedMenu?.id,
      loginUserId: userDetails?.UserId,
      moduleId: selectedModuleId,
      headerFacilityId: selectedFacility?.id,
      tabs:tabs?parseInt(tabs):0
    },
    { skip: !selectedMenu?.id || !userDetails?.UserId || !selectedModuleId }
  );
  //* Get Staff Category By Id
  const { data: staffRecords, refetch: refetchStaffCategoryData } =
    useGetStaffCategoryByIdQuery(
      {
        staffCategoryId: selectedStaffCategoryId,
        loginUserId: userDetails?.UserId,
        menuId: selectedMenu?.id,
      },
      { skip: !selectedStaffCategoryId }
    );

  useEffect(() => {
    if (staffRecords?.Data && setSelectedStaffCategoryId) {
      setNewStaffCategory({
        staffCategoryId: staffRecords?.Data?.StaffCategoryId,
        facility: staffRecords?.Data?.FacilityId,
        staffCategoryName: staffRecords?.Data?.StaffCategoryName,
        isPhysician: staffRecords?.Data?.IsPhysician ? 'yes' : 'no',
      });
    }
  }, [staffRecords]);

  const pageFields = fields?.Data?.Sections?.find(
    (section) => section?.SectionName === 'Page'
  )?.Fields;

  //* Staff Category validation
  const staffCategoryValidation = Yup.object().shape({
    staffCategoryName: Yup.string()
      .trim()
      .when([], {
        is: () =>
          pageFields?.find((x) => x.FieldId === 'SM_P_StaffCategory')
            ?.IsMandatory === true,
        then: (schema) =>
          schema.required(
            `${getlabel('MM_SM_StaffCategory', labels, i18n.language)} ${t('IsRequired')}`
          ),
        otherwise: (schema) => schema.notRequired(),
      }),

    facility: Yup.number().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'SM_P_Facility')?.IsMandatory ===
        true,
      then: (schema) =>
        schema
          .required(
            `${getlabel('MM_SM_Facility', labels, i18n.language)} ${t('IsRequired')}`
          )
          .test(
            'is-zero',
            `${getlabel('MM_SM_Facility', labels, i18n.language)} ${t('IsRequired')}`,
            (value) => {
              return value !== 0;
            }
          ),
      otherwise: (schema) => schema.notRequired(),
    }),

    isPhysician: Yup.string()
      .trim()
      .when([], {
        is: () =>
          pageFields?.find((x) => x.FieldId === 'SM_P_PhysicianType')
            ?.IsMandatory === true,
        then: (schema) =>
          schema.required(
            `${getlabel('MM_SM_PhysicianType', labels, i18n.language)} ${t('IsRequired')}`
          ),
        otherwise: (schema) => schema.notRequired(),
      }),
  });

  //* Submit Staff Category
  const submitStaffCategory = async (values) => {
    const facilityIds =
      Array.isArray(values?.facility) && values?.facility.join(',');
    try {
      let response;
      let isPhysician;
      if (values?.isPhysician === 'yes') {
        isPhysician = true;
      } else if (values?.isPhysician === 'no') {
        isPhysician = false;
      }
      if (newStaffCategory?.staffCategoryId === 0) {
        response = await triggerAddStaffCategory({
          payload: {
            facilityId: values?.facility,
            staffCategoryName: values?.staffCategoryName?.trim(),
            IsPhysician: isPhysician,
            moduleId: selectedModuleId,
            menuId: selectedMenu?.id,
            loginUserId: userDetails?.UserId,
            headerFacilityId: selectedFacility?.id,
            formBuilderData:values?.formBuilderData
          },
        }).unwrap();
      } else if (newStaffCategory?.staffCategoryId) {
        response = await triggerUpdateStaffCategory({
          payload: {
            staffCategoryId: values?.staffCategoryId,
            facilityId: values?.facility,
            staffCategoryName: values?.staffCategoryName?.trim(),
            IsPhysician: isPhysician,
            moduleId: selectedModuleId,
            menuId: selectedMenu?.id,
            loginUserId: userDetails?.UserId,
            headerFacilityId: selectedFacility?.id,
            formBuilderData:values?.formBuilderData
          },
        }).unwrap();
        refetchStaffCategoryData();
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
      setNewStaffCategory({
        facility: 0,
        staffCategoryName: '',
        staffCategoryId: 0,
        isPhysician: '',
      });
      refetch();
      setSelectedStaffCategoryId(null);
      setShowStaffCategoryModal(false);
    } catch (error) {
      showToastAlert({
        type: 'custom_info',
        text: 'Failed to add/update staff category',
        gif: 'ErrorGif',
      });
      console.error('Failed to add/update staff category', error);
    }
  };

  //* Cancel staff category modal
  const handleOnCancel = () => {
    setNewStaffCategory({
      facility: 0,
      staffCategoryName: '',
      staffCategoryId: 0,
      isPhysician: '',
    });
    setSelectedStaffCategoryId(null);
    setShowStaffCategoryModal(false);
  };
  return (
    <Dialog
      open={showStaffCategoryeModal}
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
          {getlabel('MM_SM_StaffCategory', labels, i18n.language)}
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
          <img src={CloseIcon} alt="Close Icon" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <FlexContainer flexWrap="wrap">
          <Formik
            enableReinitialize={true}
            initialValues={newStaffCategory}
            validateOnBlur={false}
            validationSchema={staffCategoryValidation}
            onSubmit={(values) => {
              submitStaffCategory(values);
            }}
          >
            {({ values, errors, handleSubmit, resetForm, setFieldValue }) => (
              <Form style={{ width: '100%' }}>
                {pageFields?.find((x) => x.FieldId === 'SM_P_Facility')
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
                          'MM_SM_Facility',
                          labels,
                          i18n.language
                        )}
                        isRequired={
                          pageFields?.find((x) => x.FieldId === 'SM_P_Facility')
                            ?.IsMandatory
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={8}>
                      <MultiSelectDropdown
                        disableClearable={true}
                        name={'facility'}
                        disabled={selectedStaffCategoryId}
                        options={[
                          ...(facilityList || []),
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
                          facilityList?.find(
                            (option) => option.value === values['facility']
                          ) || null
                        }
                        onChange={(event, value) => {
                          setFieldValue('facility', value?.value);
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
                {pageFields?.find((x) => x.FieldId === 'SM_P_StaffCategory')
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
                          'MM_SM_StaffCategory',
                          labels,
                          i18n.language
                        )}
                        isRequired={
                          pageFields?.find(
                            (x) => x.FieldId === 'SM_P_StaffCategory'
                          )?.IsMandatory
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={8}>
                      <Field name="staffCategoryName">
                        {({ field }) => (
                          <TextField
                            {...field}
                            id="staffCategoryName"
                            autoComplete="off"
                            values={values?.staffCategoryName}
                            fullWidth={true}
                            slotProps={{ htmlInput: { maxLength: 100 } }}
                          />
                        )}
                      </Field>
                      <ErrorMessage
                        name="staffCategoryName"
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
                {pageFields?.find((x) => x.FieldId === 'SM_P_PhysicianType')
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
                    <Grid item xs={12} sm={12} md={6} lg={4} padding={'10px'}>
                      <Label
                        value={getlabel(
                          'MM_SM_PhysicianType',
                          labels,
                          i18n.language
                        )}
                        isRequired={
                          pageFields?.find(
                            (x) => x.FieldId === 'SM_P_PhysicianType'
                          )?.IsMandatory
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={8} padding={'10px'}>
                      <SearchDropdown
                        disableClearable={true}
                        name={'isPhysician'}
                        options={[
                          { text: 'Select', value: '' },
                          { text: 'Yes', value: 'yes' },
                          { text: 'No', value: 'no' },
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
                          [
                            { text: 'Select', value: '' },
                            { text: 'Yes', value: 'yes' },
                            { text: 'No', value: 'no' },
                          ]?.find(
                            (option) => option.value === values['isPhysician']
                          ) || null
                        }
                        onChange={(event, value) => {
                          setFieldValue('isPhysician', value?.value);
                        }}
                      />
                      <ErrorMessage
                        name="isPhysician"
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
                            staffRecords?.Data?.FormBuilderData || []
                          )}
                          width="100%"
                          className="custom-width"
                          data={dynamicFormData?.Data || []}
                          onChange={(event) => {                            
                            setFieldValue('formBuilderData',event?event:null);
                          }}
                          answer_data={
                            staffRecords?.Data?.FormBuilderData
                              ? staffRecords?.Data?.FormBuilderData
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
                    style={{ display: 'inline-flex', gap: '8px' }}
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
                    sx={{ marginLeft: '10px' }}
                    style={{ display: 'inline-flex', gap: '8px' }}
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

export default AddEditStaffCategory;
