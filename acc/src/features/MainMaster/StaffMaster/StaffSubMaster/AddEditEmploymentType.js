import {
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
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
import { ReactFormGenerator } from 'react-form-builder2';
import CloseIcon from '../../../../assets/Icons/CloseIcon.png';
import DoneIcon from '../../../../assets/Icons/DoneIcon.png';
import DndIcon from '../../../../assets/Icons/DoNotDisturbIcon.png';
import Label from '../../../../components/Label/Label';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  useAddEmploymentTypeMutation,
  useGetEmploymentTypeByIdQuery,
  useUpdateEmploymentTypeMutation,
} from '../../../../redux/RTK/staffSubMasterApi';
import { getlabel } from '../../../../utils/language';
import { useTranslation } from 'react-i18next';
import { showToastAlert } from '../../../../utils/SweetAlert';
import { useGetFormBuilderByIdQuery } from '../../../../redux/RTK/formBuilderApi';
import MultiSelectDropdown from '../../../../components/Dropdown/MultiSelectDropdown';

const AddEditEmploymentType = ({
  showEmploymentModel,
  setShowEmploymentModel,
  selectedEmploymentTypeId,
  setSelectedEmploymentTypeId,
  facilityList,
  labels,
  refetch,
  fields,
  tabs
}) => {
  //* Hooks declaration
  const { i18n, t } = useTranslation();

  //*  Selectors
  const {
    selectedRoleFacility,
    selectedMenu,
    selectedModuleId,
    userDetails,
    selectedFacility,
  } = useSelector((state) => state.auth);

  //* State Variables
  const [newEmploymentType, setNewEmploymentType] = useState({
    facility: 0,
    employmentType: '',
    employmentTypeId: 0,
    formBuilderData:null
  });
  const [roleMenu, setRoleMenu] = useState();

  //* RTK Queries
  const [triggerAddEmploymentType] = useAddEmploymentTypeMutation();
  const [triggerUpdateEmploymentType] = useUpdateEmploymentTypeMutation();

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
  //* Get Employemnt Type By Id
  const { data: empRecords, refetch: refetchEmploymentTypeData } =
    useGetEmploymentTypeByIdQuery(
      {
        employmentTypeId: selectedEmploymentTypeId,
        loginUserId: userDetails?.UserId,
        menuId: selectedMenu?.id,
      },
      { skip: !selectedEmploymentTypeId }
    );

  useEffect(() => {
    if (empRecords?.Data && setSelectedEmploymentTypeId) {
      setNewEmploymentType({
        employmentTypeId: empRecords?.Data?.EmploymentTypeId,
        facility: empRecords?.Data?.FacilityId,
        employmentType: empRecords?.Data?.EmploymentType,
      });
    }
  }, [empRecords]);

  const pageFields = fields?.Data?.Sections?.find(
    (section) => section?.SectionName === 'Page'
  )?.Fields;

  //* Employment type validation
  const employmentTypeValidation = Yup.object().shape({
    employmentType: Yup.string()
      .trim()
      .when([], {
        is: () =>
          pageFields?.find((x) => x.FieldId === 'SM_P_EmployeeType')
            ?.IsMandatory === true,
        then: (schema) =>
          schema.required(
            `${getlabel('MM_SM_EmploymentType', labels, i18n.language)} ${t('IsRequired')}`
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
  });

  //* Submit Employment Type
  const submitEmploymentType = async (values) => {
    const facilityIds =
      Array.isArray(values?.facility) && values?.facility.join(',');
    try {
      let response;
      if (newEmploymentType?.employmentTypeId === 0) {
        response = await triggerAddEmploymentType({
          payload: {
            facilityId: values?.facility,
            employmentType: values?.employmentType?.trim(),
            moduleId: selectedModuleId,
            menuId: selectedMenu?.id,
            loginUserId: userDetails?.UserId,
            headerFacilityId: selectedFacility?.id,
            formBuilderData:values?.formBuilderData
          },
        }).unwrap();
      } else if (newEmploymentType?.employmentTypeId) {
        response = await triggerUpdateEmploymentType({
          payload: {
            facilityId: values?.facility,
            employmentType: values?.employmentType?.trim(),
            employmentTypeId: values?.employmentTypeId,
            moduleId: selectedModuleId,
            menuId: selectedMenu?.id,
            loginUserId: userDetails?.UserId,
            headerFacilityId: selectedFacility?.id,
            formBuilderData:values?.formBuilderData
          },
        }).unwrap();
        refetchEmploymentTypeData();
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
      setNewEmploymentType({
        facility: 0,
        employmentType: '',
        employmentTypeId: 0,
      });
      refetch();
      setSelectedEmploymentTypeId(null);
      setShowEmploymentModel(false);
    } catch (error) {
      showToastAlert({
        type: 'custom_error',
        text: 'Failed to add/update employment type',
        gif: 'ErrorGif',
      });
      console.error('Failed to add/update employment type', error);
    }
  };

  useEffect(() => {
    const roleMenu = selectedRoleFacility?.Menu.find(
      (item) => item.MenuId === selectedMenu?.id
    );
    setRoleMenu(roleMenu);
  }, [selectedRoleFacility, selectedMenu]);

  //* Cancel designation modal
  const handleOnCancel = () => {
    setNewEmploymentType({
      facility: 0,
      employmentType: '',
      employmentTypeId: 0,
    });
    setSelectedEmploymentTypeId(null);
    setShowEmploymentModel(false);
  };

  return (
    <Dialog
      open={showEmploymentModel}
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
          {getlabel('MM_SM_EmploymentType', labels, i18n.language)}
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
            initialValues={newEmploymentType}
            validateOnBlur={false}
            validationSchema={employmentTypeValidation}
            onSubmit={(values) => {
              submitEmploymentType(values);
            }}
          >
            {({ values, handleSubmit, setFieldValue }) => (
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
                        disabled={selectedEmploymentTypeId}
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
                
                {pageFields?.find((x) => x.FieldId === 'SM_P_EmployeeType')
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
                          'MM_SM_EmploymentType',
                          labels,
                          i18n.language
                        )}
                        isRequired={
                          pageFields?.find(
                            (x) => x.FieldId === 'SM_P_EmployeeType'
                          )?.IsMandatory
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={8}>
                      <Field name="employmentType">
                        {({ field }) => (
                          <TextField
                            {...field}
                            id="employmentType"
                            autoComplete="off"
                            values={values?.employmentType}
                            fullWidth={true}
                            slotProps={{ htmlInput: { maxLength: 100 } }}
                          />
                        )}
                      </Field>
                      <ErrorMessage
                        name="employmentType"
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
                            empRecords?.Data?.FormBuilderData || []
                          )}
                          width="100%"
                          className="custom-width"
                          data={dynamicFormData?.Data || []}
                          onChange={(event) => {                            
                            setFieldValue('formBuilderData',event?event:null);
                          }}
                          answer_data={
                            empRecords?.Data?.FormBuilderData
                              ? empRecords?.Data?.FormBuilderData
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

export default AddEditEmploymentType;
