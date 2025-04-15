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
import {
  useAddCertificationMutation,
  useGetCertificationDataByIdQuery,
  useUpdateCertificationTabMutation,
} from '../../../../../redux/RTK/staffDemographyApi';

const AddEditLifeSupportCertification = ({
  showLSCModal,
  setShowLSCModal,
  selectedLSCId,
  setSelectedLSCId,
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
  const [newLSC, setNewLSC] = useState({
    lscId: selectedLSCId || 0,
    certification: '',
    facility: '',
    staffCategory: '',
    issuingAuthority: '',
    country: '',
    issueDate: '',
    expiryDate: '',
    attchment: '',
  });

  //* RTK Queries

  const [triggerAddCertificate] = useAddCertificationMutation();
  const [triggerUpdateCertificate] = useUpdateCertificationTabMutation();

  const {
    data: lscRecords,
    isFetching,
    refetch: refetchLSCData,
  } = useGetCertificationDataByIdQuery(
    {
      certificateId: selectedLSCId,
      loginUserId: userDetails?.UserId,
    },
    { skip: !selectedLSCId }
  );

  //* Field access checking
  const pageFields = fieldAccess?.Data?.Sections?.find(
    (sectionName) =>
      sectionName?.SectionName === 'Life Support Certification(s)'
  )?.Fields;

  //* Use Effects to bind values

  useEffect(() => {
    if (labels?.Data) {
      setFieldLabels(labels?.Data);
    }
  }, [labels]);

  useEffect(() => {
    if (lscRecords?.Data && selectedLSCId) {
      setNewLSC({
        lscId: lscRecords?.Data?.CertificateId,
        certification: lscRecords?.Data?.CertificationTitle,
        facility: lscRecords?.Data?.FacilityId,
        staffCategory: lscRecords?.Data?.StaffCategoryId,
        issuingAuthority: lscRecords?.Data?.IsInstitutionMandatory,
        country: lscRecords?.Data?.IsCountryMandatory,
        issueDate: lscRecords?.Data?.IsIssuedateMandatory,
        expiryDate: lscRecords?.Data?.IsExpirydateMandatory,
        attchment: lscRecords?.Data?.IsAttachmentMandatory,
      });
    }
  }, [lscRecords]);

  //* Validation Schema
  const lscValidation = Yup.object().shape({
    facility: Yup.number().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'SF_LSC_Facility')
          ?.IsMandatory === true,
      then: (schema) =>
        schema
          .required(
            `${getlabel('MM_SF_LSC_Facility', labels, i18n.language)} ${t('IsRequired')}`
          )
          .test(
            'is-zero',
            `${getlabel('MM_SF_LSC_Facility', labels, i18n.language)} ${t('IsRequired')}`,
            (value) => {
              return value !== '';
            }
          ),
      otherwise: (schema) => schema.notRequired(),
    }),

    staffCategory: Yup.number().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'SF_LSC_StaffCategory')
          ?.IsMandatory === true,
      then: (schema) =>
        schema
          .required(
            `${getlabel(
              'MM_SF_LSC_StaffCategory',
              {
                Data: fieldLabels,
                Status: labels?.Status,
              },
              i18n.language
            )} ${t('IsRequired')}`
          )
          .test(
            'is-zero',
            `${getlabel(
              'MM_SF_LSC_StaffCategory',
              {
                Data: fieldLabels,
                Status: labels?.Status,
              },
              i18n.language
            )} ${t('IsRequired')}`,
            (value) => {
              return value !== 0;
            }
          ),
      otherwise: (schema) => schema.notRequired(),
    }),

    issuingAuthority: Yup.bool().when([], {
      is: () =>
        pageFields?.find(
          (x) => x.FieldId === 'SF_LSC_IssueAuthorityInstitution'
        )?.IsMandatory === true,
      then: (schema) =>
        schema.required(
          `${getlabel('MM_SF_LSC_IssueAuthorityInstitution', labels, i18n.language)} ${t('IsRequired')}`
        ),
      otherwise: (schema) => schema.notRequired(),
    }),

    country: Yup.bool().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'SF_LSC_Country')?.IsMandatory ===
        true,
      then: (schema) =>
        schema.required(
          `${getlabel('MM_SF_LSC_Country', labels, i18n.language)} ${t('IsRequired')}`
        ),
      otherwise: (schema) => schema.notRequired(),
    }),
    issueDate: Yup.bool().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'SF_LSC_IssueDate')
          ?.IsMandatory === true,
      then: (schema) =>
        schema.required(
          `${getlabel('MM_SF_LSC_IssueDate', labels, i18n.language)} ${t('IsRequired')}`
        ),
      otherwise: (schema) => schema.notRequired(),
    }),
    expiryDate: Yup.bool().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'SF_LSC_ExpiryDate')
          ?.IsMandatory === true,
      then: (schema) =>
        schema.required(
          `${getlabel('MM_SF_LSC_ExpiryDate', labels, i18n.language)} ${t('IsRequired')}`
        ),
      otherwise: (schema) => schema.notRequired(),
    }),
    attchment: Yup.bool().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'SF_LSC_Attachment(s)')
          ?.IsMandatory === true,
      then: (schema) =>
        schema.required(
          `${getlabel('MM_SF_LSC_Attachment(s)', labels, i18n.language)} ${t('IsRequired')}`
        ),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  //* Close modal
  const handleOnCancel = () => {
    setNewLSC({
      lscId: 0,
      facility: '',
      certification: '',
      issuingAuthority: '',
      staffCategory: '',
      country: '',
      issueDate: '',
      expiryDate: '',
      attchment: '',
    });
    setSelectedLSCId(null);
    setShowLSCModal(false);
  };

  //* Submit tabs
  const submitLSC = async (values) => {
    try {
      let response;
      if (newLSC?.lscId === 0) {
        response = await triggerAddCertificate({
          payload: {
            certificationTitle: values?.certification,
            facilityId: values?.facility,
            isCountryMandatory: values?.country,
            isInstitutionMandatory: values?.issuingAuthority,
            isIssuedateMandatory: values?.issueDate,
            isExpirydateMandatory: values?.expiryDate,
            isAttachmentMandatory: values?.attchment,
            staffCategoryId: Array.isArray(values?.staffCategory)
              ? values.staffCategory.join(',')
              : values?.staffCategory,
            moduleId: selectedModuleId,
            menuId: selectedMenu?.id,
            loginUserId: userDetails?.UserId,
          },
        }).unwrap();
      }
      if (newLSC?.lscId !== 0) {
        response = await triggerUpdateCertificate({
          payload: {
            certificateId: values?.lscId,
            certificationTitle: values?.certification,
            facilityId: values?.facility,
            isCountryMandatory: values?.country,
            isInstitutionMandatory: values?.issuingAuthority,
            isIssuedateMandatory: values?.issueDate,
            isExpirydateMandatory: values?.expiryDate,
            isAttachmentMandatory: values?.attchment,
            staffCategoryId: Array.isArray(values?.staffCategory)
              ? values.staffCategory.join(',')
              : values?.staffCategory,
            moduleId: selectedModuleId,
            menuId: selectedMenu?.id,
            loginUserId: userDetails?.UserId,
          },
        }).unwrap();
        refetchLSCData();
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
      setNewLSC({
        lscId: selectedLSCId || 0,
        certification: '',
        facility: '',
        staffCategory: '',
        issuingAuthority: '',
        country: '',
        issueDate: '',
        expiryDate: '',
        attchment: '',
      });
      refetch();
      setSelectedLSCId(null);
      setShowLSCModal(false);
    } catch (error) {
      console.error('Failed to add/update LSC', error);
    }
  };

  return (
    <Dialog
      open={showLSCModal}
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
          {t('LifeSupportCertification(s)')}
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
            initialValues={newLSC}
            validateOnBlur={false}
            validationSchema={lscValidation}
            onSubmit={(values) => {
              submitLSC(values);
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
                  {pageFields?.find((x) => x.FieldId === 'SF_LSC_Certification')
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
                            'MM_SF_LSC_Certification',
                            {
                              Data: fieldLabels,
                              Status: labels?.Status,
                            },
                            i18n.language
                          )}
                          isRequired={
                            pageFields?.find(
                              (x) => x.FieldId === 'SF_LSC_Certification'
                            )?.IsMandatory
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={8}>
                        <Label
                          value={values.certification}
                          isRequired={false}
                        />

                        <ErrorMessage
                          name="certification"
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
                  {pageFields?.find((x) => x.FieldId === 'SF_LSC_Facility')
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
                            'MM_SF_LSC_Facility',
                            {
                              Data: fieldLabels,
                              Status: labels?.Status,
                            },
                            i18n.language
                          )}
                          isRequired={
                            pageFields?.find(
                              (x) => x.FieldId === 'SF_LSC_Facility'
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
                  {pageFields?.find((x) => x.FieldId === 'SF_LSC_StaffCategory')
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
                            'MM_SF_LSC_StaffCategory',
                            {
                              Data: fieldLabels,
                              Status: labels?.Status,
                            },
                            i18n.language
                          )}
                          isRequired={
                            pageFields?.find(
                              (x) => x.FieldId === 'SF_LSC_StaffCategory'
                            )?.IsMandatory
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={8}>
                        <MultiSelectDropdown
                          name={'staffCategory'}
                          options={facilityList || []}
                          value={values?.staffCategory}
                        />
                        <ErrorMessage
                          name="staffCategory"
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
                  {pageFields?.find(
                    (x) => x.FieldId === 'SF_LSC_IssueAuthorityInstitution'
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
                            'MM_SF_LSC_IssueAuthorityInstitution',
                            {
                              Data: fieldLabels,
                              Status: labels?.Status,
                            },
                            i18n.language
                          )}
                          isRequired={
                            pageFields?.find(
                              (x) =>
                                x.FieldId === 'SF_LSC_IssueAuthorityInstitution'
                            )?.IsMandatory
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={8}>
                        <Checkbox
                          style={{ padding: '0px' }}
                          checked={values?.issuingAuthority}
                          onChange={(e) => {
                            setFieldValue(
                              'issuingAuthority',
                              e?.target?.checked
                            );
                          }}
                        />
                        <ErrorMessage
                          name="issuingAuthority"
                          component="div"
                          style={{
                            color: 'red',
                            fontSize: '12px',
                          }}
                        />
                      </Grid>
                    </Grid>
                  )}
                  {pageFields?.find((x) => x.FieldId === 'SF_LSC_Country')
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
                            'MM_SF_LSC_Country',
                            {
                              Data: fieldLabels,
                              Status: labels?.Status,
                            },
                            i18n.language
                          )}
                          isRequired={
                            pageFields?.find(
                              (x) => x.FieldId === 'SF_LSC_Country'
                            )?.IsMandatory
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={8}>
                        <Checkbox
                          style={{ padding: '0px' }}
                          checked={values?.country}
                          onChange={(e) => {
                            setFieldValue('country', e?.target?.checked);
                          }}
                        />
                        <ErrorMessage
                          name="country"
                          component="div"
                          style={{
                            color: 'red',
                            fontSize: '12px',
                          }}
                        />
                      </Grid>
                    </Grid>
                  )}
                  {pageFields?.find((x) => x.FieldId === 'SF_LSC_IssueDate')
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
                            'MM_SF_AT_IssueDate',
                            {
                              Data: fieldLabels,
                              Status: labels?.Status,
                            },
                            i18n.language
                          )}
                          isRequired={
                            pageFields?.find(
                              (x) => x.FieldId === 'SF_LSC_IssueDate'
                            )?.IsMandatory
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={8}>
                        <Checkbox
                          style={{ padding: '0px' }}
                          checked={values?.issueDate}
                          onChange={(e) => {
                            setFieldValue('issueDate', e?.target?.checked);
                          }}
                        />
                        <ErrorMessage
                          name="issueDate"
                          component="div"
                          style={{
                            color: 'red',
                            fontSize: '12px',
                          }}
                        />
                      </Grid>
                    </Grid>
                  )}
                  {pageFields?.find((x) => x.FieldId === 'SF_LSC_ExpiryDate')
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
                            'MM_SF_LSC_ExpiryDate',
                            {
                              Data: fieldLabels,
                              Status: labels?.Status,
                            },
                            i18n.language
                          )}
                          isRequired={
                            pageFields?.find(
                              (x) => x.FieldId === 'SF_LSC_ExpiryDate'
                            )?.IsMandatory
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={8}>
                        <Checkbox
                          style={{ padding: '0px' }}
                          checked={values?.expiryDate}
                          onChange={(e) => {
                            setFieldValue('expiryDate', e?.target?.checked);
                          }}
                        />
                        <ErrorMessage
                          name="expiryDate"
                          component="div"
                          style={{
                            color: 'red',
                            fontSize: '12px',
                          }}
                        />
                      </Grid>
                    </Grid>
                  )}
                  {pageFields?.find((x) => x.FieldId === 'SF_LSC_Attachment(s)')
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
                            'MM_SF_LSC_Attachment(s)',
                            {
                              Data: fieldLabels,
                              Status: labels?.Status,
                            },
                            i18n.language
                          )}
                          isRequired={
                            pageFields?.find(
                              (x) => x.FieldId === 'SF_LSC_Attachment(s)'
                            )?.IsMandatory
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={8}>
                        <Checkbox
                          style={{ padding: '0px' }}
                          checked={values?.attchment}
                          onChange={(e) => {
                            setFieldValue('attchment', e?.target?.checked);
                          }}
                        />
                        <ErrorMessage
                          name="attchment"
                          component="div"
                          style={{
                            color: 'red',
                            fontSize: '12px',
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

export default AddEditLifeSupportCertification;
