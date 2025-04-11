import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  Grid,
  TextField,
  Autocomplete,
  Checkbox,
} from '@mui/material';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledTypography,
} from '../../../../../utils/StyledComponents';
import CloseIcon from '../../../../../assets/Icons/CloseIcon.png';
import DoneIcon from '../../../../../assets/Icons/DoneIcon.png';
import DndIcon from '../../../../../assets/Icons/DoNotDisturbIcon.png';
import { useTranslation } from 'react-i18next';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import MultiSelectDropdown from '../../../../../components/Dropdown/MultiSelectDropdown';
import Label from '../../../../../components/Label/Label';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { getlabel } from '../../../../../utils/language';
import { useSelector } from 'react-redux';
import { showToastAlert } from '../../../../../utils/SweetAlert';
import SearchDropdown from '../../../../../components/SearchDropdown/SearchDropdown';
import { useGetReferenceNumberDataByIdQuery } from '../../../../../redux/RTK/IncidentManagement/incidentSubMasterApi';

const AddEditPassedByHR = ({
  showPassedByModal,
  setShowPassedByModal,
  selectedPassedById,
  setSelectedPassedById,
  labels,
  refetch,
  fieldAccess,
}) => {
  //* Hooks declaration
  const { t, i18n } = useTranslation();

  //* Selectors
  const {
    selectedMenu,
    selectedModuleId,
    userDetails,
    isSuperAdmin,
    roleFacilities,
  } = useSelector((state) => state.auth);

  //* State variables

  const [facilityList, setFacilityList] = useState([
    { text: 'Select', value: '' },
    ...(userDetails?.ApplicableFacilities?.filter((facility) => {
      if (!facility.IsActive) return false;
      if (isSuperAdmin) return true;
      const facilityItem = roleFacilities
        ?.find((role) => role.FacilityId === facility.FacilityId)
        ?.Menu?.find((MenuItem) => MenuItem.MenuId === selectedMenu?.id);
      return facilityItem?.IsAdd;
    }).map((facility) => ({
      text: facility.FacilityName,
      value: facility.FacilityId,
    })) ||
      [] ||
      []),
  ]);
  const [fieldLabels, setFieldLabels] = useState([]);
  const [newPassedBy, setNewPassedBy] = useState({
    passedById: selectedPassedById || 0,
    facility: '',
    passedByName: '',
  });

  //* RTK Queries

  const {
    data: passedByRecords,
    isFetching,
    refetch: refetchPassedByData,
  } = useGetReferenceNumberDataByIdQuery(
    {
      tabsId: selectedPassedById,
      loginUserId: userDetails?.UserId,
    },
    { skip: !selectedPassedById }
  );

  //* Field access checking
  const pageFields = fieldAccess?.Data?.Sections?.find(
    (sectionName) =>
      sectionName?.SectionName === 'Staff Demography Verification Passed by HR'
  )?.Fields;

  //* Use Effects to bind values

  useEffect(() => {
    if (labels?.Data) {
      setFieldLabels(labels?.Data);
    }
  }, [labels]);

  useEffect(() => {
    if (passedByRecords?.Data && selectedPassedById) {
      setNewPassedBy({
        passedById: selectedPassedById || 0,
        facility: '',
        passedByName: '',
      });
    }
  }, [passedByRecords]);

  //* Validation Schema
  const statusValidation = Yup.object().shape({
    passedByName: Yup.string().when([], {
      is: () =>
        pageFields?.find(
          (x) => x.FieldId === 'SF_VPHR_StaffDemographyVerificationPassedbyHR'
        )?.IsMandatory === true,
      then: (schema) =>
        schema.required(
          `${getlabel('MM_SF_VPHR_StaffDemographyVerificationPassedbyHR', labels, i18n.language)} ${t('IsRequired')}`
        ),
      otherwise: (schema) => schema.notRequired(),
    }),

    facility: Yup.number().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'SF_VPHR_Facility')
          ?.IsMandatory === true,
      then: (schema) =>
        schema
          .required(
            `${getlabel('MM_SF_VPHR_Facility', labels, i18n.language)} ${t('IsRequired')}`
          )
          .test(
            'is-zero',
            `${getlabel('MM_SF_VPHR_Facility', labels, i18n.language)} ${t('IsRequired')}`,
            (value) => {
              return value !== '';
            }
          ),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  //* Close modal
  const handleOnCancel = () => {
    setNewPassedBy({
      passedById: 0,
      facility: '',
      passedByName: '',
    });
    setSelectedPassedById(null);
    setShowPassedByModal(false);
  };

  //* Submit function
  const submitPassedBy = async (values) => {
    try {
      let response;
      if (newPassedBy?.passedById === 0) {
        response = await triggerAddReferenceNumber({
          payload: {
            incidentReferenceId: values?.refNumberId,
            incidentReferenceNo: values?.incRefNumber,
            dateFormat: dateFormatList?.find(
              (x) => x.value === values?.incDateFormat
            )?.text,
            numberReset: resetNumberingList?.find(
              (x) => x.value === values?.resetNumbering
            )?.text,
            facilityIds: values?.facility?.join(','),
            moduleId: selectedModuleId,
            menuId: selectedMenu?.id,
            loginUserId: userDetails?.UserId,
          },
        }).unwrap();
      }
      if (newPassedBy?.passedById !== 0) {
        response = await triggerUpdateReferenceNumber({
          payload: {
            incidentReferenceId: values?.refNumberId,
            incidentReferenceNo: values?.incRefNumber,
            facilityId: parseInt(values?.facility?.join(',')),
            dateFormat: dateFormatList?.find(
              (x) => x.value === values?.incDateFormat
            )?.text,
            numberReset: resetNumberingList?.find(
              (x) => x.value === values?.resetNumbering
            )?.text,
            loginUserId: userDetails?.UserId,
            moduleId: selectedModuleId,
            menuId: selectedMenu?.id,
          },
        }).unwrap();
        refetchPassedByData();
      }

      if (response && response.Message !== 'Record Already Exist') {
        showToastAlert({
          type: 'custom_success',
          text: response.Message,
          git: 'SuccessGif',
        });
      }
      if (response && response.Message === 'Record Already Exist') {
        showToastAlert({
          type: 'custom_info',
          text: response.Message,
          gif: 'InfoGif',
        });
      }
      setNewPassedBy({
        passedById: selectedPassedById || 0,
        facility: '',
        passedByName: '',
      });
      refetch();
      setSelectedPassedById(null);
      setShowPassedByModal(false);
    } catch (error) {
      console.error('Failed to add/update Verification Passed By HR', error);
    }
  };

  return (
    <Dialog
      open={showPassedByModal}
      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
      maxWidth={'md'}
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
          backgroundColor: '#0083c0',
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
          {getlabel(
            'MM_SF_VPHR_StaffDemographyVerificationPassedbyHR',
            {
              Data: fieldLabels,
              Status: labels?.Status,
            },
            i18n.language
          )}
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
            <StyledImage src={CloseIcon} alt="Close Icon" />
          </Tooltip>
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <FlexContainer flexWrap="wrap">
          <Formik
            enableReinitialize={true}
            initialValues={newPassedBy}
            validateOnBlur={false}
            validationSchema={statusValidation}
            onSubmit={(values) => {
              submitPassedBy(values);
            }}
          >
            {({ values, setFieldValue }) => (
              <Form style={{ width: '100%' }}>
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
                  {pageFields?.find(
                    (x) =>
                      x.FieldId ===
                      'SF_VPHR_StaffDemographyVerificationPassedbyHR'
                  )?.IsShow && (
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
                    >
                      <Grid item xs={12} sm={12} md={6} lg={4}>
                        <Label
                          value={getlabel(
                            'MM_SF_VPHR_StaffDemographyVerificationPassedbyHR',
                            {
                              Data: fieldLabels,
                              Status: labels?.Status,
                            },
                            i18n.language
                          )}
                          isRequired={
                            pageFields?.find(
                              (x) =>
                                x.FieldId ===
                                'SF_VPHR_StaffDemographyVerificationPassedbyHR'
                            )?.IsMandatory
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={8}>
                        <Field name="passedByName">
                          {({ field }) => (
                            <TextField
                              {...field}
                              id="passedByName"
                              autoComplete="off"
                              values={values.passedByName}
                              fullWidth={true}
                              slotProps={{ htmlInput: { maxLength: 100 } }}
                              disabled={isFetching}
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          name="passedByName"
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
                  {pageFields?.find((x) => x.FieldId === 'SF_VPHR_Facility')
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
                    >
                      <Grid item xs={12} sm={12} md={6} lg={4}>
                        <Label
                          value={getlabel(
                            'MM_SF_VPHR_Facility',
                            {
                              Data: fieldLabels,
                              Status: labels?.Status,
                            },
                            i18n.language
                          )}
                          isRequired={
                            pageFields?.find(
                              (x) => x.FieldId === 'SF_VPHR_Facility'
                            )?.IsMandatory
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={8}>
                        <SearchDropdown
                          disableClearable={true}
                          name={'facility'}
                          options={facilityList || []}
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
                      backgroundColor="#0083c0"
                      type="submit"
                      style={{ display: 'inline-flex', gap: '5px' }}
                      //disabled={isAdding || isUpdating}
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
                      //disabled={isAdding || isUpdating}
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
                </Grid>
              </Form>
            )}
          </Formik>
        </FlexContainer>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditPassedByHR;
