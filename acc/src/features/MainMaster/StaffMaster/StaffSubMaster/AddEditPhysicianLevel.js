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
import CloseIcon from '../../../../assets/Icons/CloseIcon.png';
import DoneIcon from '../../../../assets/Icons/DoneIcon.png';
import DndIcon from '../../../../assets/Icons/DoNotDisturbIcon.png';
import Label from '../../../../components/Label/Label';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  useAddPhysicianLevelMutation,
  useGetPhysicianLevelByIdQuery,
  useUpdatePhysicianLevelMutation,
} from '../../../../redux/RTK/staffSubMasterApi';
import { useGetFormBuilderByIdQuery } from '../../../../redux/RTK/formBuilderApi';
import { getlabel } from '../../../../utils/language';
import { useTranslation } from 'react-i18next';
import { showToastAlert } from '../../../../utils/SweetAlert';
import { ReactFormGenerator } from 'react-form-builder2';
import MultiSelectDropdown from '../../../../components/Dropdown/MultiSelectDropdown';

const AddEditPhysicianLevel = ({
  showPhysicianLevelModal,
  setShowPhysicianLevelModal,
  selectedPhysicianLevelId,
  setSelectedPhysicianLevelId,
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

  //* State Variables
  const [newPhysicianLevel, setNewPhysicianLevel] = useState({
    facility: 0,
    physicianLevel: '',
    physicianLevelId: 0,
    formBuilderData:null
  });

  //* RTK Queries
  const [triggerAddPhysicianLevel] = useAddPhysicianLevelMutation();
  const [triggerUpdatePhysicianLevel] = useUpdatePhysicianLevelMutation();

  //* Get Employemnt Type By Id
  const { data: phyRecords, refetch: refetchPhysicianLevelData } =
    useGetPhysicianLevelByIdQuery(
      {
        physicianLevelId: selectedPhysicianLevelId,
        loginUserId: userDetails?.UserId,
        menuId: selectedMenu?.id,
      },
      { skip: !selectedPhysicianLevelId }
    );
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
  useEffect(() => {
    if (phyRecords?.Data && setSelectedPhysicianLevelId) {
      setNewPhysicianLevel({
        physicianLevelId: phyRecords?.Data?.PhysicianLevelId,
        facility: phyRecords?.Data?.FacilityId,
        physicianLevel: phyRecords?.Data?.PhysicianLevel,
      });
    }
  }, [phyRecords]);

  const pageFields = fields?.Data?.Sections?.find(
    (section) => section?.SectionName === 'Page'
  )?.Fields;

  //* Physician level type validation
  const physicianLeveleValidation = Yup.object().shape({
    physicianLevel: Yup.string()
      .trim()
      .when([], {
        is: () =>
          pageFields?.find((x) => x.FieldId === 'SM_P_Physicianlevel')
            ?.IsMandatory === true,
        then: (schema) =>
          schema.required(
            `${getlabel('MM_SM_Physicianlevel', labels, i18n.language)} ${t('IsRequired')}`
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

  //* Submit physician level Type
  const submitPhysicianLevel = async (values) => {
    const facilityIds =
    Array.isArray(values?.facility) && values?.facility.join(',');
    try {
      let response;
      if (newPhysicianLevel?.physicianLevelId === 0) {
        response = await triggerAddPhysicianLevel({
          payload: {
            facilityId: values?.facility,
            physicianLevel: values?.physicianLevel?.trim(),
            moduleId: selectedModuleId,
            menuId: selectedMenu?.id,
            loginUserId: userDetails?.UserId,
            headerFacilityId: selectedFacility?.id,
            formBuilderData:values?.formBuilderData
          },
        }).unwrap();
      } else if (newPhysicianLevel?.physicianLevelId) {
        response = await triggerUpdatePhysicianLevel({
          payload: {
            facilityId: values?.facility,
            physicianLevel: values?.physicianLevel?.trim(),
            physicianLevelId: values?.physicianLevelId,
            moduleId: selectedModuleId,
            menuId: selectedMenu?.id,
            loginUserId: userDetails?.UserId,
            headerFacilityId: selectedFacility?.id,
            formBuilderData:values?.formBuilderData
          },
        }).unwrap();
        refetchPhysicianLevelData();
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
      setNewPhysicianLevel({
        facility: 0,
        physicianLevel: '',
        physicianLevelId: 0,
      });
      refetch();
      setSelectedPhysicianLevelId(null);
      setShowPhysicianLevelModal(false);
    } catch (error) {
      showToastAlert({
        type: 'custom_error',
        text: 'Failed to add/update physician level',
        gif: 'ErrorGif',
      });
      console.error('Failed to add/update physician level', error);
    }
  };

  //* Cancel physician level modal
  const handleOnCancel = () => {
    setNewPhysicianLevel({
      facility: 0,
      physicianLevel: '',
      physicianLevelId: 0,
    });
    setSelectedPhysicianLevelId(null);
    setShowPhysicianLevelModal(false);
  };

  return (
    <Dialog
      open={showPhysicianLevelModal}
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
          {getlabel('MM_SM_Physicianlevel', labels, i18n.language)}
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
            initialValues={newPhysicianLevel}
            validateOnBlur={false}
            validationSchema={physicianLeveleValidation}
            onSubmit={(values) => {
              submitPhysicianLevel(values);
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
                        disabled={selectedPhysicianLevelId}
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
                {pageFields?.find((x) => x.FieldId === 'SM_P_Physicianlevel')
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
                          'MM_SM_Physicianlevel',
                          labels,
                          i18n.language
                        )}
                        isRequired={
                          pageFields?.find(
                            (x) => x.FieldId === 'SM_P_Physicianlevel'
                          )?.IsMandatory
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={8}>
                      <Field name="physicianLevel">
                        {({ field }) => (
                          <TextField
                            {...field}
                            id="physicianLevel"
                            autoComplete="off"
                            values={values?.physicianLevel}
                            fullWidth={true}
                            slotProps={{ htmlInput: { maxLength: 100 } }}
                          />
                        )}
                      </Field>
                      <ErrorMessage
                        name="physicianLevel"
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
                            phyRecords?.Data?.FormBuilderData || []
                          )}
                          width="100%"
                          className="custom-width"
                          data={dynamicFormData?.Data || []}
                          onChange={(event) => {                            
                            setFieldValue('formBuilderData',event?event:null);
                          }}
                          answer_data={
                            phyRecords?.Data?.FormBuilderData
                              ? phyRecords?.Data?.FormBuilderData
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
                    style={{ display: 'inline-flex', gap: '8px' }}
                    type="submit"
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

export default AddEditPhysicianLevel;
